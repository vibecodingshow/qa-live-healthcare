<template>
  <div class="my-appointments">
    <AppHeader title="我的预约" :showBack="true" />
    
    <div class="appointments-container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-radio-group v-model:value="statusFilter" button-style="solid">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="pending">待确认</a-radio-button>
          <a-radio-button value="confirmed">已确认</a-radio-button>
          <a-radio-button value="completed">已完成</a-radio-button>
          <a-radio-button value="cancelled">已取消</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 预约列表 -->
      <div class="appointments-list">
        <a-empty v-if="filteredAppointments.length === 0" description="暂无预约记录">
          <template #image>
            <CalendarOutlined style="font-size: 48px; color: #999" />
          </template>
        </a-empty>

        <a-card
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="appointment-card"
          :class="{ 'cancelled-card': appointment.status === 'cancelled' }"
        >
          <div class="appointment-content">
            <div class="appointment-header">
              <div class="doctor-info">
                <img :src="getDoctorAvatar(appointment.doctorId)" :alt="appointment.doctorName" class="doctor-avatar" />
                <div class="doctor-details">
                  <h3>{{ appointment.doctorName }}</h3>
                  <p>{{ getDoctorDepartment(appointment.doctorId) }}</p>
                </div>
              </div>
              <AppointmentStatusTag :status="appointment.status" />
            </div>

            <div class="appointment-details">
              <div class="detail-item">
                <CalendarOutlined class="icon" />
                <span>{{ formatDate(appointment.date) }}</span>
              </div>
              <div class="detail-item">
                <ClockCircleOutlined class="icon" />
                <span>{{ appointment.startTime }} - {{ appointment.endTime }}</span>
              </div>
              <div class="detail-item" v-if="appointment.notes">
                <FileTextOutlined class="icon" />
                <span>{{ appointment.notes }}</span>
              </div>
            </div>

            <div class="appointment-actions">
              <a-button type="primary" ghost @click="viewDetails(appointment)">
                查看详情
              </a-button>
              <a-button 
                v-if="canCancel(appointment)" 
                danger 
                @click="cancelAppointment(appointment)"
              >
                取消预约
              </a-button>
            </div>
          </div>
        </a-card>
      </div>

      <!-- 预约统计 -->
      <div class="stats-section">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="总预约数" :value="totalAppointments" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="待确认" :value="pendingCount" :value-style="{ color: '#faad14' }" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="已确认" :value="confirmedCount" :value-style="{ color: '#52c41a' }" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="已完成" :value="completedCount" :value-style="{ color: '#1890ff' }" />
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 预约详情模态框 -->
    <a-modal
      v-model:open="detailsModalVisible"
      title="预约详情"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedAppointment" class="appointment-details-modal">
        <a-descriptions bordered column="1">
          <a-descriptions-item label="预约编号">
            {{ selectedAppointment.id }}
          </a-descriptions-item>
          <a-descriptions-item label="预约状态">
            <AppointmentStatusTag :status="selectedAppointment.status" />
          </a-descriptions-item>
          <a-descriptions-item label="医生姓名">
            {{ selectedAppointment.doctorName }}
          </a-descriptions-item>
          <a-descriptions-item label="科室">
            {{ getDoctorDepartment(selectedAppointment.doctorId) }}
          </a-descriptions-item>
          <a-descriptions-item label="预约日期">
            {{ formatDate(selectedAppointment.date) }}
          </a-descriptions-item>
          <a-descriptions-item label="预约时间">
            {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}
          </a-descriptions-item>
          <a-descriptions-item label="患者姓名">
            {{ selectedAppointment.patientName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">
            {{ selectedAppointment.patientPhone || '未填写' }}
          </a-descriptions-item>
          <a-descriptions-item label="预约备注">
            {{ selectedAppointment.notes || '无' }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ formatDateTime(selectedAppointment.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ formatDateTime(selectedAppointment.updateTime) }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="modal-actions" v-if="canCancel(selectedAppointment)">
          <a-button danger block size="large" @click="cancelAppointment(selectedAppointment)">
            取消预约
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 取消确认模态框 -->
    <a-modal
      v-model:open="cancelModalVisible"
      title="确认取消预约"
      @ok="confirmCancel"
      :confirmLoading="cancelling"
    >
      <div class="cancel-confirm-content">
        <p>确定要取消以下预约吗？</p>
        <a-card size="small" v-if="selectedAppointment">
          <p><strong>医生：</strong>{{ selectedAppointment.doctorName }}</p>
          <p><strong>日期：</strong>{{ formatDate(selectedAppointment.date) }}</p>
          <p><strong>时间：</strong>{{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</p>
        </a-card>
        <a-form-item label="取消原因" class="cancel-reason">
          <a-textarea
            v-model:value="cancelReason"
            placeholder="请输入取消原因（可选）"
            :rows="3"
          />
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Modal, message } from 'ant-design-vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue';
import { store, Appointment } from '@/store';
import { canCancelAppointment } from '@/types/appointment';
import AppHeader from '@/components/AppHeader.vue';
import AppointmentStatusTag from '@/components/AppointmentStatusTag.vue';

const statusFilter = ref('all');
const detailsModalVisible = ref(false);
const cancelModalVisible = ref(false);
const selectedAppointment = ref<Appointment | null>(null);
const cancelReason = ref('');
const cancelling = ref(false);

// 模拟患者ID（实际应该从登录状态获取）
const currentPatientId = 'patient001';

// 计算属性
const allAppointments = computed(() => {
  return store.getAppointmentsByPatient(currentPatientId);
});

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') {
    return allAppointments.value;
  }
  return allAppointments.value.filter(a => a.status === statusFilter.value);
});

const totalAppointments = computed(() => allAppointments.value.length);
const pendingCount = computed(() => allAppointments.value.filter(a => a.status === 'pending').length);
const confirmedCount = computed(() => allAppointments.value.filter(a => a.status === 'confirmed').length);
const completedCount = computed(() => allAppointments.value.filter(a => a.status === 'completed').length);

// 方法
const getDoctorAvatar = (doctorId: string): string => {
  const doctor = store.state.doctors.find(d => d.id === doctorId);
  return doctor?.avatar || 'https://via.placeholder.com/60';
};

const getDoctorDepartment = (doctorId: string): string => {
  const doctor = store.state.doctors.find(d => d.id === doctorId);
  return doctor?.department || '';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const canCancel = (appointment: Appointment): boolean => {
  return canCancelAppointment(appointment);
};

const viewDetails = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  detailsModalVisible.value = true;
};

const cancelAppointment = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  cancelReason.value = '';
  detailsModalVisible.value = false;
  cancelModalVisible.value = true;
};

const confirmCancel = () => {
  if (!selectedAppointment.value) return;
  
  cancelling.value = true;
  
  setTimeout(() => {
    const success = store.cancelAppointment(selectedAppointment.value!.id, cancelReason.value);
    
    if (success) {
      message.success('预约已取消');
      cancelModalVisible.value = false;
      // 刷新列表
      cancelReason.value = '';
    } else {
      message.error('取消失败，请重试');
    }
    
    cancelling.value = false;
  }, 500);
};
</script>

<style scoped>
.my-appointments {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 64px;
}

.appointments-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.filter-section {
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.appointment-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.appointment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-card.cancelled-card {
  opacity: 0.6;
}

.appointment-content {
  padding: 8px;
}

.appointment-header {
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

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-details h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #333;
}

.doctor-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.appointment-details {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .icon {
  color: #1890ff;
  font-size: 16px;
}

.appointment-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.stats-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointment-details-modal {
  padding: 16px 0;
}

.modal-actions {
  margin-top: 24px;
}

.cancel-confirm-content p {
  margin-bottom: 12px;
  color: #666;
}

.cancel-reason {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .appointment-header {
    flex-direction: column;
    gap: 12px;
  }

  .appointment-actions {
    flex-direction: column;
  }

  .appointment-actions .ant-btn {
    width: 100%;
  }
}
</style>
