<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
    class="appointment-detail-dialog"
  >
    <!-- 基本信息 -->
    <div class="detail-section">
      <h3 class="section-title">基本信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <label class="info-label">预约编号：</label>
          <span class="info-value">{{ appointment.id }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">预约状态：</label>
          <el-tag :type="getStatusType(appointment.status)" class="status-tag">
            {{ getStatusText(appointment.status) }}
          </el-tag>
        </div>
        <div class="info-item">
          <label class="info-label">创建时间：</label>
          <span class="info-value">{{ formatDateTime(appointment.createdAt) }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">更新时间：</label>
          <span class="info-value">{{ formatDateTime(appointment.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 医生信息 -->
    <div class="detail-section">
      <h3 class="section-title">医生信息</h3>
      <div class="doctor-info">
        <el-avatar :size="60" :src="appointment.doctorAvatar || '/default-avatar.png'" class="doctor-avatar">
          {{ appointment.doctorName.charAt(0) }}
        </el-avatar>
        <div class="doctor-details">
          <h4 class="doctor-name">{{ appointment.doctorName }}</h4>
          <p class="doctor-department">{{ appointment.department }}</p>
          <p class="doctor-title" v-if="appointment.doctorTitle">{{ appointment.doctorTitle }}</p>
        </div>
      </div>
    </div>

    <!-- 预约时间 -->
    <div class="detail-section">
      <h3 class="section-title">预约时间</h3>
      <div class="time-info">
        <div class="time-item">
          <el-icon><Calendar /></el-icon>
          <span class="time-label">预约日期：</span>
          <span class="time-value">{{ formatDate(appointment.appointmentDate) }}</span>
        </div>
        <div class="time-item">
          <el-icon><Clock /></el-icon>
          <span class="time-label">时间段：</span>
          <span class="time-value">{{ appointment.startTime }} - {{ appointment.endTime }}</span>
        </div>
        <div class="time-item">
          <el-icon><Location /></el-icon>
          <span class="time-label">就诊地点：</span>
          <span class="time-value">{{ appointment.location || '门诊大楼' }}</span>
        </div>
      </div>
    </div>

    <!-- 患者信息 -->
    <div class="detail-section">
      <h3 class="section-title">患者信息</h3>
      <div class="patient-info">
        <div class="info-item">
          <label class="info-label">患者姓名：</label>
          <span class="info-value">{{ appointment.patientName }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">患者性别：</label>
          <span class="info-value">{{ appointment.patientGender === 'male' ? '男' : '女' }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">患者年龄：</label>
          <span class="info-value">{{ appointment.patientAge }}岁</span>
        </div>
        <div class="info-item">
          <label class="info-label">联系电话：</label>
          <span class="info-value">{{ appointment.patientPhone || '未提供' }}</span>
        </div>
      </div>
    </div>

    <!-- 症状描述 -->
    <div class="detail-section">
      <h3 class="section-title">症状描述</h3>
      <div class="symptoms-content">
        <p class="symptoms-text">{{ appointment.symptoms || '未填写症状描述' }}</p>
      </div>
    </div>

    <!-- 备注信息 -->
    <div class="detail-section" v-if="appointment.notes">
      <h3 class="section-title">备注信息</h3>
      <div class="notes-content">
        <p class="notes-text">{{ appointment.notes }}</p>
      </div>
    </div>

    <!-- 状态更新 -->
    <div class="detail-section" v-if="!readonly && canUpdateStatus">
      <h3 class="section-title">状态更新</h3>
      <div class="status-update">
        <el-radio-group v-model="newStatus" size="small">
          <el-radio-button value="confirmed">确认预约</el-radio-button>
          <el-radio-button value="completed">标记完成</el-radio-button>
          <el-radio-button value="cancelled">取消预约</el-radio-button>
          <el-radio-button value="no_show">标记未就诊</el-radio-button>
        </el-radio-group>
        <el-button 
          type="primary" 
          size="small" 
          @click="handleStatusUpdate"
          :disabled="!newStatus || newStatus === appointment.status"
          class="update-btn"
        >
          更新状态
        </el-button>
      </div>
    </div>

    <!-- 备注编辑 -->
    <div class="detail-section" v-if="!readonly">
      <h3 class="section-title">编辑备注</h3>
      <el-input
        v-model="newNotes"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息（最多200字符）"
        maxlength="200"
        show-word-limit
      />
      <div class="notes-actions">
        <el-button 
          type="primary" 
          size="small" 
          @click="handleNotesUpdate"
          :disabled="newNotes === appointment.notes"
        >
          保存备注
        </el-button>
      </div>
    </div>

    <!-- 对话框底部 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleUpdate" v-if="!readonly && hasChanges">
          保存修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Calendar, Clock, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Appointment, APPOINTMENT_STATUS } from '../types'

// 属性定义
interface Props {
  appointment: Appointment
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// 事件定义
const emit = defineEmits<{
  close: []
  update: [appointment: Appointment]
}>()

// 响应式数据
const dialogVisible = ref(true)
const newStatus = ref<APPOINTMENT_STATUS | ''>('')
const newNotes = ref('')

// 计算属性
const dialogTitle = computed(() => {
  return `${props.readonly ? '查看' : '管理'}预约详情`
})

const canUpdateStatus = computed(() => {
  return ['pending', 'confirmed'].includes(props.appointment.status)
})

const hasChanges = computed(() => {
  return newStatus.value !== '' && newStatus.value !== props.appointment.status ||
         newNotes.value !== props.appointment.notes
})

// 方法
const handleBeforeClose = (done: () => void) => {
  if (hasChanges.value) {
    ElMessage.warning('您有未保存的修改，确定要关闭吗？')
  }
  done()
}

const handleClose = () => {
  dialogVisible.value = false
  emit('close')
}

const handleUpdate = () => {
  const updatedAppointment = {
    ...props.appointment,
    status: newStatus.value || props.appointment.status,
    notes: newNotes.value
  }
  emit('update', updatedAppointment)
  handleClose()
}

const handleStatusUpdate = () => {
  if (newStatus.value) {
    const updatedAppointment = {
      ...props.appointment,
      status: newStatus.value
    }
    emit('update', updatedAppointment)
    ElMessage.success('状态更新成功')
  }
}

const handleNotesUpdate = () => {
  const updatedAppointment = {
    ...props.appointment,
    notes: newNotes.value
  }
  emit('update', updatedAppointment)
  ElMessage.success('备注更新成功')
}

const getStatusType = (status: APPOINTMENT_STATUS) => {
  const statusTypes = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'info'
  }
  return statusTypes[status] || 'info'
}

const getStatusText = (status: APPOINTMENT_STATUS) => {
  const statusTexts = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
    no_show: '未就诊'
  }
  return statusTexts[status] || '未知状态'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听属性变化
watch(() => props.appointment, (newAppointment) => {
  newStatus.value = ''
  newNotes.value = newAppointment.notes || ''
}, { immediate: true })
</script>

<style scoped>
.appointment-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  font-size: 14px;
  color: #303133;
}

.status-tag {
  font-weight: 500;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.doctor-department {
  font-size: 14px;
  color: #409eff;
  margin: 0 0 4px 0;
}

.doctor-title {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-label {
  font-size: 14px;
  color: #606266;
  min-width: 80px;
}

.time-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.patient-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.symptoms-content, .notes-content {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.symptoms-text, .notes-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.status-update {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.update-btn {
  margin-left: auto;
}

.notes-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .patient-info {
    grid-template-columns: 1fr;
  }
  
  .status-update {
    flex-direction: column;
    align-items: stretch;
  }
  
  .update-btn {
    margin-left: 0;
    margin-top: 12px;
  }
}
</style>