# Feature PRD: 预约挂号

**Feature ID**: FEAT-001
**Created Date**: 2026-04-21
**Status**: PLANNED
**Language**: zh

## 1. Overview

### 1.1 Feature Summary

预约挂号功能允许患者通过平台预约医生的线下门诊服务。患者可以查看医生的门诊时间、选择合适的时段进行预约，并管理自己的预约记录。

### 1.2 Objectives

- **Objective 1**: 让患者能够浏览医生可预约的门诊时间
- **Objective 2**: 支持患者在线预约医生的线下门诊
- **Objective 3**: 让患者能够查看、取消自己的预约记录
- **Objective 4**: 为医生提供管理门诊时间设置的能力
- **Objective 5**: 增强平台的医疗服务完整性，从线上问诊扩展到线下挂号

## 2. User Stories

### Story 1: 患者预约门诊

**As a** 患者
**I want to** 查看医生的门诊时间并选择预约
**So that** 我可以预约线下面诊

**Acceptance Criteria**:
- 患者可以查看医生的可预约日期
- 患者可以查看每个时间段的可预约状态
- 患者选择时段后可以填写预约信息
- 预约成功后显示预约确认信息

### Story 2: 患者管理预约

**As a** 患者
**I want to** 查看和取消我的预约记录
**So that** 我可以管理自己的就诊计划

**Acceptance Criteria**:
- 患者可以查看所有预约记录（待确认、已确认、已完成、已取消）
- 患者可以在预约时间前取消预约
- 取消预约后更新可预约时段

### Story 3: 医生设置门诊时间

**As a** 医生
**I want to** 设置我的门诊时间和可预约人数
**So that** 患者可以预约我的线下门诊

**Acceptance Criteria**:
- 医生可以设置每周的固定门诊时间
- 医生可以设置每日可预约人数上限
- 医生可以临时关闭某些时段的预约
- 医生可以查看自己的预约列表
- 医生可以确认或拒绝患者的预约申请
- 医生可以在预约时间前取消预约

### Story 4: 查看预约详情

**As a** 患者/医生
**I want to** 查看预约的详细信息
**So that** 我可以了解预约的具体内容

**Acceptance Criteria**:
- 显示预约的医生信息、患者信息
- 显示预约的日期、时间、地点
- 显示预约状态
- 显示就诊提醒信息

## 3. Functional Requirements

### Requirement 1: 门诊时间管理
- **ID**: REQ-001
- **Description**: 医生可设置和管理自己的门诊时间表，包括工作日、可预约时段、每时段人数上限
- **Priority**: High
- **Related Stories**: Story 3

### Requirement 2: 预约列表展示
- **ID**: REQ-002
- **Description**: 患者可查看医生在某日期的可用时段，并选择合适的时段进行预约
- **Priority**: High
- **Related Stories**: Story 1

### Requirement 3: 预约表单
- **ID**: REQ-003
- **Description**: 患者选择时段后填写预约信息，包括就诊原因、联系方式等
- **Priority**: High
- **Related Stories**: Story 1

### Requirement 4: 预约记录管理
- **ID**: REQ-004
- **Description**: 患者可以查看自己所有预约记录，并进行取消操作
- **Priority**: High
- **Related Stories**: Story 2

### Requirement 5: 预约详情页
- **ID**: REQ-005
- **Description**: 显示预约的完整信息，包括医生信息、患者信息、时间地点、状态等
- **Priority**: Medium
- **Related Stories**: Story 4

### Requirement 6: 预约状态流转
- **ID**: REQ-006
- **Description**: 实现预约状态的完整流转：待确认 → 已确认 → 已完成/已取消
- **Priority**: Medium
- **Related Stories**: Story 2, Story 4

### Requirement 7: 医生预约管理
- **ID**: REQ-007
- **Description**: 医生可以查看、确认、拒绝或取消自己的预约
- **Priority**: High
- **Related Stories**: Story 3

## 4. Non-Functional Requirements

### 4.1 Performance
- 预约列表页面加载时间 < 2秒
- 预约操作响应时间 < 1秒

### 4.2 Security
- 患者只能查看和取消自己的预约
- 医生只能管理自己的门诊设置和预约
- 预约信息传输使用 HTTPS

### 4.3 Scalability
- 支持未来扩展到多医院、多科室
- 数据库设计支持预约量增长

### 4.4 Reliability
- 预约操作需要二次确认，避免误操作
- 预约冲突时提示用户选择其他时段

## 5. Technical Requirements

### 5.1 Architecture Considerations
- 遵循现有 Vue 3 + TypeScript + Ant Design Vue 技术栈
- 使用现有的 Store 状态管理模式
- 新增组件放置在 `src/components/` 目录
- 新增页面放置在 `src/views/` 目录
- 新增数据模型和 Store 方法

### 5.2 与问诊功能的区别与联系

| 方面 | 线上问诊 (已有) | 预约挂号 (新增) |
|------|---------------|---------------|
| **交互方式** | 在线文字/语音消息 | 线下面对面就诊 |
| **数据模型** | `Question` 问答对 | `Appointment` 预约记录 |
| **状态流转** | 待回答 → 已回答 | 待确认 → 已确认 → 已完成/已取消 |
| **患者操作** | 提交问题、等待回复 | 选择时段、填写预约信息、取消预约 |
| **医生操作** | 回复患者问题 | 设置门诊时间、确认/拒绝预约 |
| **数据持久性** | 问答记录永久保存 | 预约过期后归档 |

**联系**：
- 复用 `Patient`、`Doctor` 数据模型和用户体系
- 复用 `src/data/` 模拟数据加载机制
- 复用路由守卫和权限控制逻辑
- 复用 Ant Design Vue 组件库

**功能边界 (Scope)**：

| In Scope | Out of Scope |
|----------|--------------|
| 预约时间选择和创建 | 线上问诊功能 |
| 预约状态管理 | 支付/医保结算 |
| 门诊时间设置 | 短信/邮件通知 |
| 预约取消 | 候诊排队系统 |
| 预约详情查看 | 电子病历管理 |

### 5.3 复用策略

#### 可直接复用的现有类型
```typescript
// 复用 src/types/index.ts 中的定义
import type { Patient, Doctor } from '@/types';
```

#### 需要扩展的现有类型
```typescript
// Doctor 类型需添加门诊相关字段
interface Doctor {
  // ... 现有字段
  clinicSchedule?: ClinicSchedule[];   // 门诊时间表
  clinicLocation?: string;              // 门诊地点
  maxPatientsPerSlot?: number;         // 每时段最大人数
}

// Patient 类型保持不变
type Patient = Patient;  // 直接复用
```

#### 可复用组件
| 组件 | 复用方式 |
|------|----------|
| `DoctorCard.vue` | 直接复用显示医生信息 |
| `StatusTag.vue` | 扩展支持预约状态显示 |
| `PatientHeader.vue` | 直接复用患者端导航 |
| `DoctorHeader.vue` | 直接复用医生端导航 |

#### 可复用页面结构
| 页面模式 | 复用参考 |
|----------|----------|
| 列表页 | 参考 `Doctors.vue` 列表布局 |
| 详情页 | 参考 `QuestionDetail.vue` 详情布局 |
| 表单页 | 参考 `Consultation.vue` 表单布局 |

### 5.4 Dependencies
- 依赖 `dayjs` 进行日期时间处理（已在项目中使用）
- 依赖 Ant Design Vue DatePicker 组件进行日期选择
- 可能需要新增 `src/data/appointment-list.json` 模拟数据
- 可能需要新增 `src/data/clinic-schedule.json` 门诊时间模拟数据

### 5.5 Constraints
- 当前为前端演示项目，使用本地 JSON 模拟数据
- 不实现真实的支付功能
- 不实现真实的短信/邮件通知
- 不实现与现有问诊功能的深度整合

### 5.6 API 接口设计 (模拟数据)

由于当前为前端演示项目，以下为模拟 API 接口设计：

#### 数据文件
| 文件路径 | 说明 |
|----------|------|
| `src/data/appointment-list.json` | 预约列表数据 |
| `src/data/clinic-schedule.json` | 医生门诊时间表 |

#### 模拟接口定义

```typescript
// GET /api/appointments - 获取预约列表
interface GetAppointmentsRequest {
  userId: string;       // 患者ID或医生ID
  userType: 'patient' | 'doctor';
  status?: AppointmentStatus;
}

interface GetAppointmentsResponse {
  data: Appointment[];
  total: number;
}

// POST /api/appointments - 创建预约
interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string;
  appointmentDate: string;     // YYYY-MM-DD
  timeSlot: string;            // "09:00-09:30"
  reason: string;             // 就诊原因
  contactPhone: string;       // 联系电话
}

interface CreateAppointmentResponse {
  success: boolean;
  data: Appointment;
  message: string;
}

// PUT /api/appointments/:id/status - 更新预约状态
interface UpdateAppointmentStatusRequest {
  status: 'confirmed' | 'cancelled' | 'rejected' | 'completed';
  reason?: string;            // 取消/拒绝原因
}

interface UpdateAppointmentStatusResponse {
  success: boolean;
  data: Appointment;
}

// GET /api/doctors/:id/schedule - 获取医生门诊时间
interface GetDoctorScheduleRequest {
  doctorId: string;
  startDate: string;          // 查询开始日期
  endDate: string;            // 查询结束日期
}

interface GetDoctorScheduleResponse {
  doctorId: string;
  schedule: DailySchedule[];
  availableSlots: AvailableSlot[];
}

// PUT /api/doctors/:id/schedule - 更新医生门诊时间
interface UpdateDoctorScheduleRequest {
  doctorId: string;
  weeklySchedule: WeeklySchedule;
  maxPatientsPerSlot: number;
  clinicLocation: string;
}

interface UpdateDoctorScheduleResponse {
  success: boolean;
  data: ClinicSchedule;
}

// 数据结构定义
interface DailySchedule {
  date: string;               // YYYY-MM-DD
  slots: TimeSlotInfo[];
  isAvailable: boolean;
}

interface AvailableSlot {
  date: string;
  timeSlot: string;
  remainingCapacity: number;  // 剩余可预约数
}

interface WeeklySchedule {
  [dayOfWeek: string]: {
    enabled: boolean;
    startTime: string;        // "09:00"
    endTime: string;          // "17:00"
    slotDuration: number;     // 分钟，如 30
  };
}

interface TimeSlotInfo {
  startTime: string;
  endTime: string;
  bookedCount: number;
  maxCapacity: number;
  status: 'available' | 'full' | 'closed';
}
```

## 6. Success Criteria

- 患者可以成功预约医生的门诊时间
- 患者可以查看自己的预约列表
- 患者可以取消尚未就诊的预约
- 医生可以设置和管理自己的门诊时间
- 预约状态正确流转
- 页面样式与现有风格保持一致
- 代码遵循项目的编码规范

## 7. Task Breakdown Principles

### 7.1 Granularity
- 每个任务约 1-2 小时工作量
- 任务之间尽量减少依赖，支持并行开发

### 7.2 Independence
- 数据模型设计优先完成
- UI 组件开发可并行进行

### 7.3 Testability
- 每个任务有明确的验收标准
- 功能可独立验证

### 7.4 Task Categories
- **Analysis & Design**: 数据模型设计
- **Code Implementation**: 页面、组件、Store 开发
- **Testing**: 功能验证

### 7.5 Task Count Limitation
- 本功能包含 **8 个任务**，符合 ≤10 任务要求

## 8. Implementation Notes

### 8.1 数据模型扩展

需要新增 `Appointment` 实体：
```typescript
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;      // 预约日期 YYYY-MM-DD
  appointmentTime: string;     // 预约时段，如 "09:00-09:30"
  location: string;            // 就诊地点
  reason: string;              // 就诊原因
  status: AppointmentStatus;   // 预约状态
  createdAt: string;
  updatedAt: string;
}

enum AppointmentStatus {
  PENDING = 'pending',         // 待确认
  CONFIRMED = 'confirmed',     // 已确认
  COMPLETED = 'completed',     // 已完成
  CANCELLED = 'cancelled'      // 已取消
}
```

需要扩展 `Doctor` 实体：
```typescript
interface Doctor {
  // ... 现有字段
  clinicSchedule: ClinicSchedule[];  // 门诊时间表
  clinicLocation: string;            // 门诊地点
  maxPatientsPerSlot: number;        // 每时段最大患者数
}

interface ClinicSchedule {
  dayOfWeek: number;    // 0-6 (周日-周六)
  slots: TimeSlot[];    // 可预约时段
}

interface TimeSlot {
  startTime: string;    // 开始时间，如 "09:00"
  endTime: string;      // 结束时间，如 "09:30"
  maxPatients: number;   // 最大预约人数
}
```

### 8.2 页面设计

1. **预约列表页** `/appointments` - 患者查看和管理预约
2. **预约医生页** `/doctors/:id/book` - 选择医生和时段
3. **医生门诊管理页** `/doctor/schedule` - 医生设置门诊时间
4. **预约详情页** `/appointments/:id` - 查看预约详情

### 8.3 组件设计

1. `AppointmentCard.vue` - 预约卡片组件
2. `TimeSlotPicker.vue` - 时段选择器
3. `ClinicScheduleEditor.vue` - 门诊时间编辑器
4. `AppointmentForm.vue` - 预约表单

## 9. Risks and Mitigations

### Risk 1: 预约冲突
- **Description**: 多个患者同时预约同一时段导致超卖
- **Impact**: Medium
- **Mitigation**: 在预约时检查当前预约数量，提示用户选择其他时段

### Risk 2: 数据持久化
- **Description**: 当前使用内存存储，刷新页面数据丢失
- **Impact**: High
- **Mitigation**: 文档中说明当前为演示版本，未来需接入后端

### Risk 3: 预约取消后状态更新
- **Description**: 取消预约后需实时更新可预约时段
- **Impact**: Low
- **Mitigation**: 在取消操作后重新计算可用时段

## 10. Appendix

### 10.1 References
- 项目上下文文件: `.asdm/contexts/index.md`
- 数据模型文档: `.asdm/contexts/data-models.md`
- 项目结构文档: `.asdm/contexts/standard-project-structure.md`
- 编码规范文档: `.asdm/contexts/standard-coding-style.md`

### 10.2 Glossary
| 术语 | 定义 |
|------|------|
| 门诊时间 | 医生在线下医院出诊的时间段 |
| 时段 | 一个可预约的具体时间块，如 09:00-09:30 |
| 就诊地点 | 患者实际就诊的医院/诊所地址 |
| 预约状态 | 预约的当前生命周期状态 |

---

## Task Count Validation

本功能包含 **9 个任务**，符合 ≤10 任务要求：

| Task ID | Task Name | 预计工作量 |
|---------|-----------|-----------|
| TASK-001 | 设计预约数据模型 | 1 小时 |
| TASK-002 | 创建预约相关数据类型和模拟数据 | 1 小时 |
| TASK-003 | 实现预约 Store 状态管理 | 2 小时 |
| TASK-004 | 开发预约列表页面 | 2 小时 |
| TASK-005 | 开发预约表单页面 | 2 小时 |
| TASK-006 | 开发预约详情页面 | 1 小时 |
| TASK-007 | 开发医生门诊管理页面 | 2 小时 |
| TASK-008 | 开发医生预约管理功能 | 1 小时 |
| TASK-009 | 配置预约相关路由 | 1 小时 |

## Status Management

| 状态 | 说明 |
|------|------|
| PLANNED | 功能已规划，尚未开始 |
| IN PROGRESS | 功能正在实现中 |
| COMPLETED | 功能已完成 |
| CANCELLED | 功能已取消 |
