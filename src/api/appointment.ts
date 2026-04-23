/**
 * 患者端预约 API 服务
 *
 * 提供患者端所有预约相关的 API 接口：
 * - 医生列表/详情/排班查询
 * - 预约创建/查询/取消
 *
 * @version 1.0.0
 * @created 2026-04-22
 */

import { createApiService, ApiError } from './request';
import { updateLocalStorageAppointment, removeLocalStorageAppointment } from '../utils/appointment';
import type {
  Doctor,
} from '../store';
import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentCancelRequest,
  AppointmentListQuery,
  AppointmentListResponse,
  ScheduleListQuery,
  ScheduleListResponse,
  CancelReason,
} from '../types';

/**
 * 医生 API 服务
 */
const doctorApi = createApiService('/doctors');

/**
 * 排班 API 服务
 */
const scheduleApi = createApiService('/schedules');

/**
 * 预约 API 服务
 */
const appointmentApi = createApiService('/appointments');

/**
 * 获取医生列表
 *
 * @param params - 查询参数
 * @param params.department - 科室筛选
 * @param params.keyword - 搜索关键词（医生姓名）
 * @returns 医生列表
 *
 * @example
 * ```typescript
 * // 获取所有医生
 * const doctors = await getDoctors();
 *
 * // 按科室筛选
 * const doctors = await getDoctors({ department: '内科' });
 *
 * // 搜索医生
 * const doctors = await getDoctors({ keyword: '张' });
 * ```
 */
export async function getDoctors(params?: {
  department?: string;
  keyword?: string;
}): Promise<Doctor[]> {
  return doctorApi.get<Doctor[]>('/', {
    ...params,
  });
}

/**
 * 获取医生详情
 *
 * @param id - 医生 ID
 * @returns 医生详情
 * @throws {ApiError} 当 ID 为空或医生不存在时抛出错误
 *
 * @example
 * ```typescript
 * const doctor = await getDoctorDetail('doctor001');
 * ```
 */
export async function getDoctorDetail(id: string): Promise<Doctor> {
  if (!id || !id.trim()) {
    throw new ApiError('医生 ID 不能为空', 'INVALID_PARAMS', 400);
  }

  return doctorApi.get<Doctor>(`/${id}`);
}

/**
 * 获取医生排班信息
 *
 * @param id - 医生 ID
 * @param query - 排班查询参数
 * @returns 排班列表
 * @throws {ApiError} 当 ID 为空时抛出错误
 *
 * @example
 * ```typescript
 * // 获取医生所有排班
 * const schedules = await getDoctorSchedule('doctor001');
 *
 * // 获取指定日期范围的排班
 * const schedules = await getDoctorSchedule('doctor001', {
 *   startDate: '2026-04-22',
 *   endDate: '2026-04-28'
 * });
 * ```
 */
export async function getDoctorSchedule(
  id: string,
  query?: Omit<ScheduleListQuery, 'doctorId'>
): Promise<ScheduleListResponse> {
  if (!id || !id.trim()) {
    throw new ApiError('医生 ID 不能为空', 'INVALID_PARAMS', 400);
  }

  return scheduleApi.get<ScheduleListResponse>(`/doctor/${id}`, {
    ...query,
  });
}

/**
 * 创建预约
 *
 * @param data - 预约创建请求数据
 * @returns 创建的预约记录
 * @throws {ApiError} 当参数校验失败时抛出错误
 *
 * @example
 * ```typescript
 * const appointment = await createAppointment({
 *   doctorId: 'doctor001',
 *   patientId: 'patient001',
 *   appointmentDate: '2026-04-22',
 *   timeSlotId: 'slot001',
 *   reason: '头疼'
 * });
 * ```
 */
export async function createAppointment(
  data: AppointmentCreateRequest
): Promise<Appointment> {
  // 参数校验
  if (!data.doctorId || !data.doctorId.trim()) {
    throw new ApiError('医生 ID 不能为空', 'INVALID_PARAMS', 400);
  }
  if (!data.patientId || !data.patientId.trim()) {
    throw new ApiError('患者 ID 不能为空', 'INVALID_PARAMS', 400);
  }
  if (!data.appointmentDate || !data.appointmentDate.trim()) {
    throw new ApiError('预约日期不能为空', 'INVALID_PARAMS', 400);
  }
  if (!data.timeSlotId || !data.timeSlotId.trim()) {
    throw new ApiError('时段 ID 不能为空', 'INVALID_PARAMS', 400);
  }
  if (!data.reason || !data.reason.trim()) {
    throw new ApiError('预约原因不能为空', 'INVALID_PARAMS', 400);
  }

  // 日期格式校验
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.appointmentDate)) {
    throw new ApiError('预约日期格式不正确，应为 YYYY-MM-DD', 'INVALID_PARAMS', 400);
  }

  // 创建预约记录
  const newAppointment: Appointment = {
    id: `appt${Date.now()}`,
    appointmentNo: `APT${Date.now()}`,
    patient: {
      id: data.patientId,
      name: data.patientName || '',
      birthday: data.patientBirthday || '',
      phone: '',
      gender: ''
    },
    doctor: {
      id: data.doctorId,
      name: data.doctorName || '',
      username: '',
      title: data.doctorTitle || '',
      department: data.doctorDepartment || '',
      avatar: data.doctorAvatar || '',
      isActive: true,
      password: '',
      experience: '',
      specialties: []
    },
    appointmentDate: data.appointmentDate,
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    status: 'PENDING',
    reason: data.reason,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 保存到 localStorage
  const storedAppointments = localStorage.getItem('appointments');
  const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));

  return newAppointment;
}

/**
 * 获取我的预约列表
 *
 * @param query - 预约列表查询参数
 * @returns 预约列表（分页）
 * @throws {ApiError} 当 patientId 为空时抛出错误
 *
 * @example
 * ```typescript
 * // 获取所有预约
 * const result = await getMyAppointments({ patientId: 'patient001' });
 *
 * // 按状态筛选
 * const result = await getMyAppointments({
 *   patientId: 'patient001',
 *   status: AppointmentStatus.PENDING
 * });
 *
 * // 分页查询
 * const result = await getMyAppointments({
 *   patientId: 'patient001',
 *   page: 1,
 *   pageSize: 10
 * });
 * ```
 */
export async function getMyAppointments(
  query: AppointmentListQuery
): Promise<AppointmentListResponse> {
  if (!query.patientId || !query.patientId.trim()) {
    throw new ApiError('患者 ID 不能为空', 'INVALID_PARAMS', 400);
  }

  return appointmentApi.get<AppointmentListResponse>('/my', {
    ...query,
  });
}

/**
 * 获取预约详情
 *
 * @param id - 预约 ID
 * @returns 预约详情
 * @throws {ApiError} 当 ID 为空时抛出错误
 *
 * @example
 * ```typescript
 * const appointment = await getAppointmentDetail('appt001');
 * ```
 */
export async function getAppointmentDetail(id: string): Promise<Appointment> {
  if (!id || !id.trim()) {
    throw new ApiError('预约 ID 不能为空', 'INVALID_PARAMS', 400);
  }

  return appointmentApi.get<Appointment>(`/${id}`);
}

/**
 * 取消预约
 *
 * @param id - 预约 ID
 * @param reason - 取消原因
 * @returns 取消后的预约记录
 * @throws {ApiError} 当参数校验失败时抛出错误
 *
 * @example
 * ```typescript
 * const appointment = await cancelAppointment('appt001', {
 *   cancelReason: CancelReason.TIME_CONFLICT,
 *   cancelNote: '临时有事'
 * });
 * ```
 */
import { updateLocalStorageAppointment, removeLocalStorageAppointment } from '../utils/appointment';

export async function cancelAppointment(
  id: string,
  reason: {
    cancelReason: CancelReason;
    cancelNote?: string;
  }
): Promise<Appointment> {
  if (!id || !id.trim()) {
    throw new ApiError('预约 ID 不能为空', 'INVALID_PARAMS', 400);
  }
  if (!reason.cancelReason) {
    throw new ApiError('取消原因不能为空', 'INVALID_PARAMS', 400);
  }

  // 模拟API调用 - 实际项目中替换为真实的API调用
  // 这里直接更新 localStorage 来保持数据一致性
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    const appointment = appointments.find((apt: any) => apt.id === id);
    
    if (!appointment) {
      throw new ApiError('预约不存在', 'NOT_FOUND', 404);
    }
    
    // 更新预约状态
    appointment.status = 'CANCELLED';
    appointment.cancelReason = reason.cancelReason;
    appointment.cancelNote = reason.cancelNote;
    appointment.updatedAt = new Date().toISOString();
    
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    return appointment;
  }
  
  throw new ApiError('预约数据不存在', 'NOT_FOUND', 404);
}
