/**
 * 预约数据模型验证脚本
 * 用于验证类型定义和数据模型的一致性
 */

import type { Appointment, Schedule, TimeSlot } from '../types';

// 模拟导入数据
const appointments: Appointment[] = [
  {
    id: 'appointment_001',
    patientId: 'patient001',
    doctorId: 'doc001',
    scheduleId: 'schedule_001',
    appointmentTime: '2026-04-22T09:00:00.000Z',
    status: 'confirmed',
    symptoms: '胸闷、心悸，持续一周',
    notes: '建议做心电图检查',
    createdAt: '2026-04-21T10:00:00.000Z',
    updatedAt: '2026-04-21T14:30:00.000Z'
  }
];

const schedules: Schedule[] = [
  {
    id: 'schedule_001',
    doctorId: 'doc001',
    date: '2026-04-22',
    timeSlots: [],
    isAvailable: true,
    totalSlots: 5,
    bookedSlots: 1,
    availableSlots: 4,
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-21T14:30:00.000Z',
    createdBy: 'system'
  }
];

/**
 * 验证预约数据完整性
 */
function validateAppointment(appointment: Appointment): boolean {
  // 验证必填字段
  if (!appointment.id || !appointment.patientId || !appointment.doctorId) {
    console.error('Missing required fields in appointment');
    return false;
  }

  // 验证时间格式 (ISO 8601)
  const timeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (!timeRegex.test(appointment.appointmentTime)) {
    console.error('Invalid appointment time format');
    return false;
  }

  // 验证状态枚举
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(appointment.status)) {
    console.error('Invalid appointment status');
    return false;
  }

  return true;
}

/**
 * 验证排班数据完整性
 */
function validateSchedule(schedule: Schedule): boolean {
  // 验证必填字段
  if (!schedule.id || !schedule.doctorId || !schedule.date) {
    console.error('Missing required fields in schedule');
    return false;
  }

  // 验证日期格式 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(schedule.date)) {
    console.error('Invalid schedule date format');
    return false;
  }

  // 验证统计数据的逻辑一致性
  if (schedule.bookedSlots > schedule.totalSlots) {
    console.error('Booked slots cannot exceed total slots');
    return false;
  }

  return true;
}

/**
 * 冲突检测
 */
function checkConflicts(
  newAppointment: Appointment,
  existingAppointments: Appointment[]
): { hasConflict: boolean; message: string } {
  // 检查医生时间冲突
  const doctorConflict = existingAppointments.find(
    (apt) =>
      apt.doctorId === newAppointment.doctorId &&
      apt.appointmentTime === newAppointment.appointmentTime &&
      apt.id !== newAppointment.id
  );

  if (doctorConflict) {
    return {
      hasConflict: true,
      message: `Doctor ${newAppointment.doctorId} already has an appointment at this time`
    };
  }

  // 检查患者时间冲突
  const patientConflict = existingAppointments.find(
    (apt) =>
      apt.patientId === newAppointment.patientId &&
      apt.appointmentTime === newAppointment.appointmentTime &&
      apt.id !== newAppointment.id
  );

  if (patientConflict) {
    return {
      hasConflict: true,
      message: `Patient ${newAppointment.patientId} already has an appointment at this time`
    };
  }

  return { hasConflict: false, message: 'No conflicts detected' };
}

// 执行验证测试
console.log('Running appointment data model validation...\n');

// 测试预约验证
appointments.forEach((apt, index) => {
  const isValid = validateAppointment(apt);
  console.log(`Appointment ${index + 1}: ${isValid ? '✓ Valid' : '✗ Invalid'}`);
});

// 测试排班验证
schedules.forEach((schedule, index) => {
  const isValid = validateSchedule(schedule);
  console.log(`Schedule ${index + 1}: ${isValid ? '✓ Valid' : '✗ Invalid'}`);
});

// 测试冲突检测
if (appointments.length > 0) {
  const conflictResult = checkConflicts(appointments[0], appointments);
  console.log(`\nConflict check: ${conflictResult.hasConflict ? '✗ Conflict' : '✓ No conflict'}`);
  if (conflictResult.message) {
    console.log(`Message: ${conflictResult.message}`);
  }
}

console.log('\n✅ Validation completed');