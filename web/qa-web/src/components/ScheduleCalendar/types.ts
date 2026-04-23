/**
 * 日期标记接口
 */
export interface DateMark {
  /** 日期 */
  date: Date
  /** 日期状态 */
  status: 'available' | 'limited' | 'full' | 'closed' | 'past'
  /** 剩余号源数量 */
  remainingSlots?: number
  /** 总号源数量 */
  totalSlots?: number
}

/**
 * 日历组件Props接口
 */
export interface CalendarProps {
  /** 日历标题 */
  title?: string
  /** 标记的日期数组 */
  markedDates?: DateMark[]
  /** 当前选中的日期 */
  selectedDate?: Date
  /** 可选择的开始日期 */
  startDate?: Date
  /** 可选择的结束日期 */
  endDate?: Date
  /** 周起始日 (0=周日, 1=周一) */
  weekStartsOn?: 0 | 1
  /** 是否禁用过去的日期 */
  disablePast?: boolean
  /** 是否显示今日按钮 */
  showTodayButton?: boolean
}

/**
 * 日历组件Emits接口
 */
export interface CalendarEmits {
  /** 日期选择事件 */
  (e: 'select', date: Date): void
  /** 月份切换事件 */
  (e: 'month-change', date: Date): void
}

/**
 * 日期信息接口
 */
export interface CalendarDayInfo {
  /** 日期 */
  date: Date
  /** 是否当前月份 */
  isCurrentMonth: boolean
  /** 是否今天 */
  isToday: boolean
  /** 是否选中 */
  isSelected: boolean
  /** 是否禁用 */
  isDisabled: boolean
  /** 日期状态 */
  status?: DateMark['status']
}

/**
 * 日历头部组件Props接口
 */
export interface CalendarHeaderProps {
  /** 当前显示的日期 */
  currentDate: any // dayjs.Dayjs
  /** 标题 */
  title?: string
  /** 是否显示今日按钮 */
  showTodayButton?: boolean
  /** 是否可以切换到上个月 */
  canPrevMonth?: boolean
  /** 是否可以切换到下个月 */
  canNextMonth?: boolean
}

/**
 * 日历头部组件Emits接口
 */
export interface CalendarHeaderEmits {
  /** 切换到上个月 */
  (e: 'prev-month'): void
  /** 切换到下个月 */
  (e: 'next-month'): void
  /** 回到今日 */
  (e: 'go-today'): void
}

/**
 * 日历网格组件Props接口
 */
export interface CalendarGridProps {
  /** 当前显示的日期 */
  currentDate: any // dayjs.Dayjs
  /** 标记的日期数组 */
  markedDates?: DateMark[]
  /** 当前选中的日期 */
  selectedDate?: Date
  /** 周起始日 */
  weekStartsOn?: 0 | 1
  /** 是否禁用过去的日期 */
  disablePast?: boolean
}

/**
 * 日历网格组件Emits接口
 */
export interface CalendarGridEmits {
  /** 日期选择事件 */
  (e: 'select', date: Date): void
}

/**
 * 日期单元格组件Props接口
 */
export interface CalendarDayProps {
  /** 日期 */
  date: Date
  /** 是否当前月份 */
  isCurrentMonth?: boolean
  /** 是否今天 */
  isToday?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 日期状态 */
  status?: DateMark['status']
}

/**
 * 日期单元格组件Emits接口
 */
export interface CalendarDayEmits {
  /** 点击事件 */
  (e: 'click'): void
}