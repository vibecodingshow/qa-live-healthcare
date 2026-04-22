/**
 * 时间段选择器工具函数
 * 提供时段生成、冲突检测等功能
 */

import dayjs from 'dayjs';

/**
 * 时段显示数据结构
 */
export interface TimeSlotDisplay {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  remainingSlots: number;
  appointments: number;
  disabledReason?: string;
}

/**
 * 生成时间段列表
 * @param startTime 开始时间 (HH:mm)
 * @param endTime 结束时间 (HH:mm)
 * @param intervalMinutes 时间间隔（分钟），默认30分钟
 * @returns 时段列表
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): Array<{ startTime: string; endTime: string }> {
  const slots: Array<{ startTime: string; endTime: string }> = [];
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    
    let nextMin = currentMin + intervalMinutes;
    let nextHour = currentHour;
    
    if (nextMin >= 60) {
      nextMin -= 60;
      nextHour += 1;
    }
    
    const slotEnd = `${nextHour.toString().padStart(2, '0')}:${nextMin.toString().padStart(2, '0')}`;
    
    // 确保不超过结束时间
    if (
      nextHour < endHour ||
      (nextHour === endHour && nextMin <= endMin)
    ) {
      slots.push({ startTime: slotStart, endTime: slotEnd });
    }
    
    currentHour = nextHour;
    currentMin = nextMin;
  }
  
  return slots;
}

/**
 * 检查两个时间段是否冲突
 * @param slot1Start 第一个时段开始时间
 * @param slot1End 第一个时段结束时间
 * @param slot2Start 第二个时段开始时间
 * @param slot2End 第二个时段结束时间
 * @returns 是否冲突
 */
export function isTimeSlotConflict(
  slot1Start: string,
  slot1End: string,
  slot2Start: string,
  slot2End: string
): boolean {
  // 如果时段1的结束时间 <= 时段2的开始时间，或者时段1的开始时间 >= 时段2的结束时间，则不冲突
  if (slot1End <= slot2Start || slot1Start >= slot2End) {
    return false;
  }
  return true;
}

/**
 * 检查某个时段是否在排班时间范围内
 * @param slotStart 时段开始时间
 * @param slotEnd 时段结束时间
 * @param scheduleStart 排班开始时间
 * @param scheduleEnd 排班结束时间
 * @returns 是否在范围内
 */
export function isWithinSchedule(
  slotStart: string,
  slotEnd: string,
  scheduleStart: string,
  scheduleEnd: string
): boolean {
  return slotStart >= scheduleStart && slotEnd <= scheduleEnd;
}

/**
 * 格式化时间显示
 * @param timeString 时间字符串 (HH:mm)
 * @returns 格式化后的时间字符串
 */
export function formatTimeDisplay(timeString: string): string {
  const [hour, minute] = timeString.split(':').map(Number);
  const period = hour >= 12 ? '下午' : '上午';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`;
}

/**
 * 比较时间大小
 * @param time1 时间1 (HH:mm)
 * @param time2 时间2 (HH:mm)
 * @returns 负数表示time1<time2，0表示相等，正数表示time1>time2
 */
export function compareTime(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  
  return minutes1 - minutes2;
}

/**
 * 获取当前时间对应的时段
 * @param intervalMinutes 时间间隔（分钟）
 * @returns 当前时段信息
 */
export function getCurrentSlot(intervalMinutes: number = 30): { startTime: string; endTime: string } {
  const now = dayjs();
  const currentMinutes = now.hour() * 60 + now.minute();
  const slotStartMinutes = Math.floor(currentMinutes / intervalMinutes) * intervalMinutes;
  
  const startHour = Math.floor(slotStartMinutes / 60);
  const startMin = slotStartMinutes % 60;
  const endMinutes = slotStartMinutes + intervalMinutes;
  
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  
  return {
    startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
    endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`
  };
}

/**
 * 检查日期是否是今天
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns 是否是今天
 */
export function isToday(dateString: string): boolean {
  const today = dayjs().format('YYYY-MM-DD');
  return dateString === today;
}

/**
 * 检查日期是否已过期
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns 是否已过期
 */
export function isPastDate(dateString: string): boolean {
  const date = dayjs(dateString);
  const today = dayjs().startOf('day');
  return date.isBefore(today);
}

/**
 * 获取日期显示文本
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns 友好显示文本
 */
export function getDateDisplayText(dateString: string): string {
  const date = dayjs(dateString);
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');
  
  if (date.isSame(today, 'day')) {
    return '今天';
  } else if (date.isSame(tomorrow, 'day')) {
    return '明天';
  } else {
    return date.format('MM月DD日');
  }
}
