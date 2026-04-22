# Task PRD: 医生端 - 排班设置页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-008
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现医生端的排班设置页面，支持查看现有排班、创建新排班、编辑排班信息、删除排班、设置可预约人数。

### 1.2 Task Objectives

- 创建医生排班设置页面组件
- 实现排班列表展示
- 实现创建排班功能
- 实现编辑排班功能
- 实现删除排班功能
- 实现可预约人数设置

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-008（医生排班设置）
- **Related User Story**: Story 6（医生设置出诊时间和可预约人数）
- **Technical Spec**: 第5.1节路由设计

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时获取医生排班列表
- 显示现有排班信息（日期、时段、已预约数/最大预约数）
- 支持创建新排班
  - 选择工作日期
  - 添加时段（开始时间、结束时间）
  - 设置每个时段的最大预约数
- 支持编辑现有排班
  - 修改时段信息
  - 调整最大预约数
- 支持删除排班
  - 确认删除提示
  - 已有预约时不能删除
- 支持查看每日预约详情
- 排班时间冲突检测
- Loading 状态和空状态展示

### 2.2 Technical Requirements

- 页面组件位置：`src/views/DoctorSchedule.vue`
- 使用 Vue 3 Composition API
- 使用 Ant Design Vue 组件库
- 遵循项目编码规范
- 响应式布局设计

### 2.3 Constraints and Limitations

- 医生只能管理自己的排班
- 不能创建过去日期的排班
- 同一日期不能有重叠时段
- 已有预约的时段不能删除

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用日历 + 表单编辑模式：
1. 创建排班日历组件
2. 创建排班表单组件
3. 实现创建/编辑/删除功能
4. 集成 API 接口

### 3.2 Implementation Steps

1. **创建排班卡片组件**
   - 创建 `src/components/ScheduleCard.vue`
   - 展示排班信息
   - 操作按钮

2. **创建排班表单组件**
   - 创建 `src/components/ScheduleForm.vue`
   - 日期选择器
   - 时段编辑器
   - 最大人数设置

3. **创建排班设置页面**
   - 创建 `src/views/DoctorSchedule.vue`
   - 布局结构设计
   - 排班列表展示

4. **实现 CRUD 功能**
   - 创建排班表单弹窗
   - 编辑排班表单弹窗
   - 删除确认弹窗
   - API 调用

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用 `ref` 和 `computed` 管理状态
- 使用 `useRouter` 进行页面跳转
- 使用 Ant Design Modal 组件
- 使用 dayjs 处理日期时间

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 组件编码规范
- `.asdm/contexts/data-models.md`: 排班数据模型

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 排班列表正确显示
  - Test method: 页面加载后显示排班列表
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: 创建排班功能正常
  - Test method: 填写表单后成功创建排班
  - **Validation tool**: 功能测试

- **Criterion 3**: 编辑排班功能正常
  - Test method: 修改信息后成功更新排班
  - **Validation tool**: 功能测试

- **Criterion 4**: 删除排班功能正常
  - Test method: 确认删除后成功删除排班
  - **Validation tool**: 功能测试

### 4.2 Edge Cases

- 排班列表为空时显示空状态
- 网络错误时显示错误提示
- 时间冲突时显示错误提示

### 4.3 Negative Tests

- 过去日期不能创建排班
- 重叠时段不能创建
- 有预约的时段不能删除

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）, TASK-009（医生端 API 接口）
- **Blocks**: 无（最终任务）

### 5.2 External Dependencies

- Vue 3.5.10
- Vue Router 4.6.3
- Ant Design Vue 4.2.6
- dayjs 1.11.19
- TASK-009 API 接口

### 5.3 Prerequisites

- TASK-001, TASK-002, TASK-009 已完成
- API 接口可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Medium

### 6.2 Effort Factors

- 表单验证逻辑复杂
- 时间冲突检测逻辑

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 组件渲染测试
- 表单验证测试
- 时间冲突检测测试

### 7.3 Integration Testing

- 与 API 接口集成测试
- CRUD 流程测试

### 7.4 Manual Testing

- 页面功能手动测试
- 排班流程端到端测试

## 8. Implementation Notes

- 页面放置在 `src/views/` 目录
- 组件放置在 `src/components/` 目录
- 使用 `scoped` 样式
- 添加适当的注释
- 添加 Loading 状态

## 9. Risks and Mitigations

### Risk 1: 时间冲突

- **Description**: 创建的时段与现有时段重叠
- **Impact**: High
- **Mitigation**: 前端冲突检测 + 后端唯一约束

### Risk 2: 权限问题

- **Description**: 医生越权操作其他医生排班
- **Impact**: High
- **Mitigation**: 前端权限校验 + 后端权限验证

### Risk 3: 删除风险

- **Description**: 删除已有预约的排班
- **Impact**: High
- **Mitigation**: 删除前检查 + 确认提示

## 10. Deliverables

- `src/components/ScheduleCard.vue` - 排班卡片组件
- `src/components/ScheduleForm.vue` - 排班表单组件
- `src/views/DoctorSchedule.vue` - 排班设置页面
- 单元测试文件
- 页面功能验证

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **权限验证**: 医生只能管理自己的排班信息
- **冲突检测**: 排班时段不得与已有时段重叠
- **数据保护**: 排班设置变更需谨慎，防止误操作

### 11.2 合规要求

- **时间规范**: 排班时间需符合医疗工作时间规定
- **号源限制**: 每个时段的最大预约数需合理设置
- **变更记录**: 排班变更需记录日志，便于追溯

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
