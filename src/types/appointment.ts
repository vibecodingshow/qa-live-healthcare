// 预约挂号功能数据模型定义

/**
 * 医生预约设置
 */
export interface DoctorAppointmentSettings {
  maxAppointmentsPerDay: number;    // 每日最大预约数
  appointmentDuration: number;      // 每个预约时长（分钟）
  workingDays: string[];            // 工作日设置 ['monday', 'tuesday', ...]
  workingHours: {                   // 工作时间段
    start: string;                  // HH:mm
    end: string;                    // HH:mm
  };
}

/**
 * 排班模型
 */
export interface Schedule {
  id: string;
  doctorId: string;
  date: string;                     // YYYY-MM-DD
  timeSlots: TimeSlot[];            // 时间段列表
  isAvailable: boolean;             // 是否可预约
  createdAt: string;
  updatedAt: string;
}

/**
 * 时间段模型
 */
export interface TimeSlot {
  id: string;
  startTime: string;                // HH:mm
  endTime: string;                  // HH:mm
  isBooked: boolean;                // 是否已被预约
  appointmentId?: string;           // 关联的预约ID
}

/**
 * 预约模型
 */
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentTime: string;          // ISO 8601格式
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;                 // 症状描述
  notes?: string;                   // 医生备注
  cancelReason?: string;            // 取消原因
  createdAt: string;
  updatedAt: string;
}

/**
 * 预约统计数据模型
 */
export interface AppointmentStatistics {
  totalAppointments: number;        // 总预约数
  completedAppointments: number;    // 已完成预约数
  pendingAppointments: number;      // 待处理预约数
  cancellationRate: number;         // 取消率
  averageResponseTime: number;      // 平均响应时间（分钟）
}

/**
 * 冲突检测结果
 */
export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'doctor_busy' | 'patient_busy' | 'time_overlap';
  conflictingAppointment?: Appointment;
  message?: string;
}

/**
 * 预约状态流转约束
 */
export const APPOINTMENT_STATUS_CONSTRAINTS = {
  // 允许的状态转换
  allowedTransitions: {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  },
  
  // 状态对应的操作权限
  permissions: {
    // 患者可以执行的操作
    patient: {
      pending: ['cancel'],
      confirmed: ['cancel'],
      completed: [],
      cancelled: []
    },
    // 医生可以执行的操作
    doctor: {
      pending: ['confirm', 'reject'],
      confirmed: ['complete'],
      completed: [],
      cancelled: []
    }
  }
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
 * 预约状态描述
 */
export const APPOINTMENT_STATUS_DESCRIPTIONS = {
  pending: { label: '待确认', color: 'orange' },
  confirmed: { label: '已确认', color: 'green' },
  completed: { label: '已完成', color: 'blue' },
  cancelled: { label: '已取消', color: 'red' }
} as const;