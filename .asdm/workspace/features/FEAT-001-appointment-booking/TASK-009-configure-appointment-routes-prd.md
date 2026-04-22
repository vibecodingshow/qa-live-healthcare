# Task PRD: 配置预约相关路由

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-009
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务在 Vue Router 配置中添加预约相关页面的路由。包括预约列表页、预约详情页、预约表单页、医生门诊管理页的路由配置。

### 1.2 Task Objectives

- 在 `src/router/index.ts` 添加预约相关路由
- 配置 `/appointments` 路由指向预约列表页
- 配置 `/appointments/:id` 路由指向预约详情页
- 配置 `/book/:doctorId` 路由指向预约表单页
- 配置 `/doctor/schedule` 路由指向医生门诊管理页
- 验证路由跳转正常

### 1.3 Related Feature Requirements

- **Feature Requirement**: 所有预约功能
- **Related Tasks**: TASK-004, TASK-005, TASK-006, TASK-007, TASK-008 (全部)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 预约列表路由 | `/appointments` 指向 Appointments.vue |
| FR-002 | 预约详情路由 | `/appointments/:id` 指向 AppointmentDetail.vue |
| FR-003 | 预约表单路由 | `/book/:doctorId` 指向 BookAppointment.vue |
| FR-004 | 医生门诊路由 | `/doctor/schedule` 指向 DoctorSchedule.vue |
| FR-005 | 路由名称 | 为每个路由设置 name 属性 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 路由规范 | 使用 Vue Router 4 规范 |
| TR-002 | 动态导入 | 使用懒加载提升性能 |
| TR-003 | 命名规范 | 使用 PascalCase 命名 |
| TR-004 | TypeScript | 使用 RouteRecordRaw 类型 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | SPA 路由 | 使用 history 模式 |
| CL-002 | 现有路由 | 不修改现有路由 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**参考现有路由**：
1. 读取 `src/router/index.ts` 了解现有路由模式
2. 按照现有模式添加新路由

### 3.2 Implementation Steps

1. **读取现有路由配置**
   - 读取 `src/router/index.ts`

2. **添加路由定义**
   - 添加预约相关路由
   - 使用懒加载

3. **配置路由参数**
   - 预约详情页：`:id`
   - 预约表单页：`:doctorId`

4. **验证路由**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **懒加载语法**: `() => import('../views/Appointments.vue')`
- **路由名称**: `AppointmentList`, `AppointmentDetail`, `BookAppointment`, `DoctorSchedule`

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 路由组织规范
- `src/router/index.ts`: 现有路由参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 路由配置无语法错误 | 运行 `tsc --noEmit` | 浏览器测试 |
| **AC-002**: `/appointments` 路由正常 | 访问路由 | 浏览器测试 |
| **AC-003**: `/appointments/:id` 路由正常 | 访问路由带参数 | 浏览器测试 |
| **AC-004**: `/book/:doctorId` 路由正常 | 访问路由带参数 | 浏览器测试 |
| **AC-005**: `/doctor/schedule` 路由正常 | 访问路由 | 浏览器测试 |
| **AC-006**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 无效的预约 ID | 显示 404 或错误页面 |
| 无效的医生 ID | 显示 404 或错误页面 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-004, TASK-005, TASK-006, TASK-007, TASK-008 (全部)
- **Blocks**: 无 |

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/router/index.ts` | 需要修改的文件 |
| `src/views/Appointments.vue` | 预约列表组件 |
| `src/views/AppointmentDetail.vue` | 预约详情组件 |
| `src/views/BookAppointment.vue` | 预约表单组件 |
| `src/views/DoctorSchedule.vue` | 医生门诊组件 |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| 页面组件已创建 | 前置任务完成 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有现有路由参考 | 降低复杂度 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 访问 `/appointments` |
| TC-002 | 访问 `/appointments/apt-001` |
| TC-003 | 访问 `/book/doc001` |
| TC-004 | 访问 `/doctor/schedule` |

## 8. Implementation Notes

### 8.1 路由配置示例

```typescript
// src/router/index.ts

const routes: RouteRecordRaw[] = [
  // ... 现有路由
  
  // 预约相关路由
  {
    path: '/appointments',
    name: 'AppointmentList',
    component: () => import('../views/Appointments.vue'),
    meta: { requiresAuth: true, userType: 'patient' }
  },
  {
    path: '/appointments/:id',
    name: 'AppointmentDetail',
    component: () => import('../views/AppointmentDetail.vue'),
    meta: { requiresAuth: true, userType: 'patient' }
  },
  {
    path: '/book/:doctorId',
    name: 'BookAppointment',
    component: () => import('../views/BookAppointment.vue'),
    meta: { requiresAuth: true, userType: 'patient' }
  },
  {
    path: '/doctor/schedule',
    name: 'DoctorSchedule',
    component: () => import('../views/DoctorSchedule.vue'),
    meta: { requiresAuth: true, userType: 'doctor' }
  },
];
```

## 9. Risks and Mitigations

### Risk 1: 路由冲突

- **Impact**: Low
- **Mitigation**: 确保路径唯一

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 路由配置 | 添加预约相关路由 | `src/router/index.ts` |

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
