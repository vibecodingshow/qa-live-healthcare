<template>
  <div class="time-slot-picker">
    <div class="slot-header">
      <h3>选择时间段</h3>
      <div class="slot-legend">
        <span class="legend-item">
          <span class="legend-dot available"></span>
          可预约
        </span>
        <span class="legend-item">
          <span class="legend-dot disabled"></span>
          不可预约
        </span>
        <span class="legend-item">
          <span class="legend-dot selected"></span>
          已选择
        </span>
      </div>
    </div>

    <a-spin :spinning="loading">
      <a-empty v-if="!hasSchedule" description="该日期暂无排班">
        <template #image>
          <CalendarOutlined style="font-size: 48px; color: #999" />
        </template>
      </a-empty>

      <div v-else-if="displaySlots.length === 0" description="暂无可用时段">
        <a-empty>
          <template #image>
            <ClockCircleOutlined style="font-size: 48px; color: #999" />
          </template>
          该日期暂无可预约时段
        </a-empty>
      </div>

      <div v-else class="time-slots-container">
        <!-- 上午时段 -->
        <div v-if="morningSlots.length > 0" class="time-period-section">
          <div class="time-period-header">
            <span class="period-icon">🌅</span>
            <span class="period-label">上午</span>
          </div>
          <div class="slots-grid">
            <div
              v-for="slot in morningSlots"
              :key="slot.id"
              class="time-slot-item"
              :class="{
                'available': slot.available,
                'disabled': !slot.available,
                'selected': selectedSlot?.id === slot.id
              }"
              @click="selectSlot(slot)"
            >
              <div class="slot-time">
                <ClockCircleOutlined class="slot-icon" />
                <span class="time-text">{{ slot.startTime }} - {{ slot.endTime }}</span>
              </div>
              <div class="slot-status">
                <template v-if="slot.available">
                  <span class="status-badge available">
                    剩余 {{ slot.remainingSlots }} 个
                  </span>
                </template>
                <template v-else>
                  <span class="status-badge disabled">
                    {{ slot.disabledReason || '已满' }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 下午时段 -->
        <div v-if="afternoonSlots.length > 0" class="time-period-section">
          <div class="time-period-header">
            <span class="period-icon">🌞</span>
            <span class="period-label">下午</span>
          </div>
          <div class="slots-grid">
            <div
              v-for="slot in afternoonSlots"
              :key="slot.id"
              class="time-slot-item"
              :class="{
                'available': slot.available,
                'disabled': !slot.available,
                'selected': selectedSlot?.id === slot.id
              }"
              @click="selectSlot(slot)"
            >
              <div class="slot-time">
                <ClockCircleOutlined class="slot-icon" />
                <span class="time-text">{{ slot.startTime }} - {{ slot.endTime }}</span>
              </div>
              <div class="slot-status">
                <template v-if="slot.available">
                  <span class="status-badge available">
                    剩余 {{ slot.remainingSlots }} 个
                  </span>
                </template>
                <template v-else>
                  <span class="status-badge disabled">
                    {{ slot.disabledReason || '已满' }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 已选时段信息 -->
        <div v-if="selectedSlot" class="selected-slot-info">
          <a-alert
            :message="`已选择时段: ${selectedSlot.startTime} - ${selectedSlot.endTime}`"
            type="info"
            show-icon
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import type { Schedule, Appointment } from '@/types/appointment';
import { 
  generateTimeSlots, 
  isTimeSlotConflict,
  isToday,
  type TimeSlotDisplay 
} from '@/utils/timeSlot';
import { store } from '@/store';
import dayjs from 'dayjs';

interface Props {
  doctorId: string;
  date: string;
  intervalMinutes?: number;
}

const props = withDefaults(defineProps<Props>(), {
  intervalMinutes: 30
});

const emit = defineEmits<{
  (e: 'select', slot: TimeSlotDisplay): void;
  (e: 'change', slot: TimeSlotDisplay | null): void;
}>();

const loading = ref(false);
const selectedSlot = ref<TimeSlotDisplay | null>(null);

// 获取指定日期的所有排班（支持上午+下午多时段）
const schedules = computed<Schedule[]>(() => {
  if (!props.doctorId || !props.date) return [];
  return store.getAllSchedulesByDoctorAndDate(props.doctorId, props.date);
});

// 检查是否有排班
const hasSchedule = computed(() => {
  return schedules.value.length > 0;
});

// 获取该日期的已有预约
const existingAppointments = computed<Appointment[]>(() => {
  if (!props.doctorId || !props.date) return [];
  return store.state.appointments.filter(
    a => a.doctorId === props.doctorId && 
         a.date === props.date && 
         a.status !== 'cancelled'
  );
});

// 生成显示用时段列表（合并多时段排班）
const displaySlots = computed<TimeSlotDisplay[]>(() => {
  if (schedules.value.length === 0) return [];
  
  // 合并所有排班的时间段
  const allSlots: Array<{ startTime: string; endTime: string; schedule: Schedule }> = [];
  
  for (const schedule of schedules.value) {
    const generatedSlots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      props.intervalMinutes
    );
    
    for (const slot of generatedSlots) {
      allSlots.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        schedule
      });
    }
  }
  
  // 按开始时间排序
  allSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  return allSlots.map((slotInfo) => {
    const slotId = `${slotInfo.startTime}-${slotInfo.endTime}`;
    const schedule = slotInfo.schedule;
    
    // 检查该时段是否与已有预约冲突
    const conflictingAppointment = existingAppointments.value.find(
      appt => isTimeSlotConflict(
        slotInfo.startTime, slotInfo.endTime,
        appt.startTime, appt.endTime
      )
    );
    
    // 计算该时段内的预约数
    const appointmentsInSlot = existingAppointments.value.filter(
      appt => isTimeSlotConflict(
        slotInfo.startTime, slotInfo.endTime,
        appt.startTime, appt.endTime
      )
    ).length;
    
    // 使用对应排班的限额
    const remainingSlots = schedule.maxAppointments - appointmentsInSlot;
    
    // 如果是今天，检查时段是否已过
    const isPast = isToday(props.date) && dayjs().isAfter(dayjs(`${props.date} ${slotInfo.endTime}`));
    
    let available = false;
    let disabledReason: string | undefined;
    
    if (isPast) {
      available = false;
      disabledReason = '已过期';
    } else if (conflictingAppointment) {
      available = false;
      disabledReason = '已被预约';
    } else if (remainingSlots <= 0) {
      available = false;
      disabledReason = '已满';
    } else {
      available = true;
    }
    
    return {
      id: slotId,
      startTime: slotInfo.startTime,
      endTime: slotInfo.endTime,
      available,
      remainingSlots,
      appointments: appointmentsInSlot,
      disabledReason
    };
  });
});

// 获取时段所属的上下午标识
const getTimePeriod = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 12) return '上午';
  return '下午';
};

// 上午时段
const morningSlots = computed<TimeSlotDisplay[]>(() => {
  return displaySlots.value.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    return hour < 12;
  });
});

// 下午时段
const afternoonSlots = computed<TimeSlotDisplay[]>(() => {
  return displaySlots.value.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0], 10);
    return hour >= 12;
  });
});

// 选择时段
const selectSlot = (slot: TimeSlotDisplay) => {
  if (!slot.available) return;
  
  selectedSlot.value = slot;
  emit('select', slot);
  emit('change', slot);
};

// 监听日期变化，重置选择
watch(() => props.date, () => {
  selectedSlot.value = null;
  emit('change', null);
});

// 监听医生变化，重置选择
watch(() => props.doctorId, () => {
  selectedSlot.value = null;
  emit('change', null);
});

// 暴露方法
defineExpose({
  clearSelection: () => {
    selectedSlot.value = null;
    emit('change', null);
  },
  getSelectedSlot: () => selectedSlot.value
});
</script>

<style scoped>
.time-slot-picker {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.slot-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.slot-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.available {
  background: #52c41a;
}

.legend-dot.disabled {
  background: #d9d9d9;
}

.legend-dot.selected {
  background: #1890ff;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.time-slot-item {
  padding: 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.time-slot-item.available:hover {
  border-color: #1890ff;
  background: #f0f7ff;
}

.time-slot-item.disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.time-slot-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.slot-icon {
  font-size: 16px;
  color: #1890ff;
}

.time-slot-item.disabled .slot-icon {
  color: #999;
}

.time-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.time-slot-item.disabled .time-text {
  color: #999;
}

.slot-status {
  margin-top: 8px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.available {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.disabled {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #d9d9d9;
}

.selected-slot-info {
  margin-top: 16px;
}

.time-period-section {
  margin-bottom: 24px;
}

.time-period-section:last-child {
  margin-bottom: 0;
}

.time-period-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.period-icon {
  font-size: 18px;
}

.period-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .slot-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .slots-grid {
    grid-template-columns: 1fr;
  }
}
</style>
