<template>
  <div
    :class="[
      'time-slot-picker',
      `size-${size}`,
      {
        'disabled': disabled,
        'multiple': multiple
      }
    ]"
    role="group"
    :aria-label="accessibilityLabel"
    :aria-disabled="disabled"
    :aria-multiselectable="multiple"
  >
    <!-- 空状态 -->
    <div v-if="showEmptyState && filteredSlots.length === 0" class="empty-state">
      <div class="empty-icon">🕐</div>
      <div class="empty-text">{{ emptyText }}</div>
    </div>

    <!-- 时段分组 -->
    <template v-else>
      <!-- 上午时段 -->
      <div v-if="morningSlots.length > 0" class="period-group">
        <div class="period-header">
          <span class="period-icon">☀️</span>
          <span class="period-label">上午</span>
          <span class="period-info">{{ morningSlots.length }}个时段</span>
        </div>
        <div class="period-slots">
          <TimeSlotItem
            v-for="slot in morningSlots"
            :key="slot.id"
            :slot="slot"
            :selected="isSlotSelected(slot)"
            :disabled="isSlotDisabled(slot)"
            :show-details="showDetails"
            :show-remaining="showRemaining"
            :size="size"
            @select="handleSlotSelect"
          />
        </div>
      </div>

      <!-- 下午时段 -->
      <div v-if="afternoonSlots.length > 0" class="period-group">
        <div class="period-header">
          <span class="period-icon">🌞</span>
          <span class="period-label">下午</span>
          <span class="period-info">{{ afternoonSlots.length }}个时段</span>
        </div>
        <div class="period-slots">
          <TimeSlotItem
            v-for="slot in afternoonSlots"
            :key="slot.id"
            :slot="slot"
            :selected="isSlotSelected(slot)"
            :disabled="isSlotDisabled(slot)"
            :show-details="showDetails"
            :show-remaining="showRemaining"
            :size="size"
            @select="handleSlotSelect"
          />
        </div>
      </div>

      <!-- 晚上时段 -->
      <div v-if="eveningSlots.length > 0" class="period-group">
        <div class="period-header">
          <span class="period-icon">🌙</span>
          <span class="period-label">晚上</span>
          <span class="period-info">{{ eveningSlots.length }}个时段</span>
        </div>
        <div class="period-slots">
          <TimeSlotItem
            v-for="slot in eveningSlots"
            :key="slot.id"
            :slot="slot"
            :selected="isSlotSelected(slot)"
            :disabled="isSlotDisabled(slot)"
            :show-details="showDetails"
            :show-remaining="showRemaining"
            :size="size"
            @select="handleSlotSelect"
          />
        </div>
      </div>
    </template>

    <!-- 选择统计 -->
    <div v-if="multiple && selectedSlotsCount > 0" class="selection-summary">
      <div class="summary-text">已选择 {{ selectedSlotsCount }} 个时段</div>
      <div v-if="maxSelection" class="summary-limit">
        （最多可选 {{ maxSelection }} 个）
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import TimeSlotItem from './TimeSlotItem.vue'
import { SlotStatus } from '@/components/SlotStatus/types'
import type { TimeSlotPickerProps, TimeSlotPickerEmits, TimeSlot } from './types'
import { getTimePeriod, TimePeriod } from './types'
import { useKeyboardNavigation } from './keyboard-navigation'

const props = withDefaults(defineProps<TimeSlotPickerProps>(), {
  multiple: false,
  disabled: false,
  showEmptyState: true,
  emptyText: '暂无可选时段',
  showDetails: true,
  showRemaining: true,
  size: 'medium',
  maxSelection: 5
})

const emit = defineEmits<TimeSlotPickerEmits>()

// 键盘导航
const slotsRef = ref(props.slots)
const { 
  focusedIndex,
  focusedSlot,
  handleKeydown: handleNavigationKeydown,
  resetNavigation 
} = useKeyboardNavigation(slotsRef, {
  enabled: !props.disabled,
  columns: props.size === 'small' ? 2 : props.size === 'large' ? 4 : 3
})

// 使用v-model
const selectedSlotModel = useVModel(props, 'selectedSlot', emit, { passive: true })
const selectedSlotsModel = useVModel(props, 'selectedSlots', emit, { passive: true })

// 本地状态管理
const selectedSlots = ref<TimeSlot[]>([])

// 计算属性
const filteredSlots = computed(() => {
  return props.slots.filter(slot => slot.status !== SlotStatus.SUSPENDED)
})

const morningSlots = computed(() => {
  return filteredSlots.value.filter(slot => getTimePeriod(slot.startTime) === TimePeriod.MORNING)
})

const afternoonSlots = computed(() => {
  return filteredSlots.value.filter(slot => getTimePeriod(slot.startTime) === TimePeriod.AFTERNOON)
})

const eveningSlots = computed(() => {
  return filteredSlots.value.filter(slot => getTimePeriod(slot.startTime) === TimePeriod.EVENING)
})

const selectedSlotsCount = computed(() => {
  if (props.multiple) {
    return selectedSlots.value.length
  }
  return props.selectedSlot ? 1 : 0
})

const accessibilityLabel = computed(() => {
  const totalSlots = filteredSlots.value.length
  const availableSlots = filteredSlots.value.filter(slot => 
    slot.status === SlotStatus.AVAILABLE || slot.status === SlotStatus.LOW_STOCK
  ).length
  
  return `时段选择器，共${totalSlots}个时段，其中${availableSlots}个可预约`
})

// 方法
function isSlotSelected(slot: TimeSlot): boolean {
  if (props.multiple) {
    return selectedSlots.value.some(s => s.id === slot.id)
  } else {
    return props.selectedSlot?.id === slot.id
  }
}

function isSlotDisabled(slot: TimeSlot): boolean {
  // 组件级别禁用
  if (props.disabled) return true
  
  // 时段不可预约
  if (slot.status === SlotStatus.FULL || slot.status === SlotStatus.SUSPENDED) {
    return true
  }
  
  // 多选模式下达到最大选择数量
  if (props.multiple && 
      selectedSlots.value.length >= props.maxSelection && 
      !isSlotSelected(slot)) {
    return true
  }
  
  return false
}

function handleSlotSelect(slot: TimeSlot) {
  if (props.disabled || isSlotDisabled(slot)) return
  
  if (props.multiple) {
    handleMultiSelect(slot)
  } else {
    handleSingleSelect(slot)
  }
}

function handleSingleSelect(slot: TimeSlot) {
  if (props.selectedSlot?.id === slot.id) {
    // 取消选择
    selectedSlotModel.value = null
    emit('deselect', slot)
  } else {
    // 选择新时段
    const previousSlot = props.selectedSlot
    selectedSlotModel.value = slot
    emit('select', slot)
    
    // 触发取消选择事件（如果之前有选中）
    if (previousSlot) {
      emit('deselect', previousSlot)
    }
  }
}

function handleMultiSelect(slot: TimeSlot) {
  const isCurrentlySelected = isSlotSelected(slot)
  
  if (isCurrentlySelected) {
    // 取消选择
    selectedSlots.value = selectedSlots.value.filter(s => s.id !== slot.id)
    selectedSlotsModel.value = selectedSlots.value
    emit('deselect', slot)
  } else {
    // 选择新时段
    selectedSlots.value = [...selectedSlots.value, slot]
    selectedSlotsModel.value = selectedSlots.value
    emit('select', slot)
  }
}

// 初始化选中状态
function initializeSelection() {
  if (props.multiple) {
    selectedSlots.value = props.selectedSlots || []
  }
}

// 监听props变化
watch(() => props.selectedSlots, initializeSelection, { immediate: true })
watch(() => props.multiple, () => {
  // 切换模式时清空选中状态
  selectedSlots.value = []
  selectedSlotModel.value = null
})

// 暴露方法给父组件
defineExpose({
  clearSelection: () => {
    if (props.multiple) {
      selectedSlots.value = []
      selectedSlotsModel.value = []
    } else {
      selectedSlotModel.value = null
    }
  },
  getSelectedSlots: () => {
    return props.multiple ? selectedSlots.value : (props.selectedSlot ? [props.selectedSlot] : [])
  }
})
</script>

<style scoped>
.time-slot-picker {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-slot-picker.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  line-height: 1.5;
}

/* 时段分组 */
.period-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.period-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.period-icon {
  font-size: 16px;
}

.period-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.period-info {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}

.period-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* 尺寸变体 */
.time-slot-picker.size-small .period-slots {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.time-slot-picker.size-medium .period-slots {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.time-slot-picker.size-large .period-slots {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* 选择统计 */
.selection-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.summary-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.summary-limit {
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .period-slots {
    grid-template-columns: 1fr;
  }
  
  .selection-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .summary-limit {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .period-slots {
    gap: 8px;
  }
  
  .period-header {
    padding: 6px 0;
  }
  
  .period-label {
    font-size: 14px;
  }
}

/* 无障碍支持 */
.time-slot-picker:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .time-slot-picker * {
    transition: none !important;
    animation: none !important;
  }
}
</style>