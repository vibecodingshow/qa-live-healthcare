import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
import scheduleData from '../data/schedule-list.json';
import appointmentData from '../data/appointment-list.json';

export interface Doctor {
  id: string;
  username: string;
  password: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}

export interface Patient {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  gender: string;
}

export interface Question {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
  submitTime: string;
  status: 'pending' | 'answered';
  answer: string | null;
  answerTime: string | null;
}

/** 排班时段 — 单个可预约的时间段 */
export interface ScheduleSlot {
  id: string;
  startTime: string;   // HH:mm, 如 "08:00"
  endTime: string;     // HH:mm, 如 "12:00"
  periodLabel: string; // 显示标签, 如 "上午"
  totalCapacity: number; // 该时段总号源数
  remaining: number;     // 剩余可预约数
}

/** 排班计划 — 医生某一天的排班（包含多个时段） */
export interface Schedule {
  id: string;
  doctorId: string;
  date: string;          // YYYY-MM-DD
  dayOfWeek: number;     // 0=周日, 1=周一, ..., 6=周六
  slots: ScheduleSlot[];
}

/** 预约记录 */
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  scheduleSlotId: string;
  date: string;            // YYYY-MM-DD
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  symptoms: string;        // 病情描述, <=200字
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
}

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  schedules: Schedule[];
  appointments: Appointment[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  schedules: scheduleData as Schedule[],
  appointments: appointmentData as Appointment[],
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

  // ========== 预约挂号相关方法 ==========

  /** 获取指定医生的排班列表 */
  getSchedulesByDoctor(doctorId: string): Schedule[] {
    return state.schedules.filter(s => s.doctorId === doctorId);
  },

  /** 获取指定日期的所有可用时段 */
  getScheduleSlots(date: string): ScheduleSlot[] {
    const schedule = state.schedules.find(s => s.date === date);
    return schedule ? schedule.slots : [];
  },

  /** 创建新预约（含号源扣减） */
  createAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'confirmedAt' | 'cancelledAt' | 'completedAt'>): Appointment | null {
    // 找到对应时段并扣减号源
    const slot = this.findSlotById(data.scheduleSlotId, data.date);
    if (!slot || slot.remaining <= 0) return null;

    slot.remaining--;

    const newAppointment: Appointment = {
      ...data,
      id: `apt${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      cancelledAt: null,
      completedAt: null,
    };
    state.appointments.push(newAppointment);
    return newAppointment;
  },

  /** 获取患者的预约列表 */
  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },

  /** 获取医生的预约列表 */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },

  /** 取消预约（仅 PENDING 状态可取消，恢复号源） */
  cancelAppointment(appointmentId: string): boolean {
    const apt = state.appointments.find(a => a.id === appointmentId);
    if (!apt || apt.status !== 'PENDING') return false;

    // 恢复号源
    const slot = this.findSlotById(apt.scheduleSlotId, apt.date);
    if (slot) slot.remaining++;

    apt.status = 'CANCELLED';
    apt.cancelledAt = new Date().toISOString();
    return true;
  },

  /** 确认预约 */
  confirmAppointment(appointmentId: string): boolean {
    const apt = state.appointments.find(a => a.id === appointmentId);
    if (!apt || apt.status !== 'PENDING') return false;

    apt.status = 'CONFIRMED';
    apt.confirmedAt = new Date().toISOString();
    return true;
  },

  /** 标记预约完成 */
  completeAppointment(appointmentId: string): boolean {
    const apt = state.appointments.find(a => a.id === appointmentId);
    if (!apt || apt.status !== 'CONFIRMED') return false;

    apt.status = 'COMPLETED';
    apt.completedAt = new Date().toISOString();
    return true;
  },

  /** 内部辅助方法：通过 slotId + date 找到具体的 ScheduleSlot */
  findSlotById(slotId: string, date: string): ScheduleSlot | undefined {
    const schedule = state.schedules.find(s => s.date === date);
    if (!schedule) return undefined;
    return schedule.slots.find(sl => sl.id === slotId);
  },
};
