// 预约挂号功能类型导出

// 从 appointment.ts 导入预约相关类型
export {
  Appointment,
  DoctorAppointmentSettings,
  Schedule,
  TimeSlot,
  AppointmentStatistics,
  ConflictCheckResult,
  APPOINTMENT_STATUS_CONSTRAINTS,
  WEEK_DAYS,
  APPOINTMENT_STATUS_DESCRIPTIONS
} from './appointment';

// 从 schedule.ts 导入排班相关类型
export {
  ScheduleTimeSlot,
  Schedule,
  DoctorScheduleSettings,
  ScheduleGenerationConfig,
  ScheduleConflict,
  ScheduleStatistics,
  ScheduleQueryParams,
  SCHEDULE_STATUS,
  WEEK_DAYS,
  SCHEDULE_PERMISSIONS
} from './schedule';

// 从 errors.ts 导入错误相关类型
export {
  ErrorCode,
  ErrorSeverity,
  BaseError,
  AppointmentConflictError,
  AppointmentTimeInvalidError,
  AppointmentDurationInvalidError,
  ScheduleConflictError,
  ValidationError,
  PermissionDeniedError,
  DataValidationError,
  SystemError,
  ErrorFactory,
  ErrorHandler,
  type AppointmentError
} from './errors';
