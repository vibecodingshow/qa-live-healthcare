# Task PRD: 医生端审核

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-006
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现医生端审核功能，医生可以查看预约患者列表，审核预约信息，管理出诊状态。

### 1.2 任务目标

- 医生登录后查看预约患者列表
- 按日期查看当日预约
- 查看患者基本信息
- 标记患者已到诊
- 查看统计数据（今日预约数、已到诊数）

### 1.3 关联需求

- **Feature 需求**: REQ-006
- **用户故事**: 故事 4
- **页面路由**: `/doctor/appointments` → DoctorAppointments.vue

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| 医生登录功能 | 前置 | 需先登录医生账号 |
| TASK-FEAT-001-005 | 关联 | 预约提交后产生数据 |
| 预约 Store API | 前置 | getAppointmentsByDoctor() 方法 |

**依赖任务**: 
- 医生登录 (现有功能)
- TASK-FEAT-001-004 (预约提交)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 医生查看当日预约患者列表 | 登录后默认显示当日预约 |
| 2 | 切换日期查看其他日期预约 | 日期选择器切换 |
| 3 | 显示患者姓名、手机号、预约时段 | 列表项信息完整 |
| 4 | 标记患者已到诊 | 点击后状态变为"已到诊" |
| 5 | 显示统计数据 | 今日预约总数、已到诊数、待到诊数 |
| 6 | 按状态筛选预约 | 待到诊/已到诊/已完成 |

### 3.2 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| 医生身份验证 | 非医生账号不可访问 |
| 数据隔离 | 仅显示当前医生的预约 |

### 3.3 边界条件

- 无当日预约时显示空状态
- 非登录医生不可查看
- 日期选择限制为今天及以后
- 已完成的预约不可修改到诊状态

---

## 4. 技术方案

### 4.1 页面结构

```
src/views/doctor/
└── DoctorAppointments.vue    # 医生预约管理页
```

### 4.2 组件设计

| 组件 | 类型 | 说明 |
|------|------|------|
| AppointmentStats | 统计组件 | 今日数据统计卡片 |
| DateSelector | 选择组件 | 日期选择器 |
| PatientList | 列表组件 | 预约患者列表 |
| PatientCard | 展示组件 | 患者预约卡片 |

### 4.3 数据流

```
医生登录 → 获取当前医生ID → 调用 getAppointmentsByDoctor(doctorId)
→ 按日期过滤 → 按状态筛选 → 展示列表
标记到诊 → 调用 markAppointmentCompleted(id) → 更新状态 → 刷新统计
```

### 4.4 Store API

```typescript
// 获取医生预约列表
getAppointmentsByDoctor(doctorId: string): Appointment[]

// 标记已完成
markAppointmentCompleted(appointmentId: string): void

// 获取统计数据
getDoctorStatistics(doctorId: string): {
  totalToday: number;
  arrivedToday: number;
  pendingToday: number;
}
```

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 0.5 人天 (4 小时) |
| 复杂度 | Low |
| 风险 | Low |

**工时分解**:
- 页面布局与组件: 1.5 小时
- 数据统计组件: 1 小时
- 到诊标记功能: 1 小时
- 测试与修复: 0.5 小时

---

## 6. 交付物

- [ ] `src/views/doctor/DoctorAppointments.vue`
- [ ] `src/components/appointment/PatientCard.vue`
- [ ] `src/components/appointment/AppointmentStats.vue`
- [ ] `npm run build` 编译通过
- [ ] 医生端审核功能验证

---

*Task ID: TASK-FEAT-001-006*
