<template>
  <div class="schedule-calendar">
    <CalendarHeader
      :current-date="currentDate"
      :title="title"
      :show-today-button="showTodayButton"
      :can-prev-month="canPrevMonth"
      :can-next-month="canNextMonth"
      @prev-month="prevMonth"
      @next-month="nextMonth"
      @go-today="goToToday"
    />
    
    <div class="calendar-content">
      <Transition name="month-slide" mode="out-in">
        <CalendarGrid
          :key="currentDate.format('YYYY-MM')"
          :current-date="currentDate"
          :marked-dates="markedDates"
          :selected-date="selectedDate"
          :week-starts-on="weekStartsOn"
          :disable-past="disablePast"
          @select="handleDateSelect"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import CalendarHeader from './CalendarHeader.vue'
import CalendarGrid from './CalendarGrid.vue'
import { type CalendarProps, type CalendarEmits, type DateMark } from './types'

// Props
const props = withDefaults(defineProps<CalendarProps>(), {
  title: '排班日历',
  markedDates: () => [],
  weekStartsOn: 1, // 默认周一为起始
  disablePast: true,
  showTodayButton: true,
  startDate: undefined,
  endDate: undefined
})

// Emits
const emit = defineEmits<CalendarEmits>()

// 当前显示的月份
const currentDate = ref(dayjs(props.selectedDate || dayjs()))

// 是否可以切换到上个月
const canPrevMonth = computed(() => {
  if (!props.startDate) return true
  const prevMonth = currentDate.value.subtract(1, 'month')
  return prevMonth.isAfter(props.startDate) || prevMonth.isSame(props.startDate, 'month')
})

// 是否可以切换到下个月
const canNextMonth = computed(() => {
  if (!props.endDate) return true
  const nextMonth = currentDate.value.add(1, 'month')
  return nextMonth.isBefore(props.endDate) || nextMonth.isSame(props.endDate, 'month')
})

// 月份切换
const prevMonth = () => {
  if (canPrevMonth.value) {
    currentDate.value = currentDate.value.subtract(1, 'month')
    emit('month-change', currentDate.value.toDate())
  }
}

const nextMonth = () => {
  if (canNextMonth.value) {
    currentDate.value = currentDate.value.add(1, 'month')
    emit('month-change', currentDate.value.toDate())
  }
}

// 回到今天
const goToToday = () => {
  currentDate.value = dayjs()
  emit('month-change', currentDate.value.toDate())
}

// 日期选择处理
const handleDateSelect = (date: Date) => {
  emit('select', date)
}

// 监听selectedDate变化
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    currentDate.value = dayjs(newDate)
  }
})

// 监听月份范围变化
watch(() => [props.startDate, props.endDate], () => {
  // 确保当前月份在允许的范围内
  if (props.startDate && currentDate.value.isBefore(props.startDate, 'month')) {
    currentDate.value = dayjs(props.startDate)
  }
  if (props.endDate && currentDate.value.isAfter(props.endDate, 'month')) {
    currentDate.value = dayjs(props.endDate)
  }
})
</script>

<style scoped>
.schedule-calendar {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.calendar-content {
  position: relative;
  min-height: 300px;
}
</style>

<style>
/* 月份切换动画 */
.month-slide-enter-active {
  transition: all 0.3s ease-out;
}

.month-slide-leave-active {
  transition: all 0.3s ease-in;
}

.month-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.month-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>