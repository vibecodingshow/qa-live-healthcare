# Task PRD: 订单查询

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-FEAT-001-005
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

---

## 1. 任务概述

### 1.1 任务摘要

实现订单查询功能，患者可以查看自己的预约记录列表，了解预约状态，并进行取消预约操作。

### 1.2 任务目标

- 展示患者的所有预约记录
- 按状态分类展示（待就诊/已完成/已取消）
- 显示预约详情（医生、日期、时间、诊室）
- 支持取消预约（待就诊状态）
- 取消后号源释放

### 1.3 关联需求

- **Feature 需求**: REQ-005
- **用户故事**: 故事 2
- **页面路由**: `/appointment/my` → MyAppointments.vue

---

## 2. 前置依赖

| 依赖项 | 类型 | 说明 |
|--------|------|------|
| TASK-FEAT-001-004 | 前置 | 预约提交后产生订单 |
| 预约 Store API | 前置 | getAppointmentsByPatient() 方法 |
| 取消预约 API | 前置 | cancelAppointment() 方法 |

**依赖任务**: TASK-FEAT-001-004 (预约提交)

---

## 3. 验收标准

### 3.1 功能验收

| # | 验收条件 | 验证方法 |
|---|----------|----------|
| 1 | 页面展示患者的所有预约记录 | 登录后查看预约列表 |
| 2 | 按状态分类显示 | Tab 切换：待就诊/已完成/已取消 |
| 3 | 预约卡片显示完整信息 | 医生、科室、日期、时段、取号码 |
| 4 | 点击卡片展开预约详情 | 展示完整预约信息 |
| 5 | 待就诊状态显示"取消预约"按钮 | 点击后弹出确认对话框 |
| 6 | 取消预约后号源释放 | 同时段剩余号源 +1 |
| 7 | 取消后订单状态更新 | 订单状态变为"已取消" |

### 3.2 技术验收

| 验收条件 | 验证命令 |
|----------|----------|
| TypeScript 编译通过 | `npm run build` 无错误 |
| 列表数据正确加载 | 控制台无错误，列表正常渲染 |
| 取消流程完整 | 取消后数据更新正确 |

### 3.3 边界条件

- 无预约记录时显示空状态
- 不同患者的预约记录互不可见
- 取消需二次确认
- 就诊当天不可取消（提示联系医院）
- 已完成的订单不可取消

---

## 4. 技术方案

### 4.1 页面结构

```
src/views/appointment/
└── MyAppointments.vue    # 我的预约页
```

### 4.2 组件设计

| 组件 | 类型 | 说明 |
|------|------|------|
| AppointmentTabs | 筛选组件 | 状态 Tab 切换 |
| AppointmentCard | 展示组件 | 预约卡片 |
| AppointmentDetail | 详情组件 | 预约详情弹窗 |
| CancelConfirm | 确认组件 | 取消确认对话框 |

### 4.3 数据流

```
页面加载 → 获取当前患者ID → 调用 getAppointmentsByPatient(patientId)
→ 过滤不同状态 → 分类展示
用户取消 → 二次确认 → 调用 cancelAppointment(id) → 更新号源 → 刷新列表
```

### 4.4 Store API

```typescript
// 获取患者预约列表
getAppointmentsByPatient(patientId: string): Appointment[]

// 取消预约
cancelAppointment(appointmentId: string): void

// 更新号源（内部方法）
releaseSlot(slotId: string): void
```

---

## 5. 预估工时

| 项目 | 预估 |
|------|------|
| **人天** | 0.5 人天 (4 小时) |
| 复杂度 | Low |
| 风险 | Low |

**工时分解**:
- 页面布局与列表组件: 1.5 小时
- 状态筛选与 Tab 切换: 1 小时
- 取消预约功能: 1 小时
- 测试与修复: 0.5 小时

---

## 6. 交付物

- [ ] `src/views/appointment/MyAppointments.vue`
- [ ] `src/components/appointment/AppointmentCard.vue`
- [ ] `src/components/appointment/AppointmentTabs.vue`
- [ ] `npm run build` 编译通过
- [ ] 订单查询功能验证

---

*Task ID: TASK-FEAT-001-005*
