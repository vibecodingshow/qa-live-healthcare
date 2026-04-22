# Task PRD: 集成时间选择器和冲突检测

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-006-time-slot-conflict
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

集成直观易用的时间选择器组件，并实现时间段冲突检测功能，防止重复预约和超预约情况。时间选择是预约挂号的核心交互，需要提供良好的用户体验。

### 1.2 Task Objectives

**目标1**: 实现时间选择器组件
**目标2**: 显示可用的时间段
**目标3**: 禁用已满的时间段
**目标4**: 实现冲突检测逻辑
**目标5**: 处理并发预约冲突

### 1.3 Related Feature Requirements

- Feature requirement: REQ-003 (时间选择器)
- Related user story: Story 1
- Dependencies: TASK-003, TASK-004

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: 时间选择器
- 显示一天的可用时间段（30分钟或1小时为单位）
- 每个时段显示剩余名额
- 禁用已满时段
- 禁用已过期时段

**FR-002**: 冲突检测
- 预约前检查时间段是否可用
- 提交时再次验证
- 防止并发预约

**FR-003**: 实时更新
- 选择日期后刷新可用时段
- 预约成功后更新时段状态

### 2.2 Technical Requirements

**TR-001**: 组件设计
- 使用Day.js处理日期时间
- 计算可用时段
- 显示剩余名额

**TR-002**: 冲突检测算法
- 检查时间段是否在排班范围内
- 检查当前预约数是否已满
- 检查是否与现有预约冲突

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 设计时段数据结构
- 从排班生成可用时段
- 每个时段包含开始时间、结束时间、可用状态

**步骤2**: 创建TimeSlotPicker组件
- 接收doctorId和date作为props
- 从Store获取排班数据
- 计算并显示可用时段

**步骤3**: 实现时段选择
- 点击时段选中
- 显示选中状态
- 触发emit事件

**步骤4**: 实现冲突检测
- 在TimeSlotPicker中检测
- 在Store方法中双重检测

### 3.2 Implementation Steps

1. 设计时段数据结构
2. 创建时段计算函数
3. 创建TimeSlotPicker组件
4. 集成到预约创建页面
5. 实现冲突检测逻辑
6. 测试时段选择

## 4. Acceptance Criteria

**AC-001**: 时间选择器正常工作
- **验证工具**: 页面测试

**AC-002**: 可用时段正确显示
- **验证工具**: 功能测试

**AC-003**: 已满时段正确禁用
- **验证工具**: 满额测试

**AC-004**: 冲突检测正常工作
- **验证工具**: 并发测试

**AC-005**: 编译无错误
- **验证工具**: `npm run build` 退出码 0

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-003, TASK-004
- **Blocks**: TASK-008

## 6. Estimated Effort

- **Estimated effort**: 2小时
- **Complexity**: Medium
- **Risk**: Medium

## 7. Testing Strategy

### 7.1 Automated Validation

**Build validation**:
- 命令: `npm run build`
- 预期: 编译成功
- 退出码: 0

### 7.2 Manual Testing

- 测试时段选择
- 测试冲突检测
- 测试并发预约

## 8. Implementation Notes

### 时段数据结构

```typescript
interface TimeSlotDisplay {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  remainingSlots: number;
  appointments: number;
}
```

### 时段计算逻辑

```
1. 获取医生在该日期的排班
2. 遍历排班时间范围
3. 按固定间隔（30分钟）生成时段
4. 检查每个时段的预约情况
5. 标记可用/不可用状态
```

## 9. Deliverables

1. **src/components/TimeSlotPicker.vue**: 时间段选择组件
2. **时段计算工具函数**: 时间段生成逻辑
3. **冲突检测逻辑**: Store中的验证方法