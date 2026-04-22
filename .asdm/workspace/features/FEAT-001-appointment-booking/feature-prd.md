# Feature PRD: 预约挂号

**Feature ID**: FEAT-001-appointment-booking
**Created Date**: 2026-04-22
**Status**: PLANNED
**Language**: zh

## 1. Overview

### 1.1 Feature Summary

预约挂号功能允许患者通过平台预约医生的线下门诊时段，实现线上预约、线下就诊的完整流程。

- **功能概述**: 患者可以选择医生、查看可用时段、提交预约申请
- **需求原因**: 扩展现有问诊平台的业务范围，从纯线上问诊扩展到线上预约线下就诊
- **受益用户**: 患者（预约方）、医生（接诊方）

### 1.2 Objectives

- Objective 1: 提供可视化的医生出诊时间表，方便患者选择
- Objective 2: 实现预约申请、确认、取消的完整流程
- Objective 3: 医生可在诊室管理预约（确认/拒绝/查看预约列表）
- Objective 4: 患者可查看和管理自己的预约记录

## 2. User Stories

### Story 1: 患者预约挂号

**As a** 患者
**I want to** 选择医生和就诊时间进行预约
**So that** 能够预定线下门诊，避免现场排队

**Acceptance Criteria**:
- 患者可以从医生列表中选择医生
- 患者可以查看医生未来7天的可用时段
- 患者可以填写预约信息（姓名、联系方式、症状描述）
- 预约成功后显示预约确认信息

### Story 2: 患者管理预约

**As a** 患者
**I want to** 查看和取消我的预约
**So that** 能够灵活调整就诊计划

**Acceptance Criteria**:
- 患者可以查看所有预约记录（待确认、已确认、已取消、已完成）
- 患者可以在就诊前取消预约
- 取消预约后自动更新预约状态

### Story 3: 医生管理预约

**As a** 医生
**I want to** 设置出诊时间并处理预约申请
**So that** 合理安排门诊工作，提高就诊效率

**Acceptance Criteria**:
- 医生可以查看所有患者的预约申请
- 医生可以确认或拒绝预约申请
- 医生可以设置每日出诊时段
- 医生可以查看自己的预约统计

## 3. Functional Requirements

### Requirement 1: 医生出诊时段管理

- **ID**: REQ-001
- **Description**: 医生可设置和管理自己的出诊时间
- **Priority**: High
- **Related Stories**: Story 3

### Requirement 2: 预约申请提交

- **ID**: REQ-002
- **Description**: 患者可选择医生和时段提交预约申请
- **Priority**: High
- **Related Stories**: Story 1

### Requirement 3: 预约状态流转

- **ID**: REQ-003
- **Description**: 预约状态包括：pending（待确认）、confirmed（已确认）、cancelled（已取消）、completed（已完成）
- **Priority**: High
- **Related Stories**: Story 1, Story 2, Story 3

### Requirement 4: 预约列表查询

- **ID**: REQ-004
- **Description**: 患者和医生可分别查看自己的预约列表
- **Priority**: Medium
- **Related Stories**: Story 2, Story 3

### Requirement 5: 预约取消

- **ID**: REQ-005
- **Description**: 患者可在就诊前取消预约，医生可拒绝预约
- **Priority**: Medium
- **Related Stories**: Story 2, Story 3

## 4. Non-Functional Requirements

### 4.1 Performance

- 页面加载时间不超过 2 秒
- 预约提交响应时间不超过 1 秒

### 4.2 Security

- 患者需验证身份后才能提交预约
- 医生需登录后才能管理预约

### 4.3 Scalability

- 系统设计支持未来扩展到多医院、多科室

### 4.4 Reliability

- 预约数据持久化存储
- 预约冲突检测，避免同一时段重复预约

## 5. Technical Requirements

### 5.1 Architecture Considerations

- 遵循现有 Vue 3 + TypeScript 项目结构
- 使用 Reactive Store 进行状态管理
- 新增预约相关页面在 `src/views/` 目录
- 预约数据存储在 `src/data/` 目录

### 5.2 Dependencies

- 内部依赖：Doctor、Patient 数据模型（已有）
- UI 组件：复用 Ant Design Vue 组件库
- 日期处理：使用已有的 dayjs

### 5.3 Constraints

- 当前为前端原型，数据存储于内存
- 预约时段为静态配置，支持未来接入真实排班系统

## 6. Success Criteria

- Success criterion 1: 患者能够成功提交预约申请
- Success criterion 2: 医生能够查看并处理预约申请
- Success criterion 3: 预约状态正确流转（pending → confirmed/cancelled）
- Success criterion 4: 患者能够查看和取消自己的预约
- Success criterion 5: 所有页面符合项目 UI 规范

## 7. Task Breakdown Principles

### 7.1 Granularity

- 每个任务应控制在 1-2 小时工作量内
- 任务应聚焦且可独立测试

### 7.2 Independence

- 最小化任务间依赖
- 支持并行执行

### 7.3 Testability

- 每个任务有清晰的验收标准
- 任务可独立验证

### 7.4 Task Categories

- 数据模型设计
- 页面组件开发
- Store 状态管理
- 路由配置
- 单元测试

### 7.5 Task Count Limitation

- 功能将拆分为 7 个任务
- 遵循 10 个任务以内的原则

## 8. Implementation Notes

### 8.1 新增数据模型

```typescript
interface Appointment {
  id: string;           // 预约ID
  patientId: string;    // 患者ID
  patientName: string;  // 患者姓名
  doctorId: string;     // 医生ID
  doctorName: string;   // 医生姓名
  appointmentDate: string;  // 预约日期 (YYYY-MM-DD)
  appointmentTime: string;   // 预约时段 (如: "09:00-10:00")
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  symptoms: string;     // 症状描述
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}
```

### 8.2 新增页面

- `src/views/Appointment.vue` - 预约挂号页面
- `src/views/MyAppointments.vue` - 我的预约页面

### 8.3 新增路由

| 路径 | 组件 | 功能 |
|------|------|------|
| `/appointment` | Appointment.vue | 预约挂号页面 |
| `/my-appointments` | MyAppointments.vue | 我的预约列表 |

### 8.4 新增 Store 方法

```typescript
// 预约管理
addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Appointment
confirmAppointment(appointmentId: string): void
cancelAppointment(appointmentId: string): void
getAppointmentsByPatient(patientId: string): Appointment[]
getAppointmentsByDoctor(doctorId: string): Appointment[]
getAvailableSlots(doctorId: string, date: string): string[]
```

### 8.5 预约时段配置

医生出诊时段预设配置（每个时段 1 小时）:
- 09:00-10:00
- 10:00-11:00
- 11:00-12:00
- 14:00-15:00
- 15:00-16:00
- 16:00-17:00

## 9. Risks and Mitigations

### Risk 1: 预约时段冲突

- **Description**: 同一时段被多个患者同时预约
- **Impact**: Medium
- **Mitigation**: 预约提交时检查时段可用性，显示友好提示

### Risk 2: 预约数据丢失

- **Description**: 页面刷新导致预约数据丢失
- **Impact**: Low
- **Mitigation**: 本原型为正常现象，生产环境需接入持久化存储

## 10. Appendix

### 10.1 References

- 项目上下文: `.asdm/contexts/index.md`
- 数据模型: `.asdm/contexts/data-models.md`
- API 文档: `.asdm/contexts/api.md`

### 10.2 Glossary

| 术语 | 定义 |
|------|------|
| 预约挂号 | 患者线上预约医生线下门诊的服务 |
| 出诊时段 | 医生开放就诊的时间段 |
| 预约状态 | 预约的生命周期状态 |

---

*本 Feature PRD 由 PRD Builder 工具集生成。*
