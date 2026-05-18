/**
 * 医生端预约管理 API 服务
 *
 * 提供医生端的预约列表查询、预约确认/拒绝、排班管理等接口
 *
 * @version 1.0.0
 * @created 2026-04-22
 */

import { 
  AppointmentStatusEnum, 
  CancelReasonEnum, 
  isValidStatusTransition, 
  canManageAppointment, 
  getCurrentDoctorId,
  updateLocalStorageAppointment
} from '../utils/appointment';
import type {
  Appointment,
  DoctorSchedule,
  AppointmentListQuery,
  AppointmentListResponse,
  ScheduleListQuery,
  ScheduleListResponse,
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
  AppointmentStats,
} from '../types';
import { store } from '../store';
import { AppointmentStatus as AppointmentStatusEnum } from '../types/appointment';
import { isValidStatusTransition } from '../utils/appointment';

/**
 * 模拟数据存储
 * 实际项目中应替换为真实 API 调用
 */
const mockAppointments: Appointment[] = [];
const mockSchedules: DoctorSchedule[] = [];

// ==================== 预约管理 API ====================

/**
 * 获取当前登录医生的ID
 * @returns 医生ID或null
 */
function getCurrentDoctorId(): string | null {
  return store.state.currentDoctor?.id || null;
}

/**
 * 验证医生是否有权限操作指定预约
 * @param appointment - 预约记录
 * @returns 是否有权限
 */
function canManageAppointment(appointment: Appointment): boolean {
  const doctorId = getCurrentDoctorId();
  return doctorId === appointment.doctor.id;
}

/**
 * 获取医生预约列表
 *
 * @param query - 查询参数
 * @returns 预约列表响应
 *
 * @example
 * ```typescript
 * // 获取所有待确认的预约
 * const result = await getDoctorAppointments({ status: AppointmentStatus.PENDING });
 * ```
 */
export async function getDoctorAppointments(
  query: AppointmentListQuery = {}
): Promise<AppointmentListResponse> {
  // 获取当前医生ID
  const doctorId = query.doctorId || getCurrentDoctorId();

  if (!doctorId) {
    throw new Error('未登录或医生ID无效');
  }

  // 模拟API调用
  // 实际项目中替换为: return get<AppointmentListResponse>('/doctor/appointments', { params: query });

  // 过滤当前医生的预约
  let filteredAppointments = mockAppointments.filter(
    (apt) => apt.doctor.id === doctorId
  );

  // 按状态筛选
  if (query.status) {
    filteredAppointments = filteredAppointments.filter(
      (apt) => apt.status === query.status
    );
  }

  // 按日期范围筛选
  if (query.startDate) {
    filteredAppointments = filteredAppointments.filter(
      (apt) => apt.appointmentDate >= query.startDate!
    );
  }
  if (query.endDate) {
    filteredAppointments = filteredAppointments.filter(
      (apt) => apt.appointmentDate <= query.endDate!
    );
  }

  // 分页
  const page = query.page || 1;
  const pageSize = query.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
  const total = filteredAppointments.length;
  const totalPages = Math.ceil(total / pageSize);

  return {
    appointments: paginatedAppointments,
    total,
    currentPage: page,
    pageSize,
    totalPages,
  };
}

/**
 * 获取预约详情
 *
 * @param id - 预约ID
 * @returns 预约详情
 */
export async function getAppointmentDetail(id: string): Promise<Appointment> {
  if (!id) {
    throw new Error('预约ID不能为空');
  }

  const appointment = mockAppointments.find((apt) => apt.id === id);

  if (!appointment) {
    throw new Error('预约不存在');
  }

  // 权限验证
  if (!canManageAppointment(appointment)) {
    throw new Error('无权查看此预约');
  }

  return appointment;
}

/**
 * 确认预约
 *
 * @param id - 预约ID
 * @param note - 确认备注（可选）
 * @returns 更新后的预约
 *
 * @example
 * ```typescript
 * // 确认预约
 * const result = await confirmAppointment('apt123', '请准时就诊');
 * ```
 */
export async function confirmAppointment(
  id: string,
  note?: string
): Promise<Appointment> {
  // 参数校验
  if (!id) {
    throw new Error('预约ID不能为空');
  }

  // 查找预约
  const appointment = mockAppointments.find((apt) => apt.id === id);

  if (!appointment) {
    throw new Error('预约不存在');
  }

  // 权限验证
  if (!canManageAppointment(appointment)) {
    throw new Error('无权操作此预约');
  }

  // 状态流转验证
  if (!isValidStatusTransition(appointment.status, AppointmentStatusEnum.CONFIRMED, 'doctor')) {
    throw new Error('当前状态不允许确认');
  }

  // 模拟API调用
  // 实际项目中替换为: return put<Appointment>('/doctor/appointments/confirm', { appointmentId: id, note });

  // 更新预约状态
  appointment.status = AppointmentStatusEnum.CONFIRMED;
  if (note) {
    appointment.doctorNote = note;
  }
  appointment.updatedAt = new Date().toISOString();
  
  // 同步更新 localStorage
  updateLocalStorageAppointment(id, {
    status: AppointmentStatusEnum.CONFIRMED,
    doctorNote: note,
    updatedAt: appointment.updatedAt
  });

  return appointment;
}

/**
 * 拒绝预约
 *
 * @param id - 预约ID
 * @param reason - 拒绝原因
 * @returns 更新后的预约
 *
 * @example
 * ```typescript
 * // 拒绝预约
 * const result = await rejectAppointment('apt123', '医生临时有事无法出诊');
 * ```
 */
export async function rejectAppointment(
  id: string,
  reason: string
): Promise<Appointment> {
  // 参数校验
  if (!id) {
    throw new Error('预约ID不能为空');
  }

  if (!reason || reason.trim() === '') {
    throw new Error('拒绝原因不能为空');
  }

  // 查找预约
  const appointment = mockAppointments.find((apt) => apt.id === id);

  if (!appointment) {
    throw new Error('预约不存在');
  }

  // 权限验证
  if (!canManageAppointment(appointment)) {
    throw new Error('无权操作此预约');
  }

  // 状态流转验证
  if (!isValidStatusTransition(appointment.status, AppointmentStatusEnum.REJECTED, 'doctor')) {
    throw new Error('当前状态不允许拒绝');
  }

  // 模拟API调用
  // 实际项目中替换为: return put<Appointment>('/doctor/appointments/reject', { appointmentId: id, reason });

  // 更新预约状态
  appointment.status = AppointmentStatusEnum.REJECTED;
  appointment.doctorNote = reason;
  appointment.updatedAt = new Date().toISOString();
  
  // 同步更新 localStorage
  updateLocalStorageAppointment(id, {
    status: AppointmentStatusEnum.REJECTED,
    doctorNote: reason,
    updatedAt: appointment.updatedAt
  });

  return appointment;
}

/**
 * 完成预约（就诊完成）
 *
 * @param id - 预约ID
 * @param note - 完成备注（可选）
 * @returns 更新后的预约
 */
export async function completeAppointment(
  id: string,
  note?: string
): Promise<Appointment> {
  // 参数校验
  if (!id) {
    throw new Error('预约ID不能为空');
  }

  // 查找预约
  const appointment = mockAppointments.find((apt) => apt.id === id);

  if (!appointment) {
    throw new Error('预约不存在');
  }

  // 权限验证
  if (!canManageAppointment(appointment)) {
    throw new Error('无权操作此预约');
  }

  // 状态流转验证
  if (!isValidStatusTransition(appointment.status, AppointmentStatusEnum.COMPLETED, 'doctor')) {
    throw new Error('当前状态不允许完成');
  }

  // 更新预约状态
  appointment.status = AppointmentStatusEnum.COMPLETED;
  if (note) {
    appointment.doctorNote = note;
  }
  appointment.updatedAt = new Date().toISOString();
  
  // 同步更新 localStorage
  updateLocalStorageAppointment(id, {
    status: AppointmentStatusEnum.COMPLETED,
    doctorNote: note,
    updatedAt: appointment.updatedAt
  });

  return appointment;
}

/**
 * 获取预约统计信息
 *
 * @param doctorId - 医生ID（可选，默认当前医生）
 * @returns 预约统计
 */
export async function getAppointmentStats(
  doctorId?: string
): Promise<AppointmentStats> {
  const targetDoctorId = doctorId || getCurrentDoctorId();

  if (!targetDoctorId) {
    throw new Error('未登录或医生ID无效');
  }

  // 模拟API调用
  // 实际项目中替换为: return get<AppointmentStats>('/doctor/appointments/stats', { params: { doctorId: targetDoctorId } });

  // 过滤当前医生的预约
  const doctorAppointments = mockAppointments.filter(
    (apt) => apt.doctor.id === targetDoctorId
  );

  const today = new Date().toISOString().split('T')[0];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const stats: AppointmentStats = {
    pendingCount: doctorAppointments.filter(
      (apt) => apt.status === AppointmentStatusEnum.PENDING
    ).length,
    confirmedCount: doctorAppointments.filter(
      (apt) => apt.status === AppointmentStatusEnum.CONFIRMED
    ).length,
    todayCount: doctorAppointments.filter(
      (apt) => apt.appointmentDate === today
    ).length,
    weekCount: doctorAppointments.filter(
      (apt) => apt.appointmentDate >= startOfWeek.toISOString().split('T')[0]
    ).length,
    monthCount: doctorAppointments.filter(
      (apt) => apt.appointmentDate >= startOfMonth.toISOString().split('T')[0]
    ).length,
    completedCount: doctorAppointments.filter(
      (apt) => apt.status === AppointmentStatusEnum.COMPLETED
    ).length,
  };

  return stats;
}

// ==================== 排班管理 API ====================

/**
 * 获取医生排班列表
 *
 * @param query - 查询参数
 * @returns 排班列表响应
 *
 * @example
 * ```typescript
 * // 获取未来7天的排班
 * const result = await getDoctorSchedule({
 *   startDate: '2026-04-22',
 *   endDate: '2026-04-28'
 * });
 * ```
 */
export async function getDoctorSchedule(
  query: ScheduleListQuery = {}
): Promise<ScheduleListResponse> {
  // 获取当前医生ID
  const doctorId = query.doctorId || getCurrentDoctorId();

  if (!doctorId) {
    throw new Error('未登录或医生ID无效');
  }

  // 模拟API调用
  // 实际项目中替换为: return get<ScheduleListResponse>('/doctor/schedules', { params: query });

  // 过滤当前医生的排班
  let filteredSchedules = mockSchedules.filter(
    (schedule) => schedule.doctor.id === doctorId
  );

  // 按日期范围筛选
  if (query.startDate) {
    filteredSchedules = filteredSchedules.filter(
      (schedule) => schedule.scheduleDate >= query.startDate!
    );
  }
  if (query.endDate) {
    filteredSchedules = filteredSchedules.filter(
      (schedule) => schedule.scheduleDate <= query.endDate!
    );
  }

  return {
    schedules: filteredSchedules,
    total: filteredSchedules.length,
  };
}

/**
 * 创建排班
 *
 * @param scheduleData - 排班创建数据
 * @returns 创建的排班
 *
 * @example
 * ```typescript
 * // 创建排班
 * const result = await createSchedule({
 *   scheduleDate: '2026-04-22',
 *   timeSlots: [
 *     { date: '2026-04-22', startTime: '09:00', endTime: '12:00', maxAppointments: 20 },
 *     { date: '2026-04-22', startTime: '14:00', endTime: '17:00', maxAppointments: 20 }
 *   ]
 * });
 * ```
 */
export async function createSchedule(
  scheduleData: ScheduleCreateRequest
): Promise<DoctorSchedule> {
  // 参数校验
  if (!scheduleData.scheduleDate) {
    throw new Error('排班日期不能为空');
  }

  if (!scheduleData.timeSlots || scheduleData.timeSlots.length === 0) {
    throw new Error('时段列表不能为空');
  }

  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(scheduleData.scheduleDate)) {
    throw new Error('日期格式不正确，请使用 YYYY-MM-DD 格式');
  }

  // 验证时段数据
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  for (const slot of scheduleData.timeSlots) {
    if (!timeRegex.test(slot.startTime)) {
      throw new Error(`时段开始时间格式不正确: ${slot.startTime}`);
    }
    if (!timeRegex.test(slot.endTime)) {
      throw new Error(`时段结束时间格式不正确: ${slot.endTime}`);
    }
    if (typeof slot.maxAppointments !== 'number' || slot.maxAppointments < 0) {
      throw new Error('最大预约数必须为非负数');
    }
  }

  // 获取当前医生
  const currentDoctor = store.state.currentDoctor;
  if (!currentDoctor) {
    throw new Error('未登录');
  }

  // 检查是否已存在相同日期的排班
  const existingSchedule = mockSchedules.find(
    (schedule) =>
      schedule.doctor.id === currentDoctor.id &&
      schedule.scheduleDate === scheduleData.scheduleDate
  );

  if (existingSchedule) {
    throw new Error('该日期已存在排班，请使用更新接口');
  }

  // 模拟API调用
  // 实际项目中替换为: return post<DoctorSchedule>('/doctor/schedules', scheduleData);

  // 创建排班
  const newSchedule: DoctorSchedule = {
    id: `schedule${Date.now()}`,
    doctor: currentDoctor,
    scheduleDate: scheduleData.scheduleDate,
    timeSlots: scheduleData.timeSlots.map((slot, index) => ({
      ...slot,
      id: `slot${Date.now()}_${index}`,
      bookedAppointments: 0,
      remainingSlots: slot.maxAppointments,
    })),
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockSchedules.push(newSchedule);

  return newSchedule;
}

/**
 * 更新排班
 *
 * @param id - 排班ID
 * @param updateData - 更新数据
 * @returns 更新后的排班
 *
 * @example
 * ```typescript
 * // 更新排班可用状态
 * const result = await updateSchedule('schedule123', { isAvailable: false });
 * ```
 */
export async function updateSchedule(
  id: string,
  updateData: ScheduleUpdateRequest
): Promise<DoctorSchedule> {
  // 参数校验
  if (!id) {
    throw new Error('排班ID不能为空');
  }

  // 查找排班
  const schedule = mockSchedules.find((s) => s.id === id);

  if (!schedule) {
    throw new Error('排班不存在');
  }

  // 权限验证
  const doctorId = getCurrentDoctorId();
  if (schedule.doctor.id !== doctorId) {
    throw new Error('无权操作此排班');
  }

  // 模拟API调用
  // 实际项目中替换为: return put<DoctorSchedule>('/doctor/schedules', updateData);

  // 更新排班
  if (updateData.isAvailable !== undefined) {
    schedule.isAvailable = updateData.isAvailable;
  }

  if (updateData.timeSlots) {
    // 验证时段数据
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (const slot of updateData.timeSlots) {
      if (!timeRegex.test(slot.startTime)) {
        throw new Error(`时段开始时间格式不正确: ${slot.startTime}`);
      }
      if (!timeRegex.test(slot.endTime)) {
        throw new Error(`时段结束时间格式不正确: ${slot.endTime}`);
      }
    }

    schedule.timeSlots = updateData.timeSlots.map((slot, index) => {
      const existingSlot = schedule.timeSlots.find(
        (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
      );
      return {
        ...slot,
        id: existingSlot?.id || `slot${Date.now()}_${index}`,
        bookedAppointments: existingSlot?.bookedAppointments || 0,
        remainingSlots: slot.maxAppointments - (existingSlot?.bookedAppointments || 0),
      };
    });
  }

  schedule.updatedAt = new Date().toISOString();

  return schedule;
}

/**
 * 删除排班
 *
 * @param id - 排班ID
 * @returns 是否删除成功
 *
 * @example
 * ```typescript
 * // 删除排班
 * const result = await deleteSchedule('schedule123');
 * ```
 */
export async function deleteSchedule(id: string): Promise<boolean> {
  // 参数校验
  if (!id) {
    throw new Error('排班ID不能为空');
  }

  // 查找排班
  const scheduleIndex = mockSchedules.findIndex((s) => s.id === id);

  if (scheduleIndex === -1) {
    throw new Error('排班不存在');
  }

  const schedule = mockSchedules[scheduleIndex];

  // 权限验证
  const doctorId = getCurrentDoctorId();
  if (schedule.doctor.id !== doctorId) {
    throw new Error('无权操作此排班');
  }

  // 检查是否有已确认的预约
  const hasBookedAppointments = schedule.timeSlots.some(
    (slot) => slot.bookedAppointments > 0
  );

  if (hasBookedAppointments) {
    throw new Error('该排班存在已预约记录，无法删除');
  }

  // 模拟API调用
  // 实际项目中替换为: return del<{ success: boolean }>('/doctor/schedules', { params: { id } });

  // 删除排班
  mockSchedules.splice(scheduleIndex, 1);

  return true;
}

/**
 * 设置时段最大预约数
 *
 * @param timeSlotId - 时段ID
 * @param max - 最大预约数
 * @returns 更新后的时段
 *
 * @example
 * ```typescript
 * // 设置上午时段最大预约数为30
 * const result = await setMaxAppointments('slot123', 30);
 * ```
 */
export async function setMaxAppointments(
  timeSlotId: string,
  max: number
): Promise<{ id: string; maxAppointments: number; remainingSlots: number }> {
  // 参数校验
  if (!timeSlotId) {
    throw new Error('时段ID不能为空');
  }

  if (typeof max !== 'number' || max < 0) {
    throw new Error('最大预约数必须为非负数');
  }

  // 查找时段
  let targetSlot: { id: string; maxAppointments: number; remainingSlots: number } | null = null;

  for (const schedule of mockSchedules) {
    const slot = schedule.timeSlots.find((s) => s.id === timeSlotId);
    if (slot) {
      // 权限验证
      const doctorId = getCurrentDoctorId();
      if (schedule.doctor.id !== doctorId) {
        throw new Error('无权操作此时段');
      }

      // 更新最大预约数
      const diff = max - slot.maxAppointments;
      slot.maxAppointments = max;
      slot.remainingSlots = Math.max(0, slot.remainingSlots + diff);

      schedule.updatedAt = new Date().toISOString();

      targetSlot = {
        id: slot.id,
        maxAppointments: slot.maxAppointments,
        remainingSlots: slot.remainingSlots,
      };
      break;
    }
  }

  if (!targetSlot) {
    throw new Error('时段不存在');
  }

  // 模拟API调用
  // 实际项目中替换为: return put<{ id: string; maxAppointments: number; remainingSlots: number }>(
  //   '/doctor/schedules/time-slot/max',
  //   { timeSlotId, max }
  // );

  return targetSlot;
}

// ==================== 导出 API 服务对象 ====================

export const doctorAppointmentApi = {
  // 预约管理
  getDoctorAppointments,
  getAppointmentDetail,
  confirmAppointment,
  rejectAppointment,
  completeAppointment,
  getAppointmentStats,

  // 排班管理
  getDoctorSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  setMaxAppointments,
};

export default doctorAppointmentApi;
