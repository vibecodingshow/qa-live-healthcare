# Feature PRD: 预约挂号

**Feature ID**: FEAT-001
**Created Date**: 2026-04-22
**Status**: PLANNED
**Language**: zh

## 1. Overview

### 1.1 Feature Summary

- **功能描述**：为医疗问诊平台新增"预约挂号"功能，让患者可以在线预约医生的线下门诊时间。患者可浏览医生排班信息、选择日期与时间段进行挂号，医生可在诊室中查看和管理自己的预约列表。
- **需求背景**：当前平台仅支持在线问诊（文字咨询），缺少线下门诊的预约渠道。预约挂号是医疗平台的核心功能之一，能帮助患者合理安排就诊时间，同时帮助医生提前了解当日门诊量。
- **受益方**：
  - **患者**：可以提前预约医生的线下门诊，避免排队等待
  - **医生**：可以查看和管理自己的门诊预约，合理安排工作时间
  - **平台**：完善医疗服务闭环，提升用户体验

### 1.2 Objectives

- **目标 1**：患者可以浏览医生的排班信息（日期 + 可预约时间段），并提交预约挂号请求
- **目标 2**：医生可以在诊室页面查看自己的预约列表，支持确认/取消预约操作
- **目标 3**：预约数据在内存中管理，与现有架构（reactive Store + JSON 静态数据）保持一致
- **目标 4**：新增预约挂号的独立页面（`/appointment`），并集成到导航菜单中

## 2. User Stories

### Story 1
**As a** 患者
**I want to** 浏览所有在线医生的排班信息，选择日期和时间段提交预约挂号
**So that** 我可以提前安排好就诊时间，避免到现场排队

**Acceptance Criteria**:
- AC-1.1: 访问 `/appointment` 页面，展示所有在线医生的卡片列表（复用现有 Doctors 列表卡片样式）
- AC-1.2: 点击医生卡片后，展示该医生的可预约日期列表（未来 7 天，排除当日已过的时间）
- AC-1.3: 选择日期后，展示该日的可预约时间段列表（上午/下午各若干时段，已被预约的时段标记为"已满"）
- AC-1.4: 选择时间段后点击"预约挂号"按钮，弹出确认 Modal（显示医生信息、日期、时段）
- AC-1.5: 确认预约后，显示 `message.success` 提示，预约记录添加到 Store
- AC-1.6: 未登录患者需先验证身份（复用 `verifyPatient` 逻辑）

### Story 2
**As a** 医生
**I want to** 在我的诊室页面查看患者提交的预约挂号列表
**So that** 我可以提前了解当日门诊安排，做好接诊准备

**Acceptance Criteria**:
- AC-2.1: 医生诊室页面（DoctorRoom）新增"预约挂号"标签页，展示该医生的预约列表
- AC-2.2: 预约列表按日期分组展示，显示患者姓名、预约时段、预约状态（待确认/已确认/已取消）
- AC-2.3: 医生可以点击"确认"按钮将预约状态改为"已确认"
- AC-2.4: 医生可以点击"取消"按钮将预约状态改为"已取消"，取消时需填写取消原因

### Story 3
**As a** 患者
**I want to** 在问诊页面查看我的预约记录
**So that** 我可以管理自己的预约，了解预约状态

**Acceptance Criteria**:
- AC-3.1: Consultation 页面新增"我的预约"区域，展示当前患者的预约列表
- AC-3.2: 预约卡片显示医生姓名、预约日期、时段和状态
- AC-3.3: 患者可以取消状态为"待确认"的预约

## 3. Functional Requirements

### Requirement 1: 预约数据模型
- **ID**: REQ-001
- **Description**: 新增 `Appointment` 数据模型，包含预约ID、患者信息、医生信息、预约日期、时段、状态等字段。新增 `AppointmentSlot` 排班数据模型，定义医生的可预约时段。
- **Priority**: High
- **Related Stories**: Story 1, Story 2, Story 3

### Requirement 2: 预约挂号页面
- **ID**: REQ-002
- **Description**: 创建独立的预约挂号页面（`/appointment`），展示在线医生列表、排班日历和时间段选择器，支持预约提交。
- **Priority**: High
- **Related Stories**: Story 1

### Requirement 3: 预约管理 - 医生端
- **ID**: REQ-003
- **Description**: 在医生诊室页面新增预约管理功能，医生可查看、确认、取消预约。
- **Priority**: High
- **Related Stories**: Story 2

### Requirement 4: 预约管理 - 患者端
- **ID**: REQ-004
- **Description**: 在患者问诊页面新增"我的预约"区域，展示预约列表并支持取消操作。
- **Priority**: Medium
- **Related Stories**: Story 3

### Requirement 5: 排班数据与 Store 方法
- **ID**: REQ-005
- **Description**: 在 Store 中新增排班数据和预约相关的增删改查方法，包括创建预约、取消预约、确认预约、查询预约等。
- **Priority**: High
- **Related Stories**: Story 1, Story 2, Story 3

### Requirement 6: 导航集成
- **ID**: REQ-006
- **Description**: 在顶部导航菜单（AppHeader）中添加"预约挂号"入口，在医生诊室中添加预约管理标签。
- **Priority**: Medium
- **Related Stories**: Story 1, Story 2

## 4. Non-Functional Requirements

### 4.1 Performance
- 页面加载应流畅，排班数据从内存 reactive 状态读取，无网络延迟
- 时间段选择交互应即时响应（< 100ms）

### 4.2 Security
- 患者预约需先验证身份（复用 verifyPatient 流程）
- 医生管理预约需已登录（复用 loginDoctor 流程）

### 4.3 Scalability
- 排班数据使用 JSON 静态文件初始化，与现有架构一致，后续可扩展为动态配置
- 新增数据模型遵循现有 Store 模式，便于后续对接后端 API

### 4.4 Reliability
- 预约操作使用 setTimeout 模拟异步（与现有 addQuestion 一致）
- 表单操作有 loading 状态和成功/失败反馈

## 5. Technical Requirements

### 5.1 Architecture Considerations

- **保持纯前端架构**：所有预约数据存储在 `reactive()` 内存状态中，页面刷新后丢失
- **遵循现有分层结构**：
  - 数据层：新增 `appointment-slots.json`（排班数据）和 `appointment-list.json`（示例预约数据）
  - 状态层：`src/store/index.ts` 新增 `Appointment`/`AppointmentSlot` 接口和相关 Store 方法
  - 路由层：新增 `/appointment` 路由
  - 视图层：新增 `Appointment.vue` 页面组件
- **架构影响分析**：
  - 现有 ER 关系从 `Doctor → Question ← Patient` 扩展为三组关系：`Doctor → Question ← Patient`（保持不变）、`Doctor → AppointmentSlot`（排班）、`Doctor → Appointment ← Patient`（预约）
  - State 结构从 5 个字段扩展为 7 个字段（新增 `appointments`、`appointmentSlots`），现有字段不受影响
  - 数据流新增路径：`appointment-slots.json` → State → Appointment.vue / DoctorRoom.vue / Consultation.vue
  - 路由表从 7 条扩展为 8 条（新增 `/appointment`），不修改现有路由配置

### 5.2 Data Model Design

- **新增实体 Appointment（预约记录）**：

```typescript
interface Appointment {
  id: string;              // 唯一标识，格式 "apt001"
  patientId: string;       // 患者ID（FK → Patient.id）
  patientName: string;     // 患者姓名（冗余字段，与 Question 保持一致）
  doctorId: string;        // 医生ID（FK → Doctor.id）
  doctorName: string;      // 医生姓名（冗余字段）
  date: string;            // 预约日期，格式 "YYYY-MM-DD"
  timeSlot: string;        // 预约时段，格式 "HH:mm-HH:mm"，如 "08:00-08:30"
  status: 'pending' | 'confirmed' | 'cancelled';  // 预约状态
  cancelReason: string;    // 取消原因（仅 cancelled 状态有值）
  createdAt: string;       // 创建时间（ISO 8601）
  updatedAt: string;       // 更新时间（ISO 8601）
}
```

- **新增实体 AppointmentSlot（排班时段）**：

```typescript
interface AppointmentSlot {
  id: string;              // 唯一标识，格式 "slot_doc001_2026-04-23_08:00"
  doctorId: string;        // 医生ID（FK → Doctor.id）
  date: string;            // 排班日期，格式 "YYYY-MM-DD"
  timeSlot: string;        // 时段，格式 "HH:mm-HH:mm"
  period: 'morning' | 'afternoon';  // 上午/下午
  status: 'available' | 'booked' | 'cancelled';  // 时段状态
}
```

- **预约状态机**：

```
[创建预约] → pending → confirmed  （医生确认）
                  ↘ cancelled  （医生取消，需填原因 / 患者取消）
```

- **排班时段状态机**：

```
available → booked     （有预约关联该时段）
booked    → available  （关联的预约被取消，释放时段）
```

- **ER 关系**：

```
DOCTOR 1──N APPOINTMENT_SLOT  （一个医生多个排班时段）
DOCTOR 1──N APPOINTMENT       （一个医生多个预约）
PATIENT 1──N APPOINTMENT       （一个患者多个预约）
APPOINTMENT_SLOT 1──0..1 APPOINTMENT  （一个时段最多关联一个预约）
```

### 5.3 Store API Design

- **State 新增字段**：

```typescript
interface State {
  // ... 现有字段保持不变 ...
  appointments: Appointment[];         // 全部预约列表
  appointmentSlots: AppointmentSlot[]; // 全部排班时段
}
```

- **新增 Store 方法**：

| 方法名 | 签名 | 说明 | 返回值 |
|--------|------|------|--------|
| `getSlotsByDoctor` | `(doctorId: string): AppointmentSlot[]` | 查询医生的全部排班时段 | 时段数组 |
| `getSlotsByDoctorAndDate` | `(doctorId: string, date: string): AppointmentSlot[]` | 查询医生某天的排班 | 时段数组 |
| `getAvailableSlotsByDoctorAndDate` | `(doctorId: string, date: string): AppointmentSlot[]` | 查询可预约时段（status=available） | 时段数组 |
| `createAppointment` | `(data: Omit<Appointment, 'id' \| 'status' \| 'cancelReason' \| 'createdAt' \| 'updatedAt'>): Appointment` | 创建预约，联动更新排班状态为 booked | 新 Appointment |
| `confirmAppointment` | `(appointmentId: string): void` | 确认预约 | void |
| `cancelAppointment` | `(appointmentId: string, reason: string): void` | 取消预约，联动释放排班状态为 available | void |
| `getAppointmentsByDoctor` | `(doctorId: string): Appointment[]` | 查询医生的预约列表 | 预约数组 |
| `getAppointmentsByPatient` | `(patientId: string): Appointment[]` | 查询患者的预约列表 | 预约数组 |

- **排班联动逻辑**：
  - `createAppointment`：创建预约后，查找对应 `appointmentSlots` 中 `doctorId + date + timeSlot` 匹配的记录，将其 `status` 改为 `booked`
  - `cancelAppointment`：取消预约后，查找对应排班记录，将其 `status` 恢复为 `available`

### 5.4 Frontend Component Design

- **新增组件**：

| 组件 | 路径 | 说明 |
|------|------|------|
| `Appointment.vue` | `src/views/Appointment.vue` | 预约挂号页面（患者端），包含医生列表、排班展示、预约提交 |

- **修改组件**：

| 组件 | 路径 | 修改内容 |
|------|------|----------|
| `DoctorRoom.vue` | `src/views/DoctorRoom.vue` | 用 `a-tabs` 包裹现有内容，新增"预约管理"标签页 |
| `Consultation.vue` | `src/views/Consultation.vue` | 在"我的问题"下方新增"我的预约"区域 |
| `AppHeader.vue` | `src/components/AppHeader.vue` | 导航菜单新增"预约挂号"项 |

- **Appointment.vue 页面布局结构**：

```
┌─────────────────────────────────────┐
│  a-alert: 会话数据提示               │
├─────────────────────────────────────┤
│  患者验证区域（未验证时显示）         │
│  ┌─────────┐  ┌─────────┐           │
│  │ 姓名输入 │  │ 生日选择 │ [验证]    │
│  └─────────┘  └─────────┘           │
├─────────────────────────────────────┤
│  [医生列表] / [排班详情]（二选一）    │
│                                     │
│  医生列表视图：                       │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ Doc1 │ │ Doc2 │ │ Doc3 │  ...    │
│  └──────┘ └──────┘ └──────┘         │
│                                     │
│  排班详情视图（选择医生后）：          │
│  [← 返回列表]  医生信息              │
│  ┌─────────────────────────────┐    │
│  │ 日期标签: [4/23] [4/24] ... │    │
│  ├─────────────────────────────┤    │
│  │ 上午                        │    │
│  │ [08:00] [08:30] ... [已满]  │    │
│  │ 下午                        │    │
│  │ [14:00] [14:30] ...        │    │
│  ├─────────────────────────────┤    │
│  │ [预约挂号] 按钮             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
  a-modal: 预约确认弹窗
```

- **DoctorRoom.vue 预约管理标签页布局**：

```
┌─ a-tabs ────────────────────────────┐
│ [问诊管理]  [预约管理]               │
├─────────────────────────────────────┤
│  问诊管理（现有内容，移入第一个tab）   │
│  ┌─ 待响应问题 ─┬─ 已解答问题 ─┐    │
│  ...现有内容不变...                │
└─────────────────────────────────────┘
│  预约管理（新增第二个tab）           │
│  按日期分组：                       │
│  ▼ 2026-04-23                     │
│    ┌───────────────────────────┐   │
│    │ 赵明 08:00-08:30 [待确认]  │   │
│    │   [确认] [取消]           │   │
│    │ 李芳 09:00-09:30 [已确认]  │   │
│    │   [取消]                  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

- **Consultation.vue 我的预约区域布局**：

```
┌─ 我的预约 ──────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │ 张伟医生  4/23  08:00-08:30  │    │
│  │ 状态：[待确认]              │    │
│  │              [取消预约]      │    │
│  ├─────────────────────────────┤    │
│  │ 李娜医生  4/25  14:00-14:30 │    │
│  │ 状态：[已确认]              │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

- **组件间数据流向**：

```
appointment-slots.json → store.state.appointmentSlots
appointment-list.json  → store.state.appointments
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
      Appointment.vue   DoctorRoom.vue   Consultation.vue
      (患者浏览排班)    (医生管理预约)   (患者查看预约)
              │               │               │
              └───────┬───────┘               │
                      ▼                       │
              store.createAppointment()        │
              store.cancelAppointment()        │
                      ▲                       │
                      └───────────────────────┘
```

### 5.5 Dependencies

- **内部依赖**：
  - 复用现有 `Doctor`/`Patient` 数据模型和 Store 方法（`verifyPatient`、`loginDoctor`）
  - 复用 `AppHeader.vue` 导航菜单组件
  - 复用 Ant Design Vue 组件库（`a-card`、`a-modal`、`a-tag`、`a-button`、`a-tabs`、`a-divider`、`a-empty` 等）
  - 复用 `dayjs` 进行日期处理

### 5.6 Constraints

- 不引入新的 NPM 依赖
- 使用 Ant Design Vue 现有组件实现日期/时间选择（不使用第三方日期选择器）
- 遵循 `<script setup lang="ts">` + Composition API 编码规范
- 所有组件使用 `<style scoped>`
- 移动端响应式适配（`@media (max-width: 768px)` 断点）

## 6. Success Criteria

- [ ] 患者可以通过 `/appointment` 页面成功预约医生的线下门诊
- [ ] 医生可以在诊室页面查看并管理（确认/取消）预约
- [ ] 患者可以在问诊页面查看自己的预约记录并取消待确认的预约
- [ ] 导航菜单包含"预约挂号"入口
- [ ] 新增数据模型（Appointment、AppointmentSlot）定义完整，Store 方法与现有风格一致
- [ ] `npm run build` 构建成功，无 TypeScript 错误

## 7. Task Breakdown Principles

### 7.1 Granularity
- 每个任务应控制在 AI 模型 5-10 分钟内可完成的工作量
- 任务聚焦于单一功能模块

### 7.2 Independence
- 任务之间尽量减少依赖，支持并行执行
- 数据模型和 Store 方法作为基础任务优先完成

### 7.3 Testability
- 每个任务有明确的验收标准
- 可通过页面交互验证功能正确性

### 7.4 Task Categories
- 数据模型与 Store 层（数据结构 + 接口方法）
- 页面视图实现（Vue 组件）
- 导航与路由集成

### 7.5 Task Count Limitation
- 本功能计划不超过 10 个任务

## 8. Implementation Notes

- **排班数据设计**：每个医生预设未来 7 天的排班，每天分为上午（08:00-12:00）和下午（14:00-17:00）两个时段，每 30 分钟为一个预约单元（上午 8 个，下午 6 个），初始排班数据写在 JSON 文件中
- **时间段状态**：每个预约单元有三种状态：`available`（可预约）、`booked`（已预约）、`cancelled`（已取消后释放）
- **预约状态流转**：`pending`（待确认）→ `confirmed`（已确认）/ `cancelled`（已取消）
- **ID 生成策略**：与现有一致，使用 `apt${Date.now()}` 生成预约 ID
- **与现有问诊功能的关系**：预约挂号是独立功能模块，不影响现有问诊流程
- **并发冲突说明**：本项目为纯前端单用户场景，不存在多患者同时竞争同一时段的并发问题。排班状态在 Store 中即时更新，选中时段后的可用性以提交时的实际状态为准
- **已有功能影响分析**：
  - `src/store/index.ts`：仅新增接口和方法，不修改现有代码，对问诊功能零影响
  - `src/views/Consultation.vue`：在"我的问题"下方追加"我的预约"区域，不改动现有问诊逻辑
  - `src/views/DoctorRoom.vue`：使用 `a-tabs` 包裹现有内容 + 新增标签页，不改动现有问题回复逻辑
  - `src/components/AppHeader.vue`：在导航菜单追加一个菜单项，不影响现有菜单项

## 9. Risks and Mitigations

### Risk 1
- **Description**: 预约数据仅存储在内存中，页面刷新后丢失，用户可能误以为预约已保存
- **Impact**: Medium
- **Mitigation**: 在页面显著位置添加提示信息"预约数据仅保存在当前会话中，刷新页面后将丢失"

### Risk 2
- **Description**: 排班数据为静态预设，无法动态调整
- **Impact**: Low
- **Mitigation**: 通过 JSON 文件配置排班，后续扩展时仅需替换数据源

## 10. Appendix

### 10.1 References
- 项目上下文：`.asdm/contexts/index.md`
- 数据模型文档：`.asdm/contexts/data-models.md`
- 系统架构文档：`.asdm/contexts/architecture.md`
- 编码风格文档：`.asdm/contexts/standard-coding-style.md`
- Store API 文档：`.asdm/contexts/api.md`

### 10.2 Glossary
- **排班（Schedule Slot）**：医生的可预约时间单元，通常以 30 分钟为一个时段
- **预约挂号（Appointment Booking）**：患者提前选择医生和时间段，登记线下门诊就诊
- **预约状态**：`pending`（待确认）、`confirmed`（已确认）、`cancelled`（已取消）

---

*此功能 PRD 文档由 PRD Builder 工具集生成。*
