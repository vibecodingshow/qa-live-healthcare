<template>
  <span
    class="slot-status-badge"
    :class="[`size-${size}`, { 'has-count': showCount && remainingSlots !== undefined }]"
    :style="badgeStyle"
    :aria-label="ariaLabel"
    role="status"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- 图标 -->
    <span v-if="showIcon" class="slot-status-icon" :aria-hidden="!showIcon">
      {{ colorConfig.icon }}
    </span>
    
    <!-- 状态文字 -->
    <span v-if="showText" class="slot-status-text">
      {{ colorConfig.description }}
    </span>
    
    <!-- 号源数量 -->
    <span v-if="showCount && remainingSlots !== undefined" class="slot-status-count">
      {{ remainingSlots }}/{{ totalSlots || remainingSlots }}
    </span>
    
    <!-- 悬停提示 -->
    <div v-if="showTooltip" class="slot-status-tooltip">
      <div class="tooltip-content">
        <span class="tooltip-icon">{{ colorConfig.icon }}</span>
        <span class="tooltip-text">{{ colorConfig.description }}</span>
        <span v-if="remainingSlots !== undefined" class="tooltip-count">
          剩余 {{ remainingSlots }} 个号源
        </span>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SlotStatusBadgeProps } from './types'
import { SlotStatus, statusColors, darkModeColors } from './types'

const props = withDefaults(defineProps<SlotStatusBadgeProps>(), {
  showText: true,
  showIcon: true,
  showCount: false,
  size: 'medium'
})

const showTooltip = ref(false)

// 根据状态获取颜色配置
const colorConfig = computed(() => {
  return statusColors[props.status] || statusColors[SlotStatus.AVAILABLE]
})

// 获取CSS变量名称
const cssVars = computed(() => {
  const status = props.status.toLowerCase().replace('_', '-')
  return {
    bg: `var(--slot-status-${status}-bg, ${colorConfig.value.bg})`,
    text: `var(--slot-status-${status}-text, ${colorConfig.value.text})`
  }
})

// 徽章样式
const badgeStyle = computed(() => ({
  '--bg-color': cssVars.value.bg,
  '--text-color': cssVars.value.text
}))

// 无障碍标签
const ariaLabel = computed(() => {
  let label = colorConfig.value.description
  if (props.showCount && props.remainingSlots !== undefined) {
    label += `，剩余 ${props.remainingSlots} 个号源`
  }
  return label
})
</script>

<style scoped>
.slot-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.2s ease;
  position: relative;
  cursor: help;
  user-select: none;
}

/* 尺寸样式 */
.slot-status-badge.size-small {
  padding: 2px 6px;
  font-size: 10px;
}

.slot-status-badge.size-medium {
  padding: 4px 8px;
  font-size: 12px;
}

.slot-status-badge.size-large {
  padding: 6px 12px;
  font-size: 14px;
}

/* 图标和文字间距 */
.slot-status-icon {
  margin-right: 4px;
  font-size: 12px;
}

.slot-status-text {
  margin-right: 4px;
}

.slot-status-count {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 4px;
}

/* 悬停提示 */
.slot-status-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  z-index: 1000;
}

.tooltip-content {
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #333;
}

.tooltip-icon {
  font-size: 14px;
}

.tooltip-text {
  font-weight: 500;
}

.tooltip-count {
  opacity: 0.8;
  font-size: 11px;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .slot-status-badge {
    /* 暗黑模式下的颜色会自动通过CSS变量应用 */
  }
}

/* 无障碍支持 */
.slot-status-badge:focus {
  outline: 2px solid var(--bg-color);
  outline-offset: 2px;
}

/* 打印样式 */
@media print {
  .slot-status-badge {
    background: none !important;
    color: #000 !important;
    border: 1px solid #ccc;
  }
}
</style>