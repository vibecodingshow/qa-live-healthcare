<template>
  <div class="time-slot-grid">
    <div class="grid-header">
      <h3>选择时间段</h3>
      <div class="date-selector">
        <button class="date-nav" @click="prevDate">←</button>
        <div class="current-date">{{ formattedDate }}</div>
        <button class="date-nav" @click="nextDate">→</button>
      </div>
    </div>

    <div class="grid-content">
      <div class="time-slots">
        <div
          v-for="slot in timeSlots"
          :key="slot.id"
          class="time-slot"
          :class="{
            'is-selected': selectedSlotId === slot.id,
            'is-booked': slot.isBooked,
            'is-available': !slot.isBooked && slot.isAvailable
          }"
          @click="selectSlot(slot)"
        >
          <div class="slot-time">
            {{ slot.startTime }} - {{ slot.endTime }}
          </div>
          <div class="slot-status">
            <span v-if="slot.isBooked" class="status booked">
              已预约
            </span>
            <span v-else-if="slot.isAvailable" class="status available">
              可预约
            </span>
            <span v-else class="status unavailable">
              不可用
            </span>
          </div>
        </div>

        <div v-if="timeSlots.length === 0" class="empty-state">
          <p>该日期暂无可预约时间段</p>
        </div>
      </div>

      <div class="slot-summary">
        <div class="summary-item">
          <span class="summary-label">可选：</span>
          <span class="summary-value available">{{ availableCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">已预约：</span>
          <span class="summary-value booked">{{ bookedCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">已选：</span>
          <span class="summary-value selected">{{ selectedSlotId ? 1 : 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScheduleTimeSlot } from '../types/schedule';

interface Props {
  timeSlots: ScheduleTimeSlot[];
  selectedSlotId?: string;
  currentDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  timeSlots: () => [],
  selectedSlotId: '',
  currentDate: ''
});

const emit = defineEmits<{
  (e: 'slot-select', slot: ScheduleTimeSlot): void;
  (e: 'date-change', date: string): void;
}>();

// 格式化日期显示
const formattedDate = computed(() => {
  if (!props.currentDate) {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  const date = new Date(props.currentDate);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// 统计信息
const availableCount = computed(() => {
  return props.timeSlots.filter(slot => !slot.isBooked && slot.isAvailable).length;
});

const bookedCount = computed(() => {
  return props.timeSlots.filter(slot => slot.isBooked).length;
});

// 选择时间段
function selectSlot(slot: ScheduleTimeSlot) {
  if (!slot.isBooked && slot.isAvailable) {
    emit('slot-select', slot);
  }
}

// 日期导航
function prevDate() {
  if (!props.currentDate) return;
  const date = new Date(props.currentDate);
  date.setDate(date.getDate() - 1);
  emit('date-change', date.toISOString().split('T')[0]);
}

function nextDate() {
  if (!props.currentDate) return;
  const date = new Date(props.currentDate);
  date.setDate(date.getDate() + 1);
  emit('date-change', date.toISOString().split('T')[0]);
}
</script>

<style scoped>
.time-slot-grid {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.grid-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-nav {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.date-nav:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.current-date {
  font-size: 14px;
  color: #333;
  min-width: 120px;
  text-align: center;
}

.grid-content {
  padding: 20px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.time-slot {
  padding: 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.time-slot.is-available:hover {
  border-color: #52c41a;
  background: #f6ffed;
}

.time-slot.is-selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.time-slot.is-booked {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.time-slot.is-booked:hover {
  border-color: #e8e8e8;
}

.slot-time {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.slot-status {
  width: 100%;
  text-align: center;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.available {
  background: #f6ffed;
  color: #52c41a;
}

.status.booked {
  background: #f5f5f5;
  color: #999;
}

.status.unavailable {
  background: #fafafa;
  color: #d9d9d9;
}

.slot-summary {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-size: 14px;
  color: #666;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
}

.summary-value.available {
  color: #52c41a;
}

.summary-value.booked {
  color: #999;
}

.summary-value.selected {
  color: #1890ff;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px 24px;
  color: #999;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
