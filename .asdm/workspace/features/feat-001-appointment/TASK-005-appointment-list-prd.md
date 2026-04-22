# Task PRD: 实现预约列表和状态跟踪

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-005-appointment-list
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

实现预约列表页面和状态跟踪功能，包括患者的预约记录列表、医生的预约管理列表、预约状态实时更新等。让用户可以查看和管理自己的预约记录，跟踪预约状态变化。

### 1.2 Task Objectives

**目标1**: 创建患者预约列表页面
**目标2**: 创建医生预约管理页面
**目标3**: 实现预约状态显示和跟踪
**目标4**: 实现预约状态变更功能（确认、完成、取消）
**目标5**: 支持预约列表筛选和搜索

### 1.3 Related Feature Requirements

- Feature requirement: REQ-004 (预约状态跟踪)
- Related user story: Story 1, Story 2
- Dependencies: TASK-003 (预约创建界面)

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: 患者预约列表
- 页面路径: `/appointment/list` 或 `/my-appointments`
- 显示患者的预约记录
- 按日期排序
- 显示预约状态、医生信息、时间

**FR-002**: 医生预约管理
- 页面路径: `/doctor/room/appointments`
- 显示医生收到的所有预约
- 按日期和状态筛选
- 显示患者信息

**FR-003**: 预约状态显示
- 待确认（pending）: 黄色标签
- 已确认（confirmed）: 绿色标签
- 已完成（completed）: 蓝色标签
- 已取消（cancelled）: 灰色标签

**FR-004**: 状态变更功能
- 医生可以确认预约
- 医生可以标记预约完成
- 患者可以取消预约
- 取消需要确认

**FR-005**: 预约详情
- 点击预约查看详情
- 显示完整预约信息
- 提供快捷操作

### 2.2 Technical Requirements

**TR-001**: 列表组件
- 使用Ant Design Vue Table
- 支持分页
- 支持筛选和排序

**TR-002**: 状态管理
- 预约状态存储在Store
- 状态变更实时更新UI
- 记录状态变更时间

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 创建患者预约列表页面
- `src/views/MyAppointments.vue`
- 显示患者的所有预约

**步骤2**: 创建医生预约管理页面
- 集成到DoctorRoom.vue
- 或创建独立页面

**步骤3**: 实现预约表格组件
- 使用Ant Design Vue Table
- 添加筛选和排序

**步骤4**: 实现状态变更功能
- 添加操作按钮
- 确认对话框
- 状态更新逻辑

**验证步骤**: 构建测试
- 命令：`npm run build`

### 3.2 Implementation Steps

1. 创建MyAppointments.vue
2. 创建预约列表Table组件
3. 添加状态标签
4. 实现状态变更按钮
5. 添加确认对话框
6. 实现预约详情查看
7. 测试功能

## 4. Acceptance Criteria

**AC-001**: 患者可查看预约列表
- **验证工具**: 页面功能测试

**AC-002**: 医生可查看和管理预约
- **验证工具**: 页面功能测试

**AC-003**: 预约状态正确显示
- **验证工具**: 视觉检查

**AC-004**: 状态变更功能正常
- **验证工具**: 操作测试

**AC-005**: 编译无错误
- **验证工具**: `npm run build` 退出码 0

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-003 (预约创建界面)
- **Blocks**: TASK-008 (测试优化)

## 6. Estimated Effort

- **Estimated effort**: 1.5小时
- **Complexity**: Medium
- **Risk**: Low

## 7. Testing Strategy

### 7.1 Automated Validation

**Build validation**:
- 命令: `npm run build`
- 预期: 编译成功
- 退出码: 0

### 7.2 Manual Testing

- 测试患者预约列表
- 测试医生预约管理
- 测试状态变更

## 8. Implementation Notes

### 预约状态流转

```
待确认 (pending)
    ↓ 医生确认
已确认 (confirmed)
    ↓ 就诊完成
已完成 (completed)

任意状态（除已完成）
    ↓ 用户/医生取消
已取消 (cancelled)
```

## 9. Deliverables

1. **src/views/MyAppointments.vue**: 患者预约列表页面
2. **更新的DoctorRoom.vue**: 添加医生预约管理
3. **预约状态标签组件**: 状态显示组件
4. **更新的Store**: 添加预约查询和状态变更方法