/**
 * 号源锁定相关类型定义
 */

/** 号源锁定请求参数 */
export interface SlotLockRequest {
  slotId: string
  timeoutMs?: number
  patientId?: string
}

/** 号源锁定响应结果 */
export interface SlotLockResponse {
  success: boolean
  lockToken?: string
  errorMessage?: string
  ttlMs?: number
}

/** 号源状态更新事件 */
export interface SlotUpdateEvent {
  slotId: string
  remaining: number
  status: string
  locked?: boolean
  lockToken?: string
  updatedAt: string
}

/** 轮询配置 */
export interface PollingConfig {
  interval: number  // 轮询间隔（毫秒）
  maxRetries: number  // 最大重试次数
  backoffFactor: number  // 退避因子
  timeout: number  // 请求超时时间
}

/** WebSocket消息类型 */
export interface WebSocketMessage {
  type: 'slot_update' | 'lock_acquired' | 'lock_released' | 'error'
  data: SlotUpdateEvent | any
  timestamp: string
}

/** 轮询状态 */
export enum PollingStatus {
  IDLE = 'idle',
  POLLING = 'polling',
  PAUSED = 'paused',
  ERROR = 'error'
}