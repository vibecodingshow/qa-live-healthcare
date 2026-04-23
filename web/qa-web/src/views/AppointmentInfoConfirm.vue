<template>
  <div class="appointment-info-confirm-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button type="link" @click="goBack" class="back-btn">
          <left-outlined />
          返回修改
        </a-button>
        <h1>确认预约信息</h1>
        <p class="page-subtitle">请仔细核对您的预约信息，确认无误后提交</p>
      </div>
    </div>

    <!-- 预约信息汇总 -->
    <div class="info-summary">
      <!-- 医生信息卡片 -->
      <div class="info-card doctor-card">
        <div class="card-header">
          <h3 class="card-title">医生信息</h3>
          <a-button type="link" size="small" @click="goBackToEdit('doctor')">
            修改
          </a-button>
        </div>
        <div class="card-content">
          <div class="doctor-info">
            <div class="doctor-avatar">
              <img v-if="confirmData.doctorInfo.avatar" :src="confirmData.doctorInfo.avatar" alt="医生头像" />
              <div v-else class="avatar-placeholder">
                {{ confirmData.doctorInfo.name.charAt(0) }}
              </div>
            </div>
            <div class="doctor-details">
              <h4 class="doctor-name">{{ confirmData.doctorInfo.name }}</h4>
              <p class="doctor-title">{{ confirmData.doctorInfo.title }}</p>
              <p class="doctor-department">{{ confirmData.doctorInfo.department }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间信息卡片 -->
      <div class="info-card time-card">
        <div class="card-header">
          <h3 class="card-title">预约时间</h3>
          <a-button type="link" size="small" @click="goBackToEdit('time')">
            修改
          </a-button>
        </div>
        <div class="card-content">
          <div class="time-info">
            <div class="time-item">
              <span class="time-label">日期：</span>
              <span class="time-value">{{ formatDate(confirmData.timeSlot.date) }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">时段：</span>
              <span class="time-value">{{ confirmData.timeSlot.time }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">就诊类型：</span>
              <span class="time-value">{{ confirmData.appointmentInfo.visitType === 'first' ? '初诊' : '复诊' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 就诊人信息卡片 -->
      <div class="info-card patient-card">
        <div class="card-header">
          <h3 class="card-title">就诊人信息</h3>
          <a-button type="link" size="small" @click="goBackToEdit('patient')">
            修改
          </a-button>
        </div>
        <div class="card-content">
          <div class="patient-info">
            <div class="patient-item">
              <span class="patient-label">姓名：</span>
              <span class="patient-value">{{ confirmData.patientInfo.name }}</span>
            </div>
            <div class="patient-item">
              <span class="patient-label">身份证号：</span>
              <span class="patient-value">{{ formatIdCard(confirmData.patientInfo.idCard) }}</span>
            </div>
            <div class="patient-item">
              <span class="patient-label">手机号：</span>
              <span class="patient-value">{{ confirmData.patientInfo.phone }}</span>
            </div>
            <div v-if="confirmData.patientInfo.relation" class="patient-item">
              <span class="patient-label">关系：</span>
              <span class="patient-value">{{ formatRelation(confirmData.patientInfo.relation, confirmData.patientInfo.relationName) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 症状描述卡片 -->
      <div v-if="confirmData.appointmentInfo.symptoms" class="info-card symptoms-card">
        <div class="card-header">
          <h3 class="card-title">症状描述</h3>
          <a-button type="link" size="small" @click="goBackToEdit('symptoms')">
            修改
          </a-button>
        </div>
        <div class="card-content">
          <div class="symptoms-content">
            {{ confirmData.appointmentInfo.symptoms }}
          </div>
        </div>
      </div>
    </div>

    <!-- 预约规则说明 -->
    <div class="rules-section">
      <div class="rules-header">
        <h3 class="rules-title">预约规则说明</h3>
        <a-button 
          type="link" 
          size="small" 
          @click="toggleRulesExpand"
          class="expand-btn"
        >
          {{ isRulesExpanded ? '收起' : '展开' }}
        </a-button>
      </div>
      
      <div v-show="isRulesExpanded" class="rules-content">
        <div 
          v-for="(rule, index) in APPOINTMENT_RULES" 
          :key="index"
          class="rule-item"
          :class="{ 'important': rule.isImportant }"
        >
          <div class="rule-icon">
            <exclamation-circle-filled v-if="rule.isImportant" />
            <info-circle-filled v-else />
          </div>
          <div class="rule-content">
            <h4 class="rule-title">{{ rule.title }}</h4>
            <p class="rule-text">{{ rule.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <div class="action-buttons">
        <a-button 
          type="default" 
          size="large" 
          @click="goBack"
          class="back-action-btn"
        >
          返回修改
        </a-button>
        <a-button 
          type="primary" 
          size="large" 
          :loading="isSubmitting"
          @click="handleConfirm"
          class="confirm-btn"
        >
          确认提交预约
        </a-button>
      </div>
      
      <div class="agreement-section">
        <a-checkbox v-model:checked="isAgreed">
          我已阅读并同意 <a href="#" @click.prevent="showAgreement">《预约挂号服务协议》</a>
        </a-checkbox>
      </div>
    </div>

    <!-- 确认对话框 -->
    <a-modal
      v-model:visible="showConfirmDialog"
      title="确认提交预约"
      :confirm-loading="isSubmitting"
      @ok="handleSubmit"
      @cancel="showConfirmDialog = false"
    >
      <p>请确认以下信息无误：</p>
      <ul class="confirm-list">
        <li>医生：{{ confirmData.doctorInfo.name }}</li>
        <li>时间：{{ formatDate(confirmData.timeSlot.date) }} {{ confirmData.timeSlot.time }}</li>
        <li>就诊人：{{ confirmData.patientInfo.name }}</li>
        <li>就诊类型：{{ confirmData.appointmentInfo.visitType === 'first' ? '初诊' : '复诊' }}</li>
      </ul>
      <p class="confirm-note">提交后系统将为您锁定号源，请准时就诊。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LeftOutlined, 
  ExclamationCircleFilled, 
  InfoCircleFilled 
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { AppointmentConfirmData, AppointmentConfirmRules, APPOINTMENT_RULES } from '@/services/appointment/confirmTypes'
import { submitAppointment } from '@/services/appointment'

const route = useRoute()
const router = useRouter()

// 确认数据
const confirmData = ref<AppointmentConfirmData>({
  doctorInfo: {
    id: '',
    name: '',
    title: '',
    department: ''
  },
  timeSlot: {
    date: '',
    time: '',
    slotId: '',
    scheduleId: ''
  },
  patientInfo: {
    name: '',
    idCard: '',
    phone: ''
  },
  appointmentInfo: {
    visitType: 'first'
  }
})

// 状态管理
const isRulesExpanded = ref(false)
const isAgreed = ref(false)
const isSubmitting = ref(false)
const showConfirmDialog = ref(false)

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return '未知日期'
  
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
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

// 返回修改
function goBack() {
  router.back()
}

// 跳转到具体修改页面
function goBackToEdit(section: string) {
  // 这里可以根据section类型跳转到不同的修改页面
  // 目前先统一返回预约表单页面
  router.back()
}

// 展开/收起规则说明
function toggleRulesExpand() {
  isRulesExpanded.value = !isRulesExpanded.value
}

// 显示服务协议
function showAgreement() {
  Modal.info({
    title: '预约挂号服务协议',
    width: 600,
    content: `
      <div style="max-height: 400px; overflow-y: auto;">
        <h4>一、服务说明</h4>
        <p>1. 本平台提供在线预约挂号服务，帮助用户便捷预约医生门诊。</p>
        <p>2. 预约成功后，请按时就诊，如有变动请及时取消预约。</p>
        
        <h4>二、用户责任</h4>
        <p>1. 用户需提供真实、准确的个人信息。</p>
        <p>2. 用户需妥善保管预约信息，按时就诊。</p>
        
        <h4>三、取消规则</h4>
        <p>1. 如需取消预约，请至少提前24小时操作。</p>
        <p>2. 多次无故爽约可能影响后续预约权限。</p>
        
        <h4>四、隐私保护</h4>
        <p>1. 平台严格保护用户个人信息安全。</p>
        <p>2. 未经用户同意，不会向第三方透露个人信息。</p>
      </div>
    `,
    onOk() {}
  })
}

// 确认提交
function handleConfirm() {
  if (!isAgreed.value) {
    message.warning('请先阅读并同意预约挂号服务协议')
    return
  }
  
  showConfirmDialog.value = true
}

// 提交预约
async function handleSubmit() {
  isSubmitting.value = true
  
  try {
    const submitRequest = {
      doctorId: confirmData.value.doctorInfo.id,
      scheduleId: confirmData.value.timeSlot.scheduleId,
      timeSlotId: confirmData.value.timeSlot.slotId,
      patientName: confirmData.value.patientInfo.name,
      patientIdCard: confirmData.value.patientInfo.idCard,
      patientPhone: confirmData.value.patientInfo.phone,
      visitType: confirmData.value.appointmentInfo.visitType,
      symptoms: confirmData.value.appointmentInfo.symptoms
    }

    const response = await submitAppointment(submitRequest)
    
    if (response.paymentRequired) {
      // 需要支付，跳转到支付页面
      handlePaymentRedirect(response)
    } else {
      // 不需要支付，直接跳转到预约成功页面
      router.push({
        name: 'AppointmentConfirm',
        params: { 
          scheduleId: confirmData.value.timeSlot.scheduleId,
          appointmentId: response.appointmentId
        },
        query: {
          appointmentNumber: response.appointmentNumber,
          status: response.status
        }
      })
      
      message.success('预约提交成功！')
    }
  } catch (error: any) {
    console.error('提交预约失败:', error)
    
    // 根据错误类型显示不同的提示信息
    if (error.message?.includes('号源已被锁定')) {
      message.error('该时段号源已被预约，请重新选择时间')
    } else if (error.message?.includes('号源已满')) {
      message.error('该时段号源已满，请选择其他时段')
    } else if (error.message?.includes('重复预约')) {
      message.error('您已预约该时段的号源，请勿重复预约')
    } else if (error.message?.includes('系统繁忙')) {
      message.error('系统繁忙，请稍后重试')
    } else {
      message.error('提交预约失败，请稍后重试')
    }
  } finally {
    isSubmitting.value = false
    showConfirmDialog.value = false
  }
}

// 处理支付重定向
function handlePaymentRedirect(response: any) {
  // 这里应该跳转到支付页面
  // 目前先显示支付提示信息
  message.info('预约提交成功，请完成支付')
  
  // 在实际应用中，这里应该跳转到支付页面
  // router.push({
  //   path: '/payment',
  //   query: {
  //     orderId: response.paymentOrderId,
  //     amount: response.paymentAmount,
  //     appointmentId: response.appointmentId
  //   }
  // })
  
  // 临时方案：跳转到预约成功页面，显示支付提示
  router.push({
    name: 'AppointmentConfirm',
    params: { 
      scheduleId: confirmData.value.timeSlot.scheduleId,
      appointmentId: response.appointmentId
    },
    query: {
      appointmentNumber: response.appointmentNumber,
      status: response.status,
      paymentRequired: 'true',
      paymentAmount: response.paymentAmount?.toString(),
      paymentUrl: response.paymentUrl
    }
  })
}

// 加载预约数据
function loadAppointmentData() {
  // 从路由查询参数获取预约数据
  const queryData = route.query.confirmData
  
  if (queryData && typeof queryData === 'string') {
    try {
      const parsedData = JSON.parse(queryData)
      confirmData.value = parsedData
    } catch (error) {
      console.error('解析预约数据失败:', error)
      // 解析失败时使用默认数据
      useDefaultData()
    }
  } else {
    // 没有查询参数时使用默认数据
    useDefaultData()
  }
}

// 使用默认数据（开发模式）
function useDefaultData() {
  confirmData.value = {
    doctorInfo: {
      id: 'doc001',
      name: '张医生',
      title: '主任医师',
      department: '内科',
      avatar: '/images/doctor-avatar.jpg'
    },
    timeSlot: {
      date: '2026-04-23',
      time: '08:00-12:00',
      slotId: 'slot001',
      scheduleId: route.params.scheduleId as string || 'schedule001'
    },
    patientInfo: {
      id: 'patient001',
      name: '张三',
      idCard: '110101199001011234',
      phone: '13800138000',
      relation: 'self',
      relationName: '本人'
    },
    appointmentInfo: {
      visitType: 'first',
      symptoms: '头痛、发热三天，伴有咳嗽症状'
    }
  }
}

// 生命周期
onMounted(() => {
  loadAppointmentData()
})
</script>

<style scoped>
.appointment-info-confirm-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header-content {
  text-align: center;
}

.back-btn {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.info-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.card-content {
  padding: 24px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 24px;
  font-weight: 600;
  color: #999;
}

.doctor-details h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.doctor-title,
.doctor-department {
  margin: 0 0 4px 0;
  color: #666;
}

.time-info,
.patient-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-item,
.patient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-label,
.patient-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.time-value,
.patient-value {
  color: #333;
  text-align: right;
}

.symptoms-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  line-height: 1.6;
  color: #495057;
}

.rules-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.rules-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.rules-content {
  padding: 0 24px 24px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-item.important {
  background: #fff7e6;
  margin: 0 -24px;
  padding: 16px 24px;
  border-left: 4px solid #fa8c16;
}

.rule-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.rule-icon :deep(svg) {
  font-size: 16px;
  color: #1890ff;
}

.rule-item.important .rule-icon :deep(svg) {
  color: #fa8c16;
}

.rule-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.rule-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.action-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.back-action-btn,
.confirm-btn {
  min-width: 150px;
}

.agreement-section {
  text-align: center;
}

.confirm-list {
  margin: 16px 0;
  padding-left: 20px;
}

.confirm-list li {
  margin-bottom: 8px;
  color: #333;
}

.confirm-note {
  color: #fa8c16;
  font-size: 14px;
  margin: 16px 0 0 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .appointment-info-confirm-page {
    padding: 16px;
  }
  
  .page-header {
    padding: 20px;
    position: relative;
  }
  
  .back-btn {
    position: static;
    transform: none;
    margin-bottom: 12px;
    display: inline-block;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .doctor-info {
    flex-direction: column;
    text-align: center;
  }
  
  .time-item,
  .patient-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .time-value,
  .patient-value {
    text-align: left;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .back-action-btn,
  .confirm-btn {
    width: 100%;
  }
}
</style>