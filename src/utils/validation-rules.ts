import { TimeSlot, ScheduleTimeSlot } from '../types';

/**
 * 预约验证规则定义
 */
export const ValidationRules = {
  
  /**
   * 患者冲突检测规则
   * 同一患者30分钟内不能有多个预约
   */
  patientConflict: {
    name: '患者冲突检测',
    description: '同一患者在30分钟内不能有多个有效预约',
    minTimeGap: 30 * 60 * 1000, // 30分钟
    validate: (patientId: string, startTime: Date, endTime: Date, existingAppointments: any[]) => {
      return !existingAppointments.some(appointment => {
        const existingStart = new Date(appointment.startTime);
        const existingEnd = new Date(appointment.endTime);
        
        // 检查时间重叠
        return existingStart < endTime && existingEnd > startTime;
      });
    }
  },

  /**
   * 医生冲突检测规则
   * 医生在同一时间段只能有一个预约
   */
  doctorConflict: {
    name: '医生冲突检测',
    description: '医生在同一时间段只能有一个有效预约',
    validate: (doctorId: string, startTime: Date, endTime: Date, existingAppointments: any[]) => {
      return !existingAppointments.some(appointment => {
        const existingStart = new Date(appointment.startTime);
        const existingEnd = new Date(appointment.endTime);
        
        // 检查时间重叠
        return existingStart < endTime && existingEnd > startTime;
      });
    }
  },

  /**
   * 时间段有效性规则
   * 预约时间必须在医生排班范围内
   */
  timeSlotValidity: {
    name: '时间段有效性',
    description: '预约时间必须在医生排班范围内',
    validate: (startTime: Date, endTime: Date, scheduleTimeSlots: ScheduleTimeSlot[]) => {
      return scheduleTimeSlots.some(slot => {
        const slotStart = new Date(`${startTime.toISOString().split('T')[0]}T${slot.startTime}`);
        const slotEnd = new Date(`${startTime.toISOString().split('T')[0]}T${slot.endTime}`);
        
        return startTime >= slotStart && endTime <= slotEnd;
      });
    }
  },

  /**
   * 预约时长规则
   * 预约时长必须符合医生设置
   */
  appointmentDuration: {
    name: '预约时长',
    description: '预约时长必须为30分钟的倍数，且不超过120分钟',
    allowedDurations: [30, 60, 90, 120], // 分钟
    validate: (duration: number) => {
      return this.appointmentDuration.allowedDurations.includes(duration);
    }
  },

  /**
   * 时间格式规则
   * 时间格式必须符合HH:mm格式
   */
  timeFormat: {
    name: '时间格式',
    description: '时间必须符合HH:mm格式',
    pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    validate: (timeStr: string) => {
      return this.timeFormat.pattern.test(timeStr);
    }
  },

  /**
   * 日期有效性规则
   * 日期不能是过去的时间，且不能超过3个月
   */
  dateValidity: {
    name: '日期有效性',
    description: '预约日期必须在今天之后的3个月内',
    maxFutureDays: 90, // 3个月
    validate: (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + this.dateValidity.maxFutureDays);
      
      return date >= today && date <= maxDate;
    }
  },

  /**
   * 节假日规则
   * 排除节假日预约
   */
  holidayCheck: {
    name: '节假日检查',
    description: '节假日不能预约',
    holidays: [
      '2026-01-01', // 元旦
      '2026-02-08', '2026-02-09', '2026-02-10', // 春节
      '2026-04-04', // 清明
      '2026-05-01', // 劳动节
      '2026-06-10', // 端午
      '2026-09-15', // 中秋
      '2026-10-01', '2026-10-02', '2026-10-03', // 国庆
    ],
    validate: (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return !this.holidayCheck.holidays.includes(dateStr);
    }
  },

  /**
   * 工作时间规则
   * 预约必须在工作时间内
   */
  workingHours: {
    name: '工作时间',
    description: '预约必须在医院工作时间内',
    weekdays: {
      start: 8,  // 8:00
      end: 17   // 17:00
    },
    saturday: {
      start: 8,  // 8:00
      end: 12   // 12:00
    },
    validate: (date: Date) => {
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 周一至周五
        return hour >= this.workingHours.weekdays.start && hour < this.workingHours.weekdays.end;
      } else if (dayOfWeek === 6) { // 周六
        return hour >= this.workingHours.saturday.start && hour < this.workingHours.saturday.end;
      }
      
      return false; // 周日不工作
    }
  },

  /**
   * 症状描述验证规则
   * 症状描述必填，且长度在10-500字符之间
   */
  symptomDescription: {
    name: '症状描述',
    description: '症状描述为必填项，长度10-500字符',
    minLength: 10,
    maxLength: 500,
    validate: (description: string) => {
      return description && 
             description.length >= this.symptomDescription.minLength && 
             description.length <= this.symptomDescription.maxLength;
    }
  },

  /**
   * 备注验证规则
   * 备注可选，最大长度200字符
   */
  notes: {
    name: '备注',
    description: '备注信息可选，最大长度200字符',
    maxLength: 200,
    validate: (notes: string) => {
      return !notes || notes.length <= this.notes.maxLength;
    }
  }
};

/**
 * 验证器类 - 提供具体的验证方法
 */
export class AppointmentValidator {
  
  /**
   * 验证预约时间
   */
  static validateAppointmentTime(
    patientId: string,
    doctorId: string,
    startTime: Date,
    endTime: Date,
    duration: number,
    scheduleTimeSlots: ScheduleTimeSlot[],
    existingPatientAppointments: any[],
    existingDoctorAppointments: any[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 验证日期有效性
    if (!ValidationRules.dateValidity.validate(startTime)) {
      errors.push('预约日期必须在今天之后的3个月内');
    }

    // 验证节假日
    if (!ValidationRules.holidayCheck.validate(startTime)) {
      errors.push('节假日不能预约');
    }

    // 验证工作时间
    if (!ValidationRules.workingHours.validate(startTime)) {
      errors.push('预约时间必须在工作时间内');
    }

    // 验证预约时长
    if (!ValidationRules.appointmentDuration.validate(duration)) {
      errors.push(`预约时长必须为${ValidationRules.appointmentDuration.allowedDurations.join('、')}分钟`);
    }

    // 验证患者冲突
    if (!ValidationRules.patientConflict.validate(patientId, startTime, endTime, existingPatientAppointments)) {
      errors.push('您在同一时间段已有预约，请选择其他时间');
    }

    // 验证医生冲突
    if (!ValidationRules.doctorConflict.validate(doctorId, startTime, endTime, existingDoctorAppointments)) {
      errors.push('医生在该时间段已有预约，请选择其他时间');
    }

    // 验证时间段有效性
    if (!ValidationRules.timeSlotValidity.validate(startTime, endTime, scheduleTimeSlots)) {
      errors.push('预约时间不在医生排班范围内');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证症状描述
   */
  static validateSymptomDescription(description: string): { isValid: boolean; error?: string } {
    if (!description) {
      return { isValid: false, error: '症状描述为必填项' };
    }

    if (description.length < ValidationRules.symptomDescription.minLength) {
      return { 
        isValid: false, 
        error: `症状描述至少需要${ValidationRules.symptomDescription.minLength}个字符` 
      };
    }

    if (description.length > ValidationRules.symptomDescription.maxLength) {
      return { 
        isValid: false, 
        error: `症状描述不能超过${ValidationRules.symptomDescription.maxLength}个字符` 
      };
    }

    return { isValid: true };
  }

  /**
   * 验证备注信息
   */
  static validateNotes(notes: string): { isValid: boolean; error?: string } {
    if (notes && notes.length > ValidationRules.notes.maxLength) {
      return { 
        isValid: false, 
        error: `备注信息不能超过${ValidationRules.notes.maxLength}个字符` 
      };
    }

    return { isValid: true };
  }

  /**
   * 验证时间格式
   */
  static validateTimeFormat(timeStr: string): { isValid: boolean; error?: string } {
    if (!ValidationRules.timeFormat.validate(timeStr)) {
      return { isValid: false, error: '时间格式必须为HH:mm（如09:30）' };
    }

    return { isValid: true };
  }
}

export default ValidationRules;