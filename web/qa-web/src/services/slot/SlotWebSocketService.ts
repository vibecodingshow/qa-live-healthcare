import { ref, type Ref, onUnmounted } from 'vue'
import type { WebSocketMessage, SlotUpdateEvent, PollingStatus } from './types'

/**
 * WebSocket连接状态
 */
export enum WebSocketState {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed',
  ERROR = 'error'
}

/**
 * WebSocket配置
 */
export interface WebSocketConfig {
  url: string
  reconnectInterval: number  // 重连间隔（毫秒）
  maxReconnectAttempts: number  // 最大重连次数
  heartbeatInterval: number  // 心跳间隔（毫秒）
  timeout: number  // 连接超时时间
}

/**
 * 号源WebSocket服务
 * 负责建立和维护WebSocket连接，实时接收号源状态更新
 */
export class SlotWebSocketService {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private isManuallyClosed = false
  
  // 响应式状态
  private _state: Ref<WebSocketState> = ref(WebSocketState.CLOSED)
  private _lastMessage: Ref<WebSocketMessage | null> = ref(null)
  private _error: Ref<string | null> = ref(null)
  
  // 默认配置
  private config: WebSocketConfig = {
    url: 'ws://localhost:8080/ws/slots',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 60000, // 60秒
    timeout: 10000
  }
  
  // 回调函数
  private onMessageCallback: ((message: WebSocketMessage) => void) | null = null
  private onUpdateCallback: ((event: SlotUpdateEvent) => void) | null = null
  private onErrorCallback: ((error: Error) => void) | null = null
  private onReconnectCallback: (() => void) | null = null
  
  constructor(config?: Partial<WebSocketConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }
  
  /**
   * 连接到WebSocket服务器
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.warn('WebSocket连接已存在')
      return
    }
    
    this.isManuallyClosed = false
    this._state.value = WebSocketState.CONNECTING
    this._error.value = null
    
    try {
      this.ws = new WebSocket(this.config.url)
      this.setupEventListeners()
      
      // 设置连接超时
      setTimeout(() => {
        if (this._state.value === WebSocketState.CONNECTING) {
          this.handleError(new Error('WebSocket连接超时'))
          this.ws?.close()
        }
      }, this.config.timeout)
      
    } catch (error) {
      this.handleError(error as Error)
    }
  }
  
  /**
   * 断开WebSocket连接
   */
  disconnect(): void {
    this.isManuallyClosed = true
    this._state.value = WebSocketState.CLOSING
    
    // 清理重连和心跳定时器
    this.clearTimers()
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
    }
  }
  
  /**
   * 发送消息
   */
  send(message: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket未连接，无法发送消息')
      return false
    }
    
    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message)
      this.ws.send(messageString)
      return true
    } catch (error) {
      console.error('发送WebSocket消息失败:', error)
      return false
    }
  }
  
  /**
   * 订阅号源更新
   */
  subscribeToSlot(slotId: string): boolean {
    return this.send({
      type: 'subscribe',
      slotId: slotId
    })
  }
  
  /**
   * 取消订阅号源
   */
  unsubscribeFromSlot(slotId: string): boolean {
    return this.send({
      type: 'unsubscribe',
      slotId: slotId
    })
  }
  
  /**
   * 设置消息回调
   */
  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.onMessageCallback = callback
  }
  
  /**
   * 设置号源更新回调
   */
  onUpdate(callback: (event: SlotUpdateEvent) => void): void {
    this.onUpdateCallback = callback
  }
  
  /**
   * 设置错误回调
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback
  }
  
  /**
   * 设置重连回调
   */
  onReconnect(callback: () => void): void {
    this.onReconnectCallback = callback
  }
  
  /**
   * 获取当前状态
   */
  get state(): Ref<WebSocketState> {
    return this._state
  }
  
  /**
   * 获取最后收到的消息
   */
  get lastMessage(): Ref<WebSocketMessage | null> {
    return this._lastMessage
  }
  
  /**
   * 获取错误信息
   */
  get error(): Ref<string | null> {
    return this._error
  }
  
  /**
   * 是否已连接
   */
  get connected(): boolean {
    return this._state.value === WebSocketState.OPEN
  }
  
  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (!this.ws) return
    
    this.ws.onopen = () => {
      this._state.value = WebSocketState.OPEN
      this.reconnectAttempts = 0
      this._error.value = null
      console.log('WebSocket连接已建立')
      
      // 开始心跳检测
      this.startHeartbeat()
    }
    
    this.ws.onmessage = (event) => {
      this.handleMessage(event)
    }
    
    this.ws.onclose = (event) => {
      this._state.value = WebSocketState.CLOSED
      this.clearTimers()
      
      if (!this.isManuallyClosed) {
        console.warn(`WebSocket连接关闭: ${event.code} ${event.reason}`)
        this.attemptReconnect()
      } else {
        console.log('WebSocket连接已手动关闭')
      }
    }
    
    this.ws.onerror = (event) => {
      this.handleError(new Error('WebSocket连接错误'))
    }
  }
  
  /**
   * 处理收到的消息
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      this._lastMessage.value = message
      
      // 调用消息回调
      if (this.onMessageCallback) {
        this.onMessageCallback(message)
      }
      
      // 处理特定类型的消息
      switch (message.type) {
        case 'slot_update':
          if (this.onUpdateCallback && message.data) {
            this.onUpdateCallback(message.data as SlotUpdateEvent)
          }
          break
        case 'heartbeat':
          // 心跳响应，不做特殊处理
          break
        default:
          console.log('收到未知类型的WebSocket消息:', message)
      }
      
    } catch (error) {
      console.error('解析WebSocket消息失败:', error)
    }
  }
  
  /**
   * 处理错误
   */
  private handleError(error: Error): void {
    this._error.value = error.message
    this._state.value = WebSocketState.ERROR
    
    if (this.onErrorCallback) {
      this.onErrorCallback(error)
    }
  }
  
  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.isManuallyClosed || this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('WebSocket重连次数已达上限，停止重连')
      return
    }
    
    this.reconnectAttempts++
    console.log(`尝试第${this.reconnectAttempts}次重连...`)
    
    this.reconnectTimer = setTimeout(() => {
      if (this.onReconnectCallback) {
        this.onReconnectCallback()
      }
      this.connect()
    }, this.config.reconnectInterval)
  }
  
  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.send({
          type: 'heartbeat',
          timestamp: Date.now()
        })
      }
    }, this.config.heartbeatInterval)
  }
  
  /**
   * 清理定时器
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
  
  /**
   * 清理资源
   */
  destroy(): void {
    this.disconnect()
    this.clearTimers()
    this.onMessageCallback = null
    this.onUpdateCallback = null
    this.onErrorCallback = null
    this.onReconnectCallback = null
  }
}

/**
 * 创建可组合的WebSocket服务
 */
export function useSlotWebSocket(config?: Partial<WebSocketConfig>) {
  const wsService = new SlotWebSocketService(config)
  
  // 组件卸载时自动清理
  onUnmounted(() => {
    wsService.destroy()
  })
  
  return {
    wsService,
    state: wsService.state,
    lastMessage: wsService.lastMessage,
    error: wsService.error,
    connected: wsService.connected
  }
}