import { reactive, computed, watch } from 'vue'
import type { TimeSlot } from '../schedule/types'
import type { SlotLockResponse, SlotUpdateEvent, PollingStatus } from './types'
import { SlotPollingService } from './SlotPollingService'
import { SlotWebSocketService } from './SlotWebSocketService'

/**
 * 号源状态接口
 */
interface SlotState {
  slotId: string
  remaining: number
  status: string
  locked: boolean
  lockToken?: string
  lockedUntil?: Date
  lastUpdated: Date
}

/**
 * 号源锁定记录
 */
interface SlotLockRecord {
  slotId: string
  lockToken: string
  acquiredAt: Date
  expiresAt: Date
  patientId?: string
}

/**
 * 号源状态管理Store
 */
class SlotStore {
  // 状态管理
  private state = reactive({
    // 号源状态映射
    slots: new Map<string, SlotState>(),
    
    // 当前锁定的号源
    lockedSlots: new Map<string, SlotLockRecord>(),
    
    // 轮询服务状态
    pollingStatus: PollingStatus.IDLE,
    pollingError: null as string | null,
    lastPollingUpdate: null as Date | null,
    
    // WebSocket状态
    wsConnected: false,
    wsError: null as string | null,
    lastWsUpdate: null as Date | null,
    
    // 配置
    config: {
      pollingInterval: 30000, // 30秒
      lockTimeout: 10 * 60 * 1000, // 10分钟
      enableWebSocket: true,
      enablePolling: true
    }
  })
  
  // 服务实例
  private pollingService: SlotPollingService | null = null
  private wsService: SlotWebSocketService | null = null
  
  /**
   * 获取号源状态（只读）
   */
  getSlotState(slotId: string): SlotState | undefined {
    return this.state.slots.get(slotId)
  }
  
  /**
   * 获取所有号源状态
   */
  getAllSlotStates(): SlotState[] {
    return Array.from(this.state.slots.values())
  }
  
  /**
   * 获取号源是否被锁定
   */
  isSlotLocked(slotId: string): boolean {
    const slotState = this.state.slots.get(slotId)
    return slotState?.locked || false
  }
  
  /**
   * 获取号源是否可预约
   */
  isSlotBookable(slotId: string): boolean {
    const slotState = this.state.slots.get(slotId)
    if (!slotState) return false
    
    return slotState.remaining > 0 && 
           slotState.status === 'available' && 
           !slotState.locked
  }
  
  /**
   * 获取当前用户锁定的号源
   */
  getLockedSlots(): SlotLockRecord[] {
    return Array.from(this.state.lockedSlots.values())
  }
  
  /**
   * 获取轮询状态
   */
  getPollingStatus(): PollingStatus {
    return this.state.pollingStatus
  }
  
  /**
   * 获取WebSocket连接状态
   */
  getWsConnected(): boolean {
    return this.state.wsConnected
  }
  
  /**
   * 获取错误信息
   */
  getErrors() {
    return {
      polling: this.state.pollingError,
      ws: this.state.wsError
    }
  }
  
  /**
   * 更新号源状态
   */
  updateSlotState(slotId: string, updates: Partial<SlotState>): void {
    const existing = this.state.slots.get(slotId)
    
    if (existing) {
      Object.assign(existing, updates, { lastUpdated: new Date() })
    } else {
      this.state.slots.set(slotId, {
        slotId,
        remaining: 0,
        status: 'unknown',
        locked: false,
        lastUpdated: new Date(),
        ...updates
      })
    }
  }
  
  /**
   * 锁定号源
   */
  async lockSlot(slotId: string, patientId?: string): Promise<SlotLockResponse> {
    try {
      // 调用后端锁定API
      const response = await fetch('/api/slots/lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slotId,
          timeoutMs: this.state.config.lockTimeout,
          patientId
        })
      })
      
      const result: SlotLockResponse = await response.json()
      
      if (result.success && result.lockToken) {
        // 更新本地状态
        this.updateSlotState(slotId, {
          locked: true,
          lockToken: result.lockToken
        })
        
        // 记录锁定信息
        const lockRecord: SlotLockRecord = {
          slotId,
          lockToken: result.lockToken,
          acquiredAt: new Date(),
          expiresAt: new Date(Date.now() + (result.ttlMs || this.state.config.lockTimeout)),
          patientId
        }
        
        this.state.lockedSlots.set(slotId, lockRecord)
        
        console.log(`号源锁定成功: ${slotId}`)
      }
      
      return result
      
    } catch (error) {
      console.error('锁定号源失败:', error)
      return {
        success: false,
        errorMessage: '锁定号源失败，请检查网络连接'
      }
    }
  }
  
  /**
   * 解锁号源
   */
  async unlockSlot(slotId: string, lockToken: string): Promise<SlotLockResponse> {
    try {
      const response = await fetch(`/api/slots/unlock?slotId=${slotId}&lockToken=${lockToken}`, {
        method: 'POST'
      })
      
      const result: SlotLockResponse = await response.json()
      
      if (result.success) {
        // 更新本地状态
        this.updateSlotState(slotId, {
          locked: false,
          lockToken: undefined
        })
        
        // 移除锁定记录
        this.state.lockedSlots.delete(slotId)
        
        console.log(`号源解锁成功: ${slotId}`)
      }
      
      return result
      
    } catch (error) {
      console.error('解锁号源失败:', error)
      return {
        success: false,
        errorMessage: '解锁号源失败'
      }
    }
  }
  
  /**
   * 初始化轮询服务
   */
  initPollingService(): void {
    if (!this.state.config.enablePolling) return
    
    this.pollingService = new SlotPollingService({
      interval: this.state.config.pollingInterval
    })
    
    // 设置回调
    this.pollingService.onUpdate((event: SlotUpdateEvent) => {
      this.handleSlotUpdate(event)
    })
    
    this.pollingService.onError((error: Error) => {
      this.state.pollingError = error.message
      console.error('轮询服务错误:', error)
    })
    
    // 监听状态变化
    watch(this.pollingService.status, (newStatus) => {
      this.state.pollingStatus = newStatus
    })
  }
  
  /**
   * 初始化WebSocket服务
   */
  initWebSocketService(): void {
    if (!this.state.config.enableWebSocket) return
    
    this.wsService = new SlotWebSocketService()
    
    // 设置回调
    this.wsService.onUpdate((event: SlotUpdateEvent) => {
      this.handleSlotUpdate(event)
    })
    
    this.wsService.onError((error: Error) => {
      this.state.wsError = error.message
      console.error('WebSocket服务错误:', error)
    })
    
    // 监听连接状态
    watch(this.wsService.state, (newState) => {
      this.state.wsConnected = newState === 'open'
      this.state.lastWsUpdate = new Date()
    })
  }
  
  /**
   * 开始监控号源状态
   */
  startMonitoring(slotIds: string[]): void {
    // 初始化号源状态
    slotIds.forEach(slotId => {
      if (!this.state.slots.has(slotId)) {
        this.updateSlotState(slotId, {
          remaining: 0,
          status: 'unknown',
          locked: false
        })
      }
    })
    
    // 启动轮询
    if (this.pollingService && this.state.config.enablePolling) {
      this.pollingService.start(() => this.fetchSlotUpdates(slotIds))
    }
    
    // 连接WebSocket
    if (this.wsService && this.state.config.enableWebSocket) {
      this.wsService.connect()
      
      // 订阅号源更新
      slotIds.forEach(slotId => {
        this.wsService?.subscribeToSlot(slotId)
      })
    }
  }
  
  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.pollingService) {
      this.pollingService.stop()
    }
    
    if (this.wsService) {
      this.wsService.disconnect()
    }
    
    // 清理锁定记录（保留状态，只停止监控）
    this.state.pollingStatus = PollingStatus.IDLE
    this.state.wsConnected = false
  }
  
  /**
   * 处理号源更新事件
   */
  private handleSlotUpdate(event: SlotUpdateEvent): void {
    this.updateSlotState(event.slotId, {
      remaining: event.remaining,
      status: event.status,
      locked: event.locked || false,
      lockToken: event.lockToken
    })
    
    console.log(`号源状态更新: ${event.slotId}`, event)
  }
  
  /**
   * 获取号源更新数据
   */
  private async fetchSlotUpdates(slotIds: string[]): Promise<SlotUpdateEvent[]> {
    try {
      // 这里应该调用后端API获取最新的号源状态
      // 暂时返回空数组，实际实现时需要调用真实API
      return []
    } catch (error) {
      console.error('获取号源更新失败:', error)
      throw error
    }
  }
  
  /**
   * 清理资源
   */
  destroy(): void {
    this.stopMonitoring()
    
    if (this.pollingService) {
      this.pollingService.destroy()
      this.pollingService = null
    }
    
    if (this.wsService) {
      this.wsService.destroy()
      this.wsService = null
    }
  }
}

// 创建全局实例
export const slotStore = new SlotStore()

// 导出可组合函数
export function useSlotStore() {
  return {
    // 状态获取
    getSlotState: (slotId: string) => slotStore.getSlotState(slotId),
    getAllSlotStates: () => slotStore.getAllSlotStates(),
    isSlotLocked: (slotId: string) => slotStore.isSlotLocked(slotId),
    isSlotBookable: (slotId: string) => slotStore.isSlotBookable(slotId),
    getLockedSlots: () => slotStore.getLockedSlots(),
    getPollingStatus: () => slotStore.getPollingStatus(),
    getWsConnected: () => slotStore.getWsConnected(),
    getErrors: () => slotStore.getErrors(),
    
    // 操作方法
    lockSlot: (slotId: string, patientId?: string) => slotStore.lockSlot(slotId, patientId),
    unlockSlot: (slotId: string, lockToken: string) => slotStore.unlockSlot(slotId, lockToken),
    startMonitoring: (slotIds: string[]) => slotStore.startMonitoring(slotIds),
    stopMonitoring: () => slotStore.stopMonitoring(),
    
    // 初始化
    init: () => {
      slotStore.initPollingService()
      slotStore.initWebSocketService()
    },
    
    // 清理
    destroy: () => slotStore.destroy()
  }
}