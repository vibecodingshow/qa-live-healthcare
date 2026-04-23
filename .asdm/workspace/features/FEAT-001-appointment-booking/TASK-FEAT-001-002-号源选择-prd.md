# Task PRD: 号源选择

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-002
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现号源选择功能，患者选择医生后可查看该医生的可预约日期和时段，并选择合适的时间进行预约。

### 1.2 任务目标

- 显示医生的基本信息（从列表页传递）
- 日历组件展示可预约日期（周一至周五出诊日高亮）
- 显示每个出诊日的可用时段（上午/下午）
- 时段剩余号源显示
- 已满时段不可选择

### 1.3 关联需求

- **Feature 需求**: REQ-002, REQ-003
- **用户故事**: 故事 1
- **页面路由**: `/appointment/book/:doctorId` → AppointmentBook.vue

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| TASK-FEAT-001-001 | 前置 | 医生列表页跳转过来 |
| 数据模型定义 | 前置 | AppointmentSlot 接口需先定义 |
| 排班 Store API | 前置 | getAvailableSlots() 方法需存在 |

**依赖任务**: TASK-FEAT-001-001 (医生列表查询)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 日历正确显示医生的出诊日期 | 出诊日高亮显示，非出诊日灰色 |
| 2 | 选择日期后显示该日可用时段 | 上午/下午时段卡片展示 |
| 3 | 时段卡片显示剩余号源数量 | 如"剩余 5 个号源" |
| 4 | 已满时段显示"已约满"且不可点击 | 视觉检查和交互测试 |
| 5 | 选择时段后高亮显示已选项 | 选中状态样式变化 |
| 6 | 点击"下一步"进入患者信息填写 | 路由跳转到填写页或展开表单 |

### 3.2 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| Ant Design DatePicker 组件正常使用 | 日历交互正常 |
| 时段数据加载正常 | 控制台无接口错误 |

### 3.3 边界条件

- 医生未设置排班时提示"该医生暂无可预约时段"
- 过去日期不可选择
- 周末若无排班则不显示
- 当前时段已过则不可选择

---

## 4. 技术方案

### 4.1 页面结构

```
src/views/appointment/
└── AppointmentBook.vue    # 预约医生页
```

### 4.2 组件设计

| 组件 | 类型 | 说明 |
|------|------|------|
| DoctorInfoCard | 展示组件 | 展示医生基本信息 |
| SlotCalendar | 日历组件 | 出诊日期日历选择 |
| TimeSlotPicker | 选择组件 | 上午/下午时段选择 |
| SlotCard | 展示组件 | 单个时段信息卡片 |

### 4.3 数据流

```
选择医生 → 获取医生排班信息 → 渲染日历
选择日期 → 调用 getAvailableSlots(doctorId, date) → 获取可用时段
选择时段 → 保存选中时段 → 进入下一步
```

### 4.4 数据模型

```typescript
interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: string;           // YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon';
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  maxPatients: number;     // 最大预约人数
  currentCount: number;    // 当前预约人数
  isAvailable: boolean;    // 是否开放预约
}
```

### 4.5 样式规范

- 使用 Ant Design Vue 组件库
- 时段卡片使用 `a-card` 组件
- 日历使用 `a-date-picker` 组件
- 响应式布局适配移动端

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 1 人天 (8 小时) |
| 复杂度 | Medium |
| 风险 | Medium |

**工时分解**:
- 日历组件集成与样式: 2 小时
- 时段选择器开发: 3 小时
- 号源状态显示逻辑: 2 小时
- 测试与修复: 1 小时

---

## 6. 交付物

- [ ] `src/views/appointment/AppointmentBook.vue`
- [ ] `src/components/appointment/SlotCalendar.vue`
- [ ] `src/components/appointment/TimeSlotPicker.vue`
- [ ] `npm run build` 编译通过
- [ ] 号源选择功能验证完成

---

*Task ID: TASK-FEAT-001-002*
