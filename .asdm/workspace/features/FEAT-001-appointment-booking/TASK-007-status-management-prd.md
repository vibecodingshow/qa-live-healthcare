# Task PRD: 预约状态管理

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-007
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
实现预约状态变更逻辑，包括状态流转规则和号源管理。

### 1.2 Task Objectives
- 实现预约状态机（待就诊 → 已就诊/已取消）
- 实现号源扣减和归还逻辑
- 添加状态变更通知

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-005 (预约状态变更)
- User Story: Story 2, Story 3

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 预约状态：
  - `PENDING` - 待就诊
  - `COMPLETED` - 已就诊
  - `CANCELLED` - 已取消
- 状态流转规则：
  - `PENDING` → `COMPLETED`（就诊完成后）
  - `PENDING` → `CANCELLED`（用户取消）
- 号源管理：
  - 预约成功时号源 -1
  - 取消预约时号源 +1

### 2.2 Technical Requirements
- 在 `src/data/appointment.ts` 中扩展状态变更函数
- 添加事务逻辑防止号源超卖
- 添加状态变更日志

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 扩展 `src/data/appointment.ts` 中的函数
- 实现号源锁定机制
- 添加单元测试验证状态流转

### 3.2 Implementation Steps
1. 扩展 `src/data/appointment.ts`：
   - 添加 `checkAvailability(doctorId, date, slot)` 检查号源
   - 扩展 `createAppointment()` 实现号源扣减
   - 扩展 `cancelAppointment()` 实现号源归还
   - 添加 `completeAppointment()` 完成就诊
2. 实现号源锁定：
   ```typescript
   // 使用 localStorage 模拟锁
   const lockKey = `${doctorId}-${date}-${slot}`;
   if (localStorage.getItem(lockKey)) {
     throw new Error('号源正在被预约，请重试');
   }
   localStorage.setItem(lockKey, '1');
   // ... 执行预约逻辑
   localStorage.removeItem(lockKey);
   ```
3. 添加状态变更日志函数
4. **Validation Step**: 运行 `npm run build` 验证编译

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 预约成功后号源正确减少
  - Test method: 创建预约后检查排班号源
  - **Validation tool**: `npm run build`
- **Criterion 2**: 取消预约后号源正确恢复
  - Test method: 取消预约后检查排班号源
  - **Validation tool**: `npm run build`
- **Criterion 3**: 状态流转符合规则
  - Test method: 测试各种状态变更场景
  - **Validation tool**: `npm run build`

### 4.2 Edge Cases
- 并发预约同一号源的处理
- 取消已完成的预约（应禁止）
- 状态变更失败时的回滚

### 4.3 Negative Tests
- 尝试预约号源为 0 的时段
- 尝试取消不存在的预约

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: 无

### 5.2 External Dependencies
- `src/data/appointment.ts`

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 1.5 小时
- **Complexity**: Medium
- **Risk**: Medium

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Exit criteria**: 命令 exit code 为 0

### 7.2 Manual Testing
- 测试各种状态流转场景

## 8. Implementation Notes

- 使用 Day.js 处理日期比较
- 考虑添加预约超时自动释放锁

## 9. Risks and Mitigations

### Risk 1: localStorage 锁不可靠
- **Impact**: High
- **Mitigation**: 添加锁超时机制

### Risk 2: 状态不一致
- **Impact**: Medium
- **Mitigation**: 添加操作日志和回滚机制

## 10. Deliverables

- 更新 `src/data/appointment.ts`
- **Build output**: TypeScript 编译无错误

---
