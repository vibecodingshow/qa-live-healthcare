# Task PRD: 患者端 - 医生详情和预约页面

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-004
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务实现患者端的医生详情页面和预约时段选择功能，包括显示医生详细信息、选择预约日期和时间段、确认预约信息、提交预约申请。

### 1.2 Task Objectives

- 创建医生详情页面组件
- 实现预约日期选择器
- 实现时段选择功能
- 实现预约确认流程
- 实现就诊原因填写

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-002（预约时段管理）, REQ-003（预约下单与确认）
- **Related User Story**: Story 2（患者选择预约时段并确认预约）
- **Technical Spec**: 第5.1节路由设计

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 显示医生详细信息（姓名、职称、科室、擅长领域、简介）
- 显示未来 7 天的可预约日期
- 每个日期显示可预约时段列表
- 时段显示剩余号源数量
- 禁止选择已满的时段
- 显示预约须知和注意事项
- 支持选择/填写就诊原因
- 预约确认页面
- 提交预约创建请求

### 2.2 Technical Requirements

- 页面组件位置：`src/views/AppointmentDetail.vue`
- 使用 Vue 3 Composition API
- 使用 Ant Design Vue 组件库
- 遵循项目编码规范
- 响应式布局设计

### 2.3 Constraints and Limitations

- 只能选择未来 7 天的日期
- 预约提交需选择有效的时段
- 就诊原因最多 500 字符

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用多步骤表单流程：
1. 显示医生详情
2. 选择日期和时段
3. 填写就诊原因
4. 确认并提交

### 3.2 Implementation Steps

1. **创建预约日期选择组件**
   - 创建 `src/components/DatePicker.vue`
   - 显示未来 7 天日期
   - 日期可选状态判断

2. **创建时段选择组件**
   - 创建 `src/components/TimeSlotPicker.vue`
   - 显示时段列表
   - 时段可用状态判断

3. **创建医生详情页面**
   - 创建 `src/views/AppointmentDetail.vue`
   - 医生信息展示
   - 预约流程整合

4. **实现预约确认流程**
   - 创建 `src/views/AppointmentConfirm.vue`
   - 显示预约摘要
   - 确认提交功能

5. **验证步骤**
   - 运行 `npm run build` 确保编译通过
   - 运行 `npm run lint` 确保代码风格

### 3.3 Technical Considerations

- 使用 `useRoute` 获取医生 ID
- 使用 `useRouter` 进行页面跳转
- 使用 `ref` 管理预约表单状态
- 表单验证使用 Ant Design Form

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-project-structure.md`: 项目结构
- `.asdm/contexts/standard-coding-style.md`: 组件编码规范
- `src/views/Consultation.vue`: 参考现有详情页实现

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 医生详情正确显示
  - Test method: 页面加载后显示完整医生信息
  - **Validation tool**: `npm run build` - 编译成功

- **Criterion 2**: 日期和时段选择正常
  - Test method: 选择不同日期和时段，状态正确更新
  - **Validation tool**: 功能测试

- **Criterion 3**: 已满时段禁用
  - Test method: 剩余号源为 0 的时段不可点击
  - **Validation tool**: 功能测试

- **Criterion 4**: 预约提交成功
  - Test method: 填写信息后提交，预约创建成功
  - **Validation tool**: 功能测试

### 4.2 Edge Cases

- 医生无可用时段时显示提示
- 网络错误时显示错误提示
- 预约提交失败后重试

### 4.3 Negative Tests

- 未选择日期/时段不能提交
- 就诊原因超过限制被截断
- 重复提交被正确阻止

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）, TASK-002（工具函数）, TASK-003（医生列表页面）
- **Blocks**: 无（最终任务）

### 5.2 External Dependencies

- Vue 3.5.10
- Vue Router 4.6.3
- Ant Design Vue 4.2.6
- TASK-006 API 接口

### 5.3 Prerequisites

- TASK-001, TASK-002, TASK-003, TASK-006 已完成
- API 接口可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Medium
- **Risk**: Medium

### 6.2 Effort Factors

- 表单验证逻辑复杂
- 多步骤流程协调

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 组件渲染测试
- 表单验证测试
- 时段选择逻辑测试

### 7.3 Integration Testing

- 与 API 接口集成测试
- 预约创建流程测试

### 7.4 Manual Testing

- 页面功能手动测试
- 预约流程端到端测试

## 8. Implementation Notes

- 页面放置在 `src/views/` 目录
- 组件放置在 `src/components/` 目录
- 使用 `scoped` 样式
- 添加适当的注释
- 添加 Loading 状态

## 9. Risks and Mitigations

### Risk 1: 号源冲突

- **Description**: 选择时段后号源被抢完
- **Impact**: High
- **Mitigation**: 提交前再次验证号源

### Risk 2: 表单数据丢失

- **Description**: 页面刷新后表单数据丢失
- **Impact**: Medium
- **Mitigation**: 使用 sessionStorage 暂存

## 10. Deliverables

- `src/components/DatePicker.vue` - 日期选择组件
- `src/components/TimeSlotPicker.vue` - 时段选择组件
- `src/views/AppointmentDetail.vue` - 医生详情页面
- `src/views/AppointmentConfirm.vue` - 预约确认页面
- 单元测试文件
- 页面功能验证

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功
- **Test results**: 单元测试通过
- **Validation log**: 验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **身份验证**: 预约操作需验证用户登录状态
- **会话安全**: 使用 sessionStorage 暂存表单数据，防止敏感信息泄露
- **请求防护**: 防止重复提交，使用防抖和请求状态管理

### 11.2 合规要求

- **号源保护**: 预约号源数据不得在前端暴露真实库存
- **信息完整**: 预约确认页需展示完整的预约须知
- **取消规则**: 取消提示需明确说明取消时限和规则

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
