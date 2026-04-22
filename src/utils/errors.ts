/**
 * 预约系统异常定义
 */

// 异常错误码枚举
export enum AppointmentErrorCode {
  // 时段相关
  SLOT_UNAVAILABLE = 'SLOT_UNAVAILABLE',
  SLOT_NOT_FOUND = 'SLOT_NOT_FOUND',
  PAST_SLOT = 'PAST_SLOT',
  
  // 网络相关
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // 验证相关
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PHONE_INVALID = 'PHONE_INVALID',
  NAME_INVALID = 'NAME_INVALID',
  
  // 存储相关
  STORAGE_ERROR = 'STORAGE_ERROR',
  STORAGE_FULL = 'STORAGE_FULL',
  
  // 预约相关
  DUPLICATE_BOOKING = 'DUPLICATE_BOOKING',
  APPOINTMENT_NOT_FOUND = 'APPOINTMENT_NOT_FOUND',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  TOO_LATE_TO_CANCEL = 'TOO_LATE_TO_CANCEL',
  
  // 认证相关
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// 预约异常类
export class AppointmentError extends Error {
  constructor(
    public code: AppointmentErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppointmentError';
  }
  
  toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}

// 错误消息映射
export const ErrorMessages: Record<AppointmentErrorCode, string> = {
  [AppointmentErrorCode.SLOT_UNAVAILABLE]: '该时段已被其他患者预约，请重新选择',
  [AppointmentErrorCode.SLOT_NOT_FOUND]: '时段不存在',
  [AppointmentErrorCode.PAST_SLOT]: '该时段已过期，无法预约',
  
  [AppointmentErrorCode.NETWORK_ERROR]: '网络异常，请检查网络连接后重试',
  [AppointmentErrorCode.TIMEOUT_ERROR]: '请求超时，请稍后重试',
  
  [AppointmentErrorCode.VALIDATION_ERROR]: '数据验证失败，请检查输入',
  [AppointmentErrorCode.PHONE_INVALID]: '请输入正确的手机号',
  [AppointmentErrorCode.NAME_INVALID]: '请输入正确的姓名',
  
  [AppointmentErrorCode.STORAGE_ERROR]: '数据保存失败，请稍后重试',
  [AppointmentErrorCode.STORAGE_FULL]: '存储空间不足，请清理浏览器缓存',
  
  [AppointmentErrorCode.DUPLICATE_BOOKING]: '您已预约该时段，请勿重复预约',
  [AppointmentErrorCode.APPOINTMENT_NOT_FOUND]: '预约记录不存在',
  [AppointmentErrorCode.APPOINTMENT_CANCELLED]: '该预约已取消',
  [AppointmentErrorCode.ALREADY_COMPLETED]: '该预约已完成，无法取消',
  [AppointmentErrorCode.TOO_LATE_TO_CANCEL]: '距离就诊时间不足2小时，无法取消',
  
  [AppointmentErrorCode.AUTH_ERROR]: '认证失败，请重新登录',
  [AppointmentErrorCode.UNAUTHORIZED]: '您没有权限进行此操作',
  
  [AppointmentErrorCode.UNKNOWN_ERROR]: '操作失败，请稍后重试',
};

// 快捷创建异常
export function createError(code: AppointmentErrorCode, details?: unknown): AppointmentError {
  return new AppointmentError(code, ErrorMessages[code], details);
}

// 判断是否为 AppointmentError
export function isAppointmentError(error: unknown): error is AppointmentError {
  return error instanceof AppointmentError;
}
