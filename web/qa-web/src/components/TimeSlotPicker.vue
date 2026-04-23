<template>
  <a-card class="time-slot-picker" :bordered="false" v-if="selectedDate">
    <div class="picker-header">
      <h3>{{ selectedDate }} 时段选择</h3>
      <span class="selected-date">{{ formatSelectedDate(selectedDate) }}</span>
    </div>
    
    <div class="time-slots-grid">
      <div 
        v-for="slot in timeSlots" 
        :key="slot.id"
        :class="['time-slot', slot.status, { 'selected': slot.id === selectedSlotId }]"
        @click="selectSlot(slot)"
      >
        <div class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</div>
        <div class="slot-info">
          <span class="slot-remaining">{{ slot.remaining }}/{{ slot.total }}</span>
          <SlotStatusBadge 
            :status="getSlotStatus(slot)" 
            :show-text="false"
            :show-count="false"
            size="small"
          />
        </div>
      </div>
    </div>
    
    <div v-if="timeSlots.length === 0" class="no-slots">
      <a-empty description="该日期暂无排班信息" />
    </div>
    
    <div class="picker-actions" v-if="selectedSlot">
      <a-button type="primary" size="large" @click="confirmSelection" :disabled="!canSelect">
        {{ getActionButtonText() }}
      </a-button>
    </div>
    
    <div class="slot-legend">
      <div class="legend-item">
        <SlotStatusTag :status="SlotStatus.AVAILABLE" size="small" />
        <span>可预约</span>
      </div>
      <div class="legend-item">
        <SlotStatusTag :status="SlotStatus.LOW_STOCK" size="small" />
        <span>号源紧张</span>
      </div>
      <div class="legend-item">
        <SlotStatusTag :status="SlotStatus.FULL" size="small" />
        <span>已约满</span>
      </div>
      <div class="legend-item">
        <SlotStatusTag :status="SlotStatus.SUSPENDED" size="small" />
        <span>停诊</span>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type { TimeSlot } from '@/services/schedule/types'
import SlotStatusBadge from '@/components/SlotStatus/SlotStatusBadge.vue'
import SlotStatusTag from '@/components/SlotStatus/SlotStatusTag.vue'
import { SlotStatus } from '@/components/SlotStatus/types'

dayjs.locale('zh-cn')

interface Props {
  selectedDate: string
  timeSlots: TimeSlot[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  slotSelected: [slot: TimeSlot]
}>()

const selectedSlotId = ref('')

const selectedSlot = computed(() => {
  return props.timeSlots.find(slot => slot.id === selectedSlotId.value)
})

const canSelect = computed(() => {
  return selectedSlot.value && selectedSlot.value.status !== 'full'
})

function selectSlot(slot: TimeSlot) {
  if (slot.status !== 'full') {
    selectedSlotId.value = slot.id
    emit('slotSelected', slot)
  }
}

function confirmSelection() {
  if (selectedSlot.value) {
    // 这里可以触发预约流程
    console.log('确认选择时段:', selectedSlot.value)
    // 实际项目中应该跳转到预约确认页面
  }
}

function formatSelectedDate(dateStr: string) {
  const date = dayjs(dateStr)
  return date.format('YYYY年MM月DD日 dddd')
}

function getStatusText(status: string) {
  const statusMap = {
    available: '可预约',
    low_stock: '号源紧张',
    full: '已约满',
    suspended: '停诊'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 将后端时段状态映射到前端SlotStatus枚举
function getSlotStatus(slot: TimeSlot): SlotStatus {
  switch (slot.status) {
    case 'available':
      return SlotStatus.AVAILABLE
    case 'low_stock':
      return SlotStatus.LOW_STOCK
    case 'full':
      return SlotStatus.FULL
    case 'suspended':
      return SlotStatus.SUSPENDED
    default:
      return SlotStatus.AVAILABLE
  }
}

function getActionButtonText() {
  if (!selectedSlot.value) return '请选择时段'
  
  switch (selectedSlot.value.status) {
    case 'available':
      return '确认预约'
    case 'low_stock':
      return '号源紧张，立即预约'
    case 'full':
      return '已约满'
    default:
      return '不可预约'
  }
}

// 当日期变化时重置选择
watch(() => props.selectedDate, () => {
  selectedSlotId.value = ''
})
</script>

<style scoped>
.time-slot-picker {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.picker-header {
  margin-bottom: 16px;
}

.picker-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.selected-date {
  font-size: 14px;
  color: #666;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.time-slot {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.time-slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.time-slot.available {
  border-color: #b7eb8f;
  background: #f6ffed;
}

.time-slot.available:hover {
  border-color: #52c41a;
}

.time-slot.low_stock {
  border-color: #ffe58f;
  background: #fffbe6;
}

.time-slot.low_stock:hover {
  border-color: #faad14;
}

.time-slot.full {
  border-color: #ffccc7;
  background: #fff2f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.time-slot.full:hover {
  transform: none;
  box-shadow: none;
}

.time-slot.selected {
  border-color: #1890ff;
  background: #e6f7ff;
  transform: scale(1.05);
}

.slot-time {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.slot-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slot-remaining {
  font-size: 14px;
  color: #666;
}

.slot-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.slot-status.available {
  background: #52c41a;
  color: white;
}

.slot-status.low_stock {
  background: #faad14;
  color: white;
}

.slot-status.full {
  background: #ff4d4f;
  color: white;
}

.slot-status.suspended {
  background: #d9d9d9;
  color: white;
}

.no-slots {
  padding: 40px 0;
  text-align: center;
}

.picker-actions {
  text-align: center;
  margin: 24px 0 16px;
}

.picker-actions .ant-btn {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.slot-legend {
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

@media (max-width: 768px) {
  .time-slots-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .time-slot {
    padding: 12px;
  }
  
  .slot-time {
    font-size: 14px;
  }
  
  .picker-actions .ant-btn {
    min-width: 100%;
  }
}
</style>