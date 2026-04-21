# Task PRD: 开发预约详情页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-006
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务创建预约详情展示页面 `AppointmentDetail.vue`。页面展示完整的预约信息，包括医生信息、患者信息、预约时间地点、预约状态，以及相应的操作按钮。

### 1.2 Task Objectives

- 创建 `src/views/AppointmentDetail.vue` 页面组件
- 展示完整预约信息
- 展示医生信息
- 展示预约状态和操作按钮
- 实现返回列表功能

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-005 预约详情页
- **Related User Story**: Story 4
- **Related Task**: TASK-004 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 预约基本信息 | 展示预约 ID、预约日期时间、地点等 |
| FR-002 | 医生信息展示 | 显示医生姓名、职称、科室等 |
| FR-003 | 患者信息展示 | 显示患者姓名等 |
| FR-004 | 状态展示 | 使用状态标签显示当前状态 |
| FR-005 | 操作按钮 | 根据状态显示不同按钮（取消/已完成等） |
| FR-006 | 返回列表 | 提供返回预约列表的按钮 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 组件规范 | 使用 Vue 3 Composition API + `<script setup>` |
| TR-002 | UI 框架 | 使用 Ant Design Vue 组件 |
| TR-003 | 状态管理 | 使用 Store 中的预约方法 |
| TR-004 | 路由参数 | 从路由获取 appointmentId 参数 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 仅患者可用 | 页面仅供已登录患者访问 |
| CL-002 | 无编辑功能 | 详情页仅展示，不可编辑 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**参考现有页面**：
1. 参考 `QuestionDetail.vue` 的详情布局
2. 复用 Ant Design Vue 展示组件

### 3.2 Implementation Steps

1. **创建页面组件**
   - 在 `src/views/` 创建 `AppointmentDetail.vue`

2. **获取预约信息**
   - 从路由参数获取 appointmentId
   - 从 Store 获取预约详情

3. **实现 UI 布局**
   - 页面标题
   - 预约信息卡片
   - 医生信息卡片
   - 操作按钮区域

4. **实现状态展示**
   - 状态标签映射
   - 状态颜色映射

5. **实现操作功能**
   - 取消预约按钮
   - 二次确认

6. **实现返回功能**
   - 返回按钮

7. **验证功能**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **状态颜色映射**: pending(orange), confirmed(green), completed(blue), cancelled(red)
- **日期格式化**: 使用 dayjs 格式化显示

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: views 目录规范
- `src/views/QuestionDetail.vue`: 详情页面参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 页面正常显示预约详情 | 打开页面查看 | 浏览器测试 |
| **AC-002**: 医生信息正确展示 | 查看医生区域 | 浏览器测试 |
| **AC-003**: 状态标签正确显示 | 查看状态标签 | 浏览器测试 |
| **AC-004**: 返回按钮功能正常 | 点击返回 | 浏览器测试 |
| **AC-005**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 预约 ID 无效 | 显示错误或返回列表 |
| 预约已取消 | 显示取消状态 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-004 开发预约列表页面
- **Blocks**: 无直接阻塞

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/views/AppointmentDetail.vue` | 需要创建的文件 |
| `src/store/index.ts` | 获取预约方法 |
| `src/router/index.ts` | 路由配置（将在 TASK-009 完成） |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-004 已完成 | 提供页面跳转逻辑 |
| 路由已配置 | 可在 TASK-009 后测试完整功能 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有详情页参考 | 降低复杂度 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 打开预约详情页面 |
| TC-002 | 查看预约信息 |
| TC-003 | 点击返回按钮 |

## 8. Implementation Notes

### 8.1 页面布局示例

```
┌─────────────────────────────────────┐
│  ← 预约详情                          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 预约状态                         │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │      [ 待确认 ]              │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  预约信息                           │
│  ┌─────────────────────────────────┐ │
│  │ 预约编号：apt-001              │ │
│  │ 预约日期：2026-04-25          │ │
│  │ 预约时间：09:00-09:30         │ │
│  │ 就诊地点：市第一医院 3楼       │ │
│  │ 就诊原因：胸闷气短...         │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  医生信息                           │
│  ┌─────────────────────────────────┐ │
│  │ [头像] 张伟医生                │ │
│  │ 主任医师 | 心内科              │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  [        返回列表        ]         │
└─────────────────────────────────────┘
```

## 9. Risks and Mitigations

无显著风险。

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 预约详情页面 | AppointmentDetail.vue 组件 | `src/views/AppointmentDetail.vue` |

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
