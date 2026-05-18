/**
 * 医生端预约列表项组件
 * 
 * 展示单个预约信息，支持确认/拒绝操作
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="doctor-appointment-item">
    <!-- 患者信息 -->
    <div class="patient-section">
      <a-avatar :size="48" class="patient-avatar">
        {{ patientInitials }}
      </a-avatar>
      <div class="patient-info">
        <div class="patient-name">{{ appointment.patient.name }}</div>
        <div class="patient-detail">
          {{ appointment.patient.gender === 'male' ? '男' : '女' }} · {{ appointment.patient.age }}岁
        </div>
      </div>
      <a-tag :color="statusColor" class="status-tag">
        {{ statusText }}
      </a-tag>
    </div>

    <!-- 预约信息 -->
    <div class="appointment-section">
      <div class="info-row">
        <CalendarOutlined class="info-icon" />
        <span class="info-text">{{ formatDate(appointment.appointmentDate) }}</span>
      </div>
      <div class="info-row">
        <ClockCircleOutlined class="info-icon" />
        <span class="info-text">{{ appointment.startTime }} - {{ appointment.endTime }}</span>
      </div>
      <div class="info-row">
        <ReadOutlined class="info-icon" />
        <span class="info-text reason">{{ appointment.reason || '未填写就诊原因' }}</span>
      </div>
    </div>

    <!-- 医生备注 -->
    <div v-if="appointment.doctorNote" class="doctor-note">
      <ExclamationCircleOutlined class="note-icon" />
      <span>您的备注：{{ appointment.doctorNote }}</span>
    </div>

    <!-- 操作按钮 -->
    <div class="action-section">
      <a-button @click="$emit('view-detail', appointment)">
        查看详情
      </a-button>
      
      <template v-if="canConfirm">
        <a-button type="primary" @click="$emit('confirm', appointment)">
          <CheckOutlined />
          确认预约
        </a-button>
      </template>
      
      <template v-if="canReject">
        <a-button danger @click="$emit('reject', appointment)">
          <CloseOutlined />
          拒绝
        </a-button>
      </template>

      <template v-if="canComplete">
        <a-button type="primary" color="green" @click="$emit('complete', appointment)">
          <CheckCircleOutlined />
          完成就诊
        </a-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  ReadOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import type { Appointment } from '../types';
import { AppointmentStatus } from '../types';
import { 
  getAppointmentStatusText, 
  getAppointmentStatusColor,
  isValidStatusTransition
} from '../utils/appointment';

/**
 * Props 定义
 */
interface Props {
  /** 预约数据 */
  appointment: Appointment;
}

const props = defineProps<Props>();

/**
 * 事件定义
 */
defineEmits<{
  /** 查看详情 */
  (e: 'view-detail', appointment: Appointment): void;
  /** 确认预约 */
  (e: 'confirm', appointment: Appointment): void;
  /** 拒绝预约 */
  (e: 'reject', appointment: Appointment): void;
  /** 完成就诊 */
  (e: 'complete', appointment: Appointment): void;
}>();

/**
 * 患者姓名首字母
 */
const patientInitials = computed(() => {
  const name = props.appointment.patient.name;
  return name.charAt(0).toUpperCase();
});

/**
 * 状态文本
 */
const statusText = computed(() => getAppointmentStatusText(props.appointment.status));

/**
 * 状态颜色
 */
const statusColor = computed(() => getAppointmentStatusColor(props.appointment.status));

/**
 * 是否可以确认
 */
const canConfirm = computed(() => {
  return isValidStatusTransition(
    props.appointment.status, 
    AppointmentStatus.CONFIRMED, 
    'doctor'
  );
});

/**
 * 是否可以拒绝
 */
const canReject = computed(() => {
  return isValidStatusTransition(
    props.appointment.status, 
    AppointmentStatus.REJECTED, 
    'doctor'
  );
});

/**
 * 是否可以完成
 */
const canComplete = computed(() => {
  return isValidStatusTransition(
    props.appointment.status, 
    AppointmentStatus.COMPLETED, 
    'doctor'
  );
});

/**
 * 格式化日期
 */
const formatDate = (date: string) => {
  const d = new Date(date);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[d.getDay()];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日 ${weekday}`;
};
</script>

<style scoped>
.doctor-appointment-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.doctor-appointment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 患者信息 */
.patient-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.patient-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 20px;
  font-weight: 600;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.patient-detail {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

.status-tag {
  border-radius: 20px;
}

/* 预约信息 */
.appointment-section {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-icon {
  color: #999;
  font-size: 14px;
  margin-top: 2px;
}

.info-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.info-text.reason {
  color: #333;
}

/* 医生备注 */
.doctor-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #fffbe6;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #ad6800;
}

.note-icon {
  color: #faad14;
  margin-top: 2px;
}

/* 操作按钮 */
.action-section {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 480px) {
  .patient-section {
    flex-wrap: wrap;
  }

  .status-tag {
    order: -1;
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
  }

  .action-section {
    flex-direction: column;
  }

  .action-section :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
