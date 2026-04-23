# Task List: 预约挂号功能

**Feature ID**: FEAT-001  
**Feature Name**: appointment-booking  
**Created Date**: 2026-04-21  
**Last Updated**: 2026-04-21  
**Language**: zh

---

## Summary

| 类别     | Total | TODO | In Progress | Done | Blocked | Cancelled |
|----------|-------|------|-------------|------|---------|-----------|
| 核心任务 | 5     | 5    | 0           | 0    | 0       | 0         |
| 辅助任务 | 5     | 5    | 0           | 0    | 0       | 0         |
| **总计** | **10**| **10**| **0**      | **0**| **0**   | **0**     |

---

## Task Registry

### 核心任务 (高优先级)

| Task ID | Task Name | Description | Assignee | Priority | Status | Dependencies |
|---------|-----------|-------------|---------|----------|--------|--------------|
| TASK-FEAT-001-001 | 医生列表查询 | 实现预约首页医生列表查询，支持科室筛选和搜索 | | High | TODO | 无 |
| TASK-FEAT-001-002 | 号源选择 | 实现号源选择功能，日历展示可预约日期，时段选择 | | High | TODO | TASK-001 |
| TASK-FEAT-001-003 | 患者信息填写 | 实现患者信息表单，姓名和手机号验证 | | High | TODO | TASK-002 |
| TASK-FEAT-001-004 | 预约提交 | 实现预约提交，防冲突检测，号源更新 | | High | TODO | TASK-002, TASK-003 |
| TASK-FEAT-001-005 | 订单查询 | 实现我的预约页面，查看和取消预约 | | High | TODO | TASK-004 |

### 辅助任务 (中优先级)

| Task ID | Task Name | Description | Assignee | Priority | Status | Dependencies |
|---------|-----------|-------------|---------|----------|--------|--------------|
| TASK-FEAT-001-006 | 医生端审核 | 实现医生预约管理，查看患者列表，标记到诊 | | Medium | TODO | TASK-004 |
| TASK-FEAT-001-007 | 消息通知 | 实现预约成功/取消通知，就诊提醒 | | Medium | TODO | TASK-004, TASK-005 |
| TASK-FEAT-001-008 | 数据统计 | 实现首页和医生端统计数据展示 | | Medium | TODO | TASK-004 |
| TASK-FEAT-001-009 | 异常处理 | 实现异常处理机制，网络/冲突/验证异常处理 | | Medium | TODO | TASK-001~008 |
| TASK-FEAT-001-010 | 回归测试 | 执行完整链路测试，验证功能完整性 | | Medium | TODO | TASK-001~009 |

---

## Task Details

### TASK-FEAT-001-001: 医生列表查询

**Task ID**: TASK-FEAT-001-001  
**Task Name**: 医生列表查询  
**Category**: 核心任务  
**Assignee**:   
**Priority**: High  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-001-医生列表查询-prd.md](./TASK-FEAT-001-001-医生列表查询-prd.md)

**Dependencies**: 无

**Estimated Effort**: 0.5 人天

**Key Deliverables**:
- `src/views/appointment/Appointment.vue`
- `src/components/appointment/DoctorCard.vue`

---

### TASK-FEAT-001-002: 号源选择

**Task ID**: TASK-FEAT-001-002  
**Task Name**: 号源选择  
**Category**: 核心任务  
**Assignee**:   
**Priority**: High  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-002-号源选择-prd.md](./TASK-FEAT-001-002-号源选择-prd.md)

**Dependencies**: TASK-FEAT-001-001

**Estimated Effort**: 1 人天

**Key Deliverables**:
- `src/views/appointment/AppointmentBook.vue`
- `src/components/appointment/SlotCalendar.vue`
- `src/components/appointment/TimeSlotPicker.vue`

---

### TASK-FEAT-001-003: 患者信息填写

**Task ID**: TASK-FEAT-001-003  
**Task Name**: 患者信息填写  
**Category**: 核心任务  
**Assignee**:   
**Priority**: High  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-003-患者信息填写-prd.md](./TASK-FEAT-001-003-患者信息填写-prd.md)

**Dependencies**: TASK-FEAT-001-002

**Estimated Effort**: 0.5 人天

**Key Deliverables**:
- AppointmentBook.vue 表单部分
- 表单验证逻辑

---

### TASK-FEAT-001-004: 预约提交

**Task ID**: TASK-FEAT-001-004  
**Task Name**: 预约提交  
**Category**: 核心任务  
**Assignee**:   
**Priority**: High  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-004-预约提交-prd.md](./TASK-FEAT-001-004-预约提交-prd.md)

**Dependencies**: TASK-FEAT-001-002, TASK-FEAT-001-003

**Estimated Effort**: 1 人天

**Key Deliverables**:
- 预约确认页组件
- addAppointment() Store 方法
- 冲突检测逻辑
- 预约成功结果页

---

### TASK-FEAT-001-005: 订单查询

**Task ID**: TASK-FEAT-001-005  
**Task Name**: 订单查询  
**Category**: 核心任务  
**Assignee**:   
**Priority**: High  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-005-订单查询-prd.md](./TASK-FEAT-001-005-订单查询-prd.md)

**Dependencies**: TASK-FEAT-001-004

**Estimated Effort**: 0.5 人天

**Key Deliverables**:
- `src/views/appointment/MyAppointments.vue`
- `src/components/appointment/AppointmentCard.vue`
- 取消预约功能

---

### TASK-FEAT-001-006: 医生端审核

**Task ID**: TASK-FEAT-001-006  
**Task Name**: 医生端审核  
**Category**: 辅助任务  
**Assignee**:   
**Priority**: Medium  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-006-医生端审核-prd.md](./TASK-FEAT-001-006-医生端审核-prd.md)

**Dependencies**: TASK-FEAT-001-004

**Estimated Effort**: 0.5 人天

**Key Deliverables**:
- `src/views/doctor/DoctorAppointments.vue`
- 患者列表组件
- 到诊标记功能

---

### TASK-FEAT-001-007: 消息通知

**Task ID**: TASK-FEAT-001-007  
**Task Name**: 消息通知  
**Category**: 辅助任务  
**Assignee**:   
**Priority**: Medium  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-007-消息通知-prd.md](./TASK-FEAT-001-007-消息通知-prd.md)

**Dependencies**: TASK-FEAT-001-004, TASK-FEAT-001-005

**Estimated Effort**: 0.25 人天

**Key Deliverables**:
- `src/services/notifyService.ts`
- 预约成功通知
- 取消预约通知

---

### TASK-FEAT-001-008: 数据统计

**Task ID**: TASK-FEAT-001-008  
**Task Name**: 数据统计  
**Category**: 辅助任务  
**Assignee**:   
**Priority**: Medium  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-008-数据统计-prd.md](./TASK-FEAT-001-008-数据统计-prd.md)

**Dependencies**: TASK-FEAT-001-004

**Estimated Effort**: 0.25 人天

**Key Deliverables**:
- Store 统计方法
- 首页统计卡片
- 医生端统计集成

---

### TASK-FEAT-001-009: 异常处理

**Task ID**: TASK-FEAT-001-009  
**Task Name**: 异常处理  
**Category**: 辅助任务  
**Assignee**:   
**Priority**: Medium  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-009-异常处理-prd.md](./TASK-FEAT-001-009-异常处理-prd.md)

**Dependencies**: TASK-FEAT-001-001 ~ TASK-FEAT-001-008

**Estimated Effort**: 0.5 人天

**Key Deliverables**:
- `src/utils/errors.ts`
- `src/utils/errorHandler.ts`
- 全局异常处理集成

---

### TASK-FEAT-001-010: 回归测试

**Task ID**: TASK-FEAT-001-010  
**Task Name**: 回归测试  
**Category**: 辅助任务  
**Assignee**:   
**Priority**: Medium  
**Status**: TODO

**PRD Document**: [TASK-FEAT-001-010-回归测试-prd.md](./TASK-FEAT-001-010-回归测试-prd.md)

**Dependencies**: TASK-FEAT-001-001 ~ TASK-FEAT-001-009

**Estimated Effort**: 1 人天

**Key Deliverables**:
- 端到端测试报告
- 功能点测试清单
- 异常场景测试结果
- 兼容性测试报告

---

## Task Execution Order

```
阶段一 (核心链路)
─────────────────────────────────────────────────────
[TASK-001] ──┬──> [TASK-002] ──> [TASK-003] ──> [TASK-004]
             │                                    │
             │                                    ▼
             │                               [TASK-005]
             │                                    │
阶段二 (辅助)  │                                    ▼
             │                               [TASK-006]
             │                                    │
             ▼                                    ▼
          [TASK-007]                        [TASK-008]
             │
             ▼
          [TASK-009]
             │
             ▼
阶段三 (收尾)
             │
             ▼
         [TASK-010]
```

---

## Total Estimated Effort

| 类别 | 任务数 | 工时合计 |
|------|--------|----------|
| 核心任务 | 5 | 3.5 人天 |
| 辅助任务 | 5 | 2.5 人天 |
| **总计** | **10** | **6 人天** |

---

## Progress Tracking

| Task ID | Priority | Status | Progress | Completed Date |
|---------|----------|--------|----------|----------------|
| TASK-FEAT-001-001 | High | TODO | 0% | - |
| TASK-FEAT-001-002 | High | TODO | 0% | - |
| TASK-FEAT-001-003 | High | TODO | 0% | - |
| TASK-FEAT-001-004 | High | TODO | 0% | - |
| TASK-FEAT-001-005 | High | TODO | 0% | - |
| TASK-FEAT-001-006 | Medium | TODO | 0% | - |
| TASK-FEAT-001-007 | Medium | TODO | 0% | - |
| TASK-FEAT-001-008 | Medium | TODO | 0% | - |
| TASK-FEAT-001-009 | Medium | TODO | 0% | - |
| TASK-FEAT-001-010 | Medium | TODO | 0% | - |

---

## PRD Document Index

| # | Task ID | PRD Document |
|---|---------|--------------|
| 1 | TASK-FEAT-001-001 | [TASK-FEAT-001-001-医生列表查询-prd.md](./TASK-FEAT-001-001-医生列表查询-prd.md) |
| 2 | TASK-FEAT-001-002 | [TASK-FEAT-001-002-号源选择-prd.md](./TASK-FEAT-001-002-号源选择-prd.md) |
| 3 | TASK-FEAT-001-003 | [TASK-FEAT-001-003-患者信息填写-prd.md](./TASK-FEAT-001-003-患者信息填写-prd.md) |
| 4 | TASK-FEAT-001-004 | [TASK-FEAT-001-004-预约提交-prd.md](./TASK-FEAT-001-004-预约提交-prd.md) |
| 5 | TASK-FEAT-001-005 | [TASK-FEAT-001-005-订单查询-prd.md](./TASK-FEAT-001-005-订单查询-prd.md) |
| 6 | TASK-FEAT-001-006 | [TASK-FEAT-001-006-医生端审核-prd.md](./TASK-FEAT-001-006-医生端审核-prd.md) |
| 7 | TASK-FEAT-001-007 | [TASK-FEAT-001-007-消息通知-prd.md](./TASK-FEAT-001-007-消息通知-prd.md) |
| 8 | TASK-FEAT-001-008 | [TASK-FEAT-001-008-数据统计-prd.md](./TASK-FEAT-001-008-数据统计-prd.md) |
| 9 | TASK-FEAT-001-009 | [TASK-FEAT-001-009-异常处理-prd.md](./TASK-FEAT-001-009-异常处理-prd.md) |
| 10 | TASK-FEAT-001-010 | [TASK-FEAT-001-010-回归测试-prd.md](./TASK-FEAT-001-010-回归测试-prd.md) |

---

*最后更新: 2026-04-21*
