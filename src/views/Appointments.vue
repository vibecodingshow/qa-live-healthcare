<template>
  <div class="appointments-page">
    <div class="page-header">
      <h1>我的预约</h1>
      <p>查看和管理您的预约记录</p>
    </div>

    <div class="appointments-container">
      <!-- 状态筛选标签 -->
      <div class="status-tabs">
        <a-radio-group v-model:value="activeStatus" button-style="solid">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="pending">待确认</a-radio-button>
          <a-radio-button value="confirmed">已确认</a-radio-button>
          <a-radio-button value="completed">已完成</a-radio-button>
          <a-radio-button value="cancelled">已取消</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <a-spin size="large" />
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredAppointments.length === 0" class="empty">
        <a-empty description="暂无预约记录">
          <a-button type="primary" @click="goToDoctors">去预约</a-button>
        </a-empty>
      </div>

      <!-- 预约列表 -->
      <div v-else class="appointment-list">
        <a-card
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="appointment-card"
          :class="getStatusClass(appointment.status)"
        >
          <div class="appointment-header">
            <div class="doctor-info">
              <h3>{{ appointment.doctorName }}</h3>
              <p class="doctor-title">{{ appointment.doctorTitle }} · {{ appointment.doctorDepartment }}</p>
            </div>
            <a-tag :color="getStatusColor(appointment.status)">
              {{ getStatusText(appointment.status) }}
            </a-tag>
          </div>

          <div class="appointment-body">
            <div class="info-row">
              <CalendarOutlined class="icon" />
              <span>{{ appointment.appointmentDate }}</span>
            </div>
            <div class="info-row">
              <ClockCircleOutlined class="icon" />
              <span>{{ appointment.timeSlot }}</span>
            </div>
            <div class="info-row">
              <EnvironmentOutlined class="icon" />
              <span>{{ appointment.location }}</span>
            </div>
            <div class="info-row">
              <FileTextOutlined class="icon" />
              <span class="reason">{{ appointment.reason }}</span>
            </div>
          </div>

          <div class="appointment-footer">
            <a-button
              v-if="canCancel(appointment.status)"
              danger
              @click="handleCancel(appointment)"
            >
              取消预约
            </a-button>
            <a-button @click="handleViewDetail(appointment)">
              查看详情
            </a-button>
          </div>

          <!-- 显示取消/拒绝原因 -->
          <div v-if="appointment.cancelReason" class="reason-note">
            <WarningOutlined /> 取消原因：{{ appointment.cancelReason }}
          </div>
          <div v-if="appointment.rejectReason" class="reason-note reject">
            <CloseCircleOutlined /> 拒绝原因：{{ appointment.rejectReason }}
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue';
import { store, Appointment, AppointmentStatus } from '../store';

const router = useRouter();
const loading = ref(false);
const activeStatus = ref<string>('all');

const appointments = ref<Appointment[]>([]);

onMounted(() => {
  loadAppointments();
});

const loadAppointments = () => {
  if (!store.state.currentPatient) {
    message.warning('请先登录');
    return;
  }
  loading.value = true;
  appointments.value = store.getAppointmentsByPatient(
    store.state.currentPatient.id
  );
  loading.value = false;
};

const filteredAppointments = computed(() => {
  if (activeStatus.value === 'all') {
    return appointments.value;
  }
  return appointments.value.filter(
    apt => apt.status === activeStatus.value
  );
});

const getStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'orange',
    [AppointmentStatus.CONFIRMED]: 'green',
    [AppointmentStatus.COMPLETED]: 'blue',
    [AppointmentStatus.CANCELLED]: 'default',
    [AppointmentStatus.REJECTED]: 'red',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: AppointmentStatus): string => {
  const textMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: '待确认',
    [AppointmentStatus.CONFIRMED]: '已确认',
    [AppointmentStatus.COMPLETED]: '已完成',
    [AppointmentStatus.CANCELLED]: '已取消',
    [AppointmentStatus.REJECTED]: '已拒绝',
  };
  return textMap[status] || status;
};

const getStatusClass = (status: AppointmentStatus): string => {
  return `status-${status}`;
};

const canCancel = (status: AppointmentStatus): boolean => {
  return (
    status === AppointmentStatus.PENDING ||
    status === AppointmentStatus.CONFIRMED
  );
};

const handleCancel = (appointment: Appointment) => {
  Modal.confirm({
    title: '确认取消预约',
    content: `确定要取消与 ${appointment.doctorName} 在 ${appointment.appointmentDate} ${appointment.timeSlot} 的预约吗？`,
    okText: '确认取消',
    okType: 'danger',
    cancelText: '返回',
    onOk() {
      const result = store.cancelAppointment(appointment.id, '患者主动取消');
      if (result) {
        message.success('预约已取消');
        loadAppointments();
      } else {
        message.error('取消预约失败');
      }
    },
  });
};

const handleViewDetail = (appointment: Appointment) => {
  router.push(`/appointments/${appointment.id}`);
};

const goToDoctors = () => {
  router.push('/doctors');
};
</script>

<style scoped>
.appointments-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-header {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  padding: 80px 24px;
  text-align: center;
  color: #fff;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.appointments-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.status-tabs {
  margin-bottom: 24px;
  text-align: center;
}

.loading,
.empty {
  padding: 60px 0;
  text-align: center;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.appointment-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.appointment-card.status-cancelled,
.appointment-card.status-rejected {
  opacity: 0.7;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.doctor-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.doctor-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.appointment-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.info-row .icon {
  margin-right: 8px;
  color: #1890ff;
  min-width: 20px;
}

.info-row .reason {
  flex: 1;
  word-break: break-word;
}

.appointment-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.reason-note {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fffbe6;
  border-radius: 4px;
  font-size: 13px;
  color: #ad6800;
}

.reason-note.reject {
  background: #fff1f0;
  color: #cf1322;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }

  .page-header p {
    font-size: 16px;
  }

  .appointment-header {
    flex-direction: column;
    gap: 12px;
  }

  .appointment-footer {
    flex-direction: column;
  }

  .appointment-footer :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
