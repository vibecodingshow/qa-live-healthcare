import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';
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
  // 预约挂号扩展字段
  clinicSchedule?: ClinicSchedule;  // 门诊排班设置
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

// ============================================================
// 预约挂号功能 - 数据模型定义
// ============================================================

/**
 * 预约状态枚举
 * - pending: 待确认
 * - confirmed: 已确认
 * - completed: 已完成
 * - cancelled: 已取消
 * - rejected: 已拒绝
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

/**
 * 预约实体
 * 记录患者的预约信息
 */
export interface Appointment {
  id: string;                    // 预约ID，使用 apt- 前缀，如 apt-001
  patientId: string;            // 患者ID，复用 Patient.id
  patientName: string;          // 患者姓名
  patientPhone: string;          // 患者联系电话
  doctorId: string;             // 医生ID，复用 Doctor.id
  doctorName: string;           // 医生姓名
  doctorTitle: string;          // 医生职称
  doctorDepartment: string;     // 医生科室
  appointmentDate: string;      // 预约日期，格式：YYYY-MM-DD
  timeSlot: string;             // 时段，格式："09:00-09:30"
  location: string;             // 门诊地点
  reason: string;               // 就诊原因
  status: AppointmentStatus;    // 预约状态
  cancelReason?: string;        // 取消原因
  rejectReason?: string;        // 拒绝原因
  createdAt: string;            // 创建时间，ISO 8601 格式
  updatedAt: string;            // 更新时间，ISO 8601 格式
  confirmedAt?: string;          // 确认时间
  completedAt?: string;         // 完成时间
  cancelledAt?: string;         // 取消时间
}

/**
 * 时段容量信息
 * 用于展示时段的可预约状态
 */
export interface TimeSlotCapacity {
  startTime: string;             // 开始时间，格式：HH:mm
  endTime: string;               // 结束时间，格式：HH:mm
  maxCapacity: number;           // 最大可预约人数
  bookedCount: number;           // 已预约人数
  available: number;            // 剩余可预约人数
  status: 'available' | 'full' | 'closed';
}

/**
 * 日门诊时间表
 * 记录某一天的门诊时段安排
 */
export interface DailySchedule {
  date: string;                  // 日期，格式：YYYY-MM-DD
  isAvailable: boolean;          // 是否开放门诊
  slots: TimeSlotCapacity[];    // 时段列表
}

/**
 * 周排班配置
 * 单个工作日的排班设置
 */
export interface DayScheduleConfig {
  enabled: boolean;             // 是否启用
  startTime: string;             // 开始时间，格式：HH:mm
  endTime: string;               // 结束时间，格式：HH:mm
  slotDuration: number;         // 时段时长（分钟），默认 30
  maxPatientsPerSlot: number;   // 每时段最大患者数
}

/**
 * 周排班设置
 * 按星期几配置的门诊时间
 */
export interface WeeklySchedule {
  monday: DayScheduleConfig;
  tuesday: DayScheduleConfig;
  wednesday: DayScheduleConfig;
  thursday: DayScheduleConfig;
  friday: DayScheduleConfig;
  saturday: DayScheduleConfig;
  sunday: DayScheduleConfig;
}

/**
 * 门诊时间表
 * 医生的门诊排班设置
 */
export interface ClinicSchedule {
  doctorId: string;              // 医生ID
  weeklySchedule: WeeklySchedule; // 周排班设置
  clinicLocation: string;        // 门诊地点
  maxPatientsPerSlot: number;    // 默认每时段最大人数
  effectiveFrom: string;        // 生效日期
  createdAt: string;
  updatedAt: string;
}

/**
 * 可预约时段
 * 患者可选择的时段
 */
export interface AvailableSlot {
  date: string;                  // 日期，格式：YYYY-MM-DD
  timeSlot: string;              // 时段，格式："09:00-09:30"
  remainingCapacity: number;     // 剩余可预约数
  location: string;              // 门诊地点
}

// ============================================================
// 预约状态流转规则
// ============================================================
/**
 * 预约状态流转图：
 * 
 *   [PENDING] ──确认──→ [CONFIRMED] ──完成──→ [COMPLETED]
 *      │                │
 *      │                └──取消──→ [CANCELLED]
 *      │
 *      └──拒绝──→ [REJECTED]
 *      │
 *      └──患者取消──→ [CANCELLED]
 * 
 * 状态说明：
 * - PENDING: 患者提交预约，等待医生确认
 * - CONFIRMED: 医生确认预约
 * - COMPLETED: 患者已完成就诊
 * - CANCELLED: 预约被取消（医生或患者取消）
 * - REJECTED: 医生拒绝预约
 */

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  appointments: Appointment[];
  clinicSchedules: ClinicSchedule[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

// 预约模拟数据结构
interface AppointmentData {
  appointments: Appointment[];
}

const appointmentListData = appointmentData as AppointmentData;

const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  appointments: appointmentListData.appointments || [],
  clinicSchedules: [],
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

  // ============================================================
  // 预约挂号功能 - Store 方法
  // ============================================================

  /**
   * 创建新预约
   * @param appointment 预约信息（不含 id、status、createdAt、updatedAt）
   * @returns 新创建的预约对象
   */
  addAppointment(
    appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.appointments.push(newAppointment);
    return newAppointment;
  },

  /**
   * 根据 ID 获取预约
   * @param id 预约 ID
   * @returns 预约对象或 undefined
   */
  getAppointmentById(id: string): Appointment | undefined {
    return state.appointments.find(a => a.id === id);
  },

  /**
   * 取消预约
   * @param id 预约 ID
   * @param reason 取消原因（可选）
   * @returns 更新后的预约或 null
   */
  cancelAppointment(id: string, reason?: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) {
      return null;
    }

    // 只能取消 pending 或 confirmed 状态的预约
    if (
      appointment.status !== AppointmentStatus.PENDING &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      return null;
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.updatedAt = new Date().toISOString();
    appointment.cancelledAt = new Date().toISOString();
    if (reason) {
      appointment.cancelReason = reason;
    }

    return appointment;
  },

  /**
   * 确认预约
   * @param id 预约 ID
   * @returns 更新后的预约或 null
   */
  confirmAppointment(id: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) {
      return null;
    }

    // 只能确认 pending 状态的预约
    if (appointment.status !== AppointmentStatus.PENDING) {
      return null;
    }

    appointment.status = AppointmentStatus.CONFIRMED;
    appointment.updatedAt = new Date().toISOString();
    appointment.confirmedAt = new Date().toISOString();

    return appointment;
  },

  /**
   * 拒绝预约
   * @param id 预约 ID
   * @param reason 拒绝原因
   * @returns 更新后的预约或 null
   */
  rejectAppointment(id: string, reason: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) {
      return null;
    }

    // 只能拒绝 pending 状态的预约
    if (appointment.status !== AppointmentStatus.PENDING) {
      return null;
    }

    appointment.status = AppointmentStatus.REJECTED;
    appointment.updatedAt = new Date().toISOString();
    appointment.rejectReason = reason;

    return appointment;
  },

  /**
   * 完成预约
   * @param id 预约 ID
   * @returns 更新后的预约或 null
   */
  completeAppointment(id: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) {
      return null;
    }

    // 只能完成 confirmed 状态的预约
    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      return null;
    }

    appointment.status = AppointmentStatus.COMPLETED;
    appointment.updatedAt = new Date().toISOString();
    appointment.completedAt = new Date().toISOString();

    return appointment;
  },

  /**
   * 获取指定患者的所有预约
   * @param patientId 患者 ID
   * @param status 可选：按状态筛选
   * @returns 预约列表
   */
  getAppointmentsByPatient(
    patientId: string,
    status?: AppointmentStatus
  ): Appointment[] {
    let appointments = state.appointments.filter(a => a.patientId === patientId);
    if (status) {
      appointments = appointments.filter(a => a.status === status);
    }
    return appointments;
  },

  /**
   * 获取指定医生的所有预约
   * @param doctorId 医生 ID
   * @param status 可选：按状态筛选
   * @returns 预约列表
   */
  getAppointmentsByDoctor(
    doctorId: string,
    status?: AppointmentStatus
  ): Appointment[] {
    let appointments = state.appointments.filter(a => a.doctorId === doctorId);
    if (status) {
      appointments = appointments.filter(a => a.status === status);
    }
    return appointments;
  },

  /**
   * 获取医生的门诊时间表
   * @param doctorId 医生 ID
   * @returns 门诊时间表或 undefined
   */
  getDoctorSchedule(doctorId: string): ClinicSchedule | undefined {
    const doctor = state.doctors.find(d => d.id === doctorId);
    return doctor?.clinicSchedule;
  },

  /**
   * 获取医生在指定日期的可预约时段
   * @param doctorId 医生 ID
   * @param date 日期 (YYYY-MM-DD)
   * @returns 可预约时段列表
   */
  getAvailableSlots(doctorId: string, date: string): AvailableSlot[] {
    const doctor = state.doctors.find(d => d.id === doctorId);
    if (!doctor?.clinicSchedule) {
      return [];
    }

    const schedule = doctor.clinicSchedule;
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // 将星期数字映射到 schedule 键
    const dayMap: Record<number, keyof WeeklySchedule> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };

    const dayKey = dayMap[dayOfWeek];
    const dayConfig = schedule.weeklySchedule[dayKey];

    if (!dayConfig.enabled) {
      return [];
    }

    // 生成时段列表
    const slots: AvailableSlot[] = [];
    const [startHour, startMin] = dayConfig.startTime.split(':').map(Number);
    const [endHour, endMin] = dayConfig.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const slotStart = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      currentMin += dayConfig.slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
      const slotEnd = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      const timeSlot = `${slotStart}-${slotEnd}`;

      // 计算该时段已预约人数
      const bookedCount = state.appointments.filter(
        a =>
          a.doctorId === doctorId &&
          a.appointmentDate === date &&
          a.timeSlot === timeSlot &&
          a.status !== AppointmentStatus.CANCELLED &&
          a.status !== AppointmentStatus.REJECTED
      ).length;

      const remainingCapacity = dayConfig.maxPatientsPerSlot - bookedCount;

      if (remainingCapacity > 0) {
        slots.push({
          date,
          timeSlot,
          remainingCapacity,
          location: schedule.clinicLocation,
        });
      }

      // 检查是否已达到结束时间
      if (currentHour >= endHour && currentMin > endMin) {
        break;
      }
    }

    return slots;
  },

  /**
   * 获取预约统计信息
   * @returns 统计对象
   */
  getAppointmentStatistics() {
    const totalAppointments = state.appointments.length;
    const pendingCount = state.appointments.filter(
      a => a.status === AppointmentStatus.PENDING
    ).length;
    const confirmedCount = state.appointments.filter(
      a => a.status === AppointmentStatus.CONFIRMED
    ).length;
    const completedCount = state.appointments.filter(
      a => a.status === AppointmentStatus.COMPLETED
    ).length;
    const cancelledCount = state.appointments.filter(
      a => a.status === AppointmentStatus.CANCELLED
    ).length;
    const rejectedCount = state.appointments.filter(
      a => a.status === AppointmentStatus.REJECTED
    ).length;

    return {
      totalAppointments,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      rejectedCount,
    };
  },
};
