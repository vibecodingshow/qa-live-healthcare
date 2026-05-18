/**
 * 预约列表项组件
 * 
 * 展示单个预约记录的基本信息和操作按钮
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="appointment-item" :class="{ 'is-cancelled': appointment.status === 'CANCELLED' }">
    <div class="item-header">
      <div class="doctor-info">
        <img :src="appointment.doctor.avatar" :alt="appointment.doctor.name" class="doctor-avatar" />
        <div class="doctor-details">
          <div class="doctor-name">{{ appointment.doctor.name }}</div>
          <div class="doctor-title">{{ appointment.doctor.title }}</div>
        </div>
      </div>
      <a-tag :color="statusColor" class="status-tag">
        {{ statusText }}
      </a-tag>
    </div>

    <div class="item-content">
      <div class="info-row">
        <CalendarOutlined class="info-icon" />
        <span class="info-label">预约日期：</span>
        <span class="info-value">{{ formattedDate }}</span>
      </div>
      <div class="info-row">
        <ClockCircleOutlined class="info-icon" />
        <span class="info-label">预约时间：</span>
        <span class="info-value">{{ appointment.startTime }} - {{ appointment.endTime }}</span>
      </div>
      <div class="info-row">
        <MedicineBoxOutlined class="info-icon" />
        <span class="info-label">预约科室：</span>
        <span class="info-value">{{ appointment.doctor.department }}</span>
      </div>
      <div class="info-row">
        <FileTextOutlined class="info-icon" />
        <span class="info-label">预约编号：</span>
        <span class="info-value appointment-no">{{ appointment.appointmentNo }}</span>
      </div>
    </div>

    <div v-if="appointment.reason" class="reason-section">
      <div class="reason-label">就诊原因：</div>
      <div class="reason-text">{{ appointment.reason }}</div>
    </div>

    <div v-if="appointment.doctorNote" class="note-section">
      <div class="note-label">医生备注：</div>
      <div class="note-text">{{ appointment.doctorNote }}</div>
    </div>

    <div v-if="appointment.cancelReason" class="cancel-section">
      <div class="cancel-label">取消原因：</div>
      <div class="cancel-text">
        {{ cancelReasonText }}
        <span v-if="appointment.cancelNote"> - {{ appointment.cancelNote }}</span>
      </div>
    </div>

    <div class="item-footer">
      <div class="footer-left">
        <span class="create-time">创建于 {{ formattedCreateTime }}</span>
      </div>
      <div class="footer-right">
        <a-button 
          v-if="showCancelButton"
          type="primary"
          danger
          size="small"
          :loading="cancelling"
          @click="handleCancel"
        >
          取消预约
        </a-button>
        <a-button 
          type="link"
          size="small"
          @click="handleViewDetail"
        >
          查看详情
        </a-button>
      </div>
    </div>

    <!-- 取消确认弹窗 -->
    <a-modal
      v-model:open="cancelModalVisible"
      title="取消预约"
      @ok="confirmCancel"
      @cancel="cancelModalVisible = false"
      :confirm-loading="confirmCancelling"
      :disabled="confirmCancelling"
    >
      <div class="cancel-modal-content">
        <a-alert
          type="warning"
          show-icon
          message="取消预约将释放您的号源，请确认是否取消"
          class="cancel-warning"
        />
        
        <a-form layout="vertical" class="cancel-form">
          <a-form-item label="取消原因" required>
            <a-select
              v-model:value="cancelForm.cancelReason"
              placeholder="请选择取消原因"
            >
              <a-select-option value="TIME_CONFLICT">时间冲突</a-select-option>
              <a-select-option value="CONDITION_CHANGED">病情变化</a-select-option>
              <a-select-option value="OTHER_DOCTOR">其他医生</a-select-option>
              <a-select-option value="OTHER">其他原因</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="补充说明（可选）">
            <a-textarea
              v-model:value="cancelForm.cancelNote"
              :rows="3"
              placeholder="请输入补充说明..."
              :maxlength="200"
              show-count
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import type { Appointment, CancelReason } from '../types';
import { 
  canCancelAppointment, 
  formatAppointmentDate,
  getAppointmentStatusText,
  getAppointmentStatusColor,
  getCancelReasonText
} from '../utils/appointment';

interface Props {
  /** 预约数据 */
  appointment: Appointment;
}

interface Emits {
  (e: 'cancel', appointment: Appointment, reason: { cancelReason: CancelReason; cancelNote?: string }, callback?: (error?: any) => void): void;
  (e: 'view-detail', appointment: Appointment): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 状态
const cancelling = ref(false);
const cancelModalVisible = ref(false);
const confirmCancelling = ref(false);

// 取消表单
const cancelForm = reactive({
  cancelReason: undefined as CancelReason | undefined,
  cancelNote: ''
});

/**
 * 格式化日期
 */
const formattedDate = computed(() => {
  return formatAppointmentDate(props.appointment.appointmentDate, 'YYYY年MM月DD日');
});

/**
 * 格式化创建时间
 */
const formattedCreateTime = computed(() => {
  return dayjs(props.appointment.createdAt).format('YYYY-MM-DD HH:mm');
});

/**
 * 状态文本
 */
const statusText = computed(() => {
  return getAppointmentStatusText(props.appointment.status);
});

/**
 * 状态颜色
 */
const statusColor = computed(() => {
  return getAppointmentStatusColor(props.appointment.status);
});

/**
 * 取消原因文本
 */
const cancelReasonText = computed(() => {
  if (!props.appointment.cancelReason) return '';
  return getCancelReasonText(props.appointment.cancelReason);
});

/**
 * 是否显示取消按钮
 */
const showCancelButton = computed(() => {
  // 检查是否在可取消时间内
  if (!canCancelAppointment(props.appointment.appointmentDate, props.appointment.startTime)) {
    return false;
  }
  
  // 只有活跃状态可以取消
  const cancellableStatuses = ['PENDING', 'CONFIRMED', 'SCHEDULED'];
  return cancellableStatuses.includes(props.appointment.status);
});

/**
 * 处理取消预约
 */
const handleCancel = () => {
  cancelForm.cancelReason = undefined;
  cancelForm.cancelNote = '';
  cancelModalVisible.value = true;
};

/**
 * 确认取消
 */
  const confirmCancel = async () => {
  if (!cancelForm.cancelReason) {
    message.warning('请选择取消原因');
    return;
  }

  confirmCancelling.value = true;

  try {
    // 等待父组件处理取消操作
    await new Promise<void>((resolve, reject) => {
      emit('cancel', props.appointment, {
        cancelReason: cancelForm.cancelReason,
        cancelNote: cancelForm.cancelNote || undefined
      }, (error?: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    
    cancelModalVisible.value = false;
    message.success('预约已取消');
  } catch (error: any) {
    message.error(error.message || '取消失败，请重试');
  } finally {
    confirmCancelling.value = false;
  }
};

/**
 * 查看详情
 */
const handleViewDetail = () => {
  emit('view-detail', props.appointment);
};
</script>

<style scoped>
.appointment-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.appointment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-item.is-cancelled {
  opacity: 0.7;
  background: #fafafa;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.doctor-title {
  font-size: 13px;
  color: #999;
}

.status-tag {
  font-size: 13px;
}

.item-content {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.info-icon {
  color: #1890ff;
  margin-right: 8px;
  font-size: 14px;
}

.info-label {
  color: #999;
  margin-right: 4px;
}

.info-value {
  color: #333;
}

.appointment-no {
  font-family: monospace;
  font-size: 13px;
  color: #666;
}

.reason-section,
.note-section,
.cancel-section {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.reason-label,
.note-label,
.cancel-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.reason-text,
.note-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.cancel-text {
  font-size: 14px;
  color: #ff4d4f;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.create-time {
  font-size: 12px;
  color: #999;
}

.footer-right {
  display: flex;
  gap: 8px;
}

.cancel-modal-content {
  padding: 8px 0;
}

.cancel-warning {
  margin-bottom: 20px;
}

.cancel-form {
  margin-top: 16px;
}

@media (max-width: 480px) {
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .doctor-info {
    width: 100%;
  }

  .item-footer {
    flex-direction: column;
    gap: 12px;
  }

  .footer-right {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
