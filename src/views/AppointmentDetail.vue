<template>
  <div class="appointment-detail-page">
    <div class="page-container">
      <a-page-header
        title="预约详情"
        sub-title="查看预约信息"
        @back="() => $router.back()"
      />

      <!-- 加载状态 -->
      <a-spin v-if="loading" size="large" class="loading" />

      <!-- 找不到预约 -->
      <a-result v-if="!loading && !appointment" status="warning" title="未找到预约">
        <template #subTitle>
          预约信息不存在或已过期
        </template>
        <template #extra>
          <a-button type="primary" @click="goToAppointments">返回预约列表</a-button>
        </template>
      </a-result>

      <!-- 预约详情 -->
      <div v-if="!loading && appointment">
        <!-- 状态卡片 -->
        <a-card class="status-card">
          <div class="status-display">
            <a-tag :color="getStatusColor(appointment.status)" class="status-tag">
              {{ getStatusText(appointment.status) }}
            </a-tag>
            <p class="status-hint">{{ getStatusHint(appointment.status) }}</p>
          </div>
        </a-card>

        <!-- 预约信息卡片 -->
        <a-card title="预约信息" class="info-card">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="预约编号">
              {{ appointment.id }}
            </a-descriptions-item>
            <a-descriptions-item label="预约日期">
              <CalendarOutlined /> {{ appointment.appointmentDate }}
            </a-descriptions-item>
            <a-descriptions-item label="预约时间">
              <ClockCircleOutlined /> {{ appointment.timeSlot }}
            </a-descriptions-item>
            <a-descriptions-item label="就诊地点">
              <EnvironmentOutlined /> {{ appointment.location }}
            </a-descriptions-item>
            <a-descriptions-item label="就诊原因">
              {{ appointment.reason }}
            </a-descriptions-item>
            <a-descriptions-item label="预约时间">
              <CalendarOutlined /> {{ formatDateTime(appointment.createdAt) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="appointment.confirmedAt" label="确认时间">
              <CheckCircleOutlined /> {{ formatDateTime(appointment.confirmedAt) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="appointment.completedAt" label="完成时间">
              <CheckCircleOutlined /> {{ formatDateTime(appointment.completedAt) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="appointment.cancelReason" label="取消原因">
              <WarningOutlined /> {{ appointment.cancelReason }}
            </a-descriptions-item>
            <a-descriptions-item v-if="appointment.rejectReason" label="拒绝原因">
              <CloseCircleOutlined /> {{ appointment.rejectReason }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 医生信息卡片 -->
        <a-card title="医生信息" class="doctor-card">
          <div class="doctor-info">
            <img :src="doctor?.avatar" :alt="doctor?.name" class="doctor-avatar" />
            <div class="doctor-details">
              <h3>{{ appointment.doctorName }}</h3>
              <p class="doctor-title">{{ appointment.doctorTitle }} · {{ appointment.doctorDepartment }}</p>
              <p class="doctor-location" v-if="doctor?.clinicSchedule">
                <EnvironmentOutlined /> {{ doctor.clinicSchedule.clinicLocation }}
              </p>
            </div>
          </div>
        </a-card>

        <!-- 患者信息卡片 -->
        <a-card title="患者信息" class="patient-card">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="患者姓名">
              <UserOutlined /> {{ appointment.patientName }}
            </a-descriptions-item>
            <a-descriptions-item v-if="appointment.patientPhone" label="联系电话">
              <PhoneOutlined /> {{ appointment.patientPhone }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-button v-if="canCancel" type="primary" danger size="large" @click="handleCancel">
            取消预约
          </a-button>
          <a-button size="large" @click="goToAppointments">
            返回列表
          </a-button>
        </div>

        <!-- 温馨提示 -->
        <a-alert
          v-if="appointment.status === 'confirmed'"
          message="温馨提示"
          description="请按时就诊。如需取消预约，请提前联系医院或在此页面取消。"
          type="info"
          show-icon
          closable
          class="tips-alert"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue';
import { store, Appointment, AppointmentStatus, Doctor } from '../store';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const appointment = ref<Appointment | null>(null);

const appointmentId = computed(() => route.params.id as string);

const doctor = computed(() => {
  if (!appointment.value) return null;
  return store.state.doctors.find(d => d.id === appointment.value!.doctorId) as Doctor | undefined;
});

onMounted(() => {
  loadAppointment();
});

const loadAppointment = () => {
  loading.value = true;
  appointment.value = store.getAppointmentById(appointmentId.value) || null;
  loading.value = false;
};

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

const getStatusHint = (status: AppointmentStatus): string => {
  const hintMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: '医生尚未确认，请耐心等待',
    [AppointmentStatus.CONFIRMED]: '预约已确认，请按时就诊',
    [AppointmentStatus.COMPLETED]: '您已完成就诊，祝您早日康复',
    [AppointmentStatus.CANCELLED]: '该预约已取消',
    [AppointmentStatus.REJECTED]: '该预约已被医生拒绝',
  };
  return hintMap[status] || '';
};

const canCancel = computed(() => {
  if (!appointment.value) return false;
  return (
    appointment.value.status === AppointmentStatus.PENDING ||
    appointment.value.status === AppointmentStatus.CONFIRMED
  );
});

const handleCancel = () => {
  if (!appointment.value) return;

  Modal.confirm({
    title: '确认取消预约',
    content: `确定要取消与 ${appointment.value.doctorName} 在 ${appointment.value.appointmentDate} ${appointment.value.timeSlot} 的预约吗？`,
    okText: '确认取消',
    okType: 'danger',
    cancelText: '返回',
    onOk() {
      const result = store.cancelAppointment(appointment.value!.id, '患者主动取消');
      if (result) {
        message.success('预约已取消');
        loadAppointment();
      } else {
        message.error('取消预约失败');
      }
    },
  });
};

const formatDateTime = (dateTime: string): string => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};

const goToAppointments = () => {
  router.push('/appointments');
};
</script>

<style scoped>
.appointment-detail-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.status-card {
  margin-bottom: 24px;
  text-align: center;
}

.status-display {
  padding: 24px;
}

.status-tag {
  font-size: 18px;
  padding: 8px 24px;
  margin-bottom: 12px;
}

.status-hint {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.info-card,
.doctor-card,
.patient-card {
  margin-bottom: 24px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.doctor-details h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.doctor-title {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin: 0 0 8px;
}

.doctor-location {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.doctor-location .anticon-environment {
  margin-right: 4px;
  color: #1890ff;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.tips-alert {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .doctor-info {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
