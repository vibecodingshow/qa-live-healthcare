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
| 前端     | 5     | 5    | 0           | 0    | 0       | 0         |
| 后端     | 3     | 3    | 0           | 0    | 0       | 0         |
| 测试     | 2     | 2    | 0           | 0    | 0       | 0         |
| **总计** | **10**| **10**| **0**      | **0**| **0**   | **0**     |

---

## Task Registry

### 前端任务

| Task ID | Task Name | Description | Assignee | Priority | Status |
|---------|-----------|-------------|---------|----------|--------|
| FEAT-001-TASK-01 | 设计预约数据模型 | 定义 Appointment 和 AppointmentSlot 接口，扩展 Doctor 接口增加排班字段 | | High | TODO |
| FEAT-001-TASK-02 | 实现预约 Store API | 在 store/index.ts 中实现预约相关的状态管理和业务逻辑方法 | | High | TODO |
| FEAT-001-TASK-03 | 开发预约首页 | 实现 Appointment.vue 页面，包含医生搜索、筛选功能 | | High | TODO |
| FEAT-001-TASK-04 | 开发预约页面 | 实现 AppointmentBook.vue 页面，包含日期选择、时间段选择、预约表单 | | High | TODO |
| FEAT-001-TASK-05 | 开发我的预约页面 | 实现 MyAppointments.vue 页面，展示预约记录列表，支持取消预约 | | Medium | TODO |

### 后端任务

| Task ID | Task Name | Description | Assignee | Priority | Status |
|---------|-----------|-------------|---------|----------|--------|
| FEAT-001-TASK-06 | 预约数据持久化 | 在 localStorage 中实现预约数据的增删改查 | | High | TODO |
| FEAT-001-TASK-07 | 医生排班数据管理 | 实现医生排班数据的读取和更新功能 | | High | TODO |
| FEAT-001-TASK-08 | 路由配置 | 在 router/index.ts 中添加预约相关路由配置 | | Medium | TODO |

### 测试任务

| Task ID | Task Name | Description | Assignee | Priority | Status |
|---------|-----------|-------------|---------|----------|--------|
| FEAT-001-TASK-09 | 预约功能单元测试 | 编写预约 Store API 的单元测试用例 | | Medium | TODO |
| FEAT-001-TASK-10 | 预约页面功能测试 | 手动测试预约流程的完整链路 | | Medium | TODO |

---

## Task Details

### 前端任务详情

#### FEAT-001-TASK-01: 设计预约数据模型

**Task ID**: FEAT-001-TASK-01  
**Task Name**: 设计预约数据模型  
**Category**: 前端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
定义预约功能所需的数据结构，包括 AppointmentSlot（预约时段）和 Appointment（预约记录）接口，扩展现有的 Doctor 接口增加排班相关字段。

**Deliverables**:
- `src/types/appointment.ts` - 预约相关类型定义文件
- AppointmentSlot 接口定义
- Appointment 接口定义
- 扩展 Doctor 接口的排班字段

**Dependencies**: 无  
**Estimated Effort**: 1 小时

---

#### FEAT-001-TASK-02: 实现预约 Store API

**Task ID**: FEAT-001-TASK-02  
**Task Name**: 实现预约 Store API  
**Category**: 前端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
在 store/index.ts 中扩展预约相关的状态管理和业务逻辑方法，包括预约创建、取消、查询等功能。

**Deliverables**:
- 预约相关状态 (appointments, slots)
- addAppointment() - 创建预约
- cancelAppointment() - 取消预约
- getAppointmentsByPatient() - 获取患者预约列表
- getAppointmentsByDoctor() - 获取医生预约列表
- getAvailableSlots() - 获取可用时段
- markAppointmentCompleted() - 标记已完成

**Dependencies**: FEAT-001-TASK-01 (数据模型)  
**Estimated Effort**: 2 小时

---

#### FEAT-001-TASK-03: 开发预约首页

**Task ID**: FEAT-001-TASK-03  
**Task Name**: 开发预约首页  
**Category**: 前端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
创建 `src/views/appointment/Appointment.vue` 页面，实现预约首页功能：医生搜索、科室筛选、在线预约入口。

**Deliverables**:
- `src/views/appointment/Appointment.vue`
- 医生卡片列表组件
- 科室筛选下拉框
- 预约入口按钮

**Dependencies**: FEAT-001-TASK-01, FEAT-001-TASK-02  
**Estimated Effort**: 2 小时

---

#### FEAT-001-TASK-04: 开发预约页面

**Task ID**: FEAT-001-TASK-04  
**Task Name**: 开发预约页面  
**Category**: 前端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
创建 `src/views/appointment/AppointmentBook.vue` 页面，实现完整的预约流程：选择日期 → 选择时段 → 填写信息 → 确认预约。

**Deliverables**:
- `src/views/appointment/AppointmentBook.vue`
- 日期选择组件 (使用 Ant Design DatePicker)
- 时段选择组件 (上午/下午时段卡片)
- 患者信息表单 (姓名、手机号)
- 预约确认对话框

**Dependencies**: FEAT-001-TASK-01, FEAT-001-TASK-02  
**Estimated Effort**: 3 小时

---

#### FEAT-001-TASK-05: 开发我的预约页面

**Task ID**: FEAT-001-TASK-05  
**Task Name**: 开发我的预约页面  
**Category**: 前端  
**Assignee**:  
**Priority**: Medium  
**Status**: TODO

**Description**:
创建 `src/views/appointment/MyAppointments.vue` 页面，展示患者的预约记录列表，支持查看详情和取消预约。

**Deliverables**:
- `src/views/appointment/MyAppointments.vue`
- 预约记录列表 (按状态分类：待就诊、已完成、已取消)
- 预约详情展示卡片
- 取消预约功能

**Dependencies**: FEAT-001-TASK-02  
**Estimated Effort**: 2 小时

---

### 后端任务详情

#### FEAT-001-TASK-06: 预约数据持久化

**Task ID**: FEAT-001-TASK-06  
**Task Name**: 预约数据持久化  
**Category**: 后端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
在 localStorage 中实现预约数据的增删改查，包括预约创建、状态更新、冲突检测等逻辑。

**Deliverables**:
- 预约数据的 localStorage 存储
- 预约冲突检测逻辑
- 预约时段占用计数更新

**Dependencies**: FEAT-001-TASK-01  
**Estimated Effort**: 2 小时

---

#### FEAT-001-TASK-07: 医生排班数据管理

**Task ID**: FEAT-001-TASK-07  
**Task Name**: 医生排班数据管理  
**Category**: 后端  
**Assignee**:  
**Priority**: High  
**Status**: TODO

**Description**:
实现医生排班数据的读取和更新功能，支持医生设置出诊日期、时段、最大接诊人数等。

**Deliverables**:
- 排班数据读取方法
- 排班数据更新方法
- 可用时段计算逻辑

**Dependencies**: FEAT-001-TASK-01  
**Estimated Effort**: 1.5 小时

---

#### FEAT-001-TASK-08: 路由配置

**Task ID**: FEAT-001-TASK-08  
**Task Name**: 路由配置  
**Category**: 后端  
**Assignee**:  
**Priority**: Medium  
**Status**: TODO

**Description**:
在 `src/router/index.ts` 中添加预约相关路由配置。

**Deliverables**:
- `/appointment` - 预约首页
- `/appointment/book/:doctorId` - 预约医生页面
- `/appointment/my` - 我的预约页面

**Dependencies**: FEAT-001-TASK-03, FEAT-001-TASK-04, FEAT-001-TASK-05  
**Estimated Effort**: 0.5 小时

---

### 测试任务详情

#### FEAT-001-TASK-09: 预约功能单元测试

**Task ID**: FEAT-001-TASK-09  
**Task Name**: 预约功能单元测试  
**Category**: 测试  
**Assignee**:  
**Priority**: Medium  
**Status**: TODO

**Description**:
编写预约 Store API 的单元测试用例，覆盖正常流程和异常场景。

**Deliverables**:
- addAppointment 测试用例
- cancelAppointment 测试用例
- 预约冲突检测测试用例
- 时段可用性测试用例

**Dependencies**: FEAT-001-TASK-02, FEAT-001-TASK-06  
**Estimated Effort**: 2 小时

---

#### FEAT-001-TASK-10: 预约页面功能测试

**Task ID**: FEAT-001-TASK-10  
**Task Name**: 预约页面功能测试  
**Category**: 测试  
**Assignee**:  
**Priority**: Medium  
**Status**: TODO

**Description**:
手动测试预约流程的完整链路，包括正向流程和异常场景。

**Test Scenarios**:
- 正常预约流程测试
- 预约冲突场景测试
- 取消预约功能测试
- 表单验证测试
- 移动端适配测试

**Dependencies**: FEAT-001-TASK-03, FEAT-001-TASK-04, FEAT-001-TASK-05  
**Estimated Effort**: 1.5 小时

---

## Task Execution Order

### 阶段一：数据层 (可并行)
1. FEAT-001-TASK-01 - 设计预约数据模型
2. FEAT-001-TASK-06 - 预约数据持久化
3. FEAT-001-TASK-07 - 医生排班数据管理

### 阶段二：业务层 (依赖阶段一)
4. FEAT-001-TASK-02 - 实现预约 Store API

### 阶段三：前端开发 (依赖阶段二)
5. FEAT-001-TASK-03 - 开发预约首页
6. FEAT-001-TASK-04 - 开发预约页面
7. FEAT-001-TASK-05 - 开发我的预约页面
8. FEAT-001-TASK-08 - 路由配置

### 阶段四：测试 (依赖阶段三)
9. FEAT-001-TASK-09 - 预约功能单元测试
10. FEAT-001-TASK-10 - 预约页面功能测试

---

## 任务进度汇总

| Task ID | Category | Priority | Status | Progress |
|---------|----------|----------|--------|----------|
| FEAT-001-TASK-01 | 前端 | High | TODO | 0% |
| FEAT-001-TASK-02 | 前端 | High | TODO | 0% |
| FEAT-001-TASK-03 | 前端 | High | TODO | 0% |
| FEAT-001-TASK-04 | 前端 | High | TODO | 0% |
| FEAT-001-TASK-05 | 前端 | Medium | TODO | 0% |
| FEAT-001-TASK-06 | 后端 | High | TODO | 0% |
| FEAT-001-TASK-07 | 后端 | High | TODO | 0% |
| FEAT-001-TASK-08 | 后端 | Medium | TODO | 0% |
| FEAT-001-TASK-09 | 测试 | Medium | TODO | 0% |
| FEAT-001-TASK-10 | 测试 | Medium | TODO | 0% |

---

*最后更新: 2026-04-21*
