# Task PRD: 开发医生预约管理功能

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-008
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.2 Task Summary

本任务为医生端添加预约管理能力。在现有的 `DoctorSchedule.vue` 页面中添加预约列表区域，让医生可以查看自己的预约列表，并支持确认/拒绝预约申请和取消预约功能。

### 1.2 Task Objectives

- 在医生门诊管理页面添加预约列表区域
- 实现查看自己预约的功能
- 实现确认预约的功能
- 实现拒绝预约的功能
- 实现取消预约的功能
- 支持按状态筛选预约

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-007 医生预约管理
- **Related User Story**: Story 3
- **Related Task**: TASK-003, TASK-007 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 预约列表展示 | 显示医生的所有预约 |
| FR-002 | 状态筛选 | 支持按状态筛选预约 |
| FR-003 | 确认预约 | 医生确认患者的预约申请 |
| FR-004 | 拒绝预约 | 医生拒绝患者的预约申请 |
| FR-005 | 取消预约 | 医生取消已确认的预约 |
| FR-006 | 预约信息展示 | 显示患者信息、预约时间等 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 组件规范 | 使用 Vue 3 Composition API + `<script setup>` |
| TR-002 | UI 框架 | 使用 Ant Design Vue 组件 |
| TR-003 | 状态管理 | 使用 Store 中的预约方法 |
| TR-004 | 复用页面 | 在 TASK-007 的页面中添加功能 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 仅医生可用 | 功能仅对登录医生可见 |
| CL-002 | 操作确认 | 确认/拒绝/取消需要二次确认 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**增量式开发**：
1. 在 TASK-007 完成的 DoctorSchedule.vue 中添加预约列表
2. 复用 AppointmentCard 组件

### 3.2 Implementation Steps

1. **修改 DoctorSchedule.vue**
   - 在页面中添加预约列表标签页或区域

2. **获取医生预约**
   - 调用 `getAppointmentsByDoctor()` 获取预约列表

3. **实现预约列表 UI**
   - 状态筛选
   - 预约卡片列表

4. **实现操作功能**
   - 确认预约
   - 拒绝预约
   - 取消预约
   - 二次确认

5. **验证功能**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **复用组件**: 复用 AppointmentCard 组件
- **操作限制**: 已完成的预约不可操作

### 3.4 Reference to Project Context

- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-007-develop-doctor-schedule-management-page-prd.md`: 基础页面
- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-004-develop-appointment-list-page-prd.md`: 预约卡片参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 预约列表正常显示 | 打开页面查看 | 浏览器测试 |
| **AC-002**: 确认预约功能正常 | 点击确认 | 浏览器测试 |
| **AC-003**: 拒绝预约功能正常 | 点击拒绝 | 浏览器测试 |
| **AC-004**: 取消预约功能正常 | 点击取消 | 浏览器测试 |
| **AC-005**: 状态筛选功能正常 | 切换筛选 | 浏览器测试 |
| **AC-006**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 无预约时 | 显示空状态 |
| 操作失败 | 显示错误提示 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-003 实现预约 Store 状态管理, TASK-007 开发医生门诊管理页面
- **Blocks**: 无直接阻塞 |

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/views/DoctorSchedule.vue` | 需要修改的文件 |
| `src/components/AppointmentCard.vue` | 预约卡片组件 |
| `src/store/index.ts` | 获取预约方法 |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-007 已完成 | 提供基础页面 |
| TASK-004 已完成 | 提供预约卡片组件 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 复用预约卡片组件 | 降低复杂度 |
| 在现有页面中添加 | 减少工作量 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 查看预约列表 |
| TC-002 | 确认预约 |
| TC-003 | 拒绝预约 |
| TC-004 | 取消预约 |

## 8. Implementation Notes

### 8.1 页面布局示例

```
┌─────────────────────────────────────┐
│  门诊管理                             │
├─────────────────────────────────────┤
│ [出诊时间] [预约管理]                │
├─────────────────────────────────────┤
│  预约管理                            │
│  [全部] [待确认] [已确认] [已完成]    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 赵明 - 2026-04-25 09:00-09:30  │ │
│ │ [待确认]                        │ │
│ │ [确认] [拒绝] [查看详情]        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 9. Risks and Mitigations

无显著风险。

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 预约管理功能 | 在 DoctorSchedule.vue 中添加 | `src/views/DoctorSchedule.vue` |

**Mandatory Deliverable**: Validation Results
- **Build output**: `npm run build` 成功
- **Type check**: `tsc --noEmit` 无错误

---

## Status Management

| Current Status | 说明 |
|----------------|------|
| TODO | 任务尚未开始 |

### Status Transitions

- `TODO` → `IN PROGRESS`: 开始任务执行
- `IN PROGRESS` → `DONE`: 任务完成并通过验证
