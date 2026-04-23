/**
 * 时段选择器相关类型定义
 */

import type { TimeSlot as BaseTimeSlot } from '@/services/schedule/types'

export { SlotStatus } from '@/services/schedule/types'

/** 时段选择器配置选项 */
export interface TimeSlotPickerOptions {
  /** 是否支持多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 最大选择数量（多选模式下有效） */
  maxSelection?: number
  /** 是否显示空状态 */
  showEmptyState?: boolean
  /** 空状态文本 */
  emptyText?: string
  /** 是否显示时段详情 */
  showDetails?: boolean
  /** 是否显示剩余号源 */
  showRemaining?: boolean
  /** 组件尺寸 */
  size?: 'small' | 'medium' | 'large'
}

/** 时段项组件Props */
export interface TimeSlotItemProps {
  slot: TimeSlot
  selected?: boolean
  disabled?: boolean
  focused?: boolean
  showDetails?: boolean
  showRemaining?: boolean
  size?: 'small' | 'medium' | 'large'
}

/** 时段选择器组件Props */
export interface TimeSlotPickerProps {
  /** 时段列表 */
  slots: TimeSlot[]
  /** 选中的时段 */
  selectedSlot?: TimeSlot | null
  /** 选中的时段列表（多选模式） */
  selectedSlots?: TimeSlot[]
  /** 是否支持多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 最大选择数量（多选模式下有效） */
  maxSelection?: number
  /** 是否显示空状态 */
  showEmptyState?: boolean
  /** 空状态文本 */
  emptyText?: string
  /** 是否显示时段详情 */
  showDetails?: boolean
  /** 是否显示剩余号源 */
  showRemaining?: boolean
  /** 组件尺寸 */
  size?: 'small' | 'medium' | 'large'
}

/** 时段选择器事件 */
export interface TimeSlotPickerEmits {
  /** 时段选择事件 */
  (e: 'select', slot: TimeSlot): void
  /** 时段取消选择事件 */
  (e: 'deselect', slot: TimeSlot): void
  /** 选中时段变更事件 */
  (e: 'update:selectedSlot', slot: TimeSlot | null): void
  /** 选中时段列表变更事件（多选模式） */
  (e: 'update:selectedSlots', slots: TimeSlot[]): void
}

/** 扩展的TimeSlot类型 */
export interface TimeSlot extends BaseTimeSlot {
  /** 时段类型（上午/下午/晚上） */
  period?: 'morning' | 'afternoon' | 'evening'
  /** 时段显示名称 */
  displayName?: string
  /** 是否可预约 */
  bookable?: boolean
}

/** 时段类型定义 */
export enum TimePeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening'
}

/** 时段类型配置 */
export const TimePeriodConfig = {
  [TimePeriod.MORNING]: {
    label: '上午',
    startHour: 8,
    endHour: 12,
    icon: '☀️'
  },
  [TimePeriod.AFTERNOON]: {
    label: '下午',
    startHour: 13,
    endHour: 17,
    icon: '🌞'
  },
  [TimePeriod.EVENING]: {
    label: '晚上',
    startHour: 18,
    endHour: 22,
    icon: '🌙'
  }
} as const

/** 获取时段类型的函数 */
export function getTimePeriod(startTime: string): TimePeriod {
  const hour = parseInt(startTime.split(':')[0])
  
  if (hour >= 8 && hour < 12) {
    return TimePeriod.MORNING
  } else if (hour >= 13 && hour < 17) {
    return TimePeriod.AFTERNOON
  } else if (hour >= 18 && hour < 22) {
    return TimePeriod.EVENING
  }
  
  return TimePeriod.MORNING // 默认值
}