<template>
  <span
    class="slot-status-tag"
    :class="`size-${size}`"
    :style="tagStyle"
    :aria-label="colorConfig.description"
    role="status"
    title="状态标识"
  >
    <span class="slot-status-dot" :style="{ backgroundColor: colorConfig.bg }"></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SlotStatusTagProps } from './types'
import { SlotStatus, statusColors } from './types'

const props = withDefaults(defineProps<SlotStatusTagProps>(), {
  size: 'medium'
})

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

// 标签样式
const tagStyle = computed(() => ({
  '--bg-color': cssVars.value.bg,
  '--text-color': cssVars.value.text
}))
</script>

<style scoped>
.slot-status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
  user-select: none;
}

/* 尺寸样式 */
.slot-status-tag.size-small {
  width: 16px;
  height: 16px;
}

.slot-status-tag.size-medium {
  width: 20px;
  height: 20px;
}

.slot-status-tag.size-large {
  width: 24px;
  height: 24px;
}

/* 状态圆点 */
.slot-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.slot-status-tag.size-small .slot-status-dot {
  width: 6px;
  height: 6px;
}

.slot-status-tag.size-medium .slot-status-dot {
  width: 8px;
  height: 8px;
}

.slot-status-tag.size-large .slot-status-dot {
  width: 10px;
  height: 10px;
}

/* 悬停效果 */
.slot-status-tag:hover .slot-status-dot {
  transform: scale(1.2);
}

/* 焦点样式 */
.slot-status-tag:focus {
  outline: 2px solid var(--bg-color);
  outline-offset: 2px;
  border-radius: 50%;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .slot-status-dot {
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
  }
}

/* 打印样式 */
@media print {
  .slot-status-tag {
    border: 1px solid #ccc !important;
    background: #fff !important;
  }
  
  .slot-status-dot {
    background: #000 !important;
  }
}
</style>