/**
 * 医生排班相关类型定义
 */

/** 时段状态 */
export enum SlotStatus {
  /** 可预约 */
  AVAILABLE = 'available',
  /** 号源紧张 */
  LOW_STOCK = 'low_stock',
  /** 已满 */
  FULL = 'full',
  /** 停诊 */
  SUSPENDED = 'suspended',
}

/** 时段 */
export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  total: number
  remaining: number
  status: SlotStatus
}

/** 医生排班信息 */
export interface DoctorSchedule {
  id: string
  doctorId: string
  doctorName: string
  doctorAvatar?: string
  department: string
  title: string
  hospital: string
  scheduleDate: string
  timeSlots: TimeSlot[]
  status: SlotStatus
}

/** 排班筛选参数 */
export interface ScheduleFilterParams {
  department?: string
  startDate?: string
  endDate?: string
  keyword?: string
  page?: number
  pageSize?: number
}

/** 排班列表响应 */
export interface ScheduleListResponse {
  list: DoctorSchedule[]
  total: number
  page: number
  pageSize: number
}

/** 科室信息 */
export interface Department {
  id: string
  name: string
}
