<template>
  <a-card class="patient-card" :class="statusClass">
    <div class="card-header">
      <div class="patient-info">
        <a-avatar :size="48" class="patient-avatar">
          {{ appointment.patientName?.charAt(0) || '?' }}
        </a-avatar>
        <div class="patient-details">
          <div class="patient-name">{{ appointment.patientName }}</div>
          <div class="patient-phone">
            <PhoneOutlined /> {{ appointment.patientPhone }}
          </div>
        </div>
      </div>
      <a-tag :color="statusColor" class="status-tag">
        {{ statusText }}
      </a-tag>
    </div>

    <div class="card-body">
      <div class="info-row">
        <CalendarOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">就诊日期</span>
          <span class="info-value">{{ formatDate(appointment.appointmentDate) }}</span>
        </div>
      </div>

      <div class="info-row">
        <ClockCircleOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">就诊时段</span>
          <span class="info-value">{{ appointment.appointmentTime }}</span>
        </div>
      </div>

      <div class="info-row">
        <QrcodeOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">预约号</span>
          <span class="info-value appointment-id">{{ appointment.id }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer" v-if="appointment.status === 'pending'">
      <a-button type="primary" success @click="handleMarkArrived">
        <CheckOutlined /> 标记到诊
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  QrcodeOutlined,
  CheckOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue';
import { type Appointment } from '../../store';

const props = defineProps<{
  appointment: Appointment;
}>();

const emit = defineEmits<{
  (e: 'markArrived', id: string): void;
}>();

const statusClass = computed(() => {
  return {
    'status-pending': props.appointment.status === 'pending',
    'status-completed': props.appointment.status === 'completed',
  };
});

const statusColor = computed(() => {
  switch (props.appointment.status) {
    case 'pending':
      return 'processing';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
});

const statusText = computed(() => {
  switch (props.appointment.status) {
    case 'pending':
      return '待到诊';
    case 'completed':
      return '已到诊';
    default:
      return '未知';
  }
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
};

const handleMarkArrived = () => {
  emit('markArrived', props.appointment.id);
};
</script>

<style scoped>
.patient-card {
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.patient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.patient-card.status-pending {
  border-left: 4px solid #1890ff;
}

.patient-card.status-completed {
  border-left: 4px solid #52c41a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 20px;
  font-weight: 600;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patient-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.patient-phone {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-tag {
  font-size: 13px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  color: #1890ff;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  color: #999;
  font-size: 12px;
}

.info-value {
  color: #333;
  font-size: 14px;
}

.appointment-id {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  color: #1890ff;
  font-weight: 600;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.card-footer :deep(.ant-btn-success) {
  background: #52c41a;
  border-color: #52c41a;
}

.card-footer :deep(.ant-btn-success:hover) {
  background: #73d13d;
  border-color: #73d13d;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
