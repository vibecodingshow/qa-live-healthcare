/**
 * 号源状态枚举
 */
export enum SlotStatus {
  AVAILABLE = 'available',      // 可预约
  LOW_STOCK = 'low_stock',     // 号源紧张
  FULL = 'full',               // 已满
  SUSPENDED = 'suspended'      // 停诊
}

/**
 * 状态颜色配置
 */
export interface StatusColorConfig {
  bg: string
  text: string
  icon?: string
  description: string
}

/**
 * 状态颜色映射
 */
export const statusColors: Record<SlotStatus, StatusColorConfig> = {
  [SlotStatus.AVAILABLE]: {
    bg: '#52c41a',
    text: '#fff',
    icon: '✅',
    description: '可预约'
  },
  [SlotStatus.LOW_STOCK]: {
    bg: '#faad14',
    text: '#fff',
    icon: '⚠️',
    description: '号源紧张'
  },
  [SlotStatus.FULL]: {
    bg: '#d9d9d9',
    text: '#666',
    icon: '❌',
    description: '已满'
  },
  [SlotStatus.SUSPENDED]: {
    bg: '#ff4d4f',
    text: '#fff',
    icon: '🚫',
    description: '停诊'
  }
}

/**
 * 暗黑模式下的颜色配置
 */
export const darkModeColors: Record<SlotStatus, StatusColorConfig> = {
  [SlotStatus.AVAILABLE]: {
    bg: '#389e0d',
    text: '#fff',
    icon: '✅',
    description: '可预约'
  },
  [SlotStatus.LOW_STOCK]: {
    bg: '#d48806',
    text: '#fff',
    icon: '⚠️',
    description: '号源紧张'
  },
  [SlotStatus.FULL]: {
    bg: '#434343',
    text: '#bfbfbf',
    icon: '❌',
    description: '已满'
  },
  [SlotStatus.SUSPENDED]: {
    bg: '#a8071a',
    text: '#fff',
    icon: '🚫',
    description: '停诊'
  }
}

/**
 * 状态徽章组件Props
 */
export interface SlotStatusBadgeProps {
  status: SlotStatus
  showText?: boolean
  showIcon?: boolean
  showCount?: boolean
  remainingSlots?: number
  totalSlots?: number
  size?: 'small' | 'medium' | 'large'
}

/**
 * 状态标签组件Props
 */
export interface SlotStatusTagProps {
  status: SlotStatus
  size?: 'small' | 'medium' | 'large'
}