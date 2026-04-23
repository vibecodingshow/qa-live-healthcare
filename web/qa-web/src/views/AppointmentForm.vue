<template>
  <div class="appointment-form-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a-button type="link" @click="goBack" class="back-btn">
        <template #icon><left-outlined /></template>
        返回排班列表
      </a-button>
      <h1>预约挂号</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <a-result
        status="error"
        title="加载失败"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="loadScheduleDetail">
            重新加载
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 排班不存在 -->
    <div v-else-if="!schedule" class="not-found-container">
      <a-result
        status="404"
        title="排班不存在"
        sub-title="请检查排班ID是否正确"
      >
        <template #extra>
          <a-button type="primary" @click="goBack">
            返回排班列表
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 预约表单内容 -->
    <div v-else class="appointment-content">
      <!-- 医生信息卡片 -->
      <div class="doctor-card">
        <div class="doctor-avatar">
          <a-avatar :size="64" :src="schedule.doctorAvatar" />
        </div>
        <div class="doctor-info">
          <h3 class="doctor-name">{{ schedule.doctorName }}</h3>
          <p class="doctor-department">{{ schedule.department }} - {{ schedule.title }}</p>
          <p class="doctor-hospital">{{ schedule.hospital }}</p>
          <p class="schedule-date">{{ formatScheduleDate(schedule.scheduleDate) }}</p>
        </div>
      </div>

      <!-- 预约表单 -->
      <div class="appointment-form">
        <!-- 患者信息区域 -->
        <div class="form-section">
          <h3 class="section-title">患者信息</h3>
          
          <!-- 就诊人选择 -->
          <div class="patient-selection-section">
            <div class="selection-header">
              <h4 class="selection-title">选择就诊人</h4>
              <p class="selection-description">您可以选择已有的就诊人或新增就诊人</p>
            </div>
            
            <patient-selector
              v-model="selectedPatient"
              @select="handlePatientSelect"
              class="patient-selector"
            />
          </div>

          <!-- 患者信息表单（仅在未选择就诊人时显示） -->
          <div v-if="!selectedPatient" class="patient-form-section">
            <div class="form-grid">
              <!-- 患者姓名 -->
              <div class="form-item">
                <label class="form-label required">患者姓名</label>
                <a-input
                  v-model:value="formData.patientName"
                  placeholder="请输入患者姓名"
                  :max-length="50"
                  @blur="validatePatientName"
                  :status="errors.patientName ? 'error' : ''"
                />
                <div v-if="errors.patientName" class="error-message">{{ errors.patientName }}</div>
              </div>

              <!-- 身份证号 -->
              <div class="form-item">
                <label class="form-label required">身份证号</label>
                <a-input
                  v-model:value="formData.patientIdCard"
                  placeholder="请输入身份证号"
                  :max-length="18"
                  @blur="validateIdCard"
                  :status="errors.patientIdCard ? 'error' : ''"
                />
                <div v-if="errors.patientIdCard" class="error-message">{{ errors.patientIdCard }}</div>
              </div>

              <!-- 手机号 -->
              <div class="form-item">
                <label class="form-label required">手机号</label>
                <a-input
                  v-model:value="formData.patientPhone"
                  placeholder="请输入手机号"
                  :max-length="11"
                  @blur="validatePhone"
                  :status="errors.patientPhone ? 'error' : ''"
                />
                <div v-if="errors.patientPhone" class="error-message">{{ errors.patientPhone }}</div>
              </div>
            </div>
          </div>

          <!-- 已选择就诊人信息显示 -->
          <div v-else class="selected-patient-info">
            <div class="patient-info-card">
              <div class="info-header">
                <h4 class="patient-name">{{ selectedPatient.name }}</h4>
                <a-button type="link" size="small" @click="clearPatientSelection">
                  重新选择
                </a-button>
              </div>
              <div class="info-details">
                <p class="info-item">
                  <span class="label">身份证号：</span>
                  <span class="value">{{ formatIdCard(selectedPatient.idCard) }}</span>
                </p>
                <p class="info-item">
                  <span class="label">手机号：</span>
                  <span class="value">{{ selectedPatient.phone }}</span>
                </p>
                <p class="info-item">
                  <span class="label">关系：</span>
                  <span class="value">{{ formatRelation(selectedPatient.relation, selectedPatient.relationName) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 时段选择区域 -->
        <div class="form-section">
          <h3 class="section-title">预约时段</h3>
          <TimeSlotPicker
            :slots="schedule.timeSlots"
            :selected-slot="selectedTimeSlot"
            @select="handleSlotSelect"
          />
          <div v-if="errors.appointmentTimeSlotId" class="error-message">{{ errors.appointmentTimeSlotId }}</div>
        </div>

        <!-- 就诊类型选择 -->
        <div class="form-section">
          <h3 class="section-title">就诊类型</h3>
          <a-radio-group v-model:value="formData.visitType" class="visit-type-group">
            <a-radio value="first">初诊</a-radio>
            <a-radio value="followup">复诊</a-radio>
          </a-radio-group>
        </div>

        <!-- 症状描述 -->
        <div class="form-section">
          <h3 class="section-title">症状描述（选填）</h3>
          <a-textarea
            v-model:value="formData.symptoms"
            placeholder="请简要描述您的症状或就诊需求"
            :rows="4"
            :max-length="500"
            show-count
          />
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <a-button @click="goBack" class="cancel-btn">取消</a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            class="submit-btn"
          >
            {{ isSubmitting ? '提交中...' : '提交预约' }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import type { DoctorSchedule, TimeSlot } from '@/services/schedule/types'
import type { AppointmentFormData, AppointmentFormErrors, AppointmentFormState } from '@/services/appointment/types'
import type { Patient } from '@/services/patient/types'
import { getScheduleDetail } from '@/services/schedule'
import { submitAppointment, validateAppointmentForm } from '@/services/appointment'
import TimeSlotPicker from '@/components/TimeSlotPicker/TimeSlotPicker.vue'
import PatientSelector from '@/components/PatientSelector/PatientSelector.vue'

const route = useRoute()
const router = useRouter()

// 状态管理
const loading = ref(false)
const error = ref<string | null>(null)
const schedule = ref<DoctorSchedule | null>(null)

// 就诊人选择状态
const selectedPatient = ref<Patient | null>(null)

// 表单数据
const formData = reactive<AppointmentFormData>({
  patientName: '',
  patientIdCard: '',
  patientPhone: '',
  appointmentTimeSlotId: '',
  visitType: 'first',
  symptoms: '',
  doctorId: '',
  scheduleId: ''
})

// 表单错误
const errors = reactive<AppointmentFormErrors>({})

// 表单状态
const isSubmitting = ref(false)
const isSubmitted = ref(false)

// 计算属性
const selectedTimeSlot = computed(() => {
  if (!schedule.value || !formData.appointmentTimeSlotId) {
    return null
  }
  return schedule.value.timeSlots.find(slot => slot.id === formData.appointmentTimeSlotId) || null
})

// 根据是否选择就诊人来判断表单验证
const isFormValid = computed(() => {
  if (selectedPatient.value) {
    // 已选择就诊人，只需要验证时段
    return (
      formData.appointmentTimeSlotId &&
      !Object.values(errors).some(error => !!error)
    )
  } else {
    // 未选择就诊人，需要验证所有字段
    return (
      formData.patientName.trim() &&
      formData.patientIdCard.trim() &&
      formData.patientPhone.trim() &&
      formData.appointmentTimeSlotId &&
      !Object.values(errors).some(error => !!error)
    )
  }
})

// 加载排班详情
async function loadScheduleDetail() {
  const scheduleId = route.params.scheduleId as string
  if (!scheduleId) {
    error.value = '排班ID不能为空'
    return
  }

  loading.value = true
  error.value = null

  try {
    const scheduleDetail = await getScheduleDetail(scheduleId)
    schedule.value = scheduleDetail
    
    // 初始化表单数据
    if (scheduleDetail) {
      formData.doctorId = scheduleDetail.doctorId
      formData.scheduleId = scheduleDetail.id
    }
  } catch (err) {
    console.error('获取排班详情失败:', err)
    error.value = '获取排班详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 表单验证方法
function validatePatientName() {
  const name = formData.patientName.trim()
  if (!name) {
    errors.patientName = '请输入患者姓名'
  } else if (name.length < 2) {
    errors.patientName = '姓名至少需要2个字符'
  } else if (!/^[\u4e00-\u9fa5a-zA-Z\s·]+$/.test(name)) {
    errors.patientName = '姓名只能包含中文、英文、空格和中间点'
  } else {
    delete errors.patientName
  }
}

function validateIdCard() {
  const idCard = formData.patientIdCard.trim()
  if (!idCard) {
    errors.patientIdCard = '请输入身份证号'
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCard)) {
    errors.patientIdCard = '请输入正确的身份证号'
  } else {
    delete errors.patientIdCard
  }
}

function validatePhone() {
  const phone = formData.patientPhone.trim()
  if (!phone) {
    errors.patientPhone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    errors.patientPhone = '请输入正确的手机号'
  } else {
    delete errors.patientPhone
  }
}

// 就诊人选择处理
function handlePatientSelect(patient: Patient) {
  selectedPatient.value = patient
  
  // 自动填充表单数据
  formData.patientName = patient.name
  formData.patientIdCard = patient.idCard
  formData.patientPhone = patient.phone
  
  // 清除相关错误
  delete errors.patientName
  delete errors.patientIdCard
  delete errors.patientPhone
}

// 清除就诊人选择
function clearPatientSelection() {
  selectedPatient.value = null
  
  // 清空表单数据
  formData.patientName = ''
  formData.patientIdCard = ''
  formData.patientPhone = ''
}

// 格式化身份证号（脱敏显示）
function formatIdCard(idCard: string): string {
  if (idCard.length !== 18) return idCard
  return `${idCard.substring(0, 6)}****${idCard.substring(14)}`
}

// 格式化关系显示
function formatRelation(relation: string, relationName?: string): string {
  const relationMap = {
    self: '本人',
    family: '家人',
    other: relationName || '其他'
  }
  return relationMap[relation as keyof typeof relationMap] || relation
}

// 时段选择处理
function handleSlotSelect(slot: TimeSlot) {
  formData.appointmentTimeSlotId = slot.id
  delete errors.appointmentTimeSlotId
}

// 提交表单（跳转到信息确认页面）
async function handleSubmit() {
  // 验证所有字段
  if (!selectedPatient.value) {
    // 未选择就诊人，需要验证手动输入的表单数据
    validatePatientName()
    validateIdCard()
    validatePhone()
  }
  
  if (!formData.appointmentTimeSlotId) {
    errors.appointmentTimeSlotId = '请选择预约时段'
  }

  // 如果有错误，不提交
  if (Object.keys(errors).length > 0) {
    return
  }

  // 构建确认页面需要的数据
  const confirmData = {
    doctorInfo: {
      id: formData.doctorId,
      name: schedule.value?.doctorName || '',
      title: schedule.value?.doctorTitle || '',
      department: schedule.value?.department || '',
      avatar: schedule.value?.doctorAvatar
    },
    timeSlot: {
      date: schedule.value?.date || '',
      time: selectedTimeSlot.value?.timeRange || '',
      slotId: formData.appointmentTimeSlotId,
      scheduleId: formData.scheduleId
    },
    patientInfo: {
      id: selectedPatient.value?.id,
      name: formData.patientName,
      idCard: formData.patientIdCard,
      phone: formData.patientPhone,
      relation: selectedPatient.value?.relation,
      relationName: selectedPatient.value?.relationName
    },
    appointmentInfo: {
      visitType: formData.visitType,
      symptoms: formData.symptoms
    }
  }

  // 跳转到预约信息确认页面
  router.push({
    name: 'AppointmentInfoConfirm',
    params: { 
      scheduleId: formData.scheduleId
    },
    query: {
      confirmData: JSON.stringify(confirmData)
    }
  })
}

// 返回上一页
function goBack() {
  router.back()
}

// 格式化排班日期
function formatScheduleDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 生命周期
onMounted(() => {
  loadScheduleDetail()
})
</script>

<style scoped>
.appointment-form-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn {
  margin-right: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.loading-container,
.error-container,
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.appointment-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.doctor-card {
  display: flex;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.doctor-avatar {
  margin-right: 16px;
}

.doctor-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.doctor-department {
  margin: 0 0 4px 0;
  color: #666;
  font-size: 14px;
}

.doctor-hospital,
.schedule-date {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.appointment-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

  .section-title::before {
    content: '';
    width: 4px;
    height: 16px;
    background: #1890ff;
    border-radius: 2px;
    margin-right: 8px;
  }

  .patient-selection-section {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .selection-header {
    margin-bottom: 16px;
  }

  .selection-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .selection-description {
    margin: 0;
    font-size: 14px;
    color: #666;
  }

  .patient-form-section {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
  }

  .selected-patient-info {
    margin-top: 16px;
  }

  .patient-info-card {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .patient-name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .info-details {
    margin: 0;
  }

  .info-item {
    margin: 8px 0;
    display: flex;
    align-items: center;
  }

  .info-item .label {
    min-width: 80px;
    font-weight: 500;
    color: #666;
  }

  .info-item .value {
    color: #333;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }

.form-item {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-label.required::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.visit-type-group {
  display: flex;
  gap: 24px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  min-width: 100px;
}

.submit-btn {
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .appointment-form-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .doctor-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .doctor-avatar {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .patient-selection-section {
    padding: 12px;
  }
  
  .info-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-item .label {
    min-width: auto;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .visit-type-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>