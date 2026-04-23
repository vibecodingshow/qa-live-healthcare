import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
import appointmentListData from '../data/appointment-list.json';
import slotData from '../data/appointment-slots.json';

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

// 预约记录接口
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;        // YYYY-MM-DD
  timeSlot: string;    // HH:mm-HH:mm
  status: 'pending' | 'confirmed' | 'cancelled';
  cancelReason: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

// 排班时段接口
export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;        // YYYY-MM-DD
  timeSlot: string;    // HH:mm-HH:mm
  period: 'morning' | 'afternoon';
  status: 'available' | 'booked';
}

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  appointments: Appointment[];
  appointmentSlots: AppointmentSlot[];
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  currentDoctor: null,
  currentPatient: null,
  appointments: appointmentListData as Appointment[],
  appointmentSlots: slotData as AppointmentSlot[],
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

  // ---- 排班查询方法 ----

  getSlotsByDoctor(doctorId: string): AppointmentSlot[] {
    return state.appointmentSlots.filter(s => s.doctorId === doctorId);
  },

  getSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[] {
    return state.appointmentSlots.filter(
      s => s.doctorId === doctorId && s.date === date
    );
  },

  getAvailableSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[] {
    return state.appointmentSlots.filter(
      s => s.doctorId === doctorId && s.date === date && s.status === 'available'
    );
  },

  // ---- 预约操作方法 ----

  createAppointment(data: Omit<Appointment, 'id' | 'status' | 'cancelReason' | 'createdAt' | 'updatedAt'>): Appointment | null {
    const slot = state.appointmentSlots.find(
      s => s.doctorId === data.doctorId && s.date === data.date && s.timeSlot === data.timeSlot
    );
    if (slot && slot.status !== 'available') {
      return null;
    }
    const appointment: Appointment = {
      ...data,
      id: `apt${Date.now()}`,
      status: 'pending',
      cancelReason: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.appointments.push(appointment);
    if (slot) {
      slot.status = 'booked';
    }
    return appointment;
  },

  confirmAppointment(appointmentId: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (!appointment || appointment.status !== 'pending') return;
    appointment.status = 'confirmed';
    appointment.updatedAt = new Date().toISOString();
  },

  cancelAppointment(appointmentId: string, reason: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    if (appointment.status !== 'pending' && appointment.status !== 'confirmed') return;
    if (!reason || reason.trim().length === 0) return;
    if (reason.length > 200) return;
    const slot = state.appointmentSlots.find(
      s => s.doctorId === appointment.doctorId && s.date === appointment.date && s.timeSlot === appointment.timeSlot
    );
    if (slot) {
      slot.status = 'available';
    }
    appointment.status = 'cancelled';
    appointment.cancelReason = reason.trim();
    appointment.updatedAt = new Date().toISOString();
  },

  // ---- 预约查询方法 ----

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },
};
