# Task PRD: 预约表单页面

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-004
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
开发在线预约表单页面，患者选择时段并填写就诊信息完成挂号。

### 1.2 Task Objectives
- 创建 `src/views/AppointmentBooking.vue` 页面
- 集成 TimeSlotPicker 组件选择时段
- 实现就诊信息表单（姓名、联系方式、病情描述）
- 提交预约并显示成功结果

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-003 (在线挂号)
- User Story: Story 2

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 页面入口：点击医生卡片上的"预约"按钮
- 选择医生（从路由参数或 props 获取）
- 使用 TimeSlotPicker 选择就诊时段
- 填写就诊人信息：
  - 姓名（必填）
  - 手机号（必填，格式验证）
  - 病情描述（选填，最多 500 字）
- 提交前确认预约信息
- 预约成功显示挂号单号

### 2.2 Technical Requirements
- 路由配置：`/appointment/:doctorId`
- 使用 Ant Design Vue Form、Input、Button
- 集成 TimeSlotPicker 组件

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 创建 `src/views/AppointmentBooking.vue`
- 使用 Ant Design Vue 表单验证
- 调用 `src/data/appointment.ts` 创建预约

### 3.2 Implementation Steps
1. 创建 `src/views/AppointmentBooking.vue`
2. 配置路由 `/appointment/:doctorId`
3. 实现页面布局：
   - 医生信息卡片
   - TimeSlotPicker 时段选择
   - 就诊信息表单
   - 确认提交按钮
4. 实现表单验证规则
5. 实现 `handleSubmit()` 提交逻辑
6. 实现预约成功后的结果展示
7. **Validation Step**: 运行 `npm run build` 验证编译

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 可以选择时段并填写信息
  - Test method: 手动填写表单验证
  - **Validation tool**: `npm run build`
- **Criterion 2**: 表单验证正常工作
  - Test method: 不填必填项提交验证
  - **Validation tool**: `npm run build`
- **Criterion 3**: 预约成功后显示挂号单号
  - Test method: 完整提交流程测试

### 4.2 Edge Cases
- 同一时段号源已满时提示
- 提交过程中网络/存储错误处理

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-002 (预约时段组件)
- **Blocks**: 无

### 5.2 External Dependencies
- `src/components/TimeSlotPicker.vue`
- `src/data/appointment.ts`
- Ant Design Vue

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 2 小时
- **Complexity**: Medium
- **Risk**: Medium

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Exit criteria**: 命令 exit code 为 0

## 8. Implementation Notes

- 参考 `src/views/Consultation.vue` 表单风格
- 添加返回按钮返回医生列表

## 9. Risks and Mitigations

### Risk 1: 号源并发超卖
- **Impact**: High
- **Mitigation**: 提交前再次检查号源

## 10. Deliverables

- `src/views/AppointmentBooking.vue`
- 更新路由配置
- **Build output**: TypeScript 编译无错误

---
