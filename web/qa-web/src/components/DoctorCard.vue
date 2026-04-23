<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { DoctorSchedule } from '@/services/schedule/types'
import { SlotStatus } from '@/services/schedule/types'
import { getSlotStatusText, getSlotStatusColor } from '@/services/schedule'

defineProps<{
  schedule: DoctorSchedule
}>()

const router = useRouter()

/** 跳转预约页面 */
function handleCardClick(schedule: DoctorSchedule) {
  router.push(`/appointment/book?scheduleId=${schedule.id}&doctorId=${schedule.doctorId}`)
}

/** 获取时段状态标签样式 */
function getSlotTagStyle(status: SlotStatus) {
  const color = getSlotStatusColor(status)
  return {
    backgroundColor: color,
    color: '#fff',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
  }
}
</script>

<template>
  <div class="doctor-card" @click="handleCardClick(schedule)">
    <!-- 医生信息 -->
    <div class="doctor-info">
      <a-avatar :size="56" :src="schedule.doctorAvatar">
        {{ schedule.doctorName.charAt(0) }}
      </a-avatar>
      <div class="info-content">
        <div class="doctor-name">{{ schedule.doctorName }}</div>
        <div class="doctor-title">{{ schedule.title }}</div>
        <div class="doctor-dept">{{ schedule.department }} · {{ schedule.hospital }}</div>
      </div>
    </div>

    <!-- 排班信息 -->
    <div class="schedule-info">
      <div class="schedule-date">
        <CalendarOutlined />
        <span>{{ schedule.scheduleDate }}</span>
      </div>

      <!-- 时段标签 -->
      <div class="time-slots">
        <span
          v-for="slot in schedule.timeSlots"
          :key="slot.id"
          class="time-slot-tag"
          :style="getSlotTagStyle(slot.status)"
        >
          {{ slot.startTime.slice(0, 5) }}-{{ slot.endTime.slice(0, 5) }}
          {{ getSlotStatusText(slot.status) }}
          {{ slot.status !== SlotStatus.SUSPENDED ? `${slot.remaining}个` : '' }}
        </span>
      </div>
    </div>

    <!-- 预约入口 -->
    <div class="action-area">
      <a-button type="primary" size="small">
        立即预约
        <RightOutlined />
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.doctor-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.doctor-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.info-content {
  flex: 1;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.doctor-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
}

.doctor-dept {
  font-size: 12px;
  color: #999;
}

.schedule-info {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 12px;
}

.schedule-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-area {
  display: flex;
  justify-content: flex-end;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .doctor-card {
    padding: 12px;
  }

  .doctor-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
