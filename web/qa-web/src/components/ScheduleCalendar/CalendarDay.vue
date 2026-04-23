<template>
  <div
    class="calendar-day"
    :class="dayClasses"
    @click="handleClick"
  >
    <div class="day-number">
      {{ dayjs(date).date() }}
    </div>
    <div v-if="status" class="day-status" :class="statusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

interface CalendarDayProps {
  date: Date
  isCurrentMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  status?: 'available' | 'limited' | 'full' | 'closed' | 'past'
}

interface CalendarDayEmits {
  (e: 'click'): void
}

const props = defineProps<CalendarDayProps>()
const emit = defineEmits<CalendarDayEmits>()

// 日期状态类名
const statusClass = computed(() => {
  switch (props.status) {
    case 'available': return 'status-available'
    case 'limited': return 'status-limited'
    case 'full': return 'status-full'
    case 'closed': return 'status-closed'
    case 'past': return 'status-past'
    default: return ''
  }
})

// 日期状态文本
const statusText = computed(() => {
  switch (props.status) {
    case 'available': return '可约'
    case 'limited': return '紧张'
    case 'full': return '已满'
    case 'closed': return '停诊'
    case 'past': return '过期'
    default: return ''
  }
})

// 组合类名
const dayClasses = computed(() => ({
  'current-month': props.isCurrentMonth,
  'other-month': !props.isCurrentMonth,
  'today': props.isToday,
  'selected': props.isSelected,
  'disabled': props.isDisabled,
  'has-status': !!props.status
}))

// 点击处理
const handleClick = () => {
  if (!props.isDisabled) {
    emit('click')
  }
}
</script>

<style scoped>
.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 4px;
  min-height: 48px;
  
  &.other-month {
    opacity: 0.3;
    cursor: default;
  }
  
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
  
  &.today {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
  }
  
  &.selected {
    background-color: #1890ff;
    color: white;
    
    .day-status {
      color: white;
    }
  }
  
  &:not(.disabled):not(.other-month):hover {
    background-color: #f0f0f0;
  }
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.day-status {
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
}

.status-available {
  color: #52c41a;
}

.status-limited {
  color: #faad14;
}

.status-full {
  color: #ff4d4f;
}

.status-closed {
  color: #8c8c8c;
}

.status-past {
  color: #bfbfbf;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 40px;
    padding: 2px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .day-status {
    font-size: 9px;
  }
}
</style>