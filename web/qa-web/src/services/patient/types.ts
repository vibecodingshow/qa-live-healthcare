// 就诊人相关类型定义

// 就诊人基本信息
export interface Patient {
  id: string
  name: string
  idCard: string
  phone: string
  relation: 'self' | 'family' | 'other'
  relationName?: string // 当relation为other时
  isDefault: boolean
  createdAt: string
  updatedAt?: string
}

// 就诊人表单数据
export interface PatientFormData {
  name: string
  idCard: string
  phone: string
  relation: 'self' | 'family' | 'other'
  relationName?: string
}

// 就诊人列表响应
export interface PatientListResponse {
  patients: Patient[]
  total: number
}

// 就诊人详情响应
export interface PatientDetailResponse {
  patient: Patient
}

// 新增就诊人请求
export interface CreatePatientRequest {
  name: string
  idCard: string
  phone: string
  relation: 'self' | 'family' | 'other'
  relationName?: string
}

// 更新就诊人请求
export interface UpdatePatientRequest {
  name?: string
  phone?: string
  relation?: 'self' | 'family' | 'other'
  relationName?: string
  isDefault?: boolean
}

// 就诊人表单验证错误
export interface PatientFormErrors {
  name?: string
  idCard?: string
  phone?: string
  relation?: string
  relationName?: string
}

// 就诊人表单验证结果
export interface PatientValidationResult {
  isValid: boolean
  errors: PatientFormErrors
}

// 就诊人选择状态
export interface PatientSelectionState {
  selectedPatient: Patient | null
  isSelecting: boolean
  searchQuery: string
}