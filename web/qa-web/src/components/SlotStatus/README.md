# SlotStatus 组件文档

## 概述

SlotStatus 组件库提供了一套完整的号源状态标识组件，支持多种状态显示、无障碍访问和暗黑模式。

## 组件列表

### SlotStatusBadge
状态徽章组件，显示完整的号源状态信息。

### SlotStatusTag  
状态标签组件，简洁的状态标识，适用于紧凑空间。

## 安装和使用

### 全局注册
```javascript
import SlotStatus from '@/components/SlotStatus'

app.use(SlotStatus)
```

### 按需引入
```javascript
import { SlotStatusBadge, SlotStatusTag } from '@/components/SlotStatus'
```

## 状态枚举

```typescript
enum SlotStatus {
  AVAILABLE = 'available',      // 可预约
  LOW_STOCK = 'low_stock',     // 号源紧张
  FULL = 'full',               // 已满
  SUSPENDED = 'suspended'      // 停诊
}
```

## 使用示例

### SlotStatusBadge 使用示例
```vue
<template>
  <div>
    <!-- 完整状态显示 -->
    <SlotStatusBadge 
      :status="SlotStatus.AVAILABLE"
      :show-text="true"
      :show-icon="true"
      :show-count="true"
      :remaining-slots="10"
      :total-slots="20"
      size="medium"
    />
    
    <!-- 简洁显示 -->
    <SlotStatusBadge 
      :status="SlotStatus.LOW_STOCK"
      :show-text="false"
      :show-count="false"
      size="small"
    />
  </div>
</template>

<script setup>
import { SlotStatus } from '@/components/SlotStatus/types'
</script>
```

### SlotStatusTag 使用示例
```vue
<template>
  <div>
    <!-- 不同尺寸 -->
    <SlotStatusTag :status="SlotStatus.AVAILABLE" size="small" />
    <SlotStatusTag :status="SlotStatus.FULL" size="medium" />
    <SlotStatusTag :status="SlotStatus.SUSPENDED" size="large" />
  </div>
</template>

<script setup>
import { SlotStatus } from '@/components/SlotStatus/types'
</script>
```

## Props 说明

### SlotStatusBadge Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| status | SlotStatus | - | 状态枚举值 |
| showText | boolean | true | 是否显示状态文字 |
| showIcon | boolean | true | 是否显示图标 |
| showCount | boolean | false | 是否显示号源数量 |
| remainingSlots | number | - | 剩余号源数量 |
| totalSlots | number | - | 总号源数量 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |

### SlotStatusTag Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| status | SlotStatus | - | 状态枚举值 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 组件尺寸 |

## 颜色配置

### 默认颜色方案

| 状态 | 背景色 | 文字色 | 图标 |
|------|--------|--------|------|
| AVAILABLE | #52c41a | #fff | ✅ |
| LOW_STOCK | #faad14 | #fff | ⚠️ |
| FULL | #d9d9d9 | #666 | ❌ |
| SUSPENDED | #ff4d4f | #fff | 🚫 |

### 暗黑模式颜色方案

| 状态 | 背景色 | 文字色 |
|------|--------|--------|
| AVAILABLE | #389e0d | #fff |
| LOW_STOCK | #d48806 | #fff |
| FULL | #434343 | #bfbfbf |
| SUSPENDED | #a8071a | #fff |

## 无障碍支持

- 所有组件都支持 `aria-label` 属性
- 支持键盘导航和焦点管理
- 提供完整的屏幕阅读器支持
- 支持高对比度模式

## 暗黑模式

组件自动适配系统暗黑模式，通过 CSS 变量实现主题切换。

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 开发指南

### 添加新状态

1. 在 `types.ts` 中添加新的枚举值
2. 在 `statusColors` 和 `darkModeColors` 中添加颜色配置
3. 更新组件样式

### 自定义主题

可以通过 CSS 变量覆盖默认颜色：

```css
:root {
  --slot-status-available-bg: #your-color;
  --slot-status-available-text: #your-color;
}
```

## 测试

```bash
# 运行单元测试
npm run test:unit

# 运行构建测试
npm run build

# 运行类型检查
npm run type-check
```

## 更新日志

### v1.0.0 (2026-04-22)
- 初始版本发布
- 支持四种号源状态
- 暗黑模式支持
- 无障碍访问优化