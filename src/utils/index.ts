/**
 * 工具函数导出入口文件
 * 
 * 统一导出所有工具函数
 */

// 预约相关工具函数
export {
  // 状态流转
  isValidStatusTransition,
  getValidNextStatuses,
  isFinalStatus,
  isActiveStatus,
  getAvailableActions,
  
  // 取消预约
  getCancelDeadline,
  canCancelAppointment,
  getRemainingCancelTime,
  
  // 日期时间格式化
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentDateTimeText,
  getFutureAvailableDays,
  
  // 状态文本
  getAppointmentStatusText,
  getCancelReasonText,
  getAppointmentStatusColor,
  
  // 时段处理
  getAvailableTimeSlots,
  isTimeSlotAvailable,
  
  // 验证函数
  isValidDateFormat,
  isValidTimeFormat,
  
  // 预约编号
  generateAppointmentNo,
  
  // 常量
  CANCEL_DEADLINE_HOURS
} from './appointment';
