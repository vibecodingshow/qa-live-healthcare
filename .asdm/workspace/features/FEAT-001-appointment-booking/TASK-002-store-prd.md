# Task PRD: 实现预约 Store 状态管理

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号
**Task ID**: TASK-002
**Created Date**: 2026-04-22
**Status**: COMPLETED
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

在 Store 中实现预约相关的方法，包括添加预约、确认预约、取消预约、查询预约列表、获取可用时段等功能。

### 1.2 Task Objectives

- 添加 appointments 状态数组
- 实现 addAppointment 方法
- 实现 confirmAppointment 方法
- 实现 cancelAppointment 方法
- 实现 getAppointmentsByPatient 方法
- 实现 getAppointmentsByDoctor 方法
- 实现 getAvailableSlots 方法
- 实现预约时段配置

### 1.3 Related Feature Requirements

- Feature requirement: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005
- Related user story: Story 1, Story 2, Story 3

## 2. Detailed Requirements

### 2.1 Functional Requirements

- appointments 状态数组存储所有预约
- addAppointment: 添加新预约，自动生成 id、createdAt、updatedAt、status=pending
- confirmAppointment: 确认预约，更新 status=confirmed 和 updatedAt
- cancelAppointment: 取消预约，更新 status=cancelled 和 updatedAt
- getAppointmentsByPatient: 根据患者 ID 查询预约列表
- getAppointmentsByDoctor: 根据医生 ID 查询预约列表
- getAvailableSlots: 获取某医生某日期的可用时段（排除已预约时段）

### 2.2 Technical Requirements

- 使用 Vue Reactive 模式
- 遵循现有 Store 方法命名约定
- 实现预约时段冲突检测

### 2.3 Constraints and Limitations

- 数据存储于内存，页面刷新后丢失
- 预约时段为静态配置

## 3. Implementation Approach

### 3.1 Recommended Methodology

1. 在 State 接口中添加 appointments 数组
2. 初始化 appointments 为空数组
3. 实现所有预约相关方法
4. 配置默认出诊时段

### 3.2 Implementation Steps

1. 读取 src/store/index.ts 了解现有结构
2. 添加 appointments 到 State 接口
3. 初始化 appointments 状态
4. 实现 addAppointment 方法
5. 实现 confirmAppointment 方法
6. 实现 cancelAppointment 方法
7. 实现 getAppointmentsByPatient 方法
8. 实现 getAppointmentsByDoctor 方法
9. 实现 getAvailableSlots 方法
10. 验证 TypeScript 编译通过

### 3.3 Reference to Project Context

- `.asdm/contexts/data-models.md`: 数据模型信息
- `.asdm/contexts/api.md`: API 规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 所有预约 Store 方法已实现
  - Test method: 检查方法存在且可调用
  - Validation tool: `npm run build`

- **Criterion 2**: 预约时段冲突检测正常工作
  - Test method: 同一时段不能被两个预约占用
  - Validation tool: 手动测试

- **Criterion 3**: TypeScript 编译无错误
  - Test method: 执行构建命令
  - Validation tool: `npm run build`

### 4.2 Edge Cases

- Edge case 1: 同一时段重复预约应返回空数组（无可用时段）
- Edge case 2: 查询不存在的患者/医生预约返回空数组

### 4.3 Negative Tests

- 取消不存在的预约（无副作用）

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001 (设计预约数据模型)
- **Blocks**: TASK-003, TASK-004, TASK-007

### 5.2 External Dependencies

- 项目依赖: vue, typescript

### 5.3 Prerequisites

- TASK-001 完成

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 45 分钟
- **Complexity**: Medium
- **Risk**: Low

### 6.2 Effort Factors

- 需要实现多个方法和冲突检测逻辑

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npm run build` (包含 vue-tsc 类型检查)

### 7.2 Unit Testing

- 无需单元测试（原型阶段）

### 7.3 Integration Testing

- 无需集成测试（原型阶段）

### 7.4 Manual Testing

- 手动测试预约流程

## 8. Implementation Notes

- Store 方法命名遵循现有约定：getXxx(), addXxx(), updateXxx(), deleteXxx()
- 预约时段配置: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00']

## 9. Risks and Mitigations

- Risk 1: 预约冲突 - Mitigation: getAvailableSlots 会过滤已预约时段

## 10. Deliverables

- src/store/index.ts 中添加的预约相关代码
- 验证构建通过

---

*本 Task PRD 由 PRD Builder 工具集生成。*
