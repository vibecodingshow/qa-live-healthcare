import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
import appointmentData from '../data/appointment-list.json';
import scheduleData from '../data/schedule-list.json';
import type {
  Doctor,
  Patient,
  Question,
  Appointment,
  Schedule,
  AppointmentInput,
  ScheduleInput,
} from '../types/appointment';
import {
  showAppointmentCreated,
  showAppointmentConfirmed,
  showAppointmentCancelledPatient,
  showAppointmentCancelledDoctor,
  showAppointmentCompleted,
  showScheduleSuccess,
  showScheduleDeleteFailed,
  showValidationError,
} from '../utils/notification';

// 重新导出类型供外部使用
export type { Doctor, Patient, Question, Appointment, Schedule, AppointmentInput, ScheduleInput };
export { } from '../types/appointment';

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  appointments: Appointment[];
  schedules: Schedule[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  appointments: (appointmentData as { appointments: Appointment[] }).appointments || [],
  schedules: (scheduleData as { schedules: Schedule[] }).schedules || [],
  currentDoctor: null,
  currentPatient: null,
});

export const store = {
  state,

  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    );
    if (doctor) {
      state.currentDoctor = doctor;
      return doctor;
    }
    return null;
  },

  logoutDoctor() {
    state.currentDoctor = null;
  },

  verifyPatient(name: string, birthday: string): Patient {
    let patient = state.patients.find(
      p => p.name === name && p.birthday === birthday
    );

    if (!patient) {
      patient = {
        id: `patient${Date.now()}`,
        name,
        birthday,
        phone: '',
        gender: '',
      };
      state.patients.push(patient);
    }

    state.currentPatient = patient;
    return patient;
  },

  logoutPatient() {
    state.currentPatient = null;
  },

  getQuestionsByDoctor(doctorId: string): Question[] {
    return state.questions.filter(q => q.doctorId === doctorId);
  },

  getQuestionsByPatient(patientId: string): Question[] {
    return state.questions.filter(q => q.patientId === patientId);
  },

  addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>): Question {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      submitTime: new Date().toISOString(),
      status: 'pending',
      answer: null,
      answerTime: null,
    };
    state.questions.push(newQuestion);
    return newQuestion;
  },

  answerQuestion(questionId: string, answer: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = answer;
      question.answerTime = new Date().toISOString();
    }
  },

  markQuestionAsAnswered(questionId: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = '已口述解答';
      question.answerTime = new Date().toISOString();
    }
  },

  getDoctorByUsername(username: string): Doctor | undefined {
    return state.doctors.find(d => d.username === username);
  },

  getActiveDoctors(): Doctor[] {
    return state.doctors.filter(d => d.isActive);
  },

  getStatistics() {
    const totalDoctors = state.doctors.length;
    const totalQuestions = state.questions.length;
    const activeSessions = state.questions.filter(q => q.status === 'pending').length;
    const totalSessions = state.doctors.filter(d => d.isActive).length;

    return {
      totalDoctors,
      totalQuestions,
      activeSessions,
      totalSessions,
    };
  },

  // ==================== 预约挂号相关方法 ====================

  /**
   * 创建预约
   */
  createAppointment(appointment: AppointmentInput): { appointment: Appointment; success: boolean } {
    // 验证预约
    const validation = this.validateAppointment(
      appointment.doctorId,
      appointment.date,
      appointment.startTime,
      appointment.endTime
    );

    if (!validation.valid) {
      showValidationError(validation.error || '预约创建失败');
      return { appointment: null as any, success: false };
    }

    // 获取医生信息用于通知
    const doctor = state.doctors.find(d => d.id === appointment.doctorId);
    const doctorName = doctor?.name || '医生';

    const newAppointment: Appointment = {
      ...appointment,
      id: `apt${Date.now()}`,
      status: 'pending',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
    state.appointments.push(newAppointment);

    // 更新排班的当前预约数
    const schedule = state.schedules.find(
      s => s.doctorId === appointment.doctorId && s.date === appointment.date
    );
    if (schedule) {
      schedule.currentAppointments++;
    }

    // 显示预约成功通知
    showAppointmentCreated(doctorName, appointment.date, appointment.startTime);

    return { appointment: newAppointment, success: true };
  },

  /**
   * 根据患者ID获取预约列表
   */
  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },

  /**
   * 根据医生ID获取预约列表
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },

  /**
   * 获取预约详情
   */
  getAppointmentById(appointmentId: string): Appointment | undefined {
    return state.appointments.find(a => a.id === appointmentId);
  },

  /**
   * 确认预约
   */
  confirmAppointment(appointmentId: string): boolean {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment && appointment.status === 'pending') {
      appointment.status = 'confirmed';
      appointment.updateTime = new Date().toISOString();
      // 显示预约确认通知
      showAppointmentConfirmed();
      return true;
    }
    return false;
  },

  /**
   * 完成预约
   */
  completeAppointment(appointmentId: string): boolean {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment && appointment.status === 'confirmed') {
      appointment.status = 'completed';
      appointment.updateTime = new Date().toISOString();
      // 显示预约完成通知
      showAppointmentCompleted();
      return true;
    }
    return false;
  },

  /**
   * 取消预约
   * @param appointmentId 预约ID
   * @param reason 取消原因
   * @param cancelledBy 取消者身份：'patient' | 'doctor'
   */
  cancelAppointment(appointmentId: string, reason?: string, cancelledBy: 'patient' | 'doctor' = 'patient'): boolean {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment && appointment.status !== 'completed' && appointment.status !== 'cancelled') {
      appointment.status = 'cancelled';
      appointment.cancelReason = reason;
      appointment.updateTime = new Date().toISOString();

      // 减少排班的当前预约数
      const schedule = state.schedules.find(
        s => s.doctorId === appointment.doctorId && s.date === appointment.date
      );
      if (schedule && schedule.currentAppointments > 0) {
        schedule.currentAppointments--;
      }

      // 显示取消通知（根据取消者身份显示不同提示）
      if (cancelledBy === 'patient') {
        showAppointmentCancelledPatient();
      } else {
        showAppointmentCancelledDoctor();
      }

      return true;
    }
    return false;
  },

  /**
   * 创建医生排班
   */
  createSchedule(schedule: ScheduleInput): Schedule {
    const newSchedule: Schedule = {
      ...schedule,
      id: `sched${Date.now()}`,
      currentAppointments: 0,
    };
    state.schedules.push(newSchedule);
    // 显示排班创建成功通知
    showScheduleSuccess('create');
    return newSchedule;
  },

  /**
   * 根据医生ID获取排班列表
   */
  getSchedulesByDoctor(doctorId: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId);
  },

  /**
   * 获取特定日期的排班
   */
  getSchedulesByDate(date: string): Schedule[] {
    return state.schedules.filter(s => s.date === date);
  },

  /**
   * 获取特定日期和医生的排班
   */
  getScheduleByDoctorAndDate(doctorId: string, date: string): Schedule | undefined {
    return state.schedules.find(s => s.doctorId === doctorId && s.date === date);
  },

  /**
   * 获取特定日期和医生的所有排班（支持多时段，如上午+下午）
   */
  getAllSchedulesByDoctorAndDate(doctorId: string, date: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId && s.date === date && s.isAvailable);
  },

  /**
   * 更新排班状态
   */
  updateScheduleStatus(scheduleId: string, isAvailable: boolean): boolean {
    const schedule = state.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.isAvailable = isAvailable;
      // 显示排班更新成功通知
      showScheduleSuccess('update');
      return true;
    }
    return false;
  },

  /**
   * 删除排班
   */
  deleteSchedule(scheduleId: string): boolean {
    const index = state.schedules.findIndex(s => s.id === scheduleId);
    if (index !== -1) {
      const schedule = state.schedules[index];
      // 检查是否有已确认的预约
      const hasActiveAppointments = state.appointments.some(
        a => a.doctorId === schedule.doctorId &&
             a.date === schedule.date &&
             (a.status === 'pending' || a.status === 'confirmed')
      );
      if (hasActiveAppointments) {
        // 显示删除失败通知
        showScheduleDeleteFailed();
        return false; // 有活跃预约，不能删除
      }
      state.schedules.splice(index, 1);
      // 显示排班删除成功通知
      showScheduleSuccess('delete');
      return true;
    }
    return false;
  },

  /**
   * 获取可用的时间段
   */
  getAvailableTimeSlots(doctorId: string, date: string): string[] {
    const schedule = state.schedules.find(
      s => s.doctorId === doctorId && s.date === date && s.isAvailable
    );
    if (!schedule) {
      return [];
    }

    // 生成时间段（假设每个时段30分钟）
    const slots: string[] = [];
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      const nextMin = currentMin + 30;
      const slotEndHour = nextMin >= 60 ? currentHour + 1 : currentHour;
      const slotEndMin = nextMin >= 60 ? nextMin - 60 : nextMin;
      const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

      slots.push(`${slotStart}-${slotEnd}`);

      currentHour = slotEndHour;
      currentMin = slotEndMin;
    }

    // 过滤掉已满的时段
    const bookedSlots = state.appointments
      .filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'cancelled')
      .map(a => `${a.startTime}-${a.endTime}`);

    return slots.filter(slot => !bookedSlots.includes(slot));
  },

  /**
   * 检查时间段是否可用
   */
  isTimeSlotAvailable(doctorId: string, date: string, startTime: string, endTime: string): boolean {
    // 检查是否有冲突的预约
    const conflict = state.appointments.find(
      a => a.doctorId === doctorId &&
           a.date === date &&
           a.status !== 'cancelled' &&
           !(endTime <= a.startTime || startTime >= a.endTime)
    );

    return !conflict;
  },

  /**
   * 验证预约是否可以创建（综合验证）
   */
  validateAppointment(
    doctorId: string, 
    date: string, 
    startTime: string, 
    endTime: string
  ): { valid: boolean; error?: string } {
    // 1. 检查排班是否存在
    const schedule = state.schedules.find(
      s => s.doctorId === doctorId && s.date === date && s.isAvailable
    );
    
    if (!schedule) {
      return { valid: false, error: '该日期医生未排班或排班不可用' };
    }

    // 2. 检查时间段是否在排班范围内
    if (startTime < schedule.startTime || endTime > schedule.endTime) {
      return { valid: false, error: '预约时间超出医生排班范围' };
    }

    // 3. 检查时间段是否已满
    const existingAppointments = state.appointments.filter(
      a => a.doctorId === doctorId && 
           a.date === date && 
           a.status !== 'cancelled' &&
           !(endTime <= a.startTime || startTime >= a.endTime)
    ).length;

    if (existingAppointments >= schedule.maxAppointments) {
      return { valid: false, error: '该时间段已满，请选择其他时段' };
    }

    // 4. 检查是否有时间冲突
    const hasConflict = state.appointments.some(
      a => a.doctorId === doctorId &&
           a.date === date &&
           a.status !== 'cancelled' &&
           !(endTime <= a.startTime || startTime >= a.endTime)
    );

    if (hasConflict) {
      return { valid: false, error: '该时间段已被其他预约占用' };
    }

    return { valid: true };
  },

  /**
   * 获取时段的预约统计
   */
  getSlotStatistics(
    doctorId: string, 
    date: string, 
    startTime: string, 
    endTime: string
  ): { total: number; booked: number; remaining: number } {
    const schedule = state.schedules.find(
      s => s.doctorId === doctorId && s.date === date
    );

    if (!schedule) {
      return { total: 0, booked: 0, remaining: 0 };
    }

    const booked = state.appointments.filter(
      a => a.doctorId === doctorId &&
           a.date === date &&
           a.status !== 'cancelled' &&
           !(endTime <= a.startTime || startTime >= a.endTime)
    ).length;

    return {
      total: schedule.maxAppointments,
      booked,
      remaining: Math.max(0, schedule.maxAppointments - booked)
    };
  },
};
