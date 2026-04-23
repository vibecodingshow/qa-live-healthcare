/**
 * 医生详情相关类型定义
 */

/** 医生基本信息 */
export interface DoctorInfo {
  id: string
  name: string
  avatar?: string
  title: string
  department: string
  hospital: string
  experience: string
  specialties: string[]
  introduction: string
  isActive: boolean
}

/** 医生排班详情 */
export interface DoctorScheduleDetail {
  id: string
  doctorId: string
  scheduleDate: string
  timeSlots: TimeSlot[]
  status: SlotStatus
}

/** 医生详情响应 */
export interface DoctorDetailResponse {
  doctor: DoctorInfo
  schedules: DoctorScheduleDetail[]
}

/** 医生排班日历响应 */
export interface DoctorScheduleCalendarResponse {
  date: string
  available: boolean
  totalSlots: number
  remainingSlots: number
  status: SlotStatus
}

/** 医生排班日历请求参数 */
export interface DoctorScheduleCalendarParams {
  doctorId: string
  year: number
  month: number
}