# Task PRD: 创建预约挂号页面

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号
**Task ID**: TASK-003
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

创建预约挂号页面 Appointment.vue，患者可以选择医生、查看可用时段、填写预约信息并提交预约申请。

### 1.2 Task Objectives

- 创建 src/views/Appointment.vue 页面组件
- 实现医生选择功能（可从 URL 参数预填）
- 实现日期选择功能（未来7天）
- 实现时段选择功能
- 实现预约表单（症状描述）
- 实现预约提交功能
- 实现预约成功提示

### 1.3 Related Feature Requirements

- Feature requirement: REQ-001, REQ-002
- Related user story: Story 1

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时获取在线医生列表
- 支持从 URL 参数 /appointment/:doctorUsername 预填医生
- 日期选择器选择未来7天内的日期
- 时段选择器显示可用时段（已预约的不可选）
- 表单验证：必须选择医生、日期、时段
- 提交前验证患者身份（姓名+生日）
- 提交成功后显示确认信息

### 2.2 Technical Requirements

- 使用 Vue 3 Composition API + `<script setup>`
- 使用 Ant Design Vue 组件
- 使用 dayjs 处理日期
- 遵循项目组件结构规范

### 2.3 Constraints and Limitations

- 当前为前端原型

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. 参考 src/views/Consultation.vue 的实现模式
2. 使用 Ant Design Vue 的 DatePicker、Select、Form 等组件
3. 调用 Store 方法完成预约

### 3.2 Implementation Steps

1. 创建 src/views/Appointment.vue
2. 导入必要的依赖（vue, vue-router, ant-design-vue, dayjs, store）
3. 实现医生列表获取逻辑
4. 实现日期和时段选择逻辑
5. 实现预约表单
6. 实现提交逻辑
7. 添加样式
8. 验证构建通过

### 3.3 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 编码规范
- `.asdm/contexts/api.md`: Store API

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 页面可正常加载，显示医生列表
  - Test method: 访问 /appointment 页面
  - Validation tool: 浏览器检查

- **Criterion 2**: 可选择医生、日期、时段并提交预约
  - Test method: 填写表单并提交
  - Validation tool: 手动测试

- **Criterion 3**: 提交后显示预约确认信息
  - Test method: 检查成功提示
  - Validation tool: 手动测试

- **Criterion 4**: TypeScript 编译无错误
  - Test method: 执行构建命令
  - Validation tool: `npm run build`

### 4.2 Edge Cases

- Edge case 1: 所有时段都已预约，显示"暂无可用时段"
- Edge case 2: URL 指定不存在的医生，显示提示

### 4.3 Negative Tests

- 不选择时段直接提交应显示验证错误

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-002 (实现预约 Store 状态管理)
- **Blocks**: 无

### 5.2 External Dependencies

- Ant Design Vue
- dayjs
- Vue Router

### 5.3 Prerequisites

- TASK-002 完成

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 需要实现表单和选择器逻辑

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`

### 7.2 Unit Testing

- 无需单元测试

### 7.3 Integration Testing

- 无需集成测试

### 7.4 Manual Testing

- 完整预约流程测试

## 8. Implementation Notes

- 参考 src/views/Consultation.vue 的组件风格
- 使用相同的患者验证逻辑
- 预约成功提示使用 Ant Design 的 message.success

## 9. Risks and Mitigations

- 无显著风险

## 10. Deliverables

- src/views/Appointment.vue
- 验证构建通过

---

*本 Task PRD 由 PRD Builder 工具集生成。*
