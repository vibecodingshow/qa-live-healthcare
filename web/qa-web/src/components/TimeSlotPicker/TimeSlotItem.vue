<template>
  <div
    :class="[
      'time-slot-item',
      `size-${size}`,
      {
        'selected': selected,
        'disabled': isDisabled,
      'bookable': isBookable,
      'low-stock': isLowStock,
      'full': isFull,
      'suspended': isSuspended,
      'hovered': isHovered,
      'pressed': isPressed,
      'focused': props.focused
      }
    ]"
    :tabindex="isDisabled ? -1 : 0"
    :aria-label="accessibilityLabel"
    :aria-selected="selected"
    :aria-disabled="isDisabled"
    @click="handleClick"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @touchstart="isPressed = true"
    @touchend="isPressed = false"
  >
    <!-- 时段信息主体 -->
    <div class="slot-main">
      <!-- 时段类型图标 -->
      <div v-if="showPeriodIcon" class="period-icon">
        {{ periodConfig.icon }}
      </div>
      
      <!-- 时段时间范围 -->
      <div class="time-range">
        <span class="start-time">{{ slot.startTime }}</span>
        <span class="separator">-</span>
        <span class="end-time">{{ slot.endTime }}</span>
      </div>
      
      <!-- 时段状态标识 -->
      <div class="slot-status">
        <slot-status-badge
          :status="slot.status"
          :show-text="false"
          :show-icon="false"
          :show-count="false"
          size="small"
        />
      </div>
    </div>
    
    <!-- 时段详情（可选） -->
    <div v-if="showDetails" class="slot-details">
      <!-- 剩余号源 -->
      <div v-if="showRemaining" class="remaining-info">
        <span class="remaining-count">{{ slot.remaining }}</span>
        <span class="remaining-text">/{{ slot.total }}</span>
      </div>
      
      <!-- 时段描述 -->
      <div class="period-label">{{ periodConfig.label }}</div>
    </div>
    
    <!-- 选中指示器 -->
    <div v-if="selected" class="selected-indicator">
      <div class="indicator-circle"></div>
    </div>
    
    <!-- 禁用遮罩 -->
    <div v-if="isDisabled" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SlotStatusBadge from '@/components/SlotStatus/SlotStatusBadge.vue'
import { SlotStatus } from '@/services/schedule/types'
import type { TimeSlotItemProps } from './types'
import { TimePeriodConfig, getTimePeriod } from './types'
import { useAnimation, selectAnimationConfig, hoverAnimationConfig } from './animations'

const props = withDefaults(defineProps<TimeSlotItemProps>(), {
  selected: false,
  disabled: false,
  showDetails: true,
  showRemaining: true,
  size: 'medium'
})

const emit = defineEmits<{
  click: [slot: TimeSlotItemProps['slot']]
  select: [slot: TimeSlotItemProps['slot']]
}>()

// 动画管理
const { transition: selectTransition, variables: selectVariables } = useAnimation(selectAnimationConfig)
const { transition: hoverTransition, variables: hoverVariables } = useAnimation(hoverAnimationConfig)

// 交互状态
const isHovered = ref(false)
const isPressed = ref(false)
const isAnimating = ref(false)

// 计算属性
const period = computed(() => {
  return getTimePeriod(props.slot.startTime)
})

const periodConfig = computed(() => {
  return TimePeriodConfig[period.value]
})

const isBookable = computed(() => {
  return props.slot.status === SlotStatus.AVAILABLE || props.slot.status === SlotStatus.LOW_STOCK
})

const isLowStock = computed(() => {
  return props.slot.status === SlotStatus.LOW_STOCK
})

const isFull = computed(() => {
  return props.slot.status === SlotStatus.FULL
})

const isSuspended = computed(() => {
  return props.slot.status === SlotStatus.SUSPENDED
})

const isDisabled = computed(() => {
  return props.disabled || !isBookable.value
})

const showPeriodIcon = computed(() => {
  return props.size !== 'small'
})

const accessibilityLabel = computed(() => {
  const statusMap = {
    [SlotStatus.AVAILABLE]: '可预约',
    [SlotStatus.LOW_STOCK]: '号源紧张',
    [SlotStatus.FULL]: '已约满',
    [SlotStatus.SUSPENDED]: '停诊'
  }
  
  const status = statusMap[props.slot.status] || '未知状态'
  const timeRange = `${props.slot.startTime}到${props.slot.endTime}`
  const remaining = props.slot.remaining > 0 ? `剩余${props.slot.remaining}个号源` : '无号源'
  
  return `${periodConfig.value.label}时段，${timeRange}，${status}，${remaining}`
})

// 事件处理
function handleClick(event: MouseEvent) {
  if (isDisabled.value) return
  
  event.stopPropagation()
  
  // 添加点击动画效果
  isPressed.value = true
  setTimeout(() => {
    isPressed.value = false
  }, 150)
  
  emit('click', props.slot)
  emit('select', props.slot)
}

function handleKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    
    // 添加键盘交互动画效果
    isPressed.value = true
    setTimeout(() => {
      isPressed.value = false
    }, 150)
    
    emit('select', props.slot)
  }
}

// 悬停事件处理
function handleMouseEnter() {
  if (isDisabled.value) return
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
  isPressed.value = false
}
</script>

<style scoped>
.time-slot-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: v-bind(selectTransition);
  user-select: none;
  outline: none;
}

.time-slot-item.hovered:not(.disabled) {
  border-color: #d0d7ff;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: v-bind(hoverTransition);
}

.time-slot-item:focus:not(.disabled) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.time-slot-item.selected:not(.disabled) {
  border-color: #1890ff;
  background: #f0f8ff;
  box-shadow: 0 2px 12px rgba(24, 144, 255, 0.2);
}

.time-slot-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: #f5f5f5;
}

/* 尺寸变体 */
.time-slot-item.size-small {
  padding: 8px 12px;
  font-size: 12px;
}

.time-slot-item.size-medium {
  padding: 12px 16px;
  font-size: 14px;
}

.time-slot-item.size-large {
  padding: 16px 20px;
  font-size: 16px;
}

/* 时段信息主体 */
.slot-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-icon {
  font-size: 18px;
  line-height: 1;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #333;
}

.separator {
  color: #999;
}

.slot-status {
  margin-left: auto;
}

/* 时段详情 */
.slot-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.remaining-info {
  display: flex;
  align-items: center;
  gap: 2px;
}

.remaining-count {
  font-weight: 600;
  color: #1890ff;
}

.remaining-text {
  color: #999;
}

.period-label {
  color: #666;
}

/* 选中指示器 */
.selected-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1890ff;
  border-radius: 50%;
  animation: scaleIn 0.2s ease-out;
}

.indicator-circle {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

/* 禁用遮罩 */
.disabled-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
}

/* 动画 */
@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .time-slot-item {
    padding: 10px 12px;
  }
  
  .slot-main {
    gap: 6px;
  }
  
  .slot-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .time-slot-item {
    border-width: 3px;
  }
  
  .time-slot-item.selected {
    border-width: 4px;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .time-slot-item {
    transition: none;
  }
  
  .selected-indicator {
    animation: none;
  }
}
</style>