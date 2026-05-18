/**
 * 日期选择组件
 * 
 * 显示未来7天的可预约日期，支持日期选择
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="date-picker">
    <div class="date-picker-title">
      <CalendarOutlined />
      <span>选择预约日期</span>
    </div>
    <div class="date-list">
      <div
        v-for="date in availableDates"
        :key="date.date"
        class="date-item"
        :class="{
          'date-item-selected': selectedDate === date.date,
          'date-item-disabled': !date.hasSlots
        }"
        :style="{ opacity: date.hasSlots ? 1 : 0.5 }"
        @click="date.hasSlots && selectDate(date.date)"
      >
        <div class="date-weekday">{{ date.weekday }}</div>
        <div class="date-day">{{ date.day }}</div>
        <div class="date-month">{{ date.month }}</div>
        <div class="date-status">
          <span v-if="date.hasSlots" class="status-available">
            可预约
          </span>
          <span v-else class="status-unavailable">
            暂无排班
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CalendarOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

interface DateInfo {
  date: string;
  weekday: string;
  day: string;
  month: string;
  hasSlots: boolean;
}

interface Props {
  /** 选中的日期 */
  modelValue?: string;
  /** 排班日期列表 */
  scheduleDates?: string[];
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  scheduleDates: () => []
});

const emit = defineEmits<Emits>();

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 生成未来7天的日期列表
 */
const availableDates = computed<DateInfo[]>(() => {
  const dates: DateInfo[] = [];
  const today = dayjs();
  const scheduleSet = new Set(props.scheduleDates);

  for (let i = 1; i <= 7; i++) {
    const date = today.add(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    
    dates.push({
      date: dateStr,
      weekday: weekDays[date.day()],
      day: date.format('D'),
      month: date.format('M月'),
      hasSlots: scheduleSet.has(dateStr)
    });
  }

  return dates;
});

/**
 * 当前选中的日期
 */
const selectedDate = computed(() => props.modelValue);

/**
 * 选择日期
 */
const selectDate = (date: string) => {
  emit('update:modelValue', date);
};
</script>

<style scoped>
.date-picker {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.date-picker-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.date-list {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #fafafa;
}

.date-item:hover:not(.date-item-disabled) {
  background: #f0f5ff;
  border-color: #1890ff;
}

.date-item-selected {
  background: #e6f7ff !important;
  border-color: #1890ff !important;
}

.date-item-selected .date-day {
  color: #1890ff;
}

.date-item-disabled {
  cursor: not-allowed;
}

.date-weekday {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.date-day {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.date-month {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
}

.date-status {
  font-size: 11px;
}

.status-available {
  color: #52c41a;
}

.status-unavailable {
  color: #999;
}

@media (max-width: 768px) {
  .date-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .date-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
