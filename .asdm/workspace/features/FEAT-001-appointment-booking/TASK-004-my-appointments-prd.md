# Task PRD: 创建我的预约页面

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号
**Task ID**: TASK-004
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

创建"我的预约"页面 MyAppointments.vue，患者可以查看和管理自己的所有预约记录。

### 1.2 Task Objectives

- 创建 src/views/MyAppointments.vue 页面组件
- 实现患者身份验证
- 实现预约列表展示
- 实现预约状态筛选（待确认/已确认/已取消/已完成）
- 实现取消预约功能

### 1.3 Related Feature Requirements

- Feature requirement: REQ-003, REQ-004, REQ-005
- Related user story: Story 2

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时验证患者身份
- 获取当前患者的所有预约
- 按状态分组展示预约列表
- 显示预约详情（医生、日期、时段、状态、症状）
- 支持取消待确认状态的预约
- 取消操作需二次确认

### 2.2 Technical Requirements

- 使用 Vue 3 Composition API + `<script setup>`
- 使用 Ant Design Vue 组件
- 使用 dayjs 格式化日期时间
- 遵循项目组件结构规范

### 2.3 Constraints and Limitations

- 当前为前端原型

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. 参考 src/views/Consultation.vue 的患者验证模式
2. 使用 Ant Design Vue 的 Table、Tag、Modal 等组件
3. 调用 Store 方法查询和取消预约

### 3.2 Implementation Steps

1. 创建 src/views/MyAppointments.vue
2. 实现患者身份验证
3. 获取患者预约列表
4. 实现预约列表展示
5. 实现状态筛选
6. 实现取消预约功能
7. 添加样式
8. 验证构建通过

### 3.3 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 编码规范
- `.asdm/contexts/api.md`: Store API

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 未验证患者身份时显示验证表单
  - Test method: 直接访问页面
  - Validation tool: 浏览器检查

- **Criterion 2**: 验证通过后显示预约列表
  - Test method: 填写验证信息后
  - Validation tool: 浏览器检查

- **Criterion 3**: 可取消待确认状态的预约
  - Test method: 点击取消按钮
  - Validation tool: 手动测试

- **Criterion 4**: TypeScript 编译无错误
  - Test method: 执行构建命令
  - Validation tool: `npm run build`

### 4.2 Edge Cases

- Edge case 1: 没有预约记录时显示空状态提示
- Edge case 2: 已确认/已取消/已完成的预约不可取消

### 4.3 Negative Tests

- 取消已确认的预约应被阻止

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

- 需要实现列表展示和交互逻辑

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`

### 7.2 Unit Testing

- 无需单元测试

### 7.3 Integration Testing

- 无需集成测试

### 7.4 Manual Testing

- 完整预约管理流程测试

## 8. Implementation Notes

- 参考 src/views/Consultation.vue 的组件风格
- 使用 a-table 展示预约列表
- 使用 a-tag 显示预约状态
- 使用 a-modal 确认取消操作

## 9. Risks and Mitigations

- 无显著风险

## 10. Deliverables

- src/views/MyAppointments.vue
- 验证构建通过

---

*本 Task PRD 由 PRD Builder 工具集生成。*
