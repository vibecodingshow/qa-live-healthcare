/**
 * 预约挂号数据模型和本地存储接口
 * Feature: FEAT-001-appointment-booking
 * Task: TASK-001 数据模型设计
 */

// ==================== 枚举定义 ====================

/**
 * 预约时段枚举
 */
export const TimeSlot = {
  MORNING: 'MORNING',   // 上午
  AFTERNOON: 'AFTERNOON', // 下午
  EVENING: 'EVENING'    // 晚上
} as const;

export type TimeSlotType = typeof TimeSlot[keyof typeof TimeSlot];

/**
 * 预约状态枚举
 */
export const AppointmentStatus = {
  PENDING: 'PENDING',       // 待就诊
  COMPLETED: 'COMPLETED',    // 已就诊
  CANCELLED: 'CANCELLED'     // 已取消
} as const;

export type AppointmentStatusType = typeof AppointmentStatus[keyof typeof AppointmentStatus];

// ==================== 接口定义 ====================

/**
 * 排班接口 - 定义医生的出诊安排
 */
export interface Schedule {
  /** 排班ID */
  id: string;
  /** 医生ID */
  doctorId: string;
  /** 出诊日期 (YYYY-MM-DD) */
  date: string;
  /** 时段 */
  timeSlot: TimeSlotType;
  /** 该时段可预约号源数 */
  totalSlots: number;
  /** 已预约号源数 */
  bookedSlots: number;
  /** 是否开放预约 */
  isOpen: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 预约记录接口
 */
export interface Appointment {
  /** 预约ID */
  id: string;
  /** 患者ID */
  patientId: string;
  /** 医生ID */
  doctorId: string;
  /** 排班ID */
  scheduleId: string;
  /** 预约日期 */
  appointmentDate: string;
  /** 预约时段 */
  timeSlot: TimeSlotType;
  /** 预约状态 */
  status: AppointmentStatusType;
  /** 患者姓名 */
  patientName: string;
  /** 患者电话 */
  patientPhone: string;
  /** 病情描述 */
  symptom?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 创建预约的输入参数（不含自动生成的ID和时间戳）
 */
export type CreateAppointmentInput = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

// ==================== localStorage Keys ====================

const STORAGE_KEYS = {
  SCHEDULES: 'asdm_schedules',
  APPOINTMENTS: 'asdm_appointments',
  LOCKS: 'asdm_locks'
} as const;

/**
 * 号源锁定信息
 */
interface SlotLock {
  key: string;
  timestamp: number;
}

// ==================== 状态变更日志 ====================

/**
 * 预约操作日志
 */
export interface AppointmentLog {
  id: string;
  appointmentId: string;
  action: 'CREATE' | 'CANCEL' | 'COMPLETE' | 'UPDATE';
  fromStatus?: AppointmentStatusType;
  toStatus?: AppointmentStatusType;
  timestamp: string;
  details?: string;
}

const LOG_STORAGE_KEY = 'asdm_appointment_logs';

function getLogsFromStorage(): AppointmentLog[] {
  const data = localStorage.getItem(LOG_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLogsToStorage(logs: AppointmentLog[]): void {
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
}

/**
 * 添加状态变更日志
 */
function addLog(
  appointmentId: string,
  action: AppointmentLog['action'],
  fromStatus?: AppointmentStatusType,
  toStatus?: AppointmentStatusType,
  details?: string
): void {
  const logs = getLogsFromStorage();
  logs.push({
    id: generateId(),
    appointmentId,
    action,
    fromStatus,
    toStatus,
    timestamp: new Date().toISOString(),
    details
  });
  // 只保留最近 1000 条日志
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }
  saveLogsToStorage(logs);
}

/**
 * 获取预约的操作日志
 */
export function getAppointmentLogs(appointmentId: string): AppointmentLog[] {
  return getLogsFromStorage().filter(log => log.appointmentId === appointmentId);
}

// ==================== 号源锁定机制 ====================

const LOCK_TIMEOUT = 30000; // 锁超时 30 秒

/**
 * 生成锁 key
 */
function getLockKey(doctorId: string, date: string, timeSlot: string): string {
  return `${doctorId}-${date}-${timeSlot}`;
}

/**
 * 获取所有锁
 */
function getLocksFromStorage(): SlotLock[] {
  const data = localStorage.getItem(STORAGE_KEYS.LOCKS);
  const locks: SlotLock[] = data ? JSON.parse(data) : [];
  const now = Date.now();
  
  // 清理过期锁
  const validLocks = locks.filter(lock => now - lock.timestamp < LOCK_TIMEOUT);
  if (validLocks.length !== locks.length) {
    localStorage.setItem(STORAGE_KEYS.LOCKS, JSON.stringify(validLocks));
  }
  
  return validLocks;
}

/**
 * 保存锁
 */
function saveLocksToStorage(locks: SlotLock[]): void {
  localStorage.setItem(STORAGE_KEYS.LOCKS, JSON.stringify(locks));
}

/**
 * 尝试获取号源锁
 * @returns true 获取成功，false 锁已被占用
 */
export function acquireLock(doctorId: string, date: string, timeSlot: string): boolean {
  const locks = getLocksFromStorage();
  const key = getLockKey(doctorId, date, timeSlot);
  
  const existingLock = locks.find(l => l.key === key);
  if (existingLock) {
    // 检查锁是否过期
    if (Date.now() - existingLock.timestamp < LOCK_TIMEOUT) {
      return false; // 锁仍有效
    }
  }
  
  // 获取新锁
  locks.push({ key, timestamp: Date.now() });
  saveLocksToStorage(locks);
  return true;
}

/**
 * 释放号源锁
 */
export function releaseLock(doctorId: string, date: string, timeSlot: string): void {
  const locks = getLocksFromStorage();
  const key = getLockKey(doctorId, date, timeSlot);
  const filtered = locks.filter(l => l.key !== key);
  saveLocksToStorage(filtered);
}

// ==================== 存储操作函数 ====================

/**
 * 生成唯一ID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 获取所有排班数据
 */
function getSchedulesFromStorage(): Schedule[] {
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
  return data ? JSON.parse(data) : [];
}

/**
 * 保存排班数据到存储
 */
function saveSchedulesToStorage(schedules: Schedule[]): void {
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
}

/**
 * 获取所有预约数据
 */
function getAppointmentsFromStorage(): Appointment[] {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
}

/**
 * 保存预约数据到存储
 */
function saveAppointmentsToStorage(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

// ==================== 排班 CRUD 操作 ====================

/**
 * 号源可用性检查结果
 */
export interface AvailabilityResult {
  available: boolean;
  schedule: Schedule | null;
  remainingSlots: number;
  reason?: string;
}

/**
 * 检查指定排班是否可预约
 * @param scheduleId 排班ID
 */
export function checkAvailability(scheduleId: string): AvailabilityResult {
  const schedules = getSchedulesFromStorage();
  const schedule = schedules.find(s => s.id === scheduleId);
  
  if (!schedule) {
    return {
      available: false,
      schedule: null,
      remainingSlots: 0,
      reason: '排班不存在'
    };
  }
  
  if (!schedule.isOpen) {
    return {
      available: false,
      schedule,
      remainingSlots: schedule.totalSlots - schedule.bookedSlots,
      reason: '该时段暂未开放预约'
    };
  }
  
  const remainingSlots = schedule.totalSlots - schedule.bookedSlots;
  
  if (remainingSlots <= 0) {
    return {
      available: false,
      schedule,
      remainingSlots: 0,
      reason: '号源已约满'
    };
  }
  
  return {
    available: true,
    schedule,
    remainingSlots
  };
}

/**
 * 检查指定医生日期时段的号源
 * @param doctorId 医生ID
 * @param date 日期
 * @param timeSlot 时段
 */
export function checkSlotAvailability(
  _doctorId: string,
  date: string,
  timeSlot: TimeSlotType
): AvailabilityResult {
  const schedules = getSchedulesFromStorage();
  const schedule = schedules.find(
    s => s.doctorId === _doctorId && s.date === date && s.timeSlot === timeSlot
  );
  
  if (!schedule) {
    return {
      available: false,
      schedule: null,
      remainingSlots: 0,
      reason: '该时段暂无排班'
    };
  }
  
  return checkAvailability(schedule.id);
}

/**
 * 获取指定医生的指定日期排班
 * @param doctorId 医生ID
 * @param date 日期 (YYYY-MM-DD)
 */
export function getSchedules(doctorId: string, date: string): Schedule[] {
  const schedules = getSchedulesFromStorage();
  return schedules.filter(s => s.doctorId === doctorId && s.date === date);
}

/**
 * 获取指定医生的所有排班
 * @param doctorId 医生ID
 */
export function getDoctorSchedules(doctorId: string): Schedule[] {
  const schedules = getSchedulesFromStorage();
  return schedules.filter(s => s.doctorId === doctorId);
}

/**
 * 获取指定日期的所有排班
 * @param date 日期 (YYYY-MM-DD)
 */
export function getDateSchedules(date: string): Schedule[] {
  const schedules = getSchedulesFromStorage();
  return schedules.filter(s => s.date === date);
}

/**
 * 保存排班
 * @param schedule 排班数据
 * @returns 保存后的排班（含ID）
 */
export function saveSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Schedule {
  const schedules = getSchedulesFromStorage();
  const now = new Date().toISOString();
  
  const newSchedule: Schedule = {
    ...schedule,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  };
  
  schedules.push(newSchedule);
  saveSchedulesToStorage(schedules);
  
  return newSchedule;
}

/**
 * 更新排班
 * @param id 排班ID
 * @param updates 更新的字段
 * @returns 更新后的排班，null表示未找到
 */
export function updateSchedule(id: string, updates: Partial<Omit<Schedule, 'id' | 'createdAt'>>): Schedule | null {
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  schedules[index] = {
    ...schedules[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveSchedulesToStorage(schedules);
  return schedules[index];
}

/**
 * 删除排班
 * @param id 排班ID
 */
export function deleteSchedule(id: string): boolean {
  const schedules = getSchedulesFromStorage();
  const filtered = schedules.filter(s => s.id !== id);
  
  if (filtered.length === schedules.length) return false;
  
  saveSchedulesToStorage(filtered);
  return true;
}

/**
 * 预约号源（增加已预约数）
 * @param scheduleId 排班ID
 * @returns 更新后的排班，null表示未找到或号源不足
 */
export function bookSlot(scheduleId: string): Schedule | null {
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex(s => s.id === scheduleId);
  
  if (index === -1) return null;
  
  const schedule = schedules[index];
  if (schedule.bookedSlots >= schedule.totalSlots) return null;
  if (!schedule.isOpen) return null;
  
  schedules[index] = {
    ...schedule,
    bookedSlots: schedule.bookedSlots + 1,
    updatedAt: new Date().toISOString()
  };
  
  saveSchedulesToStorage(schedules);
  return schedules[index];
}

/**
 * 释放号源（减少已预约数）
 * @param scheduleId 排班ID
 */
export function releaseSlot(scheduleId: string): Schedule | null {
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex(s => s.id === scheduleId);
  
  if (index === -1) return null;
  
  const schedule = schedules[index];
  if (schedule.bookedSlots <= 0) return null;
  
  schedules[index] = {
    ...schedule,
    bookedSlots: Math.max(0, schedule.bookedSlots - 1),
    updatedAt: new Date().toISOString()
  };
  
  saveSchedulesToStorage(schedules);
  return schedules[index];
}

// ==================== 预约 CRUD 操作 ====================

/**
 * 获取患者的预约记录
 * @param patientId 患者ID
 * @returns 预约记录列表
 */
export function getAppointments(patientId: string): Appointment[] {
  const appointments = getAppointmentsFromStorage();
  return appointments.filter(a => a.patientId === patientId);
}

/**
 * 获取患者的指定状态预约记录
 * @param patientId 患者ID
 * @param status 预约状态
 */
export function getAppointmentsByStatus(patientId: string, status: AppointmentStatusType): Appointment[] {
  const appointments = getAppointmentsFromStorage();
  return appointments.filter(a => a.patientId === patientId && a.status === status);
}

/**
 * 获取医生的预约记录
 * @param doctorId 医生ID
 */
export function getDoctorAppointments(doctorId: string): Appointment[] {
  const appointments = getAppointmentsFromStorage();
  return appointments.filter(a => a.doctorId === doctorId);
}

/**
 * 获取指定日期的医生预约
 * @param doctorId 医生ID
 * @param date 日期 (YYYY-MM-DD)
 */
export function getDoctorAppointmentsByDate(doctorId: string, date: string): Appointment[] {
  const appointments = getAppointmentsFromStorage();
  return appointments.filter(a => a.doctorId === doctorId && a.appointmentDate === date);
}

/**
 * 创建预约
 * @param input 预约输入数据
 * @returns 创建的预约记录
 */
export function createAppointment(input: CreateAppointmentInput): Appointment {
  const appointments = getAppointmentsFromStorage();
  const now = new Date().toISOString();
  
  const newAppointment: Appointment = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  };
  
  appointments.push(newAppointment);
  saveAppointmentsToStorage(appointments);
  
  // 同时更新排班的已预约数
  bookSlot(input.scheduleId);
  
  return newAppointment;
}

/**
 * 更新预约状态
 * @param id 预约ID
 * @param status 新状态
 * @returns 更新后的预约
 */
export function updateAppointmentStatus(id: string, status: AppointmentStatusType): Appointment | null {
  const appointments = getAppointmentsFromStorage();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  appointments[index] = {
    ...appointments[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  saveAppointmentsToStorage(appointments);
  return appointments[index];
}

/**
 * 获取预约详情
 * @param id 预约ID
 */
export function getAppointmentById(id: string): Appointment | null {
  const appointments = getAppointmentsFromStorage();
  return appointments.find(a => a.id === id) || null;
}

/**
 * 检查是否可预约（防止重复预约）
 * @param patientId 患者ID
 * @param doctorId 医生ID
 * @param scheduleId 排班ID
 */
export function canBookAppointment(patientId: string, doctorId: string, scheduleId: string): boolean {
  const appointments = getAppointmentsFromStorage();
  
  // 检查是否有相同患者的相同排班待就诊预约
  const existing = appointments.find(
    a => a.patientId === patientId 
      && a.scheduleId === scheduleId 
      && a.status === AppointmentStatus.PENDING
  );
  
  return !existing;
}

// ==================== 预约状态变更操作 ====================

/**
 * 完成就诊
 * @param id 预约ID
 * @returns 完成后的预约，null表示未找到或状态不允许
 */
export function completeAppointment(id: string): Appointment | null {
  const appointments = getAppointmentsFromStorage();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  const appointment = appointments[index];
  
  // 只能完成待就诊的预约
  if (appointment.status !== AppointmentStatus.PENDING) {
    return null;
  }
  
  const oldStatus = appointment.status;
  appointments[index] = {
    ...appointment,
    status: AppointmentStatus.COMPLETED,
    updatedAt: new Date().toISOString()
  };
  
  saveAppointmentsToStorage(appointments);
  
  // 添加状态变更日志
  addLog(id, 'COMPLETE', oldStatus, AppointmentStatus.COMPLETED, '医生确认就诊完成');
  
  return appointments[index];
}

/**
 * 取消预约（增强版）
 * @param id 预约ID
 * @param reason 取消原因（可选）
 * @returns 取消后的预约，null表示未找到或状态不允许
 */
export function cancelAppointment(id: string, reason?: string): Appointment | null {
  const appointments = getAppointmentsFromStorage();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  const appointment = appointments[index];
  
  // 只能取消待就诊的预约
  if (appointment.status !== AppointmentStatus.PENDING) {
    return null;
  }
  
  const oldStatus = appointment.status;
  appointments[index] = {
    ...appointment,
    status: AppointmentStatus.CANCELLED,
    updatedAt: new Date().toISOString()
  };
  
  saveAppointmentsToStorage(appointments);
  
  // 释放号源
  releaseSlot(appointment.scheduleId);
  
  // 添加状态变更日志
  addLog(
    id, 
    'CANCEL', 
    oldStatus, 
    AppointmentStatus.CANCELLED, 
    reason || '用户取消预约'
  );
  
  return appointments[index];
}

/**
 * 验证状态流转是否合法
 * @param currentStatus 当前状态
 * @param newStatus 新状态
 */
export function canTransitionStatus(
  currentStatus: AppointmentStatusType,
  newStatus: AppointmentStatusType
): boolean {
  // 定义合法状态流转
  const validTransitions: Record<AppointmentStatusType, AppointmentStatusType[]> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.COMPLETED]: [], // 已完成不能流转
    [AppointmentStatus.CANCELLED]: []   // 已取消不能流转
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

// ==================== 初始化数据 ====================

/**
 * 初始化示例排班数据
 */
export function initializeSampleSchedules(): void {
  const existing = getSchedulesFromStorage();
  
  // 版本检查：如果数据是旧版本（含随机 bookedSlots），清除并重新生成
  const version = localStorage.getItem('asdm_schedules_version');
  if (existing.length > 0 && version === '2') return;
  
  // 清除旧数据重新生成
  localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  localStorage.setItem('asdm_schedules_version', '2');
  
  const today = new Date();
  const doctors = ['doc001', 'doc002', 'doc003'];
  
  const schedules: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  // 为每个医生创建未来7天的排班
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const doctorId of doctors) {
      // 每个医生每天上午和下午有排班
      schedules.push({
        doctorId,
        date: dateStr,
        timeSlot: TimeSlot.MORNING,
        totalSlots: 10,
        bookedSlots: 0,
        isOpen: true
      });
      
      schedules.push({
        doctorId,
        date: dateStr,
        timeSlot: TimeSlot.AFTERNOON,
        totalSlots: 8,
        bookedSlots: 0,
        isOpen: true
      });
    }
  }
  
  schedules.forEach(s => saveSchedule(s));
}

// ==================== 导出存储键（供调试使用） ====================

export const STORAGE_KEYS_EXPORT = STORAGE_KEYS;
