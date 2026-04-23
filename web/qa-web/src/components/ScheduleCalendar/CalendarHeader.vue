<template>
  <div class="calendar-header">
    <h3 class="calendar-title">{{ title }}</h3>
    <div class="calendar-controls">
      <a-button-group>
        <a-button 
          @click="$emit('prev-month')" 
          :disabled="!canPrevMonth"
          size="small"
        >
          <template #icon><left-outlined /></template>
          上个月
        </a-button>
        <a-button type="primary" size="small">
          {{ currentDate.format('YYYY年MM月') }}
        </a-button>
        <a-button 
          @click="$emit('next-month')" 
          :disabled="!canNextMonth"
          size="small"
        >
          下个月
          <template #icon><right-outlined /></template>
        </a-button>
        <a-button 
          v-if="showTodayButton" 
          @click="$emit('go-today')"
          size="small"
        >
          今日
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

interface CalendarHeaderProps {
  currentDate: dayjs.Dayjs
  title?: string
  showTodayButton?: boolean
  canPrevMonth?: boolean
  canNextMonth?: boolean
}

interface CalendarHeaderEmits {
  (e: 'prev-month'): void
  (e: 'next-month'): void
  (e: 'go-today'): void
}

const props = withDefaults(defineProps<CalendarHeaderProps>(), {
  title: '排班日历',
  showTodayButton: true,
  canPrevMonth: true,
  canNextMonth: true
})

defineEmits<CalendarHeaderEmits>()
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.calendar-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.calendar-controls {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .calendar-title {
    text-align: center;
  }
  
  .calendar-controls {
    justify-content: center;
  }
}
</style>