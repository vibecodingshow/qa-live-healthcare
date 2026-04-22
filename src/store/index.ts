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
  // 预约相关字段
  schedule?: {
    morningStart: string;
    morningEnd: string;
    afternoonStart: string;
    afternoonEnd: string;
    availableDays: number[]; // 0-6, 周日到周六
  };
  maxPatientsPerSlot?: number;
  appointmentEnabled?: boolean;
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

// 预约时段
export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;           // YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon';
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  maxPatients: number;
  currentCount: number;
  isAvailable: boolean;
}

// 预约记录
export interface Appointment {
  id: string;              // 预约号 (AP + 日期8位 + 序号4位)
  patientId: string;       // 患者ID
  patientName: string;     // 患者姓名
  patientPhone: string;    // 患者手机号
  doctorId: string;        // 医生ID
  doctorName: string;      // 医生姓名
  department: string;     // 科室
  slotId: string;          // 时段ID
  appointmentDate: string; // 预约日期 YYYY-MM-DD
  appointmentTime: string; // 预约时段 (上午/下午 HH:mm-HH:mm)
  status: 'pending' | 'completed' | 'cancelled';  // 待就诊/已完成/已取消
  createdAt: string;       // 创建时间
}

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  // 预约时段数据
  appointmentSlots: AppointmentSlot[];
  // 预约记录
  appointments: Appointment[];
}

// 生成模拟号源数据
function generateMockSlots(): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const doctors = doctorData as Doctor[];
  const today = new Date();

  doctors.forEach(doctor => {
    // 为每个医生生成未来两周的号源
    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dayOfWeek = date.getDay();

      // 假设医生周一到周五出诊 (周一=1, 周五=5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const dateStr = date.toISOString().split('T')[0];

        // 上午时段
        const morningMax = doctor.maxPatientsPerSlot || 10;
        const morningCurrent = Math.floor(Math.random() * morningMax);
        slots.push({
          id: `slot-${doctor.id}-${dateStr}-morning`,
          doctorId: doctor.id,
          date: dateStr,
          timeSlot: 'morning',
          startTime: '09:00',
          endTime: '12:00',
          maxPatients: morningMax,
          currentCount: morningCurrent,
          isAvailable: morningCurrent < morningMax,
        });

        // 下午时段
        const afternoonMax = doctor.maxPatientsPerSlot || 10;
        const afternoonCurrent = Math.floor(Math.random() * afternoonMax);
        slots.push({
          id: `slot-${doctor.id}-${dateStr}-afternoon`,
          doctorId: doctor.id,
          date: dateStr,
          timeSlot: 'afternoon',
          startTime: '14:00',
          endTime: '17:00',
          maxPatients: afternoonMax,
          currentCount: afternoonCurrent,
          isAvailable: afternoonCurrent < afternoonMax,
        });
      }
    }
  });

  return slots;
}

const mockSlots = generateMockSlots();

// 从 localStorage 加载已保存的预约记录
function loadAppointments(): Appointment[] {
  const saved = localStorage.getItem('appointments');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

// 保存预约记录到 localStorage
function saveAppointments(appointments: Appointment[]) {
  localStorage.setItem('appointments', JSON.stringify(appointments));
}

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  currentDoctor: null,
  currentPatient: null,
  appointmentSlots: mockSlots,
  appointments: loadAppointments(),
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

    // 预约统计数据
    const today = new Date().toISOString().split('T')[0];
    const allAppointments = state.appointments.filter(a => a.status !== 'cancelled');
    const todayAppointments = allAppointments.filter(a => a.appointmentDate === today);

    // 各科室预约分布
    const departmentMap = new Map<string, number>();
    allAppointments.forEach(a => {
      departmentMap.set(a.department, (departmentMap.get(a.department) || 0) + 1);
    });
    const departmentStats = Array.from(departmentMap.entries())
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalDoctors,
      totalQuestions,
      activeSessions,
      totalSessions,
      // 预约统计
      totalAppointments: allAppointments.length,
      todayAppointments: todayAppointments.length,
      todayArrived: todayAppointments.filter(a => a.status === 'completed').length,
      todayPending: todayAppointments.filter(a => a.status === 'pending').length,
      departmentStats,
    };
  },

  // ===== 预约时段相关 API =====

  getDoctorById(doctorId: string): Doctor | undefined {
    return state.doctors.find(d => d.id === doctorId);
  },

  getAvailableSlots(doctorId: string, date: string): AppointmentSlot[] {
    return state.appointmentSlots.filter(
      slot => slot.doctorId === doctorId && slot.date === date
    );
  },

  getAvailableDates(doctorId: string): string[] {
    const dates = new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    state.appointmentSlots
      .filter(slot => slot.doctorId === doctorId && slot.isAvailable)
      .forEach(slot => {
        const slotDate = new Date(slot.date);
        if (slotDate >= today) {
          dates.add(slot.date);
        }
      });

    return Array.from(dates).sort();
  },

  isDateAvailable(doctorId: string, date: string): boolean {
    return state.appointmentSlots.some(
      slot => slot.doctorId === doctorId && slot.date === date && slot.isAvailable
    );
  },

  incrementSlotCount(slotId: string): void {
    const slot = state.appointmentSlots.find(s => s.id === slotId);
    if (slot) {
      slot.currentCount++;
      if (slot.currentCount >= slot.maxPatients) {
        slot.isAvailable = false;
      }
    }
  },

  decrementSlotCount(slotId: string): void {
    const slot = state.appointmentSlots.find(s => s.id === slotId);
    if (slot) {
      if (slot.currentCount > 0) {
        slot.currentCount--;
      }
      if (slot.currentCount < slot.maxPatients) {
        slot.isAvailable = true;
      }
    }
  },

  // ===== 患者信息验证相关 API =====

  verifyPatientByPhone(phone: string): Patient | undefined {
    return state.patients.find(p => p.phone === phone);
  },

  savePatientInfo(patientInfo: { name: string; phone: string }): Patient {
    let patient = state.patients.find(p => p.phone === patientInfo.phone);

    if (!patient) {
      patient = {
        id: `patient${Date.now()}`,
        name: patientInfo.name,
        birthday: '',
        phone: patientInfo.phone,
        gender: '',
      };
      state.patients.push(patient);
    } else {
      patient.name = patientInfo.name;
    }

    // 持久化到 localStorage
    localStorage.setItem('lastPatientInfo', JSON.stringify({
      name: patient.name,
      phone: patient.phone,
    }));

    state.currentPatient = patient;
    return patient;
  },

  getLastPatientInfo(): { name: string; phone: string } | null {
    const saved = localStorage.getItem('lastPatientInfo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  // ===== 预约提交相关 API =====

  getSlotById(slotId: string): AppointmentSlot | undefined {
    return state.appointmentSlots.find(s => s.id === slotId);
  },

  // 获取当天预约序号
  getTodayAppointmentCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return state.appointments.filter(a => a.id.startsWith(`AP${today.replace(/-/g, '')}`)).length;
  },

  // 生成预约号: AP + 日期(8位) + 序号(4位)
  generateAppointmentId(): string {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = this.getTodayAppointmentCount() + 1;
    return `AP${today}${count.toString().padStart(4, '0')}`;
  },

  // 提交预约
  addAppointment(
    slotId: string,
    patientInfo: { name: string; phone: string }
  ): { success: boolean; appointment?: Appointment; error?: string } {
    // 1. 获取时段信息
    const slot = this.getSlotById(slotId);
    if (!slot) {
      return { success: false, error: '时段不存在' };
    }

    // 2. 检查是否还有剩余号源 (冲突检测)
    if (slot.currentCount >= slot.maxPatients) {
      return { success: false, error: '该时段已约满，请重新选择' };
    }

    // 3. 获取患者信息
    let patient = this.verifyPatientByPhone(patientInfo.phone);
    if (!patient) {
      patient = this.savePatientInfo(patientInfo);
    }

    // 4. 检查患者是否已有该时段预约 (避免重复预约)
    const existingAppointment = state.appointments.find(
      a => a.slotId === slotId &&
           a.patientPhone === patientInfo.phone &&
           a.status !== 'cancelled'
    );
    if (existingAppointment) {
      return { success: false, error: '您已预约该时段' };
    }

    // 5. 获取医生信息
    const doctor = this.getDoctorById(slot.doctorId);
    if (!doctor) {
      return { success: false, error: '医生信息不存在' };
    }

    // 6. 创建预约记录
    const appointmentId = this.generateAppointmentId();
    const appointment: Appointment = {
      id: appointmentId,
      patientId: patient.id,
      patientName: patientInfo.name,
      patientPhone: patientInfo.phone,
      doctorId: slot.doctorId,
      doctorName: doctor.name,
      department: doctor.department,
      slotId: slotId,
      appointmentDate: slot.date,
      appointmentTime: `${slot.timeSlot === 'morning' ? '上午' : '下午'} ${slot.startTime}-${slot.endTime}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // 7. 更新号源数量
    this.incrementSlotCount(slotId);

    // 8. 保存预约记录
    state.appointments.push(appointment);
    saveAppointments(state.appointments);

    return { success: true, appointment };
  },

  // 根据ID获取预约
  getAppointmentById(appointmentId: string): Appointment | undefined {
    return state.appointments.find(a => a.id === appointmentId);
  },

  // 获取患者的预约列表
  getAppointmentsByPatient(phone: string): Appointment[] {
    return state.appointments
      .filter(a => a.patientPhone === phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // 获取患者最近的预约
  getLatestAppointment(phone: string): Appointment | undefined {
    const appointments = this.getAppointmentsByPatient(phone);
    return appointments[0];
  },

  // 取消预约
  cancelAppointment(appointmentId: string): { success: boolean; error?: string } {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      return { success: false, error: '预约不存在' };
    }

    if (appointment.status === 'cancelled') {
      return { success: false, error: '该预约已取消' };
    }

    if (appointment.status === 'completed') {
      return { success: false, error: '该预约已完成，无法取消' };
    }

    // 检查是否在就诊前2小时之外
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T00:00:00`);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 2) {
      return { success: false, error: '距离就诊时间不足2小时，无法取消' };
    }

    // 更新预约状态
    appointment.status = 'cancelled';

    // 恢复号源
    this.decrementSlotCount(appointment.slotId);

    // 保存更新
    saveAppointments(state.appointments);

    return { success: true };
  },

  // 获取所有预约 (用于管理)
  getAllAppointments(): Appointment[] {
    return state.appointments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 获取医生的预约列表
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments
      .filter(a => a.doctorId === doctorId && a.status !== 'cancelled')
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  },

  // 标记预约为已完成
  markAppointmentCompleted(appointmentId: string): void {
    const appointment = state.appointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.status = 'completed';
      saveAppointments(state.appointments);
    }
  },

  // 获取医生统计数据
  getDoctorStatistics(doctorId: string): {
    totalToday: number;
    arrivedToday: number;
    pendingToday: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = state.appointments.filter(
      a => a.doctorId === doctorId && a.appointmentDate === today && a.status !== 'cancelled'
    );

    return {
      totalToday: doctorAppointments.length,
      arrivedToday: doctorAppointments.filter(a => a.status === 'completed').length,
      pendingToday: doctorAppointments.filter(a => a.status === 'pending').length,
    };
  },
};
