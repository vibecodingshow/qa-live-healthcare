/**
 * 预约相关类型定义
 */

/** 就诊类型 */
export enum VisitType {
  /** 初诊 */
  FIRST = 'first',
  /** 复诊 */
  FOLLOWUP = 'followup'
}

/** 预约表单数据 */
export interface AppointmentFormData {
  /** 患者姓名 */
  patientName: string
  /** 身份证号 */
  patientIdCard: string
  /** 手机号 */
  patientPhone: string
  /** 预约时段ID */
  appointmentTimeSlotId: string
  /** 就诊类型 */
  visitType: VisitType
  /** 症状描述（可选） */
  symptoms?: string
  /** 医生ID */
  doctorId: string
  /** 排班ID */
  scheduleId: string
}

/** 预约表单验证错误 */
export interface AppointmentFormErrors {
  patientName?: string
  patientIdCard?: string
  patientPhone?: string
  appointmentTimeSlotId?: string
  visitType?: string
  symptoms?: string
}

/** 预约提交请求 */
export interface AppointmentSubmitRequest {
  /** 排班ID */
  scheduleId: string
  /** 时段ID */
  timeSlotId: string
  /** 患者姓名 */
  patientName: string
  /** 患者身份证号 */
  patientIdCard: string
  /** 患者手机号 */
  patientPhone: string
  /** 就诊类型 */
  visitType: VisitType
  /** 症状描述 */
  symptoms?: string
  /** 医生ID */
  doctorId: string
  /** 预约锁定令牌（可选） */
  lockToken?: string
}

/** 预约提交响应 */
export interface AppointmentSubmitResponse {
  /** 是否成功 */
  success: boolean
  /** 错误信息 */
  errorMessage?: string
  /** 预约ID */
  appointmentId: string
  /** 预约号 */
  appointmentNumber: string
  /** 预约状态 */
  status: string
  /** 预约时间 */
  appointmentTime?: string
  /** 医生姓名 */
  doctorName?: string
  /** 科室 */
  department?: string
  /** 医院 */
  hospital?: string
  /** 是否需要支付 */
  paymentRequired?: boolean
  /** 支付金额（分） */
  paymentAmount?: number
  /** 支付订单号 */
  paymentOrderId?: string
  /** 支付链接 */
  paymentUrl?: string
  /** 创建时间 */
  createTime?: string
}

/** 预约验证结果 */
export interface AppointmentValidationResult {
  /** 是否有效 */
  isValid: boolean
  /** 错误信息 */
  errors: AppointmentFormErrors
}

/** 预约表单状态 */
export interface AppointmentFormState {
  /** 表单数据 */
  formData: AppointmentFormData
  /** 验证错误 */
  errors: AppointmentFormErrors
  /** 是否正在提交 */
  isSubmitting: boolean
  /** 是否已提交 */
  isSubmitted: boolean
  /** 提交结果 */
  submitResult?: AppointmentSubmitResponse
}