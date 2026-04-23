# Task PRD: Store 层扩展 - 排班与预约方法

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-002
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：在 `src/store/index.ts` 中扩展 State 结构，新增 `appointments` 和 `appointmentSlots` 字段；新增 8 个 Store 方法，实现预约的创建、确认、取消、查询功能，以及排班时段的查询功能，包含排班状态联动逻辑。
- **任务目的**：为预约挂号功能提供完整的状态管理能力，使页面视图组件可以通过 Store 方法操作预约数据，确保数据变更在组件间响应式同步。
- **关联需求**：满足 Feature PRD REQ-005（排班数据与 Store 方法）。

### 1.2 Task Objectives

- 目标 1：扩展 `State` 接口，新增 `appointments: Appointment[]` 和 `appointmentSlots: AppointmentSlot[]` 两个字段
- 目标 2：在 `reactive()` 初始化中引入 TASK-001 创建的两个 JSON 数据文件
- 目标 3：在 `store` 对象中新增 8 个方法：`getSlotsByDoctor`、`getSlotsByDoctorAndDate`、`getAvailableSlotsByDoctorAndDate`、`createAppointment`、`confirmAppointment`、`cancelAppointment`、`getAppointmentsByDoctor`、`getAppointmentsByPatient`
- 目标 4：实现排班联动逻辑——创建预约时将对应排班标记为 `booked`，取消预约时释放排班为 `available`

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-005 排班数据与 Store 方法
- **Related User Story**: Story 1（患者预约）、Story 2（医生管理）、Story 3（患者查看预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：`getSlotsByDoctor(doctorId: string): AppointmentSlot[]` — 返回指定医生的全部排班时段
- **FR-2**：`getSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[]` — 返回指定医生某天的排班时段
- **FR-3**：`getAvailableSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[]` — 返回指定医生某天可预约的时段（`status === 'available'`）
- **FR-4**：`createAppointment(data: Omit<Appointment, 'id' | 'status' | 'cancelReason' | 'createdAt' | 'updatedAt'>): Appointment` — 创建预约，自动生成 id（`apt${Date.now()}`）、设置 status 为 `pending`、设置 createdAt/updatedAt，并联动将对应排班时段状态改为 `booked`
- **FR-5**：`confirmAppointment(appointmentId: string): void` — 将预约状态改为 `confirmed`，更新 `updatedAt`
- **FR-6**：`cancelAppointment(appointmentId: string, reason: string): void` — 将预约状态改为 `cancelled`、设置 cancelReason、更新 updatedAt，并联动释放对应排班时段为 `available`
- **FR-7**：`getAppointmentsByDoctor(doctorId: string): Appointment[]` — 返回指定医生的预约列表
- **FR-8**：`getAppointmentsByPatient(patientId: string): Appointment[]` — 返回指定患者的预约列表

### 2.2 Technical Requirements

- **TR-1**：新增 import 语句引入 `appointment-slots.json` 和 `appointment-list.json`，放在现有 import 语句之后
- **TR-2**：State 初始化新增两个字段：`appointments: appointmentListData as Appointment[]`、`appointmentSlots: slotData as AppointmentSlot[]`
- **TR-3**：新增 Store 方法放在 `getStatistics()` 方法之后，保持与现有方法一致的缩进和代码风格
- **TR-4**：排班联动查找逻辑：通过 `doctorId + date + timeSlot` 三个字段匹配对应的 `AppointmentSlot` 记录

### 2.3 Constraints and Limitations

- 不修改现有的 Doctor、Patient、Question 接口
- 不修改现有的 State 字段（doctors、patients、questions、currentDoctor、currentPatient）
- 不修改现有的 11 个 Store 方法
- 方法签名中的参数和返回类型必须与 Feature PRD 第 5.3 节 Store API Design 一致
- 不引入新的 NPM 依赖

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：`createAppointment` 方法必须在创建前校验对应排班时段状态，防止重复预约（同一时段被多人预约）
- **SEC-2**：`cancelAppointment` 方法应校验取消原因 `reason` 参数非空，空字符串不应允许执行取消操作
- **SEC-2.1**：`cancelAppointment` 方法应校验取消原因 `reason` 参数最大长度不超过 200 字符，超过时应截断或拒绝执行
- **SEC-3**：`cancelAppointment` 和 `confirmAppointment` 方法应校验预约记录是否存在，对不存在的 ID 应静默忽略（不抛出异常导致页面崩溃）
- **SEC-4**：`cancelAppointment` 应校验预约当前状态——仅 `pending` 和 `confirmed` 状态可取消，已 `cancelled` 的预约不应再次操作
- **SEC-5**：`confirmAppointment` 应校验预约当前状态——仅 `pending` 状态可确认，防止重复确认
- **SEC-6**：所有方法不应对输入参数执行 `eval()`、`Function()` 等动态代码执行操作

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：`createAppointment` 自动设置 `createdAt` 和 `updatedAt` 时间戳，确保每条预约记录有完整的创建和修改时间审计
- **CMP-2**：`cancelAppointment` 记录取消原因到 `cancelReason` 字段，满足操作留痕和可追溯要求
- **CMP-3**：`confirmAppointment` 更新 `updatedAt` 时间戳，记录确认操作的时间点
- **CMP-4**：排班联动逻辑（创建→booked、取消→available）确保数据一致性，防止排班状态与预约状态不匹配

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 遵循现有 `addQuestion` 方法的编码模式：使用 `Omit<>` 工具类型定义输入参数，自动生成 id 和时间戳
- 遵循现有 `answerQuestion` 方法的模式：通过 `find` 查找记录后直接修改属性（利用 reactive 深层响应式）
- 排班联动使用 `find` + 直接修改 `status` 属性，与现有数据修改风格一致

### 3.2 Implementation Steps

**步骤 1：新增 import**

在 `src/store/index.ts` 现有 import 语句（约第 4 行）之后添加：

```typescript
import appointmentListData from '../data/appointment-list.json'
import slotData from '../data/appointment-slots.json'
```

**步骤 2：扩展 State 接口**

在现有 `State` 接口中 `currentPatient` 字段之后添加：

```typescript
appointments: Appointment[]
appointmentSlots: AppointmentSlot[]
```

**步骤 3：扩展 reactive 初始化**

在 `reactive<State>({...})` 对象中添加：

```typescript
appointments: appointmentListData as Appointment[],
appointmentSlots: slotData as AppointmentSlot[],
```

**步骤 4：新增 8 个 Store 方法**

在 `store` 对象的 `getStatistics()` 方法之后添加以下方法：

```typescript
// ---- 排班查询方法 ----

getSlotsByDoctor(doctorId: string): AppointmentSlot[] {
  return state.appointmentSlots.filter(s => s.doctorId === doctorId)
},

getSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[] {
  return state.appointmentSlots.filter(
    s => s.doctorId === doctorId && s.date === date
  )
},

getAvailableSlotsByDoctorAndDate(doctorId: string, date: string): AppointmentSlot[] {
  return state.appointmentSlots.filter(
    s => s.doctorId === doctorId && s.date === date && s.status === 'available'
  )
},

// ---- 预约操作方法 ----

createAppointment(data: Omit<Appointment, 'id' | 'status' | 'cancelReason' | 'createdAt' | 'updatedAt'>): Appointment | null {
  // 排班联动：查找对应时段
  const slot = state.appointmentSlots.find(
    s => s.doctorId === data.doctorId && s.date === data.date && s.timeSlot === data.timeSlot
  )
  // 安全校验：时段已预约则拒绝创建
  if (slot && slot.status !== 'available') {
    return null
  }
  // 创建预约记录
  const appointment: Appointment = {
    ...data,
    id: `apt${Date.now()}`,
    status: 'pending',
    cancelReason: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  state.appointments.push(appointment)
  // 联动更新排班状态
  if (slot) {
    slot.status = 'booked'
  }
  return appointment
},

confirmAppointment(appointmentId: string): void {
  const appointment = state.appointments.find(a => a.id === appointmentId)
  if (!appointment || appointment.status !== 'pending') return  // 静默忽略
  appointment.status = 'confirmed'
  appointment.updatedAt = new Date().toISOString()
},

cancelAppointment(appointmentId: string, reason: string): void {
  const appointment = state.appointments.find(a => a.id === appointmentId)
  if (!appointment) return
  if (appointment.status !== 'pending' && appointment.status !== 'confirmed') return  // 仅 pending/confirmed 可取消
  if (!reason || reason.trim().length === 0) return  // 原因为空则拒绝
  if (reason.length > 200) return  // 超长则拒绝
  // 释放排班联动
  const slot = state.appointmentSlots.find(
    s => s.doctorId === appointment.doctorId && s.date === appointment.date && s.timeSlot === appointment.timeSlot
  )
  if (slot) {
    slot.status = 'available'
  }
  appointment.status = 'cancelled'
  appointment.cancelReason = reason.trim()
  appointment.updatedAt = new Date().toISOString()
},

// ---- 预约查询方法 ----

getAppointmentsByDoctor(doctorId: string): Appointment[] {
  return state.appointments.filter(a => a.doctorId === doctorId)
},

getAppointmentsByPatient(patientId: string): Appointment[] {
  return state.appointments.filter(a => a.patientId === patientId)
},
```

**步骤 5：验证**

- 运行 `npm run build` 确认编译通过
- 在浏览器控制台执行 `store.getAvailableSlotsByDoctorAndDate('doc001', '2026-04-23')` 验证返回数据
- 执行 `store.createAppointment(...)` 验证创建和排班联动

### 3.3 Technical Considerations

- `createAppointment` 的排班联动：创建前应检查对应时段是否 `available`，若已 `booked` 则不创建（返回 null 或抛出提示）。为简化实现，可直接查找并修改，若找不到则忽略
- `cancelAppointment` 的排班联动：只有当预约状态为 `pending` 或 `confirmed` 时才执行取消操作和释放排班
- `confirmAppointment`：只有当预约状态为 `pending` 时才执行确认操作

### 3.4 Reference to Project Context

- `.asdm/contexts/api.md`：Store API 设计规范
- `.asdm/contexts/data-models.md`：数据模型定义
- `.asdm/contexts/standard-coding-style.md`：编码风格指南

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：`State` 接口包含 `appointments` 和 `appointmentSlots` 两个新字段
  - Test method：检查 TypeScript 类型定义
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-2**：`store` 对象导出了 8 个新方法，方法签名与 Feature PRD 一致
  - Test method：检查方法名、参数类型、返回类型
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-3**：`createAppointment` 创建预约后，对应排班时段的 `status` 变为 `booked`
  - Test method：代码审查排班联动逻辑
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-4**：`cancelAppointment` 取消预约后，对应排班时段的 `status` 恢复为 `available`
  - Test method：代码审查排班释放逻辑
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-5**：现有的 11 个 Store 方法未被修改
  - Test method：git diff 确认现有方法无变更
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-6**：`npm run build` 构建成功
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-7**：`createAppointment` 对已 `booked` 的时段返回 `null`，不创建预约记录
  - Test method：控制台调用 `store.createAppointment(...)` 传入已 booked 的 doctorId+date+timeSlot，验证返回 null 且 appointments 数组未新增
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-8**：`cancelAppointment` 传入空字符串 `reason` 时不执行取消操作
  - Test method：控制台调用 `store.cancelAppointment(id, '')`，验证预约状态不变
  - **Validation tool**: `npm run build`（exit code 0）
- **AC-9**：`getAppointmentsByDoctor` 和 `getAppointmentsByPatient` 仅返回匹配的预约记录，不返回其他医生/患者的数据
  - Test method：控制台调用 `store.getAppointmentsByDoctor('doc001')`，验证结果中所有 `doctorId` 均为 `doc001`
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- `createAppointment` 传入的 doctorId + date + timeSlot 在排班中找不到对应记录时，不报错，仅创建预约记录
- `cancelAppointment` 传入的 appointmentId 不存在时，静默忽略
- `confirmAppointment` 传入的 appointmentId 对应的预约已是 confirmed 状态时，静默忽略

### 4.3 Negative Tests

- 不修改现有 `addQuestion`、`answerQuestion` 等方法的行为
- State 新增字段不影响现有组件对 `doctors`/`patients`/`questions` 的访问

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（需要 `Appointment`/`AppointmentSlot` 接口定义和 JSON 数据文件）
- **Blocks**: TASK-004（预约页面依赖 Store 方法）、TASK-005（预约提交依赖 createAppointment）、TASK-006（医生端依赖 confirmAppointment/cancelAppointment/getAppointmentsByDoctor）、TASK-007（患者端依赖 getAppointmentsByPatient/cancelAppointment）

### 5.2 External Dependencies

- 无新增外部依赖

### 5.3 Prerequisites

- TASK-001 已完成：`src/store/index.ts` 中已定义 `Appointment` 和 `AppointmentSlot` 接口
- TASK-001 已完成：`src/data/appointment-slots.json` 和 `src/data/appointment-list.json` 已创建

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 8 个方法逻辑清晰，但排班联动逻辑需仔细实现
- 需确保与现有 Store 风格完全一致

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Exit criteria**: exit code 0

### 7.2 Store Method Functional Testing

以下测试在浏览器控制台或临时脚本中执行：
- 调用 `store.getAvailableSlotsByDoctorAndDate('doc001', '2026-04-23')` 验证返回可用时段列表
- 调用 `store.createAppointment({patientId:'pat001', patientName:'测试患者', doctorId:'doc001', doctorName:'张伟', date:'2026-04-23', timeSlot:'08:00-08:30'})` 验证创建成功且对应排班变为 `booked`
- 调用 `store.confirmAppointment(aptId)` 验证状态变为 `confirmed`
- 调用 `store.cancelAppointment(aptId, '测试取消')` 验证状态变为 `cancelled` 且排班恢复为 `available`
- 对已 `cancelled` 的预约再次调用 `cancelAppointment`，验证静默忽略
- 对已 `confirmed` 的预约调用 `confirmAppointment`，验证静默忽略
- 对不存在的 ID 调用 `confirmAppointment`/`cancelAppointment`，验证不抛出异常

### 7.3 Data Consistency Testing

- 创建预约后检查对应排班时段确实变为 `booked`
- 取消预约后检查对应排班时段确实恢复为 `available`
- 确认预约后取消，检查排班时段恢复为 `available`
- 验证 `getAppointmentsByDoctor` 和 `getAppointmentsByPatient` 返回正确过滤结果

### 7.4 Security Verification

- 验证重复预约同一时段时行为正确（应不创建或返回提示）
- 验证 `cancelAppointment('', '')` 空参数不导致崩溃
- 验证不存在的 doctorId/patientId 查询返回空数组而非报错

### 7.5 Regression Testing

- 运行现有 `addQuestion`、`answerQuestion` 等方法，确认行为未受影响
- 验证 State 新增字段不影响现有组件的数据访问

## 8. Implementation Notes

- `createAppointment` 方法的输入参数 `Omit<Appointment, 'id' | 'status' | 'cancelReason' | 'createdAt' | 'updatedAt'>` 意味着调用方需传入 `patientId`、`patientName`、`doctorId`、`doctorName`、`date`、`timeSlot` 六个字段
- 排班联动查找逻辑示例：`state.appointmentSlots.find(s => s.doctorId === data.doctorId && s.date === data.date && s.timeSlot === data.timeSlot)`
- 现有 `store` 对象中的方法使用普通函数（非箭头函数），新方法应保持一致风格
- `state` 使用 `reactive()` 包装，对数组元素的属性修改是响应式的，无需特殊处理

## 9. Risks and Mitigations

### Risk 1

- **Description**: 排班联动逻辑可能遗漏，导致创建预约后排班状态未更新
- **Impact**: Medium
- **Mitigation**: 严格按照 Feature PRD 5.3 节的排班联动说明实现

### Risk 2

- **Description**: TypeScript 类型错误（如 Omit 类型使用不当）
- **Impact**: Low
- **Mitigation**: 通过 `npm run build` 验证

## 10. Deliverables

- `src/store/index.ts`：扩展 State 接口、reactive 初始化、新增 8 个 Store 方法
- **Build output**: `npm run build` 成功，exit code 0

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
