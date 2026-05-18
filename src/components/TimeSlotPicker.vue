/**
 * 时段选择组件
 * 
 * 显示医生在某日期的可预约时段，支持时段选择
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="time-slot-picker">
    <div class="time-slot-title">
      <ClockCircleOutlined />
      <span>选择预约时段</span>
    </div>
    
    <div v-if="loading" class="time-slot-loading">
      <a-spin size="large" />
      <span>加载时段信息...</span>
    </div>
    
    <div v-else-if="timeSlots.length === 0" class="time-slot-empty">
      <ExclamationCircleOutlined />
      <span>暂无可预约时段</span>
    </div>
    
    <div v-else class="time-slot-list">
      <div
        v-for="slot in timeSlots"
        :key="slot.id"
        class="time-slot-item"
        :class="{
          'time-slot-selected': selectedSlot === slot.id,
          'time-slot-disabled': slot.remainingSlots <= 0
        }"
        @click="slot.remainingSlots > 0 && selectSlot(slot.id)"
      >
        <div class="slot-time">
          <ClockCircleOutlined />
          <span>{{ slot.startTime }} - {{ slot.endTime }}</span>
        </div>
        <div class="slot-capacity">
          <template v-if="slot.remainingSlots > 0">
            <span class="capacity-available">剩余 {{ slot.remainingSlots }} 个号源</span>
          </template>
          <template v-else>
            <span class="capacity-full">已约满</span>
          </template>
        </div>
      </div>
    </div>

    <div v-if="selectedSlotInfo" class="selected-info">
      <CheckCircleOutlined class="selected-icon" />
      <span>已选择：{{ selectedSlotInfo.startTime }} - {{ selectedSlotInfo.endTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons-vue';
import type { TimeSlot } from '../types';

interface Props {
  /** 选中的时段ID */
  modelValue?: string;
  /** 时段列表 */
  timeSlots: TimeSlot[];
  /** 加载状态 */
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  timeSlots: () => [],
  loading: false
});

const emit = defineEmits<Emits>();

/**
 * 当前选中的时段
 */
const selectedSlot = computed(() => props.modelValue);

/**
 * 选中的时段信息
 */
const selectedSlotInfo = computed(() => {
  if (!props.modelValue) return null;
  return props.timeSlots.find(slot => slot.id === props.modelValue);
});

/**
 * 选择时段
 */
const selectSlot = (slotId: string) => {
  emit('update:modelValue', slotId);
};
</script>

<style scoped>
.time-slot-picker {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.time-slot-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.time-slot-loading,
.time-slot-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  gap: 12px;
}

.time-slot-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.time-slot-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e8e8e8;
  background: #fafafa;
}

.time-slot-item:hover:not(.time-slot-disabled) {
  border-color: #1890ff;
  background: #f0f5ff;
}

.time-slot-selected {
  border-color: #1890ff !important;
  background: #e6f7ff !important;
}

.time-slot-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.slot-capacity {
  font-size: 13px;
}

.capacity-available {
  color: #52c41a;
}

.capacity-full {
  color: #ff4d4f;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #f6ffed;
  border-radius: 8px;
  color: #52c41a;
  font-size: 14px;
  font-weight: 500;
}

.selected-icon {
  font-size: 16px;
}

@media (max-width: 480px) {
  .time-slot-list {
    grid-template-columns: 1fr;
  }
}
</style>
