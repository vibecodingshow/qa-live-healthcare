# Task PRD: 开发医生门诊管理页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-007
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务创建医生设置和管理门诊时间的页面 `DoctorSchedule.vue`。页面提供门诊时间表编辑器，支持设置每周出诊日、每时段可预约人数，并实现保存门诊设置功能。

### 1.2 Task Objectives

- 创建 `src/views/DoctorSchedule.vue` 页面组件
- 实现门诊时间表编辑器
- 支持设置每周出诊日
- 支持设置每时段可预约人数
- 支持设置门诊地点
- 实现保存门诊设置功能

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001 门诊时间管理
- **Related User Story**: Story 3
- **Related Task**: TASK-002 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 门诊时间编辑器 | 设置每周各天的出诊时间 |
| FR-002 | 出诊日开关 | 每个工作日可单独开启/关闭 |
| FR-003 | 时间段设置 | 设置每日开始和结束时间 |
| FR-004 | 容量设置 | 设置每时段最大预约人数 |
| FR-005 | 地点设置 | 设置门诊地点 |
| FR-006 | 保存设置 | 保存门诊时间配置 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 组件规范 | 使用 Vue 3 Composition API + `<script setup>` |
| TR-002 | UI 框架 | 使用 Ant Design Vue 组件 |
| TR-003 | 状态管理 | 使用 Store 中的医生方法 |
| TR-004 | 日期处理 | 使用 dayjs 库处理日期 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 仅医生可用 | 页面仅供已登录医生访问 |
| CL-002 | 需登录 | 未登录医生不可访问 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**参考现有页面**：
1. 参考 `DoctorRoom.vue` 的表单布局
2. 复用 Ant Design Vue 组件

### 3.2 Implementation Steps

1. **创建页面组件**
   - 在 `src/views/` 创建 `DoctorSchedule.vue`

2. **获取医生信息**
   - 从 Store 获取当前登录医生
   - 加载已有的门诊配置

3. **实现 UI 布局**
   - 页面标题
   - 门诊时间编辑器
   - 保存按钮

4. **实现编辑器功能**
   - 周一到周日开关
   - 时间段输入
   - 容量输入
   - 地点输入

5. **实现保存功能**
   - 调用 Store 方法保存
   - 显示保存结果

6. **验证功能**
   - 构建测试
   - 功能验证

### 3.3 Technical Considerations

- **时间格式**: 使用 HH:mm 格式
- **星期映射**: 0=周日, 1=周一, ..., 6=周六

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: views 目录规范
- `src/views/DoctorRoom.vue`: 医生页面参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 页面正常显示 | 打开页面查看 | 浏览器测试 |
| **AC-002**: 出诊日开关正常 | 切换开关 | 浏览器测试 |
| **AC-003**: 保存功能正常 | 修改并保存 | 浏览器测试 |
| **AC-004**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|------------------|
| 未登录医生访问 | 提示登录或跳转登录页 |
| 保存失败 | 显示错误提示 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002 创建预约相关数据类型和模拟数据
- **Blocks**: 无直接阻塞 |

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/views/DoctorSchedule.vue` | 需要创建的文件 |
| `src/store/index.ts` | 获取医生方法 |
| `src/router/index.ts` | 路由配置（将在 TASK-009 完成） |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-002 已完成 | 提供类型定义 |
| 路由已配置 | 可在 TASK-009 后测试完整功能 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 小时
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有表单页面参考 | 降低复杂度 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

| Test Case | Description |
|-----------|-------------|
| TC-001 | 打开门诊管理页面 |
| TC-002 | 设置出诊时间 |
| TC-003 | 保存设置 |

## 8. Implementation Notes

### 8.1 页面布局示例

```
┌─────────────────────────────────────┐
│  门诊时间管理                        │
├─────────────────────────────────────┤
│  门诊地点设置                       │
│  ┌─────────────────────────────────┐ │
│  │ [市第一医院 门诊楼 3楼          ] │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  每周出诊安排                       │
│  ┌─────────────────────────────────┐ │
│  │ ☑ 周一  09:00 - 12:00  人数: 10 │ │
│  │ ☑ 周二  09:00 - 12:00  人数: 10 │ │
│  │ ☑ 周三  14:00 - 17:00  人数: 8  │ │
│  │ ☐ 周四                          │ │
│  │ ☐ 周五                          │ │
│  │ ☐ 周六                          │ │
│  │ ☐ 周日                          │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [        保存设置        ]         │
└─────────────────────────────────────┘
```

## 9. Risks and Mitigations

无显著风险。

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 门诊管理页面 | DoctorSchedule.vue 组件 | `src/views/DoctorSchedule.vue` |

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
