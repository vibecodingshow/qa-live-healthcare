<template>
  <div class="calendar-grid">
    <!-- 周标题 -->
    <div class="week-header">
      <div 
        v-for="day in weekDays" 
        :key="day" 
        class="week-day"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- 日期网格 -->
    <div class="date-grid">
      <CalendarDay
        v-for="date in calendarDates"
        :key="date.date.toISOString()"
        :date="date.date"
        :is-current-month="date.isCurrentMonth"
        :is-today="date.isToday"
        :is-selected="date.isSelected"
        :is-disabled="date.isDisabled"
        :status="date.status"
        @click="handleDateClick(date)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import CalendarDay from './CalendarDay.vue'
import { type DateMark } from './types'

interface CalendarGridProps {
  currentDate: dayjs.Dayjs
  markedDates?: DateMark[]
  selectedDate?: Date
  weekStartsOn?: 0 | 1
  disablePast?: boolean
}

interface CalendarGridEmits {
  (e: 'select', date: Date): void
}

const props = withDefaults(defineProps<CalendarGridProps>(), {
  markedDates: () => [],
  weekStartsOn: 1,
  disablePast: true
})

const emit = defineEmits<CalendarGridEmits>()

// 周标题（根据weekStartsOn调整）
const weekDays = computed(() => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  if (props.weekStartsOn === 0) {
    // 周日为起始
    return days
  } else {
    // 周一为起始
    return [...days.slice(1), days[0]]
  }
})

// 生成日历日期数组
const calendarDates = computed(() => {
  const currentMonth = props.currentDate
  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  
  // 计算日历起始日期（包含上个月的部分日期）
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')
  
  const dates = []
  let currentDate = startDate
  
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const date = currentDate.toDate()
    const isCurrentMonth = currentDate.month() === currentMonth.month()
    const isToday = currentDate.isSame(dayjs(), 'day')
    const isSelected = props.selectedDate 
      ? currentDate.isSame(dayjs(props.selectedDate), 'day')
      : false
    
    // 判断是否禁用
    const isPast = currentDate.isBefore(dayjs(), 'day')
    const isDisabled = (props.disablePast && isPast) || !isCurrentMonth
    
    // 获取日期状态
    const status = props.markedDates.find(mark => 
      dayjs(mark.date).isSame(currentDate, 'day')
    )?.status
    
    dates.push({
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled,
      status
    })
    
    currentDate = currentDate.add(1, 'day')
  }
  
  return dates
})

// 日期点击处理
const handleDateClick = (dateInfo: { date: Date; isDisabled: boolean }) => {
  if (!dateInfo.isDisabled) {
    emit('select', dateInfo.date)
  }
}
</script>

<style scoped>
.calendar-grid {
  width: 100%;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  padding: 8px 4px;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}
</style>