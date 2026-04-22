<template>
  <div class="appointment-list">
    <!-- 预约卡片列表 -->
    <div class="appointment-cards">
      <div 
        v-for="appointment in paginatedAppointments" 
        :key="appointment.id"
        class="appointment-card"
        :class="{ 'selected': selectedAppointmentId === appointment.id }"
        @click="handleSelect(appointment)"
      >
        <!-- 头部：医生信息和状态 -->
        <div class="card-header">
          <div class="doctor-info">
            <div class="doctor-avatar">
              <el-avatar :size="40" :src="appointment.doctorAvatar || '/default-avatar.png'">
                {{ appointment.doctorName.charAt(0) }}
              </el-avatar>
            </div>
            <div class="doctor-details">
              <h3 class="doctor-name">{{ appointment.doctorName }}</h3>
              <p class="department">{{ appointment.department }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(appointment.status)">
            {{ getStatusText(appointment.status) }}
          </div>
        </div>

        <!-- 内容：预约信息 -->
        <div class="card-content">
          <div class="appointment-info">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(appointment.appointmentDate) }}</span>
            </div>
            <div class="info-item">
              <el-icon><Clock /></el-icon>
              <span>{{ appointment.startTime }} - {{ appointment.endTime }}</span>
            </div>
            <div class="info-item">
              <el-icon><Location /></el-icon>
              <span>{{ appointment.location || '门诊大楼' }}</span>
            </div>
          </div>

          <!-- 症状描述 -->
          <div class="symptoms" v-if="appointment.symptoms">
            <p class="symptoms-label">症状描述：</p>
            <p class="symptoms-text">{{ appointment.symptoms }}</p>
          </div>

          <!-- 备注 -->
          <div class="notes" v-if="appointment.notes">
            <p class="notes-label">备注：</p>
            <p class="notes-text">{{ appointment.notes }}</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="card-actions" v-if="!readonly">
          <el-button 
            size="small" 
            type="primary" 
            @click.stop="handleStatusUpdate(appointment)"
            v-if="canUpdateStatus(appointment)"
          >
            更新状态
          </el-button>
          <el-button 
            size="small" 
            @click.stop="handleEdit(appointment)"
          >
            查看详情
          </el-button>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-section" v-if="pagination.total > pagination.pageSize">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="appointments.length === 0" class="empty-state">
      <el-empty description="暂无预约记录" :image-size="150" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, Location } from '@element-plus/icons-vue'
import type { Appointment, PaginationInfo, APPOINTMENT_STATUS } from '../types'

// 属性定义
interface Props {
  appointments: Appointment[]
  pagination: PaginationInfo
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// 事件定义
const emit = defineEmits<{
  'appointment-select': [appointment: Appointment]
  'status-update': [appointment: Appointment]
  'page-change': [page: number]
  'size-change': [size: number]
}>()

// 响应式数据
const selectedAppointmentId = ref<string>('')

// 计算属性
const paginatedAppointments = computed(() => {
  const start = (props.pagination.currentPage - 1) * props.pagination.pageSize
  const end = start + props.pagination.pageSize
  return props.appointments.slice(start, end)
})

// 方法
const handleSelect = (appointment: Appointment) => {
  selectedAppointmentId.value = appointment.id
  emit('appointment-select', appointment)
}

const handleStatusUpdate = (appointment: Appointment) => {
  emit('status-update', appointment)
}

const handleEdit = (appointment: Appointment) => {
  emit('appointment-select', appointment)
}

const handleCurrentChange = (page: number) => {
  emit('page-change', page)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const getStatusClass = (status: APPOINTMENT_STATUS) => {
  const statusClasses = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    no_show: 'status-no-show'
  }
  return statusClasses[status] || 'status-pending'
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

const canUpdateStatus = (appointment: Appointment) => {
  // 只有医生可以更新状态
  return !props.readonly && ['pending', 'confirmed'].includes(appointment.status)
}
</script>

<style scoped>
.appointment-list {
  width: 100%;
}

.appointment-cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.appointment-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.appointment-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.appointment-card.selected {
  border-color: #409eff;
  background-color: #f0f7ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.department {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #f5dab1;
}

.status-confirmed {
  background: #f0f9ff;
  color: #409eff;
  border: 1px solid #c6e2ff;
}

.status-completed {
  background: #f0f9f0;
  color: #67c23a;
  border: 1px solid #c2e7b0;
}

.status-cancelled {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.status-no-show {
  background: #f4f4f5;
  color: #909399;
  border: 1px solid #d3d4d6;
}

.card-content {
  margin-bottom: 16px;
}

.appointment-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.info-item .el-icon {
  color: #909399;
}

.symptoms, .notes {
  margin-top: 12px;
}

.symptoms-label, .notes-label {
  font-size: 12px;
  color: #909399;
  margin: 0 0 4px 0;
}

.symptoms-text, .notes-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
  margin: 0;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.empty-state {
  margin-top: 60px;
}

@media (max-width: 768px) {
  .appointment-cards {
    grid-template-columns: 1fr;
  }
  
  .appointment-card {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .status-badge {
    align-self: flex-start;
  }
}
</style>