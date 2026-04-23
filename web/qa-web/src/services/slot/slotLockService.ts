/**
 * 号源锁定服务
 */

// 后端API基础URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * 号源锁定请求
 */
export interface SlotLockRequest {
  /** 时段ID */
  slotId: string
  /** 锁定超时时间（毫秒） */
  timeoutMs?: number
}

/**
 * 号源锁定响应
 */
export interface SlotLockResponse {
  /** 是否成功 */
  success: boolean
  /** 错误信息 */
  errorMessage?: string
  /** 锁定令牌 */
  lockToken?: string
  /** 剩余生存时间（毫秒） */
  ttlMs?: number
}

/**
 * 锁定号源
 */
export async function lockSlot(request: SlotLockRequest): Promise<SlotLockResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/slots/lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errorMessage || `HTTP error! status: ${response.status}`)
    }

    const result: SlotLockResponse = await response.json()
    return result

  } catch (error) {
    console.error('锁定号源失败:', error)
    
    // 如果后端API调用失败，返回失败响应
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '锁定号源失败'
    }
  }
}

/**
 * 解锁号源
 */
export async function unlockSlot(slotId: string, lockToken: string): Promise<SlotLockResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/slots/unlock?slotId=${slotId}&lockToken=${lockToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errorMessage || `HTTP error! status: ${response.status}`)
    }

    const result: SlotLockResponse = await response.json()
    return result

  } catch (error) {
    console.error('解锁号源失败:', error)
    
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '解锁号源失败'
    }
  }
}

/**
 * 检查锁状态
 */
export async function checkLockStatus(slotId: string, lockToken?: string): Promise<SlotLockResponse> {
  try {
    let url = `${API_BASE_URL}/api/slots/lock/status?slotId=${slotId}`
    if (lockToken) {
      url += `&lockToken=${lockToken}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errorMessage || `HTTP error! status: ${response.status}`)
    }

    const result: SlotLockResponse = await response.json()
    return result

  } catch (error) {
    console.error('检查锁状态失败:', error)
    
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '检查锁状态失败'
    }
  }
}

/**
 * 号源锁定管理器
 */
export class SlotLockManager {
  private locks: Map<string, { token: string; timeoutMs: number }> = new Map()
  private timers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * 锁定号源
   */
  async acquireLock(slotId: string, timeoutMs: number = 5 * 60 * 1000): Promise<boolean> {
    try {
      const response = await lockSlot({ slotId, timeoutMs })
      
      if (response.success && response.lockToken) {
        // 保存锁定信息
        this.locks.set(slotId, {
          token: response.lockToken,
          timeoutMs: response.ttlMs || timeoutMs
        })
        
        // 设置自动解锁定时器（在锁定时间到期前解锁）
        const unlockTime = Math.min(timeoutMs - 30000, timeoutMs * 0.8) // 提前30秒或80%时间解锁
        if (unlockTime > 0) {
          const timer = setTimeout(() => {
            this.releaseLock(slotId)
          }, unlockTime)
          
          this.timers.set(slotId, timer)
        }
        
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('获取号源锁失败:', error)
      return false
    }
  }

  /**
   * 释放号源锁
   */
  async releaseLock(slotId: string): Promise<boolean> {
    const lockInfo = this.locks.get(slotId)
    if (!lockInfo) {
      return false
    }

    try {
      // 清除定时器
      const timer = this.timers.get(slotId)
      if (timer) {
        clearTimeout(timer)
        this.timers.delete(slotId)
      }

      // 释放锁
      const response = await unlockSlot(slotId, lockInfo.token)
      
      if (response.success) {
        this.locks.delete(slotId)
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('释放号源锁失败:', error)
      return false
    }
  }

  /**
   * 获取锁定令牌
   */
  getLockToken(slotId: string): string | null {
    const lockInfo = this.locks.get(slotId)
    return lockInfo?.token || null
  }

  /**
   * 检查是否已锁定
   */
  isLocked(slotId: string): boolean {
    return this.locks.has(slotId)
  }

  /**
   * 释放所有锁定
   */
  async releaseAllLocks(): Promise<void> {
    const releasePromises = Array.from(this.locks.keys()).map(slotId => 
      this.releaseLock(slotId)
    )
    
    await Promise.all(releasePromises)
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    // 清除所有定时器
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
    
    // 释放所有锁定
    this.releaseAllLocks()
  }
}

// 全局号源锁定管理器实例
export const slotLockManager = new SlotLockManager()