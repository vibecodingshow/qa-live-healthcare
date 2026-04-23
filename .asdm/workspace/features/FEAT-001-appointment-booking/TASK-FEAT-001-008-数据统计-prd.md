# Task PRD: 数据统计

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-008
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现数据统计功能，在首页和医生端展示预约相关统计数据，帮助管理员和医生了解预约情况。

### 1.2 任务目标

- 首页展示平台预约统计数据
- 统计总预约数、今日预约数
- 统计各科室预约分布
- 医生端展示个人预约数据

### 1.3 关联需求

- **Feature 需求**: REQ-005, REQ-006
- **用户故事**: 故事 2, 故事 4
- **页面路由**: `/` (首页)、`/doctor/appointments` (医生端)

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| TASK-FEAT-001-004 | 前置 | 有预约数据才可统计 |
| TASK-FEAT-001-005 | 前置 | 预约记录查询基础 |
| 统计 Store API | 前置 | getStatistics() 方法 |

**依赖任务**: TASK-FEAT-001-004 (预约提交)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 首页显示总预约数 | 数字统计卡片 |
| 2 | 首页显示今日预约数 | 今日数据实时更新 |
| 3 | 首页显示各科室预约占比 | 简单图表或列表 |
| 4 | 医生端显示个人统计数据 | 今日预约、已到诊、待到诊 |
| 5 | 统计数据实时更新 | 新预约产生后数据变化 |

### 3.2 统计指标

| 指标 | 位置 | 说明 |
|------|------|------|
| 总预约数 | 首页 | 平台所有预约数量 |
| 今日预约 | 首页+医生端 | 当日预约数量 |
| 已到诊 | 医生端 | 当日已到诊数量 |
| 待到诊 | 医生端 | 当日待到诊数量 |

### 3.3 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| 统计数据计算正确 | 对比数据库数据 |
| 页面加载无延迟 | 统计查询 < 200ms |

### 3.4 边界条件

- 无预约数据时显示"暂无数据"
- 统计数据为空时显示"0"
- 跨日数据正确切换

---

## 4. 技术方案

### 4.1 Store API

```typescript
// 统计接口
getStatistics(): {
  totalAppointments: number;      // 总预约数
  todayAppointments: number;      // 今日预约
  todayArrived: number;           // 今日已到诊
  todayPending: number;           // 今日待到诊
  departmentStats: {              // 科室统计
    department: string;
    count: number;
  }[]
}

// 医生统计
getDoctorStatistics(doctorId: string): {
  totalToday: number;
  arrivedToday: number;
  pendingToday: number;
  completedToday: number;
}
```

### 4.2 首页组件

```vue
<template>
  <div class="statistics">
    <StatCard title="总预约数" :value="stats.totalAppointments" />
    <StatCard title="今日预约" :value="stats.todayAppointments" />
    <StatCard title="待到诊" :value="stats.todayPending" />
  </div>
</template>
```

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 0.25 人天 (2 小时) |
| 复杂度 | Low |
| 风险 | Low |

**工时分解**:
- 统计方法实现: 0.5 小时
- 首页统计组件: 0.5 小时
- 医生端统计集成: 0.5 小时
- 测试与修复: 0.5 小时

---

## 6. 交付物

- [ ] Store 统计方法实现
- [ ] 首页统计卡片组件
- [ ] 医生端统计集成
- [ ] `npm run build` 编译通过

---

*Task ID: TASK-FEAT-001-008*
