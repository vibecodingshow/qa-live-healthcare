<template>
  <div class="doctor-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <a-button type="link" @click="goBack" class="back-btn">
        <template #icon><left-outlined /></template>
        返回医生列表
      </a-button>
      <h1>医生详情</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <a-result
        status="error"
        title="加载失败"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="loadDoctorDetail">
            重新加载
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 医生不存在 -->
    <div v-else-if="!doctor" class="not-found-container">
      <a-result
        status="404"
        title="医生不存在"
        sub-title="请检查医生ID是否正确"
      >
        <template #extra>
          <a-button type="primary" @click="goBack">
            返回医生列表
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 医生详情内容 -->
    <div v-else class="doctor-content">
      <!-- 医生信息卡片 -->
      <DoctorInfoCard :doctor="doctor" />

      <!-- 排班日历 -->
      <ScheduleCalendar 
        :title="`${doctor.name}医生的排班`"
        :marked-dates="markedDates"
        :selected-date="selectedDate"
        :disable-past="true"
        :show-today-button="true"
        @select="handleDateSelected"
        @month-change="handleMonthChange"
      />

      <!-- 时段选择器 -->
      <div class="time-slot-section">
        <a-card class="time-slot-header" :bordered="false">
          <div class="header-content">
            <h3>{{ selectedDate ? formatSelectedDate(selectedDate) : '请选择日期' }}</h3>
            <div v-if="selectedDate" class="date-status">
              <span class="status-label">状态：</span>
              <SlotStatusBadge 
                v-if="currentSchedule"
                :status="getScheduleStatus(currentSchedule)"
                :show-text="true"
                :show-icon="true"
                :show-count="true"
                :remaining-slots="currentSchedule.remainingSlots"
                :total-slots="currentSchedule.totalSlots"
                size="medium"
              />
              <span v-else class="no-schedule">暂无排班信息</span>
            </div>
          </div>
        </a-card>
        
        <TimeSlotPicker
          :selected-date="selectedDate"
          :time-slots="currentTimeSlots"
          @slot-selected="handleSlotSelected"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
import DoctorInfoCard from '@/components/DoctorInfoCard.vue'
import ScheduleCalendar from '@/components/ScheduleCalendar/index.vue'
import TimeSlotPicker from '@/components/TimeSlotPicker.vue'
import SlotStatusBadge from '@/components/SlotStatus/SlotStatusBadge.vue'
import { SlotStatus } from '@/components/SlotStatus/types'
import type { DoctorInfo, DoctorScheduleDetail } from '@/services/doctor/types'
import type { DateMark } from '@/components/ScheduleCalendar/types'
import dayjs from 'dayjs'
import { getDoctorDetail } from '@/services/doctor'

const route = useRoute()
const router = useRouter()

const doctorId = ref('')
const doctor = ref<DoctorInfo | null>(null)
const schedules = ref<DoctorScheduleDetail[]>([])
const selectedDate = ref('')
const selectedSlot = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// 将排班数据转换为日历组件需要的格式
const markedDates = computed<DateMark[]>(() => {
  return schedules.value.map(schedule => {
    const date = new Date(schedule.scheduleDate)
    
    // 将后端状态映射到前端状态
    let status: DateMark['status'] = 'available'
    switch (schedule.status) {
      case 'available':
        status = schedule.remainingSlots > 0 
          ? (schedule.remainingSlots < 5 ? 'limited' : 'available')
          : 'full'
        break
      case 'suspended':
        status = 'closed'
        break
      case 'full':
        status = 'full'
        break
      default:
        status = 'available'
    }
    
    return {
      date,
      status,
      remainingSlots: schedule.remainingSlots,
      totalSlots: schedule.totalSlots
    }
  })
})

// 获取当前选中日期的排班信息
const currentSchedule = computed(() => {
  if (!selectedDate.value) return null
  
  return schedules.value.find(s => s.scheduleDate === selectedDate.value) || null
})

// 获取当前选中日期的时段列表
const currentTimeSlots = computed(() => {
  if (!selectedDate.value) return []
  
  const schedule = schedules.value.find(s => s.scheduleDate === selectedDate.value)
  return schedule ? schedule.timeSlots : []
})

// 将排班状态映射到SlotStatus枚举
function getScheduleStatus(schedule: DoctorScheduleDetail): SlotStatus {
  switch (schedule.status) {
    case 'available':
      return schedule.remainingSlots > 0 
        ? (schedule.remainingSlots < 5 ? SlotStatus.LOW_STOCK : SlotStatus.AVAILABLE)
        : SlotStatus.FULL
    case 'suspended':
      return SlotStatus.SUSPENDED
    case 'full':
      return SlotStatus.FULL
    default:
      return SlotStatus.AVAILABLE
  }
}

// 格式化选中日期
function formatSelectedDate(dateStr: string) {
  const date = dayjs(dateStr)
  return date.format('YYYY年MM月DD日 dddd')
}

// 加载医生详情
async function loadDoctorDetail() {
  if (!doctorId.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await getDoctorDetail(doctorId.value)
    doctor.value = response.doctor
    schedules.value = response.schedules
    
    // 默认选择今天或第一个可预约的日期
    const today = new Date().toISOString().split('T')[0]
    const todaySchedule = response.schedules.find(s => s.scheduleDate === today)
    const firstAvailable = response.schedules.find(s => s.status !== 'suspended')
    
    selectedDate.value = todaySchedule ? today : (firstAvailable ? firstAvailable.scheduleDate : '')
  } catch (err) {
    console.error('加载医生详情失败:', err)
    error.value = '加载医生详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 处理日期选择
function handleDateSelected(date: Date) {
  selectedDate.value = dayjs(date).format('YYYY-MM-DD')
  selectedSlot.value = null
}

// 处理月份切换
function handleMonthChange(date: Date) {
  console.log('月份切换到:', dayjs(date).format('YYYY年MM月'))
  // 这里可以加载新月份的排班数据
}

// 处理时段选择
function handleSlotSelected(slot: any) {
  selectedSlot.value = slot
  
  // 这里可以跳转到预约确认页面
  console.log('选择的时段:', {
    doctor: doctor.value?.name,
    date: selectedDate.value,
    slot: selectedSlot.value
  })
}

// 返回医生列表
function goBack() {
  router.push('/doctors')
}

onMounted(() => {
  doctorId.value = route.params.id as string
  
  if (doctorId.value) {
    loadDoctorDetail()
  }
})
</script>

<style scoped>
.doctor-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  color: #fff;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff !important;
  font-size: 14px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0;
}

.loading-container,
.error-container,
.not-found-container {
  padding: 100px 24px;
  text-align: center;
  background: #fff;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.time-slot-section {
  display: grid;
  gap: 16px;
}

.time-slot-header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.date-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 14px;
  color: #666;
}

.no-schedule {
  font-size: 14px;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .back-btn {
    position: static;
    transform: none;
    margin-bottom: 16px;
    text-align: left;
  }
  
  .doctor-content {
    padding: 16px;
  }
}
</style>