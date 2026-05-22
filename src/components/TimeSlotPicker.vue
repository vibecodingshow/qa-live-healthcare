<template>
  <a-card class="time-slot-picker" :bordered="false">
    <template #title>
      <div class="card-title">
        <CalendarOutlined />
        <span>选择就诊时段</span>
      </div>
    </template>

    <div v-if="availableSlots.length === 0" class="no-slots">
      <ExclamationCircleOutlined class="warning-icon" />
      <span>暂无可预约时段</span>
    </div>

    <div v-else class="slots-container">
      <div
        v-for="slot in allSlots"
        :key="slot.type"
        class="slot-item"
        :class="{
          'slot-available': isSlotAvailable(slot.type),
          'slot-disabled': !isSlotAvailable(slot.type),
          'slot-selected': selectedSlot === slot.type
        }"
        @click="handleSelect(slot.type)"
      >
        <div class="slot-icon">
          <ClockCircleOutlined v-if="slot.type === 'MORNING'" />
          <CalendarOutlined v-else-if="slot.type === 'AFTERNOON'" />
          <FieldTimeOutlined v-else />
        </div>
        <div class="slot-info">
          <div class="slot-name">{{ slot.label }}</div>
          <div class="slot-time">{{ slot.time }}</div>
          <div class="slot-remaining">
            <template v-if="isSlotAvailable(slot.type)">
              <a-tag color="success">剩余 {{ getRemainingSlots(slot.type) }} 个号源</a-tag>
            </template>
            <template v-else>
              <a-tag color="error">已约满</a-tag>
            </template>
          </div>
        </div>
        <div v-if="selectedSlot === slot.type" class="slot-check">
          <CheckCircleFilled style="color: #1890ff; font-size: 20px;" />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleFilled, FieldTimeOutlined } from '@ant-design/icons-vue';
import type { Schedule, TimeSlotType } from '@/data/appointment';
import { TimeSlot } from '@/data/appointment';

interface Props {
  doctorId: string;
  selectedDate: string;
  schedules: Schedule[];
  /** 当前选中的时段，由父组件控制 */
  modelValue?: TimeSlotType | null;
}

interface Emits {
  (e: 'select', slot: TimeSlotType): void;
  (e: 'update:modelValue', slot: TimeSlotType): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null
});
const emit = defineEmits<Emits>();

// 时段配置
const slotConfig = [
  {
    type: TimeSlot.MORNING,
    label: '上午',
    time: '08:00 - 12:00'
  },
  {
    type: TimeSlot.AFTERNOON,
    label: '下午',
    time: '14:00 - 18:00'
  },
  {
    type: TimeSlot.EVENING,
    label: '晚上',
    time: '18:00 - 21:00'
  }
];

const allSlots = slotConfig;

// 选中状态由父组件通过 modelValue 控制
const selectedSlot = computed(() => props.modelValue);

// 可预约的时段列表
const availableSlots = computed(() => {
  return props.schedules.filter(s => s.isOpen && s.bookedSlots < s.totalSlots);
});

// 获取指定时段的排班信息
const getSlotInfo = (slotType: TimeSlotType): Schedule | undefined => {
  return props.schedules.find(s => s.timeSlot === slotType);
};

// 获取剩余号源数
const getRemainingSlots = (slotType: TimeSlotType): number => {
  const schedule = getSlotInfo(slotType);
  if (!schedule) return 0;
  return schedule.totalSlots - schedule.bookedSlots;
};

// 检查时段是否可预约
const isSlotAvailable = (slotType: TimeSlotType): boolean => {
  const schedule = getSlotInfo(slotType);
  if (!schedule) return false;
  return schedule.isOpen && schedule.bookedSlots < schedule.totalSlots;
};

// 处理选择
const handleSelect = (slotType: TimeSlotType) => {
  if (!isSlotAvailable(slotType)) return;
  emit('select', slotType);
  emit('update:modelValue', slotType);
};
</script>

<style scoped>
.time-slot-picker {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.no-slots {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.slots-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slot-available {
  background: #fff;
  border-color: #f0f0f0;
}

.slot-available:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.slot-disabled {
  background: #fafafa;
  cursor: not-allowed;
  opacity: 0.7;
}

.slot-selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.slot-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f7ff;
  border-radius: 50%;
  font-size: 24px;
  color: #1890ff;
}

.slot-info {
  flex: 1;
  margin-left: 16px;
}

.slot-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.slot-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.slot-remaining {
  display: flex;
  align-items: center;
}

.slot-check {
  margin-left: auto;
}
</style>
