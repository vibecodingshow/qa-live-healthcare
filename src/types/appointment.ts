/**
 * 预约挂号功能 - 类型定义
 * 
 * 本文件定义了预约挂号功能所需的所有 TypeScript 类型定义
 * 包括预约记录、医生排班、时段等核心数据模型
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

import type { Doctor, Patient } from '../store';

/**
 * 预约状态枚举
 * 定义预约的完整生命周期状态
 */
export enum AppointmentStatus {
  /** 待确认 - 患者发起预约，等待医生确认 */
  PENDING = 'PENDING',
  /** 已确认 - 医生已确认预约 */
  CONFIRMED = 'CONFIRMED',
  /** 已拒绝 - 医生拒绝预约 */
  REJECTED = 'REJECTED',
  /** 待就诊 - 预约已确认，等待就诊 */
  SCHEDULED = 'SCHEDULED',
  /** 已完成 - 患者已完成就诊 */
  COMPLETED = 'COMPLETED',
  /** 已取消 - 预约被取消 */
  CANCELLED = 'CANCELLED'
}

/**
 * 取消原因枚举
 * 定义患者取消预约的原因分类
 */
export enum CancelReason {
  /** 时间冲突 */
  TIME_CONFLICT = 'TIME_CONFLICT',
  /** 病情变化 */
  CONDITION_CHANGED = 'CONDITION_CHANGED',
  /** 其他医生 */
  OTHER_DOCTOR = 'OTHER_DOCTOR',
  /** 其他原因 */
  OTHER = 'OTHER'
}

/**
 * 时段类型
 * 定义医生可预约的时段信息
 */
export interface TimeSlot {
  /** 时段唯一标识 */
  id: string;
  /** 时段日期（YYYY-MM-DD） */
  date: string;
  /** 开始时间（HH:mm） */
  startTime: string;
  /** 结束时间（HH:mm） */
  endTime: string;
  /** 可预约人数 */
  maxAppointments: number;
  /** 已预约人数 */
  bookedAppointments: number;
  /** 剩余号源 */
  remainingSlots: number;
}

/**
 * 医生排班类型
 * 定义医生的出诊排班信息
 */
export interface DoctorSchedule {
  /** 排班唯一标识 */
  id: string;
  /** 医生信息 */
  doctor: Doctor;
  /** 时段列表 */
  timeSlots: TimeSlot[];
  /** 排班日期（YYYY-MM-DD） */
  scheduleDate: string;
  /** 是否可用 */
  isAvailable: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 预约记录类型
 * 定义完整的预约信息
 */
export interface Appointment {
  /** 预约唯一标识 */
  id: string;
  /** 预约编号（展示用） */
  appointmentNo: string;
  /** 患者信息 */
  patient: Patient;
  /** 医生信息 */
  doctor: Doctor;
  /** 预约日期（YYYY-MM-DD） */
  appointmentDate: string;
  /** 预约时段开始时间 */
  startTime: string;
  /** 预约时段结束时间 */
  endTime: string;
  /** 预约状态 */
  status: AppointmentStatus;
  /** 预约原因/症状描述 */
  reason: string;
  /** 医生确认/拒绝理由 */
  doctorNote?: string;
  /** 取消原因 */
  cancelReason?: CancelReason;
  /** 取消说明 */
  cancelNote?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 创建预约请求类型
 */
export interface AppointmentCreateRequest {
  /** 医生ID */
  doctorId: string;
  /** 医生姓名 */
  doctorName?: string;
  /** 医生头像 */
  doctorAvatar?: string;
  /** 医生职称 */
  doctorTitle?: string;
  /** 医生科室 */
  doctorDepartment?: string;
  /** 患者ID */
  patientId: string;
  /** 患者姓名 */
  patientName?: string;
  /** 患者生日 */
  patientBirthday?: string;
  /** 预约日期（YYYY-MM-DD） */
  appointmentDate: string;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 时段ID */
  timeSlotId: string;
  /** 预约原因/症状描述 */
  reason: string;
}

/**
 * 取消预约请求类型
 */
export interface AppointmentCancelRequest {
  /** 预约ID */
  appointmentId: string;
  /** 取消原因 */
  cancelReason: CancelReason;
  /** 取消说明（可选） */
  cancelNote?: string;
}

/**
 * 医生审核预约请求类型
 */
export interface AppointmentReviewRequest {
  /** 预约ID */
  appointmentId: string;
  /** 审核结果 - true: 确认, false: 拒绝 */
  approved: boolean;
  /** 审核备注 */
  note?: string;
}

/**
 * 预约列表查询参数
 */
export interface AppointmentListQuery {
  /** 患者ID（患者端使用） */
  patientId?: string;
  /** 医生ID（医生端使用） */
  doctorId?: string;
  /** 预约状态筛选 */
  status?: AppointmentStatus;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 预约列表响应类型
 */
export interface AppointmentListResponse {
  /** 预约列表 */
  appointments: Appointment[];
  /** 总数 */
  total: number;
  /** 当前页 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 排班列表查询参数
 */
export interface ScheduleListQuery {
  /** 医生ID */
  doctorId?: string;
  /** 科室筛选 */
  department?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
}

/**
 * 排班列表响应类型
 */
export interface ScheduleListResponse {
  /** 排班列表 */
  schedules: DoctorSchedule[];
  /** 总数 */
  total: number;
}

/**
 * 创建/更新排班请求类型
 */
export interface ScheduleCreateRequest {
  /** 排班日期（YYYY-MM-DD） */
  scheduleDate: string;
  /** 时段列表 */
  timeSlots: Omit<TimeSlot, 'id' | 'bookedAppointments' | 'remainingSlots'>[];
}

/**
 * 更新排班请求类型
 */
export interface ScheduleUpdateRequest {
  /** 排班ID */
  scheduleId: string;
  /** 是否可用 */
  isAvailable?: boolean;
  /** 时段列表 */
  timeSlots?: Omit<TimeSlot, 'id' | 'bookedAppointments' | 'remainingSlots'>[];
}

/**
 * 预约统计类型
 */
export interface AppointmentStats {
  /** 待确认数量 */
  pendingCount: number;
  /** 已确认数量 */
  confirmedCount: number;
  /** 今日预约数量 */
  todayCount: number;
  /** 本周预约数量 */
  weekCount: number;
  /** 本月预约数量 */
  monthCount: number;
  /** 已完成数量 */
  completedCount: number;
}

/**
 * 预约状态流转辅助函数参数
 */
export interface StatusTransitionParams {
  /** 当前状态 */
  currentStatus: AppointmentStatus;
  /** 目标状态 */
  targetStatus: AppointmentStatus;
  /** 操作人角色 */
  role: 'patient' | 'doctor';
}

/**
 * 预约可用操作类型
 */
export interface AvailableActions {
  /** 是否可取消 */
  canCancel: boolean;
  /** 是否可确认 */
  canConfirm: boolean;
  /** 是否可拒绝 */
  canReject: boolean;
  /** 是否可完成 */
  canComplete: boolean;
}

/**
 * 预约状态文字映射
 */
export const AppointmentStatusText: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: '待确认',
  [AppointmentStatus.CONFIRMED]: '已确认',
  [AppointmentStatus.REJECTED]: '已拒绝',
  [AppointmentStatus.SCHEDULED]: '待就诊',
  [AppointmentStatus.COMPLETED]: '已完成',
  [AppointmentStatus.CANCELLED]: '已取消'
};

/**
 * 取消原因文字映射
 */
export const CancelReasonText: Record<CancelReason, string> = {
  [CancelReason.TIME_CONFLICT]: '时间冲突',
  [CancelReason.CONDITION_CHANGED]: '病情变化',
  [CancelReason.OTHER_DOCTOR]: '其他医生',
  [CancelReason.OTHER]: '其他原因'
};
