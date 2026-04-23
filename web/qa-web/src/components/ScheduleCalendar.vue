<template>
  <a-card class="schedule-calendar" :bordered="false">
    <div class="calendar-header">
      <h3>{{ title || '排班日历' }}</h3>
      <div class="calendar-controls">
        <a-button-group>
          <a-button @click="prevMonth" :disabled="!canPrevMonth">
            <template #icon><left-outlined /></template>
            上个月
          </a-button>
          <a-button type="primary">{{ currentDate.format('YYYY年MM月') }}</a-button>
          <a-button @click="nextMonth" :disabled="!canNextMonth">
            下个月
            <template #icon><right-outlined /></template>
          </a-button>
          <a-button v-if="showTodayButton" @click="goToToday">
            今日
          </a-button>
        </a-button-group>
      </div>
    </div>
    
    <div class="calendar-grid">
      <div v-for="day in weekdays" :key="day" class="weekday-header">
        {{ day }}
      </div>
      
      <div 
        v-for="day in calendarDays" 
        :key="day.date"
        :class="['calendar-day', {
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'available': day.available,
          'selected': day.date === selectedDate
        }]"
        @click="selectDate(day)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div v-if="day.available" class="slot-info">
          <div :class="['slot-indicator', day.status]"></div>
          <span class="slot-count">{{ day.remainingSlots }}个</span>
        </div>
        <div v-else class="no-slot">
          <span v-if="day.isWeekend">休息</span>
          <span v-else>停诊</span>
        </div>
      </div>
    </div>
    
    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-color available"></div>
        <span>可预约</span>
      </div>
      <div class="legend-item">
        <div class="legend-color low_stock"></div>
        <span>号源紧张</span>
      </div>
      <div class="legend-item">
        <div class="legend-color full"></div>
        <span>已约满</span>
      </div>
      <div class="legend-item">
        <div class="legend-color suspended"></div>
        <span>停诊</span>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { DoctorScheduleCalendarResponse } from '@/services/doctor/types'
import { getDoctorScheduleCalendar } from '@/services/doctor'

dayjs.locale('zh-cn')

interface Props {
  doctorId: string
}

interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  available: boolean
  status: string
  remainingSlots: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  dateSelected: [date: string]
}>()

const currentDate = ref(dayjs())
const selectedDate = ref('')
const calendarData = ref<DoctorScheduleCalendarResponse[]>([])
const loading = ref(false)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed((): CalendarDay[] => {
  const startOfMonth = currentDate.value.startOf('month')
  const endOfMonth = currentDate.value.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')
  
  const days: CalendarDay[] = []
  let currentDay = startDate
  
  while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
    const dateStr = currentDay.format('YYYY-MM-DD')
    const calendarItem = calendarData.value.find(item => item.date === dateStr)
    
    days.push({
      date: dateStr,
      day: currentDay.date(),
      isCurrentMonth: currentDay.month() === currentDate.value.month(),
      isToday: currentDay.isSame(dayjs(), 'day'),
      isWeekend: currentDay.day() === 0 || currentDay.day() === 6,
      available: calendarItem?.available || false,
      status: calendarItem?.status || 'suspended',
      remainingSlots: calendarItem?.remainingSlots || 0
    })
    
    currentDay = currentDay.add(1, 'day')
  }
  
  return days
})

async function loadCalendarData() {
  loading.value = true
  try {
    const data = await getDoctorScheduleCalendar({
      doctorId: props.doctorId,
      year: currentDate.value.year(),
      month: currentDate.value.month() + 1
    })
    calendarData.value = data
  } catch (error) {
    console.error('加载排班日历失败:', error)
  } finally {
    loading.value = false
  }
}

function prevMonth() {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

function nextMonth() {
  currentDate.value = currentDate.value.add(1, 'month')
}

function selectDate(day: CalendarDay) {
  if (day.available && day.isCurrentMonth) {
    selectedDate.value = day.date
    emit('dateSelected', day.date)
  }
}

watch(currentDate, loadCalendarData, { immediate: true })

onMounted(() => {
  selectedDate.value = dayjs().format('YYYY-MM-DD')
})
</script>

<style scoped>
.schedule-calendar {
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.weekday-header {
  text-align: center;
  font-weight: 600;
  color: #666;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-day:hover {
  border-color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.calendar-day.other-month {
  color: #ccc;
  background: #fafafa;
}

.calendar-day.today {
  border-color: #1890ff;
  background: #e6f7ff;
}

.calendar-day.selected {
  border-color: #1890ff;
  background: #1890ff;
  color: white;
}

.calendar-day.available {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.calendar-day:not(.available) {
  cursor: not-allowed;
  opacity: 0.6;
}

.calendar-day:not(.available):hover {
  border-color: #f0f0f0;
  transform: none;
  box-shadow: none;
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.slot-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.slot-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.slot-indicator.available {
  background: #52c41a;
}

.slot-indicator.low_stock {
  background: #faad14;
}

.slot-indicator.full {
  background: #ff4d4f;
}

.slot-indicator.suspended {
  background: #d9d9d9;
}

.slot-count {
  font-size: 10px;
  color: inherit;
}

.no-slot {
  font-size: 10px;
  color: #999;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.available {
  background: #52c41a;
}

.legend-color.low_stock {
  background: #faad14;
}

.legend-color.full {
  background: #ff4d4f;
}

.legend-color.suspended {
  background: #d9d9d9;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .calendar-grid {
    gap: 4px;
  }
  
  .calendar-day {
    padding: 4px;
  }
  
  .day-number {
    font-size: 14px;
  }
  
  .slot-count, .no-slot {
    font-size: 8px;
  }
}
</style>