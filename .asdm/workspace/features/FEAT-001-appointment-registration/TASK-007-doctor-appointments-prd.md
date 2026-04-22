# Task PRD: 医生端 - 预约管理页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-007
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现医生端的预约管理页面，支持查看预约列表、确认/拒绝预约申请、显示预约统计信息。

### 1.2 Task Objectives

- 创建医生预约管理页面组件
- 实现预约列表展示
- 实现预约确认/拒绝功能
- 实现预约统计信息展示
- 实现时间范围筛选功能

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-006（医生预约列表）, REQ-007（预约审核处理）
- **Related User Story**: Story 5（医生查看和管理预约）
- **Technical Spec**: 第5.1节路由设计

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 页面加载时获取医生预约列表
- 支持按时间范围筛选（今日、本周、自定义）
- 显示预约统计信息（总预约数、已确认数、待处理数）
- 显示预约列表信息：患者姓名、日期、时间、状态
- 支持查看预约详情
- 支持确认预约申请
- 支持拒绝预约申请（需填写原因）
- 拒绝后自动发送通知
- 分页加载（每页 10 条）
- Loading 状态和空状态展示

### 2.2 Technical Requirements

- 页面组件位置：`src/views/DoctorAppointments.vue`
- 使用 Vue 3 Composition API
- 使用 Ant Design Vue 组件库
- 遵循项目编码规范
- 响应式布局设计

### 2.3 Constraints and Limitations

- 医生只能管理自己的预约
- 拒绝预约需提供原因
- 已完成的预约不能操作

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用统计 + 列表展示模式：
1. 创建统计卡片组件
2. 创建预约列表项组件
3. 实现确认/拒绝功能
4. 集成 API 接口

### 3.2 Implementation Steps

1. **创建统计卡片组件**
   - 创建 `src/components/AppointmentStats.vue`
   - 展示各类统计数据
   - 数据更新逻辑

2. **创建预约列表项组件**
   - 创建 `src/components/DoctorAppointmentItem.vue`
   - 展示预约基本信息
   - 确认/拒绝按钮
   - 状态标签显示

3. **创建预约管理页面**
   - 创建 `src/views/DoctorAppointments.vue`
   - 布局结构设计
   - 时间筛选器

4. **实现确认/拒绝功能**
   - 确认预约弹窗
   - 拒绝预约弹窗（原因填写）
   - API 调用

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用 `ref` 和 `computed` 管理状态
- 使用 `watch` 监听筛选条件变化
- 使用 `useRouter` 进行页面跳转
- 使用 Ant Design Modal 组件

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 组件编码规范
- `.asdm/contexts/data-models.md`: 预约数据模型

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 预约列表正确显示
  - Test method: 页面加载后显示预约列表
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: 统计数据正确显示
  - Test method: 统计数据与列表一致
  - **Validation tool**: 功能测试

- **Criterion 3**: 确认预约功能正常
  - Test method: 点击确认按钮，预约状态更新
  - **Validation tool**: 功能测试

- **Criterion 4**: 拒绝预约功能正常
  - Test method: 填写原因后拒绝，预约状态更新
  - **Validation tool**: 功能测试

### 4.2 Edge Cases

- 预约列表为空时显示空状态
- 网络错误时显示错误提示
- 操作失败时显示错误提示

### 4.3 Negative Tests

- 无效预约 ID 不能操作
- 重复操作被正确阻止
- 已完成的预约不能被操作

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）, TASK-009（医生端 API 接口）
- **Blocks**: 无（最终任务）

### 5.2 External Dependencies

- Vue 3.5.10
- Vue Router 4.6.3
- Ant Design Vue 4.2.6
- TASK-009 API 接口

### 5.3 Prerequisites

- TASK-001, TASK-002, TASK-009 已完成
- API 接口可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 参考现有页面实现
- 复用 TASK-002 状态工具

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 组件渲染测试
- 确认/拒绝逻辑测试

### 7.3 Integration Testing

- 与 API 接口集成测试
- 确认/拒绝流程测试

### 7.4 Manual Testing

- 页面功能手动测试
- 操作流程端到端测试

## 8. Implementation Notes

- 页面放置在 `src/views/` 目录
- 组件放置在 `src/components/` 目录
- 使用 `scoped` 样式
- 添加适当的注释
- 添加 Loading 状态

## 9. Risks and Mitigations

### Risk 1: 权限问题

- **Description**: 医生越权操作其他医生预约
- **Impact**: High
- **Mitigation**: 前端权限校验 + 后端权限验证

### Risk 2: 并发问题

- **Description**: 同一预约被多次操作
- **Impact**: Medium
- **Mitigation**: 乐观锁 + loading 状态

## 10. Deliverables

- `src/components/AppointmentStats.vue` - 统计卡片组件
- `src/components/DoctorAppointmentItem.vue` - 预约列表项组件
- `src/views/DoctorAppointments.vue` - 预约管理页面
- 单元测试文件
- 页面功能验证

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **权限验证**: 医生只能查看和管理自己的预约记录
- **操作限制**: 拒绝预约必须填写原因，防止随意操作
- **通知机制**: 预约状态变更需通知患者

### 11.2 合规要求

- **数据隔离**: 医生间数据完全隔离，不得相互访问
- **操作记录**: 所有管理操作需记录操作日志
- **拒绝理由**: 拒绝预约的原因需符合医疗规范

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
