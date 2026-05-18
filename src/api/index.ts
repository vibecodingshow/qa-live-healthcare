/**
 * API 模块导出入口文件
 *
 * 统一导出所有 API 相关的类型、工具和服务
 *
 * @version 1.0.0
 * @created 2026-04-22
 */

// 请求工具
export { request, createApiService, ApiError } from './request';
export type { ApiResponse, PaginatedResponse } from './request';

// 患者端预约 API
export {
  getDoctors,
  getDoctorDetail,
  getDoctorSchedule,
  createAppointment,
  getMyAppointments,
  getAppointmentDetail,
  cancelAppointment,
} from './appointment';
