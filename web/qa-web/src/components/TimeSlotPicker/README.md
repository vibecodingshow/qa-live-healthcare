# 时段选择器组件 (TimeSlotPicker)

## 概述

时段选择器组件用于在预约流程中选择具体的就诊时段，支持上午/下午/晚上等多个时段的展示和选择。

## 功能特性

### ✅ 核心功能
- **时段分组展示**：按上午、下午、晚上分组显示时段
- **状态标识**：集成号源状态颜色标识（可预约、号源紧张、已满、停诊）
- **单选/多选模式**：支持单个时段选择和多个时段选择
- **剩余号源显示**：实时显示每个时段的剩余号源数量
- **时段详情展示**：显示时段类型、时间范围、剩余号源等信息

### 🎨 用户体验
- **响应式设计**：支持移动端和桌面端适配
- **动画效果**：选中、悬停、点击等交互动画
- **暗黑模式支持**：自动适配系统主题
- **无障碍访问**：完整的键盘导航和屏幕阅读器支持
- **触摸优化**：移动端触摸友好的交互设计

### ⌨️ 键盘导航
- **方向键导航**：使用箭头键在时段间导航
- **Tab键导航**：支持Tab键顺序导航
- **快捷操作**：Enter/Space选择，Home/End跳转
- **循环导航**：支持边界循环导航

## 组件组成

### TimeSlotPicker (主组件)
时段选择器主组件，负责时段列表管理和选择逻辑。

### TimeSlotItem (时段项组件)
单个时段的展示组件，包含时段信息和交互逻辑。

## 安装和使用

### 全局注册
```typescript
import { createApp } from 'vue'
import TimeSlotPicker from '@/components/TimeSlotPicker'

const app = createApp(App)
app.use(TimeSlotPicker)
```

### 局部引入
```vue
<template>
  <TimeSlotPicker
    :slots="timeSlots"
    :selected-slot="selectedSlot"
    @select="handleSlotSelect"
    @deselect="handleSlotDeselect"
  />
</template>

<script setup lang="ts">
import { TimeSlotPicker } from '@/components/TimeSlotPicker'
import type { TimeSlot } from '@/components/TimeSlotPicker/types'

const timeSlots: TimeSlot[] = [
  {
    id: '1',
    startTime: '08:00',
    endTime: '09:00',
    total: 10,
    remaining: 5,
    status: 'available'
  }
  // ...更多时段
]

const selectedSlot = ref<TimeSlot | null>(null)

function handleSlotSelect(slot: TimeSlot) {
  console.log('选中时段:', slot)
}

function handleSlotDeselect(slot: TimeSlot) {
  console.log('取消选中时段:', slot)
}
</script>
```

## Props 配置

### TimeSlotPicker Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| slots | TimeSlot[] | [] | 时段列表 |
| selectedSlot | TimeSlot \| null | undefined | 选中的时段（单选模式） |
| selectedSlots | TimeSlot[] | undefined | 选中的时段列表（多选模式） |
| multiple | boolean | false | 是否支持多选 |
| disabled | boolean | false | 是否禁用组件 |
| maxSelection | number | 5 | 最大选择数量（多选模式） |
| showEmptyState | boolean | true | 是否显示空状态 |
| emptyText | string | '暂无可选时段' | 空状态文本 |
| showDetails | boolean | true | 是否显示时段详情 |
| showRemaining | boolean | true | 是否显示剩余号源 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |

### TimeSlotItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| slot | TimeSlot | - | 时段数据 |
| selected | boolean | false | 是否选中 |
| disabled | boolean | false | 是否禁用 |
| focused | boolean | false | 是否获得焦点 |
| showDetails | boolean | true | 是否显示详情 |
| showRemaining | boolean | true | 是否显示剩余号源 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |

## 事件

### TimeSlotPicker Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | slot: TimeSlot | 时段选择事件 |
| deselect | slot: TimeSlot | 时段取消选择事件 |
| update:selectedSlot | slot: TimeSlot \| null | 选中时段变更事件 |
| update:selectedSlots | slots: TimeSlot[] | 选中时段列表变更事件 |

### TimeSlotItem Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | slot: TimeSlot | 点击事件 |
| select | slot: TimeSlot | 选择事件 |

## 类型定义

### TimeSlot 类型
```typescript
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  total: number
  remaining: number
  status: SlotStatus
  period?: 'morning' | 'afternoon' | 'evening'
  displayName?: string
  bookable?: boolean
}
```

### SlotStatus 枚举
```typescript
enum SlotStatus {
  AVAILABLE = 'available',      // 可预约
  LOW_STOCK = 'low_stock',      // 号源紧张
  FULL = 'full',                // 已满
  SUSPENDED = 'suspended'       // 停诊
}
```

## 键盘导航

### 支持的按键

| 按键 | 功能 |
|------|------|
| ↑ ↓ ← → | 方向键导航 |
| Tab / Shift+Tab | 向前/向后导航 |
| Enter / Space | 选择当前焦点时段 |
| Home | 跳转到第一个时段 |
| End | 跳转到最后一个时段 |

### 导航配置
```typescript
const navigationConfig = {
  enabled: true,        // 启用键盘导航
  loop: true,          // 循环导航
  columns: 3,          // 网格列数
  arrowKeys: true,     // 启用方向键
  tabNavigation: true  // 启用Tab键导航
}
```

## 动画效果

### 动画配置
组件提供多种动画效果，包括：
- **选中动画**：缩放和颜色变化
- **悬停动画**：平滑的过渡效果
- **点击反馈**：按压效果
- **焦点指示**：键盘导航时的视觉反馈

### 自定义动画
```typescript
import { useAnimation, selectAnimationConfig } from './animations'

// 自定义动画配置
const customConfig = {
  duration: 0.3,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
}

const { transition, variables } = useAnimation(customConfig)
```

## 无障碍支持

### ARIA 属性
组件自动设置以下ARIA属性：
- `aria-label`：组件描述
- `aria-selected`：选中状态
- `aria-disabled`：禁用状态
- `aria-multiselectable`：多选模式

### 屏幕阅读器
- 完整的语音提示
- 状态变更通知
- 键盘导航支持

## 主题适配

### 暗黑模式
组件自动适配系统暗黑模式，通过CSS变量实现：
```css
@media (prefers-color-scheme: dark) {
  :root {
    --slot-bg-color: #1f1f1f;
    --slot-border-color: #333;
    /* ...更多变量 */
  }
}
```

### 高对比度模式
```css
@media (prefers-contrast: high) {
  .time-slot-item {
    border-width: 3px;
  }
}
```

## 响应式设计

### 断点适配
- **桌面端** (≥768px)：3列网格布局
- **平板端** (480px-768px)：2列网格布局
- **移动端** (<480px)：1列垂直布局

### 触摸优化
- 触摸友好的点击区域
- 防止触摸延迟
- 适当的触摸反馈

## 性能优化

### 渲染优化
- 虚拟滚动（大量数据时）
- 条件渲染
- 事件委托

### 动画优化
- 使用CSS transform
- 避免layout thrashing
- 硬件加速

## 浏览器兼容性

### 支持浏览器
- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

### 特性支持
- CSS Grid
- CSS Custom Properties
- ES2018+
- Vue 3 Composition API

## 开发指南

### 自定义样式
```css
/* 自定义主题 */
.time-slot-picker {
  --slot-primary-color: #your-color;
  --slot-border-radius: 8px;
  /* ...更多变量 */
}
```

### 扩展功能
```typescript
// 自定义时段过滤器
function customFilter(slot: TimeSlot): boolean {
  return slot.remaining > 0 && slot.status !== 'suspended'
}
```

## 故障排除

### 常见问题

**Q: 时段无法选中？**
A: 检查时段状态是否为可预约状态，或组件是否被禁用。

**Q: 键盘导航不工作？**
A: 确保组件获得焦点，并检查键盘导航是否启用。

**Q: 动画不流畅？**
A: 检查浏览器是否支持硬件加速，或尝试减少动画复杂度。

## 版本历史

### v1.0.0 (2026-04-22)
- 初始版本发布
- 基本时段选择功能
- 键盘导航支持
- 无障碍访问支持
- 响应式设计

## 贡献指南

欢迎提交Issue和Pull Request来改进组件。

## 许可证

MIT License