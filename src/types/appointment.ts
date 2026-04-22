/**
 * 预约挂号相关类型定义
 * 包含预约记录、医生排班、时间段等实体类型
 */

/**
 * 预约状态枚举
 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/**
 * 预约记录实体
 * 患者预约医生线下门诊的记录
 */
export interface Appointment {
  /** 预约唯一标识 */
  id: string;

  /** 患者ID */
  patientId: string;

  /** 患者姓名 */
  patientName: string;

  /** 医生ID */
  doctorId: string;

  /** 医生姓名 */
  doctorName: string;

  /** 预约日期（YYYY-MM-DD格式） */
  date: string;

  /** 预约开始时间（HH:mm格式） */
  startTime: string;

  /** 预约结束时间（HH:mm格式） */
  endTime: string;

  /** 预约状态 */
  status: AppointmentStatus;

  /** 预约创建时间 */
  createTime: string;

  /** 预约更新时间 */
  updateTime: string;

  /** 预约备注（可选） */
  notes?: string;

  /** 患者联系电话（可选） */
  patientPhone?: string;

  /** 取消原因（仅在status为cancelled时有值） */
  cancelReason?: string;
}

/**
 * 医生排班实体
 * 医生设置的门诊工作时间
 */
export interface Schedule {
  /** 排班唯一标识 */
  id: string;

  /** 医生ID */
  doctorId: string;

  /** 工作日期（YYYY-MM-DD格式） */
  date: string;

  /** 开始时间（HH:mm格式） */
  startTime: string;

  /** 结束时间（HH:mm格式） */
  endTime: string;

  /** 是否可用 */
  isAvailable: boolean;

  /** 最大预约数 */
  maxAppointments: number;

  /** 当前预约数 */
  currentAppointments: number;
}

/**
 * 时间段实体
 * 预约的可选时间段
 */
export interface TimeSlot {
  /** 时间段唯一标识 */
  id: string;

  /** 关联的排班ID */
  scheduleId: string;

  /** 开始时间（HH:mm格式） */
  startTime: string;

  /** 结束时间（HH:mm格式） */
  endTime: string;

  /** 时间段状态 */
  status: 'available' | 'booked' | 'unavailable';
}

/**
 * 创建预约的输入类型
 */
export type AppointmentInput = Omit<Appointment, 'id' | 'status' | 'createTime' | 'updateTime'>;

/**
 * 创建排班的输入类型
 */
export type ScheduleInput = Omit<Schedule, 'id' | 'currentAppointments'>;

/**
 * 预约状态流转映射
 */
export const AppointmentStatusMap: Record<AppointmentStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

/**
 * 获取预约状态的显示文本
 */
export function getAppointmentStatusText(status: AppointmentStatus): string {
  return AppointmentStatusMap[status] || status;
}

/**
 * 判断预约是否可取消
 */
export function canCancelAppointment(appointment: Appointment): boolean {
  return appointment.status === 'pending' || appointment.status === 'confirmed';
}

/**
 * 判断预约是否可确认
 */
export function canConfirmAppointment(appointment: Appointment): boolean {
  return appointment.status === 'pending';
}

/**
 * 判断预约是否可完成
 */
export function canCompleteAppointment(appointment: Appointment): boolean {
  return appointment.status === 'confirmed';
}
