<template>
  <div class="time-slot-picker">
    <div class="slot-section">
      <div class="section-header">
        <CalendarOutlined class="header-icon morning" />
        <span class="section-title">上午</span>
        <span class="time-range">{{ morningTimeRange }}</span>
      </div>
      <div class="slot-cards">
        <div
          v-for="slot in morningSlots"
          :key="slot.id"
          class="slot-card"
          :class="{
            'is-selected': selectedSlot?.id === slot.id,
            'is-disabled': !slot.isAvailable,
            'is-full': !slot.isAvailable,
          }"
          @click="handleSlotClick(slot)"
        >
          <div class="slot-info">
            <ClockCircleOutlined class="slot-icon" />
            <span class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</span>
          </div>
          <div class="slot-status">
            <template v-if="slot.isAvailable">
              <span class="remaining-count">
                剩余 <span class="count">{{ slot.maxPatients - slot.currentCount }}</span> 个号源
              </span>
              <span class="progress-wrapper">
                <a-progress
                  :percent="getProgressPercent(slot)"
                  :show-info="false"
                  :stroke-color="getProgressColor(slot)"
                  size="small"
                />
              </span>
            </template>
            <template v-else>
              <a-tag color="error" class="full-tag">
                <CloseCircleOutlined /> 已约满
              </a-tag>
            </template>
          </div>
          <div v-if="selectedSlot?.id === slot.id" class="selected-indicator">
            <CheckCircleFilled />
          </div>
        </div>
      </div>
    </div>

    <div class="slot-section">
      <div class="section-header">
        <CalendarOutlined class="header-icon afternoon" />
        <span class="section-title">下午</span>
        <span class="time-range">{{ afternoonTimeRange }}</span>
      </div>
      <div class="slot-cards">
        <div
          v-for="slot in afternoonSlots"
          :key="slot.id"
          class="slot-card"
          :class="{
            'is-selected': selectedSlot?.id === slot.id,
            'is-disabled': !slot.isAvailable,
            'is-full': !slot.isAvailable,
          }"
          @click="handleSlotClick(slot)"
        >
          <div class="slot-info">
            <ClockCircleOutlined class="slot-icon" />
            <span class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</span>
          </div>
          <div class="slot-status">
            <template v-if="slot.isAvailable">
              <span class="remaining-count">
                剩余 <span class="count">{{ slot.maxPatients - slot.currentCount }}</span> 个号源
              </span>
              <span class="progress-wrapper">
                <a-progress
                  :percent="getProgressPercent(slot)"
                  :show-info="false"
                  :stroke-color="getProgressColor(slot)"
                  size="small"
                />
              </span>
            </template>
            <template v-else>
              <a-tag color="error" class="full-tag">
                <CloseCircleOutlined /> 已约满
              </a-tag>
            </template>
          </div>
          <div v-if="selectedSlot?.id === slot.id" class="selected-indicator">
            <CheckCircleFilled />
          </div>
        </div>
      </div>
    </div>

    <div v-if="slots.length === 0" class="empty-state">
      <CalendarOutlined class="empty-icon" />
      <p>该日期暂无可预约时段</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleFilled,
} from '@ant-design/icons-vue';
import type { AppointmentSlot } from '../../store';

interface Props {
  slots: AppointmentSlot[];
  modelValue?: AppointmentSlot | null;
}

interface Emits {
  (e: 'update:modelValue', slot: AppointmentSlot | null): void;
  (e: 'select', slot: AppointmentSlot): void;
}

const props = withDefaults(defineProps<Props>(), {
  slots: () => [],
  modelValue: null,
});

const emit = defineEmits<Emits>();

const selectedSlot = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const morningSlots = computed(() =>
  props.slots.filter(slot => slot.timeSlot === 'morning')
);

const afternoonSlots = computed(() =>
  props.slots.filter(slot => slot.timeSlot === 'afternoon')
);

const morningTimeRange = computed(() => {
  if (morningSlots.value.length > 0) {
    const first = morningSlots.value[0];
    return `${first.startTime} - ${first.endTime}`;
  }
  return '09:00 - 12:00';
});

const afternoonTimeRange = computed(() => {
  if (afternoonSlots.value.length > 0) {
    const first = afternoonSlots.value[0];
    return `${first.startTime} - ${first.endTime}`;
  }
  return '14:00 - 17:00';
});

const getProgressPercent = (slot: AppointmentSlot): number => {
  if (slot.maxPatients === 0) return 0;
  return Math.round((slot.currentCount / slot.maxPatients) * 100);
};

const getProgressColor = (slot: AppointmentSlot): string => {
  const percent = getProgressPercent(slot);
  if (percent >= 80) return '#ff4d4f';
  if (percent >= 50) return '#faad14';
  return '#52c41a';
};

const handleSlotClick = (slot: AppointmentSlot) => {
  if (!slot.isAvailable) return;
  selectedSlot.value = slot;
  emit('select', slot);
};
</script>

<style scoped>
.time-slot-picker {
  padding: 16px 0;
}

.slot-section {
  margin-bottom: 24px;
}

.slot-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.header-icon {
  font-size: 18px;
  margin-right: 8px;
}

.header-icon.morning {
  color: #1890ff;
}

.header-icon.afternoon {
  color: #722ed1;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-right: 12px;
}

.time-range {
  font-size: 13px;
  color: #666;
}

.slot-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.slot-card {
  position: relative;
  padding: 16px;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.slot-card:hover:not(.is-disabled) {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.slot-card.is-selected {
  border-color: #1890ff;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  box-shadow: 0 2px 12px rgba(24, 144, 255, 0.3);
}

.slot-card.is-disabled {
  cursor: not-allowed;
  opacity: 0.7;
  background: #fafafa;
}

.slot-card.is-full {
  border-color: #ffccc7;
}

.slot-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.slot-icon {
  font-size: 14px;
  color: #666;
  margin-right: 6px;
}

.slot-time {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.slot-status {
  margin-top: 8px;
}

.remaining-count {
  font-size: 12px;
  color: #666;
}

.remaining-count .count {
  font-weight: 600;
  color: #52c41a;
  font-size: 14px;
}

.progress-wrapper {
  display: block;
  margin-top: 6px;
}

.full-tag {
  font-size: 12px;
}

.selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 20px;
  color: #1890ff;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .slot-cards {
    grid-template-columns: 1fr;
  }

  .slot-card {
    padding: 12px;
  }

  .section-header {
    padding: 6px 10px;
  }

  .section-title {
    font-size: 14px;
  }

  .time-range {
    font-size: 12px;
  }
}
</style>
