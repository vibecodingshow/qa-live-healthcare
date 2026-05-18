<template>
  <a-card class="schedule-card" :bordered="false">
    <div class="schedule-header">
      <div class="date-info">
        <h3>{{ formatDate(schedule.scheduleDate) }}</h3>
        <span class="weekday">{{ getWeekday(schedule.scheduleDate) }}</span>
      </div>
      <a-tag :color="schedule.isAvailable ? 'green' : 'red'">
        {{ schedule.isAvailable ? '可用' : '停诊' }}
      </a-tag>
    </div>

    <div class="time-slots">
      <div v-for="slot in schedule.timeSlots" :key="slot.id" class="time-slot-item">
        <div class="slot-info">
          <span class="time-range">{{ slot.startTime }} - {{ slot.endTime }}</span>
          <span class="appointment-count">
            {{ slot.bookedAppointments }}/{{ slot.maxAppointments }} 人
          </span>
        </div>
        <a-progress 
          :percent="Math.round((slot.bookedAppointments / slot.maxAppointments) * 100)"
          :stroke-color="getProgressColor(slot)"
          size="small" 
          :show-info="false"
        />
      </div>
    </div>

    <div class="schedule-actions">
      <a-button type="link" size="small" @click="handleEdit">
        <template #icon><EditOutlined /></template>
        编辑
      </a-button>
      <a-button 
        type="link" 
        size="small" 
        danger 
        @click="handleDelete"
        :disabled="hasBookedAppointments"
      >
        <template #icon><DeleteOutlined /></template>
        删除
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { DoctorSchedule } from '../types/appointment';
import dayjs from 'dayjs';

interface Props {
  schedule: DoctorSchedule;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [schedule: DoctorSchedule];
  delete: [schedule: DoctorSchedule];
}>();

// 检查是否有已预约的时段
const hasBookedAppointments = computed(() => {
  return props.schedule.timeSlots.some(slot => slot.bookedAppointments > 0);
});

// 格式化日期显示
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM月DD日');
};

// 获取星期几
const getWeekday = (dateStr: string) => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const dayIndex = dayjs(dateStr).day();
  return `星期${weekdays[dayIndex]}`;
};

// 根据预约状态获取进度条颜色
const getProgressColor = (slot: any) => {
  const ratio = slot.bookedAppointments / slot.maxAppointments;
  if (ratio >= 0.8) return '#ff4d4f';
  if (ratio >= 0.5) return '#faad14';
  return '#52c41a';
};

// 处理编辑操作
const handleEdit = () => {
  emit('edit', props.schedule);
};

// 处理删除操作
const handleDelete = () => {
  emit('delete', props.schedule);
};
</script>

<style scoped>
.schedule-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.date-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.weekday {
  color: #8c8c8c;
  font-size: 12px;
}

.time-slots {
  margin-bottom: 16px;
}

.time-slot-item {
  margin-bottom: 12px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.time-slot-item:last-child {
  margin-bottom: 0;
}

.slot-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.time-range {
  font-weight: 500;
  color: #262626;
}

.appointment-count {
  font-size: 12px;
  color: #8c8c8c;
}

.schedule-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>