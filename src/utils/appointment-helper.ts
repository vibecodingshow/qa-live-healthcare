/**
 * 预约辅助工具函数
 * 提供预约相关的业务逻辑和数据处理功能
 */

import type { Appointment } from '../types/appointment';
import type { Schedule, ScheduleTimeSlot } from '../types/schedule';

/**
 * 格式化预约时间
 */
export function formatAppointmentTime(time: string): string {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 生成预约ID
 */
export function generateAppointmentId(): string {
  return `apt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 获取预约状态标签
 */
export function getAppointmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  };
  return labels[status] || status;
}

/**
 * 获取预约状态颜色
 */
export function getAppointmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: '#faad14',
    confirmed: '#52c41a',
    completed: '#1890ff',
    cancelled: '#ff4d4f'
  };
  return colors[status] || '#999999';
}

/**
 * 检测预约时间冲突
 */
export function checkAppointmentConflict(
  newAppointment: {
    patientId: string;
    doctorId: string;
    appointmentTime: string;
  },
  existingAppointments: Appointment[]
): { hasConflict: boolean; message: string } {
  // 检查患者同一时间是否已有预约
  const patientConflict = existingAppointments.find(apt => 
    apt.patientId === newAppointment.patientId &&
    apt.appointmentTime === newAppointment.appointmentTime &&
    apt.status !== 'cancelled'
  );

  if (patientConflict) {
    return {
      hasConflict: true,
      message: '您在同一时间已有其他预约，请选择其他时间'
    };
  }

  // 检查医生同一时间是否已有预约
  const doctorConflict = existingAppointments.find(apt =>
    apt.doctorId === newAppointment.doctorId &&
    apt.appointmentTime === newAppointment.appointmentTime &&
    apt.status !== 'cancelled'
  );

  if (doctorConflict) {
    return {
      hasConflict: true,
      message: '该医生在同一时间已有其他预约，请选择其他时间'
    };
  }

  return { hasConflict: false, message: '' };
}

/**
 * 获取可用时间段
 */
export function getAvailableTimeSlots(
  schedule: Schedule,
  appointments: Appointment[]
): ScheduleTimeSlot[] {
  return schedule.timeSlots.filter(slot => {
    if (!slot.isAvailable) return false;
    
    // 检查该时间段是否已被预约
    const hasAppointment = appointments.some(apt =>
      apt.scheduleId === schedule.id &&
      apt.status !== 'cancelled'
    );
    
    return !hasAppointment;
  });
}

/**
 * 计算预约统计信息
 */
export function calculateAppointmentStatistics(appointments: Appointment[]) {
  const total = appointments.length;
  const pending = appointments.filter(apt => apt.status === 'pending').length;
  const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
  const completed = appointments.filter(apt => apt.status === 'completed').length;
  const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;

  return {
    total,
    pending,
    confirmed,
    completed,
    cancelled,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

/**
 * 验证症状描述
 */
export function validateSymptoms(symptoms: string): { valid: boolean; message?: string } {
  if (!symptoms || symptoms.trim().length === 0) {
    return { valid: false, message: '请填写症状描述' };
  }

  if (symptoms.length > 500) {
    return { valid: false, message: '症状描述不能超过500个字符' };
  }

  return { valid: true };
}

/**
 * 验证预约表单
 */
export function validateAppointmentForm(form: {
  doctorId: string;
  scheduleId: string;
  appointmentTime: string;
  symptoms: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.doctorId) {
    errors.doctorId = '请选择医生';
  }

  if (!form.scheduleId) {
    errors.scheduleId = '请选择排班';
  }

  if (!form.appointmentTime) {
    errors.appointmentTime = '请选择预约时间';
  }

  const symptomsValidation = validateSymptoms(form.symptoms);
  if (!symptomsValidation.valid) {
    errors.symptoms = symptomsValidation.message || '';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 过滤医生列表
 */
export function filterDoctors(
  doctors: Array<{
    id: string;
    department: string;
    name: string;
    isActive: boolean;
  }>,
  filters: {
    department?: string;
    searchKeyword?: string;
    availableOnly?: boolean;
  }
) {
  return doctors.filter(doctor => {
    // 过滤非活跃医生
    if (filters.availableOnly && !doctor.isActive) {
      return false;
    }

    // 按科室过滤
    if (filters.department && doctor.department !== filters.department) {
      return false;
    }

    // 按关键词搜索
    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      const nameMatch = doctor.name.toLowerCase().includes(keyword);
      const departmentMatch = doctor.department.toLowerCase().includes(keyword);
      if (!nameMatch && !departmentMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 获取科室列表
 */
export function getDepartmentList(doctors: Array<{ department: string }>): string[] {
  const departments = new Set(doctors.map(d => d.department));
  return Array.from(departments).sort();
}

/**
 * 创建预约对象
 */
export function createAppointment(data: {
  patientId: string;
  doctorId: string;
  scheduleId: string;
  appointmentTime: string;
  symptoms: string;
  notes?: string;
}): Appointment {
  return {
    id: generateAppointmentId(),
    patientId: data.patientId,
    doctorId: data.doctorId,
    scheduleId: data.scheduleId,
    appointmentTime: data.appointmentTime,
    status: 'pending',
    symptoms: data.symptoms,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * 更新预约状态
 */
export function updateAppointmentStatus(
  appointment: Appointment,
  newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Appointment {
  return {
    ...appointment,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
}

/**
 * 取消预约
 */
export function cancelAppointment(
  appointment: Appointment,
  reason: string
): Appointment {
  return {
    ...appointment,
    status: 'cancelled',
    cancelReason: reason,
    updatedAt: new Date().toISOString()
  };
}

/**
 * 导出预约数据为JSON格式
 */
export function exportAppointmentsToJSON(appointments: Appointment[]): string {
  return JSON.stringify(appointments, null, 2);
}

/**
 * 从JSON导入预约数据
 */
export function importAppointmentsFromJSON(jsonString: string): Appointment[] {
  try {
    const appointments = JSON.parse(jsonString);
    if (!Array.isArray(appointments)) {
      throw new Error('Invalid appointment data format');
    }
    return appointments;
  } catch (error) {
    throw new Error(`Failed to import appointments: ${error}`);
  }
}

/**
 * 获取时间段的友好显示
 */
export function getTimeSlotDisplay(timeSlot: ScheduleTimeSlot): string {
  return `${timeSlot.startTime} - ${timeSlot.endTime}`;
}

/**
 * 检查时间段是否可预约
 */
export function isTimeSlotBookable(
  timeSlot: ScheduleTimeSlot,
  appointments: Appointment[]
): boolean {
  if (!timeSlot.isAvailable) return false;
  
  const hasConflict = appointments.some(apt =>
    apt.scheduleId === timeSlot.scheduleId &&
    apt.status !== 'cancelled'
  );
  
  return !hasConflict;
}