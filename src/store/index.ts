import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';

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

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

// 从 sessionStorage 恢复登录状态
const STORAGE_KEYS = {
  PATIENTS: 'asdm_patients',
} as const;

const SESSION_KEYS = {
  DOCTOR: 'doctorSession',
  PATIENT: 'patientSession',
  PATIENT_ID: 'currentPatientId',
} as const;

function restoreDoctorSession(): Doctor | null {
  try {
    const session = sessionStorage.getItem(SESSION_KEYS.DOCTOR);
    if (session) {
      // 恢复医生会话时，清除患者会话（互斥）
      sessionStorage.removeItem(SESSION_KEYS.PATIENT);
      sessionStorage.removeItem(SESSION_KEYS.PATIENT_ID);
      return JSON.parse(session) as Doctor;
    }
  } catch (e) {
    console.error('恢复医生会话失败', e);
  }
  return null;
}

function loadPatients(): Patient[] {
  const merged = [...patientData] as Patient[];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (saved) {
      const savedPatients = JSON.parse(saved) as Patient[];
      // 合并：localStorage 中的新患者追加到预设列表后面（去重）
      const existingIds = new Set(merged.map(p => p.id));
      for (const sp of savedPatients) {
        if (!existingIds.has(sp.id)) {
          merged.push(sp);
        }
      }
    }
  } catch (e) {
    console.error('加载患者数据失败', e);
  }
  return merged;
}

function savePatients(patients: Patient[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (e) {
    console.error('保存患者数据失败', e);
  }
}

function restorePatientSession(): Patient | null {
  try {
    // 如果已有医生会话，不恢复患者
    if (sessionStorage.getItem(SESSION_KEYS.DOCTOR)) {
      return null;
    }
    const session = sessionStorage.getItem(SESSION_KEYS.PATIENT);
    if (session) {
      return JSON.parse(session) as Patient;
    }
  } catch (e) {
    console.error('恢复患者会话失败', e);
  }
  return null;
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: loadPatients(),
  questions: questionData as Question[],
  currentDoctor: restoreDoctorSession(),
  currentPatient: restorePatientSession(),
});

export const store = {
  state,

  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    );
    if (doctor) {
      // 医生登录时，同时登出患者
      this.logoutPatient();
      state.currentDoctor = doctor;
      sessionStorage.setItem(SESSION_KEYS.DOCTOR, JSON.stringify(doctor));
      return doctor;
    }
    return null;
  },

  logoutDoctor() {
    state.currentDoctor = null;
    sessionStorage.removeItem(SESSION_KEYS.DOCTOR);
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
      savePatients(state.patients);
    }

    // 患者登录时，同时登出医生
    this.logoutDoctor();
    state.currentPatient = patient;
    sessionStorage.setItem(SESSION_KEYS.PATIENT, JSON.stringify(patient));
    sessionStorage.setItem(SESSION_KEYS.PATIENT_ID, patient.id);
    return patient;
  },

  logoutPatient() {
    state.currentPatient = null;
    sessionStorage.removeItem(SESSION_KEYS.PATIENT);
    sessionStorage.removeItem(SESSION_KEYS.PATIENT_ID);
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

  /** 获取当前患者 ID（用于预约等场景） */
  getPatientId(): string {
    if (state.currentPatient?.id) {
      return state.currentPatient.id;
    }
    const savedId = sessionStorage.getItem(SESSION_KEYS.PATIENT_ID);
    if (savedId) {
      return savedId;
    }
    const tempId = `patient_${Date.now()}`;
    sessionStorage.setItem(SESSION_KEYS.PATIENT_ID, tempId);
    return tempId;
  },
};

export { SESSION_KEYS, STORAGE_KEYS };
