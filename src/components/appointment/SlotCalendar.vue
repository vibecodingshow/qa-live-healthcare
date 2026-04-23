<template>
  <div class="slot-calendar">
    <a-calendar
      v-model:value="selectedDate"
      :fullscreen="false"
      @select="handleSelect"
      @panel-change="handlePanelChange"
    >
      <template #dateFullCellRender="{ current }">
        <div
          class="custom-date-cell"
          :class="getDateCellClass(current)"
        >
          <span class="day-text">{{ current.date() }}</span>
          <span v-if="isWorkday(current) && hasAvailableSlots(current)" class="status-text">
            可预约
          </span>
        </div>
      </template>
    </a-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  availableDates: string[];
  modelValue?: Dayjs | null;
}

interface Emits {
  (e: 'update:modelValue', value: Dayjs | null): void;
  (e: 'select', date: Dayjs): void;
}

const props = withDefaults(defineProps<Props>(), {
  availableDates: () => [],
  modelValue: null,
});

const emit = defineEmits<Emits>();

// 初始值设为今天
const selectedDate = ref<Dayjs>(props.modelValue || dayjs());

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedDate.value = newVal;
  }
});

watch(selectedDate, (newVal) => {
  if (newVal) {
    emit('update:modelValue', newVal);
  }
});

// 判断是否为工作日（周一至周五）
const isWorkday = (date: Dayjs): boolean => {
  const day = date.day();
  return day >= 1 && day <= 5;
};

// 判断是否为周末
const isWeekend = (date: Dayjs): boolean => {
  return !isWorkday(date);
};

// 判断是否为过去日期
const isPast = (date: Dayjs): boolean => {
  const today = dayjs().startOf('day');
  return date.isBefore(today, 'day');
};

// 判断今天
const isToday = (date: Dayjs): boolean => {
  return date.isSame(dayjs(), 'day');
};

// 判断是否已选中
const isSelected = (date: Dayjs): boolean => {
  return date.isSame(selectedDate.value, 'day');
};

// 判断该日期是否有可用号源
const hasAvailableSlots = (date: Dayjs): boolean => {
  return props.availableDates.includes(date.format('YYYY-MM-DD'));
};

// 获取单元格样式类
const getDateCellClass = (date: Dayjs) => {
  return {
    'is-workday': isWorkday(date),
    'is-weekend': isWeekend(date),
    'is-past': isPast(date),
    'is-today': isToday(date),
    'is-selected': isSelected(date),
    'has-slots': hasAvailableSlots(date),
    'no-slots': isWorkday(date) && !hasAvailableSlots(date) && !isPast(date),
  };
};

// 处理面板变化
const handlePanelChange = (value: Dayjs) => {
  console.log('Panel changed to:', value.format('YYYY-MM'));
};

// 处理日期点击
const handleDateClick = (date: Dayjs) => {
  if (isPast(date)) return;
  if (isWeekend(date)) return;
  if (!hasAvailableSlots(date)) return;

  selectedDate.value = date;
  emit('select', date);
};

// 处理日历选择事件
const handleSelect = (date: Dayjs) => {
  if (isPast(date)) {
    selectedDate.value = dayjs();
    return;
  }
  if (isWeekend(date)) {
    return;
  }
  if (!hasAvailableSlots(date)) {
    selectedDate.value = date;
    return;
  }

  selectedDate.value = date;
  emit('select', date);
};
</script>

<style scoped>
.slot-calendar {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}

/* 自定义日期单元格 */
.custom-date-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  position: relative;
}

.day-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.status-text {
  font-size: 11px;
  color: #1890ff;
  margin-top: 2px;
}

/* 工作日有号源 */
.custom-date-cell.is-workday.has-slots {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
}

.custom-date-cell.is-workday.has-slots .day-text {
  color: #1890ff;
  font-weight: 600;
}

/* 工作日无号源 */
.custom-date-cell.is-workday.no-slots {
  background: #f5f5f5;
  opacity: 0.7;
}

.custom-date-cell.is-workday.no-slots .day-text {
  color: #999;
}

/* 选中日期 */
.custom-date-cell.is-selected {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%) !important;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.4);
}

.custom-date-cell.is-selected .day-text,
.custom-date-cell.is-selected .status-text {
  color: #fff !important;
}

/* 今天是工作日且有号源 */
.custom-date-cell.is-today.has-slots {
  border: 2px solid #52c41a;
}

/* 过去日期 */
.custom-date-cell.is-past {
  opacity: 0.3;
  cursor: not-allowed;
}

.custom-date-cell.is-past .day-text {
  color: #999;
}

/* 周末 */
.custom-date-cell.is-weekend {
  opacity: 0.4;
  cursor: not-allowed;
}

.custom-date-cell.is-weekend .day-text {
  color: #999;
}

@media (max-width: 768px) {
  .custom-date-cell {
    height: 50px;
  }

  .day-text {
    font-size: 14px;
  }

  .status-text {
    font-size: 9px;
  }
}
</style>
