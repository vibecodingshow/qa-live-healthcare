# Task List for FEAT-001-appointment-booking

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Created Date**: 2026-04-21
**Last Updated**: 2026-04-21
**Language**: zh

## Summary

| | Total Tasks | TODO | In Progress | Done | Blocked | Cancelled |
|-|-------------|------|-------------|------|---------|-----------|
| | 9           | 9    | 0           | 0    | 0       | 0         |

## Task Registry

| Task ID | Task Name | Status | Task PRD | Dependencies | Estimated Effort | Created     | Updated     |
|---------|-----------|--------|----------|--------------|------------------|-------------|-------------|
| TASK-001 | 设计预约数据模型 | TODO | GENERATED | NONE | 1 hour | 2026-04-21 | 2026-04-21 |
| TASK-002 | 创建预约相关数据类型和模拟数据 | TODO | GENERATED | TASK-001 | 1 hour | 2026-04-21 | 2026-04-21 |
| TASK-003 | 实现预约 Store 状态管理 | TODO | GENERATED | TASK-002 | 2 hours | 2026-04-21 | 2026-04-21 |
| TASK-004 | 开发预约列表页面 | TODO | GENERATED | TASK-003 | 2 hours | 2026-04-21 | 2026-04-21 |
| TASK-005 | 开发预约表单页面 | TODO | GENERATED | TASK-003 | 2 hours | 2026-04-21 | 2026-04-21 |
| TASK-006 | 开发预约详情页面 | TODO | GENERATED | TASK-004 | 1 hour | 2026-04-21 | 2026-04-21 |
| TASK-007 | 开发医生门诊管理页面 | TODO | GENERATED | TASK-002 | 2 hours | 2026-04-21 | 2026-04-21 |
| TASK-008 | 开发医生预约管理功能 | TODO | GENERATED | TASK-003 | 1 hour | 2026-04-21 | 2026-04-21 |
| TASK-009 | 配置预约相关路由 | TODO | GENERATED | TASK-004, TASK-005, TASK-006, TASK-007, TASK-008 | 1 hour | 2026-04-21 | 2026-04-21 |

## Task Dependencies

```
TASK-001 (设计数据模型)
    ↓
TASK-002 (数据类型和模拟数据) ← TASK-003 (Store) ← TASK-004 (预约列表页)
    │                                    ↓                 ↓
    └─→ TASK-007 (门诊管理页)      TASK-005 (预约表单页)   ↓
                                                     TASK-006 (预约详情页)
                                                            ↓
                                                     TASK-008 (医生预约管理)
                                                            ↓
                                                     TASK-009 (路由配置)
```

## Task Details

### TASK-001: 设计预约数据模型
**Description**: 设计 Appointment、ClinicSchedule、TimeSlot 等实体及其关系  
**Acceptance Criteria**:
- 定义完整的 Appointment 接口
- 定义 ClinicSchedule 和 TimeSlot 接口
- 设计门诊时间表的数据结构
- 绘制 ER 图展示实体关系

### TASK-002: 创建预约相关数据类型和模拟数据
**Description**: 在 TypeScript 和 JSON 文件中实现预约相关数据类型  
**Acceptance Criteria**:
- 在 src/types/ 下定义预约相关类型（可扩展 store/index.ts）
- 创建 src/data/appointment-list.json 模拟数据
- 扩展 doctor-user-list.json 添加门诊时间字段
- 验证类型定义正确性

### TASK-003: 实现预约 Store 状态管理
**Description**: 在 store 中添加预约相关状态和方法  
**Acceptance Criteria**:
- 添加 appointments 状态
- 实现 addAppointment 方法
- 实现 cancelAppointment 方法
- 实现 confirmAppointment 方法
- 实现 rejectAppointment 方法
- 实现 getAppointmentsByPatient 方法
- 实现 getAppointmentsByDoctor 方法
- 实现 updateClinicSchedule 方法

### TASK-004: 开发预约列表页面
**Description**: 创建患者查看和管理预约的页面  
**Acceptance Criteria**:
- 创建 src/views/Appointments.vue 页面
- 实现预约列表展示（支持筛选：全部/待确认/已确认/已完成/已取消）
- 实现取消预约功能
- 实现跳转到预约详情功能
- 样式与现有页面保持一致

### TASK-005: 开发预约表单页面
**Description**: 创建患者预约医生的表单页面  
**Acceptance Criteria**:
- 创建 src/views/BookAppointment.vue 页面
- 实现医生信息展示
- 实现日期选择器（只显示有门诊的日期）
- 实现时段选择器（只显示可预约的时段）
- 实现预约表单（就诊原因等）
- 实现表单验证
- 实现预约提交功能

### TASK-006: 开发预约详情页面
**Description**: 创建预约详情展示页面  
**Acceptance Criteria**:
- 创建 src/views/AppointmentDetail.vue 页面
- 展示完整预约信息
- 展示医生信息
- 展示预约状态和操作按钮
- 实现返回列表功能

### TASK-007: 开发医生门诊管理页面
**Description**: 创建医生设置和管理门诊时间的页面  
**Acceptance Criteria**:
- 创建 src/views/DoctorSchedule.vue 页面
- 实现门诊时间表编辑器
- 支持设置每周出诊日
- 支持设置每时段可预约人数
- 实现保存门诊设置功能

### TASK-008: 开发医生预约管理功能
**Description**: 为医生添加预约管理能力  
**Acceptance Criteria**:
- 在医生门诊管理页面添加预约列表区域
- 实现查看自己预约的功能
- 实现确认/拒绝预约申请的功能
- 实现取消预约的功能
- 支持按状态筛选预约

### TASK-009: 配置预约相关路由
**Description**: 在路由配置中添加预约相关页面  
**Acceptance Criteria**:
- 在 src/router/index.ts 添加预约路由
- 路由列表：
  - `/appointments` - 预约列表页
  - `/appointments/:id` - 预约详情页
  - `/book/:doctorId` - 预约表单页
  - `/doctor/schedule` - 医生门诊管理页
- 验证路由跳转正常

---

*本文档由 PRD Builder 自动生成。任务状态变更时请使用 `/asdm-prd-execution` 更新。*
