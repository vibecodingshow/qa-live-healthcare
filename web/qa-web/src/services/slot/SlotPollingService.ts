import { ref, type Ref, onUnmounted } from 'vue'
import type { SlotUpdateEvent, PollingConfig, PollingStatus } from './types'

/**
 * 号源轮询服务
 * 负责定时轮询号源状态变化，支持退避重试和错误处理
 */
export class SlotPollingService {
  private pollingTimer: NodeJS.Timeout | null = null
  private retryCount = 0
  private isActive = false
  
  // 响应式状态
  private _status: Ref<PollingStatus> = ref(PollingStatus.IDLE)
  private _lastUpdate: Ref<Date | null> = ref(null)
  private _error: Ref<string | null> = ref(null)
  
  // 默认配置
  private config: PollingConfig = {
    interval: 30000, // 30秒
    maxRetries: 3,
    backoffFactor: 2,
    timeout: 10000
  }
  
  // 回调函数
  private onUpdateCallback: ((event: SlotUpdateEvent) => void) | null = null
  private onErrorCallback: ((error: Error) => void) | null = null
  
  constructor(config?: Partial<PollingConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }
  
  /**
   * 开始轮询
   */
  start(pollingFunction: () => Promise<SlotUpdateEvent[]>): void {
    if (this.isActive) {
      console.warn('轮询服务已经在运行中')
      return
    }
    
    this.isActive = true
    this._status.value = PollingStatus.POLLING
    this._error.value = null
    this.retryCount = 0
    
    this.executePolling(pollingFunction)
  }
  
  /**
   * 停止轮询
   */
  stop(): void {
    this.isActive = false
    this._status.value = PollingStatus.IDLE
    
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer)
      this.pollingTimer = null
    }
    
    this.retryCount = 0
    this._error.value = null
  }
  
  /**
   * 暂停轮询
   */
  pause(): void {
    if (this.isActive && this.pollingTimer) {
      clearTimeout(this.pollingTimer)
      this.pollingTimer = null
      this._status.value = PollingStatus.PAUSED
    }
  }
  
  /**
   * 恢复轮询
   */
  resume(pollingFunction: () => Promise<SlotUpdateEvent[]>): void {
    if (this.isActive && this._status.value === PollingStatus.PAUSED) {
      this._status.value = PollingStatus.POLLING
      this.executePolling(pollingFunction)
    }
  }
  
  /**
   * 设置状态更新回调
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
   * 获取当前状态
   */
  get status(): Ref<PollingStatus> {
    return this._status
  }
  
  /**
   * 获取最后更新时间
   */
  get lastUpdate(): Ref<Date | null> {
    return this._lastUpdate
  }
  
  /**
   * 获取错误信息
   */
  get error(): Ref<string | null> {
    return this._error
  }
  
  /**
   * 是否正在运行
   */
  get active(): boolean {
    return this.isActive
  }
  
  /**
   * 执行轮询逻辑
   */
  private async executePolling(pollingFunction: () => Promise<SlotUpdateEvent[]>): Promise<void> {
    if (!this.isActive) return
    
    try {
      // 执行轮询函数
      const updates = await pollingFunction()
      
      // 处理更新数据
      this.handleUpdates(updates)
      
      // 重置重试计数
      this.retryCount = 0
      this._error.value = null
      
      // 更新最后更新时间
      this._lastUpdate.value = new Date()
      
    } catch (error) {
      await this.handleError(error as Error)
    } finally {
      // 安排下一次轮询（使用退避策略）
      this.scheduleNextPolling(pollingFunction)
    }
  }
  
  /**
   * 处理更新数据
   */
  private handleUpdates(updates: SlotUpdateEvent[]): void {
    if (updates.length === 0) return
    
    updates.forEach(event => {
      if (this.onUpdateCallback) {
        this.onUpdateCallback(event)
      }
    })
  }
  
  /**
   * 处理错误
   */
  private async handleError(error: Error): Promise<void> {
    this.retryCount++
    this._error.value = error.message
    this._status.value = PollingStatus.ERROR
    
    // 调用错误回调
    if (this.onErrorCallback) {
      this.onErrorCallback(error)
    }
    
    // 如果超过最大重试次数，停止轮询
    if (this.retryCount >= this.config.maxRetries) {
      console.error(`轮询服务达到最大重试次数，停止轮询: ${error.message}`)
      this.stop()
      return
    }
    
    console.warn(`轮询失败，第${this.retryCount}次重试: ${error.message}`)
  }
  
  /**
   * 安排下一次轮询（使用指数退避）
   */
  private scheduleNextPolling(pollingFunction: () => Promise<SlotUpdateEvent[]>): void {
    if (!this.isActive) return
    
    // 计算下一次轮询的间隔（使用指数退避）
    const delay = this.retryCount > 0 
      ? this.config.interval * Math.pow(this.config.backoffFactor, this.retryCount - 1)
      : this.config.interval
    
    this.pollingTimer = setTimeout(() => {
      this.executePolling(pollingFunction)
    }, delay)
  }
  
  /**
   * 清理资源
   */
  destroy(): void {
    this.stop()
    this.onUpdateCallback = null
    this.onErrorCallback = null
  }
}

/**
 * 创建可组合的轮询服务
 */
export function useSlotPolling(config?: Partial<PollingConfig>) {
  const pollingService = new SlotPollingService(config)
  
  // 组件卸载时自动清理
  onUnmounted(() => {
    pollingService.destroy()
  })
  
  return {
    pollingService,
    status: pollingService.status,
    lastUpdate: pollingService.lastUpdate,
    error: pollingService.error,
    active: pollingService.active
  }
}