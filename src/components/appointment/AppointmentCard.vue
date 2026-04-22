<template>
  <a-card class="appointment-card" :class="statusClass">
    <div class="card-header">
      <div class="appointment-id">
        <span class="id-label">预约号：</span>
        <span class="id-value">{{ appointment.id }}</span>
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
          <span class="info-label">就诊时间</span>
          <span class="info-value">{{ appointment.appointmentTime }}</span>
        </div>
      </div>

      <div class="info-row">
        <MedicineBoxOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">医生科室</span>
          <span class="info-value">{{ appointment.department }}</span>
        </div>
      </div>

      <div class="info-row">
        <UserOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">医生姓名</span>
          <span class="info-value">{{ appointment.doctorName }}</span>
        </div>
      </div>

      <div class="info-row">
        <PhoneOutlined class="info-icon" />
        <div class="info-content">
          <span class="info-label">联系电话</span>
          <span class="info-value">{{ appointment.patientPhone }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer" v-if="appointment.status === 'pending'">
      <a-button type="primary" danger @click="handleCancel">
        取消预约
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Modal, message } from 'ant-design-vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue';
import { store, type Appointment } from '../../store';
import { notifyService } from '../../services/notifyService';
import { handleAppointmentError } from '../../utils/errorHandler';

const props = defineProps<{
  appointment: Appointment;
}>();

const emit = defineEmits<{
  (e: 'cancel', id: string): void;
}>();

// 取消操作进行中状态
const cancelling = ref(false);

const statusClass = computed(() => {
  return {
    'status-pending': props.appointment.status === 'pending',
    'status-completed': props.appointment.status === 'completed',
    'status-cancelled': props.appointment.status === 'cancelled',
  };
});

const statusColor = computed(() => {
  switch (props.appointment.status) {
    case 'pending':
      return 'processing';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
});

const statusText = computed(() => {
  switch (props.appointment.status) {
    case 'pending':
      return '待就诊';
    case 'completed':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return '未知';
  }
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
};

const handleCancel = () => {
  // 防止重复点击
  if (cancelling.value) {
    message.warning('正在处理中，请稍候');
    return;
  }

  Modal.confirm({
    title: '确认取消预约',
    content: `确定要取消预约 ${props.appointment.id} 吗？取消后将释放号源。`,
    okText: '确认取消',
    cancelText: '返回',
    okType: 'danger',
    async onOk() {
      cancelling.value = true;
      try {
        const result = store.cancelAppointment(props.appointment.id);
        if (result.success) {
          notifyService.appointmentCancelled();
          emit('cancel', props.appointment.id);
        } else {
          // 使用统一异常处理
          handleAppointmentError(new Error(result.error || '取消失败'));
        }
      } catch (error) {
        handleAppointmentError(error);
      } finally {
        cancelling.value = false;
      }
    },
  });
};
</script>

<style scoped>
.appointment-card {
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.appointment-card.status-pending {
  border-left: 4px solid #1890ff;
}

.appointment-card.status-completed {
  border-left: 4px solid #52c41a;
}

.appointment-card.status-cancelled {
  border-left: 4px solid #d9d9d9;
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.appointment-id {
  display: flex;
  align-items: center;
  gap: 4px;
}

.id-label {
  color: #666;
  font-size: 13px;
}

.id-value {
  color: #333;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.status-tag {
  font-size: 12px;
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

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
