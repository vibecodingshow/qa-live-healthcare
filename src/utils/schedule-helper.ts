/**
 * 排班辅助工具函数
 * 提供排班相关的业务逻辑和数据处理功能
 */

import type {
  Schedule,
  ScheduleTimeSlot,
  DoctorScheduleSettings,
  ScheduleConflict,
  ScheduleQueryParams,
  SCHEDULE_STATUS
} from '../types/schedule';

/**
 * 格式化时间为 HH:mm 格式
 */
export function formatTime(time: string): string {
  return time.substring(0, 5);
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 获取指定日期所在周的开始日期（周一）
 */
export function getWeekStartDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * 获取指定日期所在周的结束日期（周日）
 */
export function getWeekEndDate(date: Date): Date {
  const startDate = getWeekStartDate(date);
  return new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
}

/**
 * 生成一周的日期数组
 */
export function generateWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(date);
  }
  return dates;
}

/**
 * 格式化星期几
 */
export function formatWeekday(date: Date): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
}

/**
 * 生成时间段ID
 */
export function generateSlotId(): string {
  return `slot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 生成排班ID
 */
export function generateScheduleId(): string {
  return `schedule_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 检测时间段是否重叠
 */
export function isTimeOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);
  
  return !(e1 <= s2 || e2 <= s1);
}

/**
 * 解析时间为分钟数
 */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * 格式化分钟数为时间
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * 生成时间段数组
 */
export function generateTimeSlots(
  startHour: number,
  endHour: number,
  slotDuration: number = 30
): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];
  let currentMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  
  while (currentMinutes + slotDuration <= endMinutes) {
    slots.push({
      startTime: formatMinutes(currentMinutes),
      endTime: formatMinutes(currentMinutes + slotDuration)
    });
    currentMinutes += slotDuration;
  }
  
  return slots;
}

/**
 * 验证时间段格式
 */
export function validateTimeFormat(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * 验证排班时间是否合理
 */
export function validateScheduleTime(
  startTime: string,
  endTime: string
): { valid: boolean; message?: string } {
  if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
    return { valid: false, message: '时间格式不正确，应为 HH:mm' };
  }
  
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  if (startMinutes >= endMinutes) {
    return { valid: false, message: '开始时间必须早于结束时间' };
  }
  
  if (endMinutes - startMinutes < 10) {
    return { valid: false, message: '时间段长度至少为10分钟' };
  }
  
  return { valid: true };
}

/**
 * 检测排班冲突
 */
export function checkScheduleConflict(
  newSchedule: Schedule,
  existingSchedules: Schedule[]
): ScheduleConflict {
  const doctorSchedules = existingSchedules.filter(
    s => s.doctorId === newSchedule.doctorId && s.id !== newSchedule.id
  );
  
  // 检查同一医生的排班是否在同一天重叠
  const sameDaySchedules = doctorSchedules.filter(s => s.date === newSchedule.date);
  
  for (const existingSchedule of sameDaySchedules) {
    for (const newSlot of newSchedule.timeSlots) {
      for (const existingSlot of existingSchedule.timeSlots) {
        if (isTimeOverlap(
          newSlot.startTime,
          newSlot.endTime,
          existingSlot.startTime,
          existingSlot.endTime
        )) {
          return {
            hasConflict: true,
            conflictType: 'time_overlap',
            conflictingSchedule: existingSchedule,
            message: `时间段 ${newSlot.startTime}-${newSlot.endTime} 与现有排班冲突`
          };
        }
      }
    }
  }
  
  return { hasConflict: false };
}

/**
 * 计算排班统计信息
 */
export function calculateScheduleStatistics(schedules: Schedule[]) {
  const totalSchedules = schedules.length;
  const availableSchedules = schedules.filter(s => s.isAvailable).length;
  const bookedSchedules = schedules.filter(s => s.totalSlots === s.bookedSlots).length;
  
  const totalSlots = schedules.reduce((sum, s) => sum + s.totalSlots, 0);
  const bookedSlots = schedules.reduce((sum, s) => sum + s.bookedSlots, 0);
  
  const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
  
  return {
    totalSchedules,
    availableSchedules,
    bookedSchedules,
    totalSlots,
    bookedSlots,
    utilizationRate: Math.round(utilizationRate * 100) / 100
  };
}

/**
 * 根据查询参数过滤排班
 */
export function filterSchedules(
  schedules: Schedule[],
  params: ScheduleQueryParams
): Schedule[] {
  return schedules.filter(schedule => {
    if (params.doctorId && schedule.doctorId !== params.doctorId) {
      return false;
    }
    
    if (params.date && schedule.date !== params.date) {
      return false;
    }
    
    if (params.isAvailable !== undefined && schedule.isAvailable !== params.isAvailable) {
      return false;
    }
    
    if (params.startDate && schedule.date < params.startDate) {
      return false;
    }
    
    if (params.endDate && schedule.date > params.endDate) {
      return false;
    }
    
    return true;
  });
}

/**
 * 创建默认排班设置
 */
export function createDefaultScheduleSettings(doctorId: string): DoctorScheduleSettings {
  return {
    doctorId,
    maxAppointmentsPerDay: 20,
    appointmentDuration: 30,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    breakTimes: [
      { start: '12:00', end: '13:00' }
    ],
    isActive: true,
    autoGenerate: false
  };
}

/**
 * 获取排班状态标签
 */
export function getScheduleStatusLabel(status: keyof typeof SCHEDULE_STATUS): string {
  const labels: Record<string, string> = {
    available: '可预约',
    booked: '已约满',
    cancelled: '已取消',
    expired: '已过期'
  };
  return labels[status] || status;
}

/**
 * 获取排班状态颜色
 */
export function getScheduleStatusColor(status: keyof typeof SCHEDULE_STATUS): string {
  const colors: Record<string, string> = {
    available: '#52c41a',
    booked: '#faad14',
    cancelled: '#f5222d',
    expired: '#999999'
  };
  return colors[status] || '#999999';
}

/**
 * 导出排班数据为JSON格式
 */
export function exportSchedulesToJSON(schedules: Schedule[]): string {
  return JSON.stringify(schedules, null, 2);
}

/**
 * 从JSON导入排班数据
 */
export function importSchedulesFromJSON(jsonString: string): Schedule[] {
  try {
    const schedules = JSON.parse(jsonString);
    if (!Array.isArray(schedules)) {
      throw new Error('Invalid schedule data format');
    }
    return schedules;
  } catch (error) {
    throw new Error(`Failed to import schedules: ${error}`);
  }
}