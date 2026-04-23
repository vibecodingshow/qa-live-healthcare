/**
 * 预约相关 API 服务
 */
import type {
  AppointmentSubmitRequest,
  AppointmentSubmitResponse,
  AppointmentValidationResult
} from './types'

// 后端API基础URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080'

/** 模拟 API 延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 提交预约（与后端API集成）
 */
export async function submitAppointment(
  request: AppointmentSubmitRequest
): Promise<AppointmentSubmitResponse> {
  try {
    // 调用后端API提交预约
    const response = await fetch(`${API_BASE_URL}/api/appointments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errorMessage || `HTTP error! status: ${response.status}`)
    }

    const result: AppointmentSubmitResponse = await response.json()
    
    if (!result.success) {
      throw new Error(result.errorMessage || '预约提交失败')
    }

    return result

  } catch (error) {
    console.error('提交预约失败:', error)
    
    // 如果后端API调用失败，使用模拟数据作为降级方案
    if (process.env.NODE_ENV === 'development') {
      console.warn('使用模拟数据作为降级方案')
      return await submitAppointmentMock(request)
    }
    
    throw error
  }
}

/**
 * 模拟提交预约（开发环境降级方案）
 */
async function submitAppointmentMock(request: AppointmentSubmitRequest): Promise<AppointmentSubmitResponse> {
  await delay(1000)

  // 模拟预约提交逻辑
  const appointmentId = `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const appointmentNumber = `A${Math.random().toString().substr(2, 6)}`

  // 模拟根据时段ID获取预约时间
  const timeSlots = {
    's1': '2026-04-23 08:00-12:00',
    's2': '2026-04-23 14:00-18:00',
    's3': '2026-04-23 08:00-12:00',
    's4': '2026-04-23 14:00-18:00',
    's5': '2026-04-23 08:00-12:00',
    's6': '2026-04-24 08:00-12:00',
    's7': '2026-04-23 08:00-12:00',
    's8': '2026-04-23 14:00-18:00'
  }

  // 模拟医生信息
  const doctors = {
    'd001': { name: '张医生', department: '内科', hospital: '第一医院' },
    'd002': { name: '李医生', department: '外科', hospital: '第一医院' },
    'd003': { name: '王医生', department: '儿科', hospital: '第一医院' },
    'd004': { name: '赵医生', department: '妇产科', hospital: '第一医院' },
    'd005': { name: '刘医生', department: '内科', hospital: '第二医院' }
  }

  const doctorInfo = doctors[request.doctorId as keyof typeof doctors] || 
    { name: '未知医生', department: '未知科室', hospital: '未知医院' }

  return {
    success: true,
    appointmentId,
    appointmentNumber,
    appointmentTime: timeSlots[request.timeSlotId as keyof typeof timeSlots] || '未知时间',
    doctorName: doctorInfo.name,
    department: doctorInfo.department,
    hospital: doctorInfo.hospital,
    status: 'pending',
    paymentRequired: request.visitType === 'first',
    paymentAmount: request.visitType === 'first' ? 5000 : undefined,
    paymentOrderId: request.visitType === 'first' ? `pay_${Date.now()}` : undefined,
    paymentUrl: request.visitType === 'first' ? '/payment/pay' : undefined
  }
}

/**
 * 验证预约表单数据
 */
export function validateAppointmentForm(formData: any): AppointmentValidationResult {
  const errors: Record<string, string> = {}

  // 验证患者姓名
  if (!formData.patientName?.trim()) {
    errors.patientName = '请输入患者姓名'
  } else if (formData.patientName.trim().length < 2) {
    errors.patientName = '姓名至少需要2个字符'
  } else if (!/^[\u4e00-\u9fa5a-zA-Z\s·]+$/.test(formData.patientName.trim())) {
    errors.patientName = '姓名只能包含中文、英文、空格和中间点'
  }

  // 验证身份证号
  if (!formData.patientIdCard?.trim()) {
    errors.patientIdCard = '请输入身份证号'
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.patientIdCard.trim())) {
    errors.patientIdCard = '请输入正确的身份证号'
  }

  // 验证手机号
  if (!formData.patientPhone?.trim()) {
    errors.patientPhone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(formData.patientPhone.trim())) {
    errors.patientPhone = '请输入正确的手机号'
  }

  // 验证预约时段
  if (!formData.appointmentTimeSlotId) {
    errors.appointmentTimeSlotId = '请选择预约时段'
  }

  // 验证就诊类型
  if (!formData.visitType) {
    errors.visitType = '请选择就诊类型'
  }

  // 验证医生ID
  if (!formData.doctorId) {
    errors.doctorId = '医生信息不能为空'
  }

  // 验证排班ID
  if (!formData.scheduleId) {
    errors.scheduleId = '排班信息不能为空'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 检查时段可用性
 */
export async function checkSlotAvailability(slotId: string): Promise<boolean> {
  await delay(200)
  
  // 模拟时段可用性检查
  const unavailableSlots = ['s3', 's6'] // 模拟已满的时段
  return !unavailableSlots.includes(slotId)
}

/**
 * 获取预约详情
 */
export async function getAppointmentDetail(appointmentId: string): Promise<AppointmentSubmitResponse | null> {
  await delay(300)
  
  // 模拟获取预约详情
  if (appointmentId.startsWith('appt_')) {
    return {
      appointmentId,
      appointmentNumber: 'A123456',
      appointmentTime: '2026-04-23 08:00-12:00',
      doctorName: '张医生',
      department: '内科',
      hospital: '第一医院',
      status: 'pending'
    }
  }
  
  return null
}