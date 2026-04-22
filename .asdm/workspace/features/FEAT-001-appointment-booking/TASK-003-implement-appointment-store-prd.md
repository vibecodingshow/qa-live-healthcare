# Task PRD: 实现预约 Store 状态管理

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-003
**Created Date**: 2026-04-21
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务在现有的 Vue 3 Reactive Store 中添加预约相关的状态和方法。包括添加 `appointments` 状态数组，实现创建预约、取消预约、确认预约、拒绝预约等方法，以及获取患者预约列表和医生预约列表的方法。

### 1.2 Task Objectives

- 添加 `appointments` 响应式状态
- 实现 `addAppointment()` 创建预约方法
- 实现 `cancelAppointment()` 取消预约方法
- 实现 `confirmAppointment()` 确认预约方法
- 实现 `rejectAppointment()` 拒绝预约方法
- 实现 `getAppointmentsByPatient()` 获取患者预约列表方法
- 实现 `getAppointmentsByDoctor()` 获取医生预约列表方法
- 实现 `loadAppointmentData()` 加载预约模拟数据方法

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-004 预约记录管理
- **Feature Requirement**: REQ-006 预约状态流转
- **Feature Requirement**: REQ-007 医生预约管理
- **Related Task**: TASK-002 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 状态定义 | 添加 `appointments: Appointment[]` 状态 |
| FR-002 | 创建预约 | `addAppointment()` 创建新预约并设置状态为 pending |
| FR-003 | 取消预约 | `cancelAppointment()` 更新预约状态为 cancelled |
| FR-004 | 确认预约 | `confirmAppointment()` 更新预约状态为 confirmed |
| FR-005 | 拒绝预约 | `rejectAppointment()` 更新预约状态为 cancelled |
| FR-006 | 获取患者预约 | `getAppointmentsByPatient()` 按患者 ID 筛选 |
| FR-007 | 获取医生预约 | `getAppointmentsByDoctor()` 按医生 ID 筛选 |
| FR-008 | 加载模拟数据 | `loadAppointmentData()` 从 JSON 文件加载 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | Store 模式 | 使用 Vue 3 Reactive 模式（与现有代码一致） |
| TR-002 | 类型安全 | 所有参数和返回值必须使用 TypeScript 类型 |
| TR-003 | 方法导出 | 所有方法通过 store 对象导出 |
| TR-004 | 数据持久化 | 当前为内存存储，刷新页面数据重置 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 无后端存储 | 数据仅存储在内存中 |
| CL-002 | 无乐观更新 | 暂不实现离线功能 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**增量式实现**：
1. 添加状态定义
2. 实现数据加载方法
3. 实现 CRUD 方法
4. 实现查询方法

### 3.2 Implementation Steps

1. **读取现有 Store 结构**
   - 读取 `src/store/index.ts` 了解现有模式

2. **添加预约状态**
   - 在 State 接口中添加 `appointments: Appointment[]`

3. **实现 loadAppointmentData()**
   - 从 `src/data/appointment-list.json` 加载数据
   - 参考现有的 `loadDoctorData()` 方法

4. **实现 addAppointment()**
   - 生成新预约 ID
   - 设置初始状态为 pending
   - 添加到 appointments 数组

5. **实现状态变更方法**
   - `cancelAppointment(id)`
   - `confirmAppointment(id)`
   - `rejectAppointment(id)`

6. **实现查询方法**
   - `getAppointmentsByPatient(patientId)`
   - `getAppointmentsByDoctor(doctorId)`

7. **验证实现**
   - TypeScript 编译检查
   - 构建测试

### 3.3 Technical Considerations

- **方法命名规范**: 参考现有方法命名（`addQuestion`、`answerQuestion`）
- **状态更新**: 使用 Vue 3 Reactive 确保响应式
- **数据加载时机**: 在应用初始化时加载

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`: Store 方法命名参考
- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-002-create-appointment-types-and-mock-data-prd.md`: 类型定义

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: appointments 状态已添加 | 检查 State 接口包含 appointments | 代码审查 |
| **AC-002**: addAppointment() 可创建新预约 | 检查方法实现 | 代码审查 |
| **AC-003**: cancelAppointment() 可取消预约 | 检查状态更新逻辑 | 代码审查 |
| **AC-004**: confirmAppointment() 可确认预约 | 检查状态更新逻辑 | 代码审查 |
| **AC-005**: getAppointmentsByPatient() 正确筛选 | 检查过滤逻辑 | 代码审查 |
| **AC-006**: getAppointmentsByDoctor() 正确筛选 | 检查过滤逻辑 | 代码审查 |
| **AC-007**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 预约已取消后再次取消 | 应抛出错误或返回失败 |
| 预约已完成后修改状态 | 应抛出错误或返回失败 |
| 患者 ID 不存在 | 返回空数组 |

### 4.3 Negative Tests

| Negative Test | Expected Behavior |
|---------------|------------------|
| 取消不存在的预约 | 返回 null 或抛出错误 |
| 传入无效参数 | TypeScript 编译报错 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002 创建预约相关数据类型和模拟数据
- **Blocks**: TASK-004, TASK-005, TASK-008

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/store/index.ts` | 需要修改的文件 |
| `src/data/appointment-list.json` | 数据来源文件 |
| Appointment 类型 | 从 TASK-002 定义 |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-002 已完成 | 提供类型定义和模拟数据 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 小时
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有现有 Store 模式参考 | 降低复杂度 |
| 需要实现多个方法 | 增加工作量 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

- 功能测试：手动调用各方法验证功能
- 边界测试：测试异常情况处理

## 8. Implementation Notes

### 8.1 Store 方法签名示例

```typescript
// src/store/index.ts

// 状态扩展
interface State {
  // ... 现有状态
  appointments: Appointment[];
}

// 方法实现
export const store = {
  state,
  
  // ... 现有方法
  
  // 预约相关方法
  addAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.appointments.push(newAppointment);
    return newAppointment;
  },
  
  cancelAppointment(id: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = AppointmentStatus.CANCELLED;
      appointment.updatedAt = new Date().toISOString();
    }
    return appointment || null;
  },
  
  confirmAppointment(id: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = AppointmentStatus.CONFIRMED;
      appointment.updatedAt = new Date().toISOString();
    }
    return appointment || null;
  },
  
  rejectAppointment(id: string): Appointment | null {
    const appointment = state.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = AppointmentStatus.CANCELLED;
      appointment.updatedAt = new Date().toISOString();
    }
    return appointment || null;
  },
  
  getAppointmentsByPatient(patientId: string): Appointment[] {
    return state.appointments.filter(a => a.patientId === patientId);
  },
  
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return state.appointments.filter(a => a.doctorId === doctorId);
  },
  
  loadAppointmentData() {
    // 参考 loadDoctorData() 实现
  },
};
```

## 9. Risks and Mitigations

### Risk 1: 修改现有 Store 可能影响现有功能

- **Impact**: Medium
- **Mitigation**: 
  - 仅添加新状态和方法，不修改现有代码
  - 进行完整的构建测试

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| Store 状态扩展 | 添加 appointments 状态 | `src/store/index.ts` |
| Store 方法 | 所有预约相关方法 | `src/store/index.ts` |

**Mandatory Deliverable**: Validation Results
- **Build output**: `npm run build` 成功
- **Type check**: `tsc --noEmit` 无错误

---

## Status Management

| Current Status | 说明 |
|----------------|------|
| DONE | 任务已完成并通过验证 |

### Status Transitions

- `TODO` → `IN PROGRESS`: 开始任务执行
- `IN PROGRESS` → `DONE`: 任务完成并通过验证

---

## Implementation Summary

### 完成内容

1. **addAppointment()** - 创建新预约
   - 生成唯一 ID (apt- 时间戳)
   - 设置初始状态为 PENDING
   - 自动设置创建/更新时间

2. **getAppointmentById()** - 根据 ID 获取预约

3. **cancelAppointment()** - 取消预约
   - 支持填写取消原因
   - 只能取消 pending/confirmed 状态

4. **confirmAppointment()** - 确认预约
   - 只能确认 pending 状态
   - 记录确认时间

5. **rejectAppointment()** - 拒绝预约
   - 必须填写拒绝原因
   - 只能拒绝 pending 状态

6. **completeAppointment()** - 完成预约
   - 只能完成 confirmed 状态
   - 记录完成时间

7. **getAppointmentsByPatient()** - 获取患者预约
   - 支持按状态筛选

8. **getAppointmentsByDoctor()** - 获取医生预约
   - 支持按状态筛选

9. **getDoctorSchedule()** - 获取医生门诊时间表

10. **getAvailableSlots()** - 获取可预约时段
    - 根据医生排班生成时段
    - 计算每个时段的剩余容量

11. **getAppointmentStatistics()** - 获取预约统计

### 验证结果

- ✅ TypeScript 类型检查通过
- ✅ 构建成功 (`npm run build`)

### 下一步

- TASK-004: 开发预约列表页面
- TASK-005: 开发预约表单页面
- TASK-008: 开发医生预约管理功能
