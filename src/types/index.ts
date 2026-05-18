/**
 * 类型导出入口文件
 * 
 * 统一导出所有业务类型定义
 */

// 预约相关类型 - 枚举
export {
  AppointmentStatus,
  CancelReason
} from './appointment';

// 预约相关常量
export {
  AppointmentStatusText,
  CancelReasonText
} from './appointment';

export type {
  TimeSlot,
  DoctorSchedule,
  Appointment,
  AppointmentCreateRequest,
  AppointmentCancelRequest,
  AppointmentReviewRequest,
  AppointmentListQuery,
  AppointmentListResponse,
  ScheduleListQuery,
  ScheduleListResponse,
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
  AppointmentStats,
  StatusTransitionParams,
  AvailableActions
} from './appointment';

// 从 store 导出 Doctor 和 Patient 类型
export type { Doctor, Patient } from '../store';
