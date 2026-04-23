<template>
  <div class="appointment-confirm-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>预约成功</h1>
      <p class="page-subtitle">您的预约已提交成功，请妥善保管预约信息</p>
    </div>

    <!-- 预约信息卡片 -->
    <div class="appointment-card">
      <div class="card-header">
        <div class="success-icon">
          <check-circle-filled />
        </div>
        <div class="header-content">
          <h2>预约信息</h2>
          <p class="appointment-number">预约号：{{ appointmentData.appointmentNumber }}</p>
        </div>
      </div>

      <div class="card-body">
        <!-- 患者信息 -->
        <div class="info-section">
          <h3 class="section-title">患者信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>姓名</label>
              <span>{{ appointmentData.patientName }}</span>
            </div>
            <div class="info-item">
              <label>身份证号</label>
              <span>{{ appointmentData.patientIdCard }}</span>
            </div>
            <div class="info-item">
              <label>手机号</label>
              <span>{{ appointmentData.patientPhone }}</span>
            </div>
          </div>
        </div>

        <!-- 医生信息 -->
        <div class="info-section">
          <h3 class="section-title">医生信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>医生</label>
              <span>{{ appointmentData.doctorName }}</span>
            </div>
            <div class="info-item">
              <label>科室</label>
              <span>{{ appointmentData.department }}</span>
            </div>
            <div class="info-item">
              <label>医院</label>
              <span>{{ appointmentData.hospital }}</span>
            </div>
          </div>
        </div>

        <!-- 预约详情 -->
        <div class="info-section">
          <h3 class="section-title">预约详情</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>就诊类型</label>
              <span>{{ appointmentData.visitType === 'first' ? '初诊' : '复诊' }}</span>
            </div>
            <div class="info-item">
              <label>预约时间</label>
              <span>{{ formatAppointmentTime(appointmentData.appointmentTime) }}</span>
            </div>
            <div class="info-item">
              <label>状态</label>
              <span class="status-badge" :class="appointmentData.status">
                {{ getStatusText(appointmentData.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 症状描述 -->
        <div v-if="appointmentData.symptoms" class="info-section">
          <h3 class="section-title">症状描述</h3>
          <div class="symptoms-content">
            {{ appointmentData.symptoms }}
          </div>
        </div>

        <!-- 注意事项 -->
        <div class="notice-section">
          <h3 class="section-title">就诊注意事项</h3>
          <ul class="notice-list">
            <li>请携带有效身份证件和医保卡就诊</li>
            <li>建议提前15分钟到达医院</li>
            <li>如需取消预约，请提前24小时操作</li>
            <li>如有疑问，请联系医院客服</li>
          </ul>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions">
        <a-button type="primary" @click="goHome" class="home-btn">
          返回首页
        </a-button>
        <a-button @click="printInfo" class="print-btn">
          打印预约单
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import type { AppointmentSubmitResponse } from '@/services/appointment/types'
import { getAppointmentDetail } from '@/services/appointment'

const route = useRoute()
const router = useRouter()

// 预约数据
const appointmentData = ref<AppointmentSubmitResponse>({
  appointmentId: '',
  appointmentNumber: '',
  appointmentTime: '',
  doctorName: '',
  department: '',
  hospital: '',
  status: 'pending'
})

// 加载预约详情
async function loadAppointmentDetail() {
  const appointmentId = route.params.appointmentId as string
  if (!appointmentId) {
    console.error('预约ID不能为空')
    return
  }

  try {
    const detail = await getAppointmentDetail(appointmentId)
    if (detail) {
      appointmentData.value = detail
    }
  } catch (error) {
    console.error('加载预约详情失败:', error)
  }
}

// 格式化预约时间
function formatAppointmentTime(timeStr: string): string {
  if (!timeStr) return '未知时间'
  
  // 假设时间格式为 "2026-04-23 08:00-12:00"
  const [date, timeRange] = timeStr.split(' ')
  if (!date || !timeRange) return timeStr
  
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  
  return `${formattedDate} ${timeRange}`
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 返回首页
function goHome() {
  router.push('/')
}

// 打印预约信息
function printInfo() {
  window.print()
}

// 生命周期
onMounted(() => {
  loadAppointmentDetail()
})
</script>

<style scoped>
.appointment-confirm-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #52c41a;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.appointment-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border-bottom: 1px solid #e6f7ff;
}

.success-icon {
  margin-right: 16px;
}

.success-icon :deep(svg) {
  font-size: 48px;
  color: #52c41a;
}

.header-content h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.appointment-number {
  margin: 0;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.card-body {
  padding: 24px;
}

.info-section {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-item span {
  color: #333;
  text-align: right;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-badge.confirmed {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.cancelled {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.symptoms-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  line-height: 1.6;
  color: #495057;
}

.notice-section {
  background: #e6f7ff;
  border-radius: 6px;
  padding: 16px;
  margin-top: 24px;
}

.notice-list {
  margin: 0;
  padding-left: 20px;
}

.notice-list li {
  margin-bottom: 8px;
  color: #1890ff;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
}

.home-btn,
.print-btn {
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .appointment-confirm-page {
    padding: 16px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .success-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-item span {
    text-align: left;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .home-btn,
  .print-btn {
    width: 100%;
  }
}

/* 打印样式 */
@media print {
  .appointment-confirm-page {
    background: white;
    padding: 0;
  }
  
  .page-header {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .appointment-card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .card-actions {
    display: none;
  }
}
</style>