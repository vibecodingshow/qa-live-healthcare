// 预约信息确认页面类型定义

export interface AppointmentConfirmData {
  doctorInfo: {
    id: string
    name: string
    title: string
    department: string
    avatar?: string
  }
  timeSlot: {
    date: string
    time: string
    slotId: string
    scheduleId: string
  }
  patientInfo: {
    id?: string
    name: string
    idCard: string
    phone: string
    relation?: string
    relationName?: string
  }
  appointmentInfo: {
    visitType: 'first' | 'followup'
    symptoms?: string
  }
}

export interface AppointmentConfirmRules {
  title: string
  content: string
  isImportant?: boolean
}

export interface AppointmentConfirmResponse {
  appointmentId: string
  appointmentNumber: string
  status: 'pending' | 'confirmed' | 'cancelled'
  message?: string
}

export interface AppointmentConfirmRequest {
  doctorId: string
  scheduleId: string
  timeSlotId: string
  patientName: string
  patientIdCard: string
  patientPhone: string
  visitType: 'first' | 'followup'
  symptoms?: string
}

// 预约规则列表
export const APPOINTMENT_RULES: AppointmentConfirmRules[] = [
  {
    title: '身份证件要求',
    content: '请务必携带有效身份证件（身份证、护照等）就诊',
    isImportant: true
  },
  {
    title: '就诊时间',
    content: '建议提前15分钟到达医院，避免错过预约时段'
  },
  {
    title: '取消预约',
    content: '如需取消预约，请至少提前24小时操作'
  },
  {
    title: '迟到处理',
    content: '迟到超过15分钟，预约可能被取消，需要重新预约'
  },
  {
    title: '医保使用',
    content: '如需使用医保，请携带医保卡及相关证件'
  },
  {
    title: '特殊情况',
    content: '如遇紧急情况，请及时联系医院客服电话：400-123-4567'
  }
]