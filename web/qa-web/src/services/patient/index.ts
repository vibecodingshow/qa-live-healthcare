// 就诊人相关API服务
import type { 
  Patient, 
  PatientListResponse, 
  PatientDetailResponse, 
  CreatePatientRequest, 
  UpdatePatientRequest, 
  PatientFormData, 
  PatientFormErrors, 
  PatientValidationResult 
} from './types'

// 模拟数据 - 就诊人列表
const mockPatients: Patient[] = [
  {
    id: '1',
    name: '张三',
    idCard: '110101199001011234',
    phone: '13800138000',
    relation: 'self',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '李四',
    idCard: '110101198502021234',
    phone: '13800138001',
    relation: 'family',
    isDefault: false,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '王五',
    idCard: '110101199512031234',
    phone: '13800138002',
    relation: 'other',
    relationName: '朋友',
    isDefault: false,
    createdAt: '2024-01-03T00:00:00Z'
  }
]

// 获取就诊人列表
export async function getPatientList(params?: { search?: string }): Promise<PatientListResponse> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredPatients = mockPatients
  
  // 如果有搜索条件，过滤就诊人
  if (params?.search) {
    const searchQuery = params.search.toLowerCase()
    filteredPatients = mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchQuery) ||
      patient.idCard.includes(searchQuery) ||
      patient.phone.includes(searchQuery)
    )
  }
  
  return {
    patients: filteredPatients,
    total: filteredPatients.length
  }
}

// 获取就诊人详情
export async function getPatientDetail(patientId: string): Promise<PatientDetailResponse> {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const patient = mockPatients.find(p => p.id === patientId)
  if (!patient) {
    throw new Error('就诊人不存在')
  }
  
  return { patient }
}

// 新增就诊人
export async function createPatient(data: CreatePatientRequest): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 检查身份证号是否已存在
  const existingPatient = mockPatients.find(p => p.idCard === data.idCard)
  if (existingPatient) {
    throw new Error('该身份证号已存在')
  }
  
  const newPatient: Patient = {
    id: Date.now().toString(),
    name: data.name,
    idCard: data.idCard,
    phone: data.phone,
    relation: data.relation,
    relationName: data.relationName,
    isDefault: false, // 新增就诊人不设为默认
    createdAt: new Date().toISOString()
  }
  
  // 模拟添加到列表
  mockPatients.push(newPatient)
  
  return newPatient
}

// 更新就诊人
export async function updatePatient(patientId: string, data: UpdatePatientRequest): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const patientIndex = mockPatients.findIndex(p => p.id === patientId)
  if (patientIndex === -1) {
    throw new Error('就诊人不存在')
  }
  
  // 更新就诊人信息
  mockPatients[patientIndex] = {
    ...mockPatients[patientIndex],
    ...data,
    updatedAt: new Date().toISOString()
  }
  
  return mockPatients[patientIndex]
}

// 删除就诊人
export async function deletePatient(patientId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const patientIndex = mockPatients.findIndex(p => p.id === patientId)
  if (patientIndex === -1) {
    throw new Error('就诊人不存在')
  }
  
  // 不能删除默认就诊人
  if (mockPatients[patientIndex].isDefault) {
    throw new Error('不能删除默认就诊人')
  }
  
  // 模拟删除
  mockPatients.splice(patientIndex, 1)
}

// 设置默认就诊人
export async function setDefaultPatient(patientId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // 重置所有就诊人的默认状态
  mockPatients.forEach(patient => {
    patient.isDefault = patient.id === patientId
  })
}

// 验证就诊人表单数据
export function validatePatientForm(formData: PatientFormData): PatientValidationResult {
  const errors: PatientFormErrors = {}
  
  // 验证姓名
  if (!formData.name?.trim()) {
    errors.name = '请输入就诊人姓名'
  } else if (formData.name.trim().length < 2) {
    errors.name = '姓名至少需要2个字符'
  } else if (!/^[\u4e00-\u9fa5a-zA-Z\s·]+$/.test(formData.name.trim())) {
    errors.name = '姓名只能包含中文、英文、空格和中间点'
  }
  
  // 验证身份证号
  if (!formData.idCard?.trim()) {
    errors.idCard = '请输入身份证号'
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard.trim())) {
    errors.idCard = '请输入正确的身份证号'
  }
  
  // 验证手机号
  if (!formData.phone?.trim()) {
    errors.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone.trim())) {
    errors.phone = '请输入正确的手机号'
  }
  
  // 验证关系
  if (!formData.relation) {
    errors.relation = '请选择与就诊人的关系'
  }
  
  // 如果关系为"其他"，需要填写关系名称
  if (formData.relation === 'other' && !formData.relationName?.trim()) {
    errors.relationName = '请输入其他关系说明'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 导出就诊人服务
export default {
  getPatientList,
  getPatientDetail,
  createPatient,
  updatePatient,
  deletePatient,
  setDefaultPatient,
  validatePatientForm
}