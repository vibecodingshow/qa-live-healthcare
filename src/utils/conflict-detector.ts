import { Appointment, Schedule, TimeSlot, DoctorScheduleSettings, ConflictCheckResult, ScheduleConflict } from '../types';
import { appointments, schedules } from '../data/appointments.json';

/**
 * 冲突检测器 - 负责预约冲突检测和解决方案推荐
 */
export class ConflictDetector {
  
  /**
   * 检测患者冲突
   * @param patientId 患者ID
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @param excludeAppointmentId 排除的预约ID（用于编辑模式）
   */
  checkPatientConflict(
    patientId: string, 
    startTime: Date, 
    endTime: Date, 
    excludeAppointmentId?: string
  ): ConflictCheckResult {
    const existingAppointments = appointments.filter(appointment => 
      appointment.patientId === patientId && 
      appointment.id !== excludeAppointmentId &&
      appointment.status !== 'cancelled'
    );

    const conflicts = existingAppointments.filter(appointment => {
      const existingStart = new Date(appointment.startTime);
      const existingEnd = new Date(appointment.endTime);
      
      return this.isTimeOverlap(existingStart, existingEnd, startTime, endTime);
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts.map(conflict => ({
        type: 'patient' as const,
        appointmentId: conflict.id,
        startTime: conflict.startTime,
        endTime: conflict.endTime,
        doctorName: conflict.doctorName,
        department: conflict.department
      })),
      message: conflicts.length > 0 
        ? `您在同一时间段已有 ${conflicts.length} 个预约，请选择其他时间`
        : undefined
    };
  }

  /**
   * 检测医生冲突
   * @param doctorId 医生ID
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @param excludeAppointmentId 排除的预约ID
   */
  checkDoctorConflict(
    doctorId: string, 
    startTime: Date, 
    endTime: Date, 
    excludeAppointmentId?: string
  ): ConflictCheckResult {
    // 检查医生排班
    const doctorSchedule = schedules.find(schedule => 
      schedule.doctorId === doctorId && 
      schedule.date === startTime.toISOString().split('T')[0]
    );

    if (!doctorSchedule) {
      return {
        hasConflict: true,
        conflicts: [{
          type: 'doctor' as const,
          reason: '医生当天无排班'
        }],
        message: '医生当天无排班，请选择其他日期'
      };
    }

    // 检查时间段是否在排班内
    const scheduleTimeSlots = doctorSchedule.timeSlots;
    const isInSchedule = scheduleTimeSlots.some(slot => {
      const slotStart = new Date(`${doctorSchedule.date}T${slot.startTime}`);
      const slotEnd = new Date(`${doctorSchedule.date}T${slot.endTime}`);
      
      return startTime >= slotStart && endTime <= slotEnd;
    });

    if (!isInSchedule) {
      return {
        hasConflict: true,
        conflicts: [{
          type: 'doctor' as const,
          reason: '时间段不在医生排班内'
        }],
        message: '选择的时间段不在医生排班范围内'
      };
    }

    // 检查医生已有预约
    const doctorAppointments = appointments.filter(appointment => 
      appointment.doctorId === doctorId && 
      appointment.id !== excludeAppointmentId &&
      appointment.status !== 'cancelled'
    );

    const conflicts = doctorAppointments.filter(appointment => {
      const existingStart = new Date(appointment.startTime);
      const existingEnd = new Date(appointment.endTime);
      
      return this.isTimeOverlap(existingStart, existingEnd, startTime, endTime);
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts.map(conflict => ({
        type: 'doctor' as const,
        appointmentId: conflict.id,
        startTime: conflict.startTime,
        endTime: conflict.endTime,
        patientName: conflict.patientName,
        patientId: conflict.patientId
      })),
      message: conflicts.length > 0 
        ? `医生在该时间段已有 ${conflicts.length} 个预约，请选择其他时间`
        : undefined
    };
  }

  /**
   * 时间段重叠检测
   * @param start1 时间段1开始时间
   * @param end1 时间段1结束时间
   * @param start2 时间段2开始时间
   * @param end2 时间段2结束时间
   */
  isTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * 综合冲突检测
   * @param patientId 患者ID
   * @param doctorId 医生ID
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @param excludeAppointmentId 排除的预约ID
   */
  checkAllConflicts(
    patientId: string,
    doctorId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
  ): {
    patientConflict: ConflictCheckResult;
    doctorConflict: ConflictCheckResult;
    hasAnyConflict: boolean;
    allConflicts: Array<ConflictCheckResult['conflicts'][number]>;
  } {
    const patientConflict = this.checkPatientConflict(patientId, startTime, endTime, excludeAppointmentId);
    const doctorConflict = this.checkDoctorConflict(doctorId, startTime, endTime, excludeAppointmentId);
    
    const allConflicts = [
      ...patientConflict.conflicts,
      ...doctorConflict.conflicts
    ];

    return {
      patientConflict,
      doctorConflict,
      hasAnyConflict: patientConflict.hasConflict || doctorConflict.hasConflict,
      allConflicts
    };
  }

  /**
   * 推荐可用的时间段
   * @param doctorId 医生ID
   * @param date 日期
   * @param duration 预约时长（分钟）
   */
  suggestAlternativeSlots(doctorId: string, date: Date, duration: number = 30): TimeSlot[] {
    const dateStr = date.toISOString().split('T')[0];
    const doctorSchedule = schedules.find(schedule => 
      schedule.doctorId === doctorId && schedule.date === dateStr
    );

    if (!doctorSchedule) {
      return [];
    }

    const availableSlots: TimeSlot[] = [];
    const doctorAppointments = appointments.filter(appointment => 
      appointment.doctorId === doctorId && 
      appointment.date === dateStr &&
      appointment.status !== 'cancelled'
    );

    // 为每个排班时间段生成可用时间段
    doctorSchedule.timeSlots.forEach(scheduleSlot => {
      const slotStart = new Date(`${dateStr}T${scheduleSlot.startTime}`);
      const slotEnd = new Date(`${dateStr}T${scheduleSlot.endTime}`);
      
      // 生成每30分钟一个的时间段
      let currentTime = new Date(slotStart);
      while (currentTime.getTime() + duration * 60 * 1000 <= slotEnd.getTime()) {
        const slotEndTime = new Date(currentTime.getTime() + duration * 60 * 1000);
        
        // 检查该时间段是否被占用
        const isOccupied = doctorAppointments.some(appointment => {
          const apptStart = new Date(appointment.startTime);
          const apptEnd = new Date(appointment.endTime);
          
          return this.isTimeOverlap(apptStart, apptEnd, currentTime, slotEndTime);
        });

        if (!isOccupied) {
          availableSlots.push({
            startTime: currentTime.toTimeString().slice(0, 5),
            endTime: slotEndTime.toTimeString().slice(0, 5),
            available: true
          });
        }

        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // 增加30分钟
      }
    });

    return availableSlots;
  }

  /**
   * 验证预约时长是否符合医生设置
   * @param doctorId 医生ID
   * @param duration 预约时长（分钟）
   */
  validateAppointmentDuration(doctorId: string, duration: number): boolean {
    // 默认医生设置：预约时长为30分钟倍数，最长120分钟
    const validDurations = [30, 60, 90, 120];
    return validDurations.includes(duration);
  }

  /**
   * 检查是否为节假日
   * @param date 日期
   */
  isHoliday(date: Date): boolean {
    const holidays = [
      '2026-01-01', // 元旦
      '2026-02-08', // 春节
      '2026-02-09', // 春节
      '2026-02-10', // 春节
      '2026-04-04', // 清明
      '2026-05-01', // 劳动节
      '2026-06-10', // 端午
      '2026-09-15', // 中秋
      '2026-10-01', // 国庆
    ];
    
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
  }

  /**
   * 检查是否为工作时间
   * @param date 时间
   */
  isWorkingHours(date: Date): boolean {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    
    // 周一至周五，8:00-17:00
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return hour >= 8 && hour < 17;
    }
    
    // 周六，8:00-12:00
    if (dayOfWeek === 6) {
      return hour >= 8 && hour < 12;
    }
    
    // 周日休息
    return false;
  }
}

// 创建默认实例
export const conflictDetector = new ConflictDetector();

export default conflictDetector;