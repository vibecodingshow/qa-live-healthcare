/**
 * 预约相关工具函数
 * 
 * 提供预约状态管理、格式化、验证等通用功能
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

import type { Appointment, AppointmentStatus, CancelReason } from '../types';
import dayjs from 'dayjs';

/**
 * 预约状态枚举
 */
export enum AppointmentStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/**
 * 取消原因枚举
 */
export enum CancelReasonEnum {
  TIME_CONFLICT = 'TIME_CONFLICT',
  CONDITION_CHANGED = 'CONDITION_CHANGED',
  OTHER_DOCTOR = 'OTHER_DOCTOR',
  OTHER = 'OTHER',
}

/**
 * 获取预约状态文本
 * 
 * @param status - 预约状态
 * @returns 状态文本
 */
export function getAppointmentStatusText(status: AppointmentStatus): string {
  const statusMap: Record<AppointmentStatus, string> = {
    [AppointmentStatusEnum.PENDING]: '待确认',
    [AppointmentStatusEnum.CONFIRMED]: '已确认',
    [AppointmentStatusEnum.SCHEDULED]: '待就诊',
    [AppointmentStatusEnum.COMPLETED]: '已完成',
    [AppointmentStatusEnum.REJECTED]: '已拒绝',
    [AppointmentStatusEnum.CANCELLED]: '已取消',
  };
  return statusMap[status] || status;
}

/**
 * 获取预约状态颜色
 * 
 * @param status - 预约状态
 * @returns Ant Design 颜色值
 */
export function getAppointmentStatusColor(status: AppointmentStatus): string {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatusEnum.PENDING]: 'orange',
    [AppointmentStatusEnum.CONFIRMED]: 'blue',
    [AppointmentStatusEnum.SCHEDULED]: 'cyan',
    [AppointmentStatusEnum.COMPLETED]: 'green',
    [AppointmentStatusEnum.REJECTED]: 'red',
    [AppointmentStatusEnum.CANCELLED]: 'default',
  };
  return colorMap[status] || 'default';
}

/**
 * 获取取消原因文本
 * 
 * @param reason - 取消原因
 * @returns 原因文本
 */
export function getCancelReasonText(reason: CancelReason): string {
  const reasonMap: Record<CancelReason, string> = {
    [CancelReasonEnum.TIME_CONFLICT]: '时间冲突',
    [CancelReasonEnum.CONDITION_CHANGED]: '病情变化',
    [CancelReasonEnum.OTHER_DOCTOR]: '选择其他医生',
    [CancelReasonEnum.OTHER]: '其他原因',
  };
  return reasonMap[reason] || reason;
}

/**
 * 格式化预约日期
 * 
 * @param date - 日期字符串
 * @param format - 格式模板
 * @returns 格式化后的日期
 */
export function formatAppointmentDate(date: string, format: string = 'YYYY-MM-DD'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

/**
 * 检查是否可以取消预约（距离预约时间2小时以上）
 * 
 * @param appointmentDate - 预约日期
 * @param startTime - 开始时间
 * @returns 是否可以取消
 */
export function canCancelAppointment(appointmentDate: string, startTime: string): boolean {
  const now = dayjs();
  const appointmentDateTime = dayjs(`${appointmentDate} ${startTime}`);
  const hoursDiff = appointmentDateTime.diff(now, 'hour');
  return hoursDiff >= 2;
}

/**
 * 更新 localStorage 中的预约数据
 * 
 * @param appointmentId - 预约ID
 * @param updates - 要更新的字段
 */
export function updateLocalStorageAppointment(appointmentId: string, updates: Partial<Appointment>): void {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    const index = appointments.findIndex((apt: any) => apt.id === appointmentId);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }
}

/**
 * 从 localStorage 中删除预约
 * 
 * @param appointmentId - 预约ID
 */
export function removeLocalStorageAppointment(appointmentId: string): void {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    const filteredAppointments = appointments.filter((apt: any) => apt.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
  }
}

// ===== 以下是从 constants.ts 迁移过来的函数 =====

/**
 * 检查状态转换是否有效
 */
export function isValidStatusTransition(
  currentStatus: AppointmentStatus,
  targetStatus: AppointmentStatus,
  operator: 'patient' | 'doctor'
): boolean {
  const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    PENDING: ['CONFIRMED', 'REJECTED'],
    CONFIRMED: ['SCHEDULED', 'CANCELLED'],
    SCHEDULED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  return transitions[currentStatus]?.includes(targetStatus) || false;
}

/**
 * 检查是否有权限管理预约
 */
export function canManageAppointment(appointment: Appointment): boolean {
  // 这里简化处理，实际项目中需要根据登录用户判断
  return true;
}

/**
 * 获取当前医生ID
 */
export function getCurrentDoctorId(): string | null {
  // 这里简化处理，实际项目中应该从登录状态获取
  return 'doc001';
}