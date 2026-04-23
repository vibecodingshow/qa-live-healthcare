<template>
  <a-modal
    :visible="props.visible"
    :title="modalTitle"
    :width="600"
    :footer="null"
    :mask-closable="false"
    :keyboard="false"
    @cancel="handleCancel"
    @ok="handleSubmit"
    class="patient-form-modal"
  >
    <!-- 表单内容 -->
    <div class="patient-form">
      <!-- 基本信息 -->
      <div class="form-section">
        <h4 class="section-title">基本信息</h4>
        
        <!-- 姓名 -->
        <div class="form-item">
          <label class="form-label required">姓名</label>
          <a-input
            v-model:value="formData.name"
            placeholder="请输入就诊人姓名"
            :max-length="50"
            @blur="validateName"
            :status="errors.name ? 'error' : ''"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <!-- 身份证号 -->
        <div class="form-item">
          <label class="form-label required">身份证号</label>
          <a-input
            v-model:value="formData.idCard"
            placeholder="请输入身份证号"
            :max-length="18"
            @blur="validateIdCard"
            :status="errors.idCard ? 'error' : ''"
            :disabled="mode === 'edit'"
          />
          <div v-if="errors.idCard" class="error-message">{{ errors.idCard }}</div>
          <div v-if="mode === 'edit'" class="field-note">身份证号不可修改</div>
        </div>

        <!-- 手机号 -->
        <div class="form-item">
          <label class="form-label required">手机号</label>
          <a-input
            v-model:value="formData.phone"
            placeholder="请输入手机号"
            :max-length="11"
            @blur="validatePhone"
            :status="errors.phone ? 'error' : ''"
          />
          <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
        </div>
      </div>

      <!-- 关系选择 -->
      <div class="form-section">
        <h4 class="section-title">关系</h4>
        
        <!-- 关系选择 -->
        <div class="form-item">
          <label class="form-label required">与就诊人的关系</label>
          <a-radio-group 
            v-model:value="formData.relation" 
            class="relation-group"
            @change="handleRelationChange"
          >
            <a-radio value="self">本人</a-radio>
            <a-radio value="family">家人</a-radio>
            <a-radio value="other">其他</a-radio>
          </a-radio-group>
          <div v-if="errors.relation" class="error-message">{{ errors.relation }}</div>
        </div>

        <!-- 其他关系说明 -->
        <div v-if="formData.relation === 'other'" class="form-item">
          <label class="form-label required">其他关系说明</label>
          <a-input
            v-model:value="formData.relationName"
            placeholder="请输入关系说明，如：朋友、同事等"
            :max-length="20"
            @blur="validateRelationName"
            :status="errors.relationName ? 'error' : ''"
          />
          <div v-if="errors.relationName" class="error-message">{{ errors.relationName }}</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <a-button @click="handleCancel" class="cancel-btn">取消</a-button>
        <a-button
          type="primary"
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          class="submit-btn"
        >
          {{ isSubmitting ? '提交中...' : submitButtonText }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { Patient, PatientFormData, PatientFormErrors } from '@/services/patient/types'
import { createPatient, updatePatient, validatePatientForm } from '@/services/patient'

// 组件属性
interface Props {
  visible: boolean
  patient?: Patient | null
  mode: 'add' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  patient: null,
  mode: 'add'
})

// 组件事件
const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'success': []
  'cancel': []
}>()

// 状态管理
const isSubmitting = ref(false)
const formData = reactive<PatientFormData>({
  name: '',
  idCard: '',
  phone: '',
  relation: 'self',
  relationName: ''
})

const errors = reactive<PatientFormErrors>({})

// 计算属性
const modalTitle = computed(() => {
  return props.mode === 'add' ? '新增就诊人' : '编辑就诊人信息'
})

const submitButtonText = computed(() => {
  return props.mode === 'add' ? '新增就诊人' : '保存修改'
})

const isFormValid = computed(() => {
  return (
    formData.name.trim() &&
    formData.idCard.trim() &&
    formData.phone.trim() &&
    formData.relation &&
    (formData.relation !== 'other' || formData.relationName?.trim()) &&
    Object.values(errors).every(error => !error)
  )
})

// 监听属性变化
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    // 初始化表单数据
    initializeFormData()
    // 清除错误
    clearErrors()
  }
})

watch(() => props.patient, (newPatient) => {
  if (props.visible && newPatient) {
    initializeFormData()
  }
})

// 初始化表单数据
function initializeFormData() {
  if (props.mode === 'edit' && props.patient) {
    // 编辑模式，填充就诊人数据
    formData.name = props.patient.name
    formData.idCard = props.patient.idCard
    formData.phone = props.patient.phone
    formData.relation = props.patient.relation
    formData.relationName = props.patient.relationName || ''
  } else {
    // 新增模式，重置表单
    formData.name = ''
    formData.idCard = ''
    formData.phone = ''
    formData.relation = 'self'
    formData.relationName = ''
  }
}

// 表单验证方法
function validateName() {
  const name = formData.name.trim()
  if (!name) {
    errors.name = '请输入就诊人姓名'
  } else if (name.length < 2) {
    errors.name = '姓名至少需要2个字符'
  } else if (!/^[\u4e00-\u9fa5a-zA-Z\s·]+$/.test(name)) {
    errors.name = '姓名只能包含中文、英文、空格和中间点'
  } else {
    delete errors.name
  }
}

function validateIdCard() {
  const idCard = formData.idCard.trim()
  if (!idCard) {
    errors.idCard = '请输入身份证号'
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCard)) {
    errors.idCard = '请输入正确的身份证号'
  } else {
    delete errors.idCard
  }
}

function validatePhone() {
  const phone = formData.phone.trim()
  if (!phone) {
    errors.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    errors.phone = '请输入正确的手机号'
  } else {
    delete errors.phone
  }
}

function validateRelationName() {
  if (formData.relation === 'other' && !formData.relationName?.trim()) {
    errors.relationName = '请输入其他关系说明'
  } else {
    delete errors.relationName
  }
}

// 处理关系变化
function handleRelationChange() {
  if (formData.relation !== 'other') {
    formData.relationName = ''
    delete errors.relationName
  }
}

// 清除所有错误
function clearErrors() {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof PatientFormErrors]
  })
}

// 提交表单
async function handleSubmit() {
  // 验证所有字段
  validateName()
  validateIdCard()
  validatePhone()
  
  if (!formData.relation) {
    errors.relation = '请选择与就诊人的关系'
  }
  
  if (formData.relation === 'other' && !formData.relationName?.trim()) {
    errors.relationName = '请输入其他关系说明'
  }

  // 如果有错误，不提交
  if (Object.keys(errors).length > 0) {
    return
  }

  isSubmitting.value = true

  try {
    // 使用就诊人服务验证表单数据
    const validationResult = validatePatientForm(formData)
    if (!validationResult.isValid) {
      Object.assign(errors, validationResult.errors)
      return
    }

    // 提交数据
    if (props.mode === 'add') {
      await createPatient(formData)
      message.success('就诊人添加成功')
    } else {
      if (!props.patient) return
      await updatePatient(props.patient.id, formData)
      message.success('就诊人信息更新成功')
    }

    // 触发成功事件
    emit('success')
    emit('update:visible', false)
  } catch (err) {
    console.error('提交就诊人信息失败:', err)
    message.error(err instanceof Error ? err.message : '提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 取消操作
function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.patient-form-modal {
  :deep(.ant-modal-body) {
    padding: 24px;
  }
}

.patient-form {
  width: 100%;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-label.required::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.relation-group {
  display: flex;
  gap: 24px;
}

.field-note {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
}

.cancel-btn {
  min-width: 80px;
}

.submit-btn {
  min-width: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .patient-form-modal {
    :deep(.ant-modal) {
      width: 90vw !important;
      max-width: 400px;
    }
  }
  
  .relation-group {
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