/**
 * 预约系统错误类型定义
 */

/**
 * 错误代码枚举
 */
export enum ErrorCode {
  // 预约相关错误 (1000-1999)
  APPOINTMENT_CONFLICT = 1001,
  APPOINTMENT_INVALID_TIME = 1002,
  APPOINTMENT_DURATION_INVALID = 1003,
  APPOINTMENT_NOT_FOUND = 1004,
  APPOINTMENT_STATUS_INVALID = 1005,
  
  // 排班相关错误 (2000-2999)
  SCHEDULE_NOT_FOUND = 2001,
  SCHEDULE_CONFLICT = 2002,
  SCHEDULE_TIME_INVALID = 2003,
  SCHEDULE_OVERLAP = 2004,
  
  // 验证相关错误 (3000-3999)
  VALIDATION_FAILED = 3001,
  VALIDATION_TIME_FORMAT = 3002,
  VALIDATION_DATE_INVALID = 3003,
  VALIDATION_REQUIRED_FIELD = 3004,
  
  // 权限相关错误 (4000-4999)
  PERMISSION_DENIED = 4001,
  UNAUTHORIZED_ACCESS = 4002,
  INSUFFICIENT_PERMISSIONS = 4003,
  
  // 数据相关错误 (5000-5999)
  DATA_NOT_FOUND = 5001,
  DATA_VALIDATION_ERROR = 5002,
  DATA_INTEGRITY_ERROR = 5003,
  
  // 系统错误 (9000-9999)
  SYSTEM_ERROR = 9001,
  NETWORK_ERROR = 9002,
  TIMEOUT_ERROR = 9003,
  UNKNOWN_ERROR = 9999
}

/**
 * 错误严重程度
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * 基础错误接口
 */
export interface BaseError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  details?: Record<string, any>;
}

/**
 * 预约冲突错误
 */
export interface AppointmentConflictError extends BaseError {
  code: ErrorCode.APPOINTMENT_CONFLICT;
  conflictType: 'patient' | 'doctor';
  conflictingAppointments: Array<{
    appointmentId: string;
    startTime: string;
    endTime: string;
    patientName?: string;
    doctorName?: string;
  }>;
  suggestedSlots?: Array<{
    startTime: string;
    endTime: string;
    date: string;
  }>;
}

/**
 * 预约时间无效错误
 */
export interface AppointmentTimeInvalidError extends BaseError {
  code: ErrorCode.APPOINTMENT_INVALID_TIME;
  reason: 'past_date' | 'holiday' | 'non_working_hours' | 'outside_schedule';
  providedTime: string;
  validRange?: {
    start: string;
    end: string;
  };
}

/**
 * 预约时长无效错误
 */
export interface AppointmentDurationInvalidError extends BaseError {
  code: ErrorCode.APPOINTMENT_DURATION_INVALID;
  providedDuration: number; // 分钟
  allowedDurations: number[];
}

/**
 * 排班冲突错误
 */
export interface ScheduleConflictError extends BaseError {
  code: ErrorCode.SCHEDULE_CONFLICT;
  conflictDetails: {
    existingSchedule: {
      scheduleId: string;
      date: string;
      timeSlots: Array<{ startTime: string; endTime: string }>;
    };
    newTimeSlot: {
      startTime: string;
      endTime: string;
    };
    overlapDuration: number; // 分钟
  };
}

/**
 * 验证失败错误
 */
export interface ValidationError extends BaseError {
  code: ErrorCode.VALIDATION_FAILED;
  fieldErrors: Array<{
    field: string;
    message: string;
    rule: string;
    value: any;
  }>;
}

/**
 * 权限拒绝错误
 */
export interface PermissionDeniedError extends BaseError {
  code: ErrorCode.PERMISSION_DENIED;
  action: string;
  resource: string;
  requiredPermissions: string[];
  userPermissions: string[];
}

/**
 * 数据验证错误
 */
export interface DataValidationError extends BaseError {
  code: ErrorCode.DATA_VALIDATION_ERROR;
  validationErrors: Array<{
    path: string;
    message: string;
    value: any;
    expected: any;
  }>;
}

/**
 * 系统错误
 */
export interface SystemError extends BaseError {
  code: ErrorCode.SYSTEM_ERROR;
  component: string;
  operation: string;
  stackTrace?: string;
}

/**
 * 错误工厂类
 */
export class ErrorFactory {
  
  /**
   * 创建预约冲突错误
   */
  static createAppointmentConflictError(
    conflictType: 'patient' | 'doctor',
    conflictingAppointments: Array<{
      appointmentId: string;
      startTime: string;
      endTime: string;
      patientName?: string;
      doctorName?: string;
    }>,
    suggestedSlots?: Array<{
      startTime: string;
      endTime: string;
      date: string;
    }>
  ): AppointmentConflictError {
    const message = conflictType === 'patient' 
      ? `患者在同一时间段已有 ${conflictingAppointments.length} 个预约`
      : `医生在该时间段已有 ${conflictingAppointments.length} 个预约`;

    return {
      code: ErrorCode.APPOINTMENT_CONFLICT,
      message,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      conflictType,
      conflictingAppointments,
      suggestedSlots
    };
  }

  /**
   * 创建预约时间无效错误
   */
  static createAppointmentTimeInvalidError(
    reason: 'past_date' | 'holiday' | 'non_working_hours' | 'outside_schedule',
    providedTime: string,
    validRange?: { start: string; end: string }
  ): AppointmentTimeInvalidError {
    const messages = {
      past_date: '预约时间不能是过去的时间',
      holiday: '节假日不能预约',
      non_working_hours: '非工作时间不能预约',
      outside_schedule: '预约时间不在医生排班范围内'
    };

    return {
      code: ErrorCode.APPOINTMENT_INVALID_TIME,
      message: messages[reason],
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      reason,
      providedTime,
      validRange
    };
  }

  /**
   * 创建预约时长无效错误
   */
  static createAppointmentDurationInvalidError(
    providedDuration: number,
    allowedDurations: number[] = [30, 60, 90, 120]
  ): AppointmentDurationInvalidError {
    return {
      code: ErrorCode.APPOINTMENT_DURATION_INVALID,
      message: `预约时长 ${providedDuration} 分钟无效，允许的时长：${allowedDurations.join('、')} 分钟`,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      providedDuration,
      allowedDurations
    };
  }

  /**
   * 创建验证错误
   */
  static createValidationError(fieldErrors: Array<{
    field: string;
    message: string;
    rule: string;
    value: any;
  }>): ValidationError {
    return {
      code: ErrorCode.VALIDATION_FAILED,
      message: `验证失败：${fieldErrors.length} 个字段存在问题`,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      fieldErrors
    };
  }

  /**
   * 创建权限拒绝错误
   */
  static createPermissionDeniedError(
    action: string,
    resource: string,
    requiredPermissions: string[],
    userPermissions: string[]
  ): PermissionDeniedError {
    return {
      code: ErrorCode.PERMISSION_DENIED,
      message: `没有权限执行 ${action} 操作`,
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      action,
      resource,
      requiredPermissions,
      userPermissions
    };
  }

  /**
   * 创建系统错误
   */
  static createSystemError(
    component: string,
    operation: string,
    message: string,
    stackTrace?: string
  ): SystemError {
    return {
      code: ErrorCode.SYSTEM_ERROR,
      message,
      severity: ErrorSeverity.CRITICAL,
      timestamp: new Date(),
      component,
      operation,
      stackTrace
    };
  }
}

/**
 * 错误处理工具类
 */
export class ErrorHandler {
  
  /**
   * 获取错误的用户友好消息
   */
  static getUserFriendlyMessage(error: BaseError): string {
    switch (error.code) {
      case ErrorCode.APPOINTMENT_CONFLICT:
        const conflictError = error as AppointmentConflictError;
        return conflictError.conflictType === 'patient'
          ? '您在同一时间段已有预约，请选择其他时间'
          : '医生在该时间段已有预约，请选择其他时间';

      case ErrorCode.APPOINTMENT_INVALID_TIME:
        const timeError = error as AppointmentTimeInvalidError;
        switch (timeError.reason) {
          case 'past_date': return '预约时间不能是过去的时间';
          case 'holiday': return '节假日不能预约';
          case 'non_working_hours': return '非工作时间不能预约';
          case 'outside_schedule': return '预约时间不在医生排班范围内';
          default: return '预约时间无效';
        }

      case ErrorCode.VALIDATION_FAILED:
        const validationError = error as ValidationError;
        return validationError.fieldErrors[0]?.message || '输入信息有误，请检查后重试';

      case ErrorCode.PERMISSION_DENIED:
        return '您没有权限执行此操作';

      default:
        return error.message || '系统繁忙，请稍后重试';
    }
  }

  /**
   * 记录错误日志
   */
  static logError(error: BaseError, context?: Record<string, any>): void {
    const logEntry = {
      timestamp: error.timestamp.toISOString(),
      code: error.code,
      severity: error.severity,
      message: error.message,
      details: error.details,
      context
    };

    // 实际项目中应该发送到日志服务
    console.error('预约系统错误:', logEntry);

    // 根据错误严重程度进行不同处理
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        // 发送警报
        console.error('CRITICAL ERROR - 需要立即处理');
        break;
      case ErrorSeverity.HIGH:
        // 记录到错误监控系统
        console.warn('HIGH SEVERITY ERROR');
        break;
      default:
        // 常规错误日志
        console.log('常规错误记录');
    }
  }

  /**
   * 判断错误是否可重试
   */
  static isRetryable(error: BaseError): boolean {
    const retryableCodes = [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT_ERROR,
      ErrorCode.SYSTEM_ERROR
    ];

    return retryableCodes.includes(error.code) && 
           error.severity !== ErrorSeverity.CRITICAL;
  }
}

// 导出所有错误类型
export type AppointmentError = 
  | AppointmentConflictError
  | AppointmentTimeInvalidError
  | AppointmentDurationInvalidError
  | ScheduleConflictError
  | ValidationError
  | PermissionDeniedError
  | DataValidationError
  | SystemError
  | BaseError;