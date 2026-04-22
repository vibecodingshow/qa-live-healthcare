// 排班管理相关数据模型定义

/**
 * 排班时间段模型
 */
export interface ScheduleTimeSlot {
  id: string;
  scheduleId: string;
  startTime: string;                // HH:mm
  endTime: string;                  // HH:mm
  isBooked: boolean;                // 是否已被预约
  appointmentId?: string;           // 关联的预约ID
  maxCapacity: number;              // 最大预约人数
  currentCapacity: number;          // 当前预约人数
  isAvailable: boolean;             // 是否可预约
}

/**
 * 排班模型（天级别）
 */
export interface Schedule {
  id: string;
  doctorId: string;
  date: string;                     // YYYY-MM-DD
  timeSlots: ScheduleTimeSlot[];    // 时间段列表
  isAvailable: boolean;             // 是否可预约
  totalSlots: number;               // 总时间段数
  bookedSlots: number;              // 已预约时间段数
  availableSlots: number;           // 可预约时间段数
  createdAt: string;
  updatedAt: string;
  createdBy: string;                // 创建者ID
}

/**
 * 医生排班设置
 */
export interface DoctorScheduleSettings {
  doctorId: string;
  maxAppointmentsPerDay: number;    // 每日最大预约数
  appointmentDuration: number;      // 每个预约时长（分钟）
  workingDays: string[];            // 工作日设置 ['monday', 'tuesday', ...]
  workingHours: {                   // 工作时间段
    start: string;                  // HH:mm
    end: string;                    // HH:mm
  };
  breakTimes: {                     // 休息时间段
    start: string;
    end: string;
  }[];
  isActive: boolean;                // 是否激活排班
  autoGenerate: boolean;            // 是否自动生成排班
}

/**
 * 排班生成配置
 */
export interface ScheduleGenerationConfig {
  doctorId: string;
  startDate: string;                // 开始日期 YYYY-MM-DD
  endDate: string;                  // 结束日期 YYYY-MM-DD
  slotDuration: number;             // 时间段时长（分钟）
  maxSlotsPerDay: number;           // 每天最大时间段数
  includeWeekends: boolean;         // 是否包含周末
  holidays: string[];               // 节假日列表
}

/**
 * 排班冲突检测结果
 */
export interface ScheduleConflict {
  hasConflict: boolean;
  conflictType?: 'doctor_busy' | 'time_overlap' | 'capacity_full';
  conflictingSchedule?: Schedule;
  message?: string;
}

/**
 * 排班统计信息
 */
export interface ScheduleStatistics {
  totalSchedules: number;           // 总排班数
  availableSchedules: number;       // 可预约排班数
  bookedSchedules: number;          // 已预约排班数
  utilizationRate: number;          // 利用率
  averageBookingsPerDay: number;    // 日均预约数
  peakBookingTime: string;          // 高峰预约时间
}

/**
 * 排班查询参数
 */
export interface ScheduleQueryParams {
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  isAvailable?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * 排班状态枚举
 */
export const SCHEDULE_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
} as const;

/**
 * 工作日枚举
 */
export const WEEK_DAYS = {
  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
  sunday: '周日'
} as const;

/**
 * 排班操作权限
 */
export const SCHEDULE_PERMISSIONS = {
  // 医生可以执行的操作
  doctor: ['create', 'update', 'delete', 'view', 'generate'],
  // 患者可以执行的操作
  patient: ['view', 'book'],
  // 管理员可以执行的操作
  admin: ['create', 'update', 'delete', 'view', 'generate', 'manage']
} as const;