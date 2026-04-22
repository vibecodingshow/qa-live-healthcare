# Task PRD: 开发预约列表页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-004
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务创建患者查看和管理预约的页面组件 `Appointments.vue`。页面需要展示患者的所有预约记录，支持按状态筛选（全部/待确认/已确认/已完成/已取消），提供取消预约功能和跳转到预约详情的功能。

### 1.2 Task Objectives

- 创建 `src/views/Appointments.vue` 页面组件
- 实现预约列表展示，支持按状态筛选
- 实现取消预约功能（需二次确认）
- 实现跳转到预约详情功能
- 展示预约卡片，包含医生信息、时间、状态等
- 样式与现有页面保持一致

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-004 预约记录管理
- **Related User Story**: Story 2
- **Related Task**: TASK-003 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 预约列表展示 | 显示当前患者的预约列表 |
| FR-002 | 状态筛选 | 支持按状态筛选：全部/待确认/已确认/已完成/已取消 |
| FR-003 | 取消预约 | 支持取消预约，需二次确认 |
| FR-004 | 跳转详情 | 点击预约卡片跳转到预约详情页 |
| FR-005 | 空状态展示 | 无预约时显示空状态提示 |
| FR-006 | 加载状态 | 数据加载时显示 loading |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 组件规范 | 使用 Vue 3 Composition API + `<script setup>` |
| TR-002 | UI 框架 | 使用 Ant Design Vue 组件 |
| TR-003 | 状态管理 | 使用 Store 中的预约方法 |
| TR-004 | 路由跳转 | 使用 Vue Router 导航 |
| TR-005 | 用户身份 | 使用 Store 中的 currentPatient 获取当前患者 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 仅患者可用 | 页面仅供已登录患者访问 |
| CL-002 | 无权限控制 | 暂不实现路由守卫 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**参考现有页面**：
1. 参考 `Doctors.vue` 的列表布局
2. 参考 `QuestionDetail.vue` 的卡片展示
3. 复用 Ant Design Vue 组件

### 3.2 Implementation Steps

1. **创建页面组件**
   - 在 `src/views/` 创建 `Appointments.vue`

2. **实现状态管理**
   - 从 Store 获取当前患者 ID
   - 调用 `getAppointmentsByPatient()` 获取预约列表
   - 管理筛选状态

3. **实现 UI 布局**
   - 页面标题
   - 状态筛选标签
   - 预约卡片列表

4. **实现预约卡片**
   - 医生信息展示
   - 预约时间展示
   - 状态标签
   - 操作按钮

5. **实现取消预约功能**
   - 使用 Modal.confirm() 二次确认
   - 调用 `cancelAppointment()`
   - 更新列表

6. **样式调整**
   - 与现有页面风格保持一致

7. **验证功能**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **组件引用**: 从 `@/store` 导入 store
- **路由参数**: 详情页路由 `/appointments/:id`
- **状态映射**: AppointmentStatus 枚举到中文标签

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: views 目录规范
- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-003-implement-appointment-store-prd.md`: Store 方法
- `src/views/Doctors.vue`: 列表页面参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 页面正常显示预约列表 | 打开页面查看 | 浏览器测试 |
| **AC-002**: 状态筛选功能正常 | 切换筛选条件 | 浏览器测试 |
| **AC-003**: 取消预约需二次确认 | 点击取消按钮 | 浏览器测试 |
| **AC-004**: 取消后列表更新 | 取消预约后查看列表 | 浏览器测试 |
| **AC-005**: 点击卡片跳转详情 | 点击预约卡片 | 浏览器测试 |
| **AC-006**: 空状态正常显示 | 无预约时查看 | 浏览器测试 |
| **AC-007**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 未登录患者访问 | 提示登录或显示空状态 |
| 预约列表为空 | 显示空状态提示 |
| 取消已取消的预约 | 按钮不可用 |

### 4.3 Negative Tests

| Negative Test | Expected Behavior |
|---------------|------------------|
| 页面加载失败 | 显示错误提示 |
| 取消预约失败 | 显示错误提示 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-003 实现预约 Store 状态管理
- **Blocks**: TASK-006 预约详情页 (TASK-006 依赖此任务)

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/views/Appointments.vue` | 需要创建的文件 |
| `src/store/index.ts` | 获取预约方法 |
| `src/router/index.ts` | 路由配置（将在 TASK-009 完成） |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-003 已完成 | 提供 Store 方法 |
| 路由已配置 | 可在 TASK-009 后测试完整功能 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 小时
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有现有页面参考 | 降低复杂度 |
| 需要自定义卡片样式 | 增加工作量 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |
| **Linter** | `npm run lint` | 无 lint 错误 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 打开预约列表页面 |
| TC-002 | 切换状态筛选 |
| TC-003 | 取消预约（正常流程） |
| TC-004 | 点击预约卡片跳转 |

## 8. Implementation Notes

### 8.1 页面布局示例

```
┌─────────────────────────────────────┐
│  我的预约                            │
├─────────────────────────────────────┤
│ [全部] [待确认] [已确认] [已完成] [已取消] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 张伟医生 - 心内科               │ │
│ │ 2026-04-25 09:00-09:30         │ │
│ │ [待确认]  [取消] [查看详情]     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ...                            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 8.2 组件代码结构

```vue
<template>
  <div class="appointments-page">
    <h1>我的预约</h1>
    
    <!-- 状态筛选 -->
    <a-tabs v-model:activeKey="activeStatus">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane key="pending" tab="待确认" />
      <!-- ... -->
    </a-tabs>
    
    <!-- 预约列表 -->
    <div v-if="loading" class="loading">
      <a-spin />
    </div>
    <div v-else-if="filteredAppointments.length === 0" class="empty">
      <a-empty description="暂无预约记录" />
    </div>
    <div v-else class="appointment-list">
      <AppointmentCard 
        v-for="apt in filteredAppointments"
        :key="apt.id"
        :appointment="apt"
        @cancel="handleCancel"
        @view="handleViewDetail"
      />
    </div>
  </div>
</template>
```

## 9. Risks and Mitigations

### Risk 1: 路由未配置导致跳转失败

- **Impact**: Low
- **Mitigation**: 在 TASK-009 配置路由后测试

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 预约列表页面 | Appointments.vue 组件 | `src/views/Appointments.vue` |
| 预约卡片组件 | AppointmentCard.vue | `src/components/AppointmentCard.vue` |

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
