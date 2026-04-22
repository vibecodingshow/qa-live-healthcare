/**
 * 预约系统通知工具函数
 * 封装 Ant Design Vue Message 组件调用
 */
import { message } from 'ant-design-vue';

// 通知文案配置
export const notificationMessages = {
  // 预约创建
  appointmentCreated: (doctorName: string, date: string, time: string) =>
    `预约成功！您已预约 ${doctorName} 的门诊，时间：${date} ${time}`,

  // 预约确认
  appointmentConfirmed: '您的预约已被确认，请按时就诊',

  // 预约取消（患者视角）
  appointmentCancelledByPatient: '您的预约已取消',

  // 预约取消（医生视角）
  appointmentCancelledByDoctor: '该预约已取消',

  // 预约完成
  appointmentCompleted: '就诊已完成，感谢您的使用',

  // 预约失败
  appointmentFailed: '预约创建失败，请重试',

  // 取消失败
  cancelFailed: '取消预约失败',

  // 确认失败
  confirmFailed: '确认预约失败',

  // 无效操作
  invalidOperation: '当前状态不支持此操作',

  // 排班创建
  scheduleCreated: '排班创建成功',

  // 排班更新
  scheduleUpdated: '排班更新成功',

  // 排班删除
  scheduleDeleted: '排班删除成功',

  // 排班删除失败
  scheduleDeleteFailed: '该排班存在活跃预约，无法删除',

  // 时间冲突
  timeSlotConflict: '该时间段已被其他预约占用',

  // 超出排班范围
  outOfScheduleRange: '预约时间超出医生排班范围',
};

/**
 * 显示成功通知
 */
export function showSuccess(content: string) {
  message.success(content, 3);
}

/**
 * 显示警告通知
 */
export function showWarning(content: string) {
  message.warning(content, 3);
}

/**
 * 显示错误通知
 */
export function showError(content: string) {
  message.error(content, 3);
}

/**
 * 显示信息通知
 */
export function showInfo(content: string) {
  message.info(content, 3);
}

/**
 * 预约创建成功通知
 */
export function showAppointmentCreated(doctorName: string, date: string, time: string) {
  showSuccess(notificationMessages.appointmentCreated(doctorName, date, time));
}

/**
 * 预约确认通知
 */
export function showAppointmentConfirmed() {
  showSuccess(notificationMessages.appointmentConfirmed);
}

/**
 * 预约取消通知（患者）
 */
export function showAppointmentCancelledPatient() {
  showInfo(notificationMessages.appointmentCancelledByPatient);
}

/**
 * 预约取消通知（医生）
 */
export function showAppointmentCancelledDoctor() {
  showInfo(notificationMessages.appointmentCancelledByDoctor);
}

/**
 * 预约完成通知
 */
export function showAppointmentCompleted() {
  showSuccess(notificationMessages.appointmentCompleted);
}

/**
 * 排班操作通知
 */
export function showScheduleSuccess(action: 'create' | 'update' | 'delete') {
  const messages = {
    create: notificationMessages.scheduleCreated,
    update: notificationMessages.scheduleUpdated,
    delete: notificationMessages.scheduleDeleted,
  };
  showSuccess(messages[action]);
}

/**
 * 排班删除失败通知
 */
export function showScheduleDeleteFailed() {
  showError(notificationMessages.scheduleDeleteFailed);
}

/**
 * 显示验证错误通知
 */
export function showValidationError(error: string) {
  showWarning(error);
}
