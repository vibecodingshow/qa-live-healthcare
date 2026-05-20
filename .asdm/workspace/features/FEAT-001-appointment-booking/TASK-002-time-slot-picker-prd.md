# Task PRD: 预约时段组件

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-002
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
开发预约时段选择组件，用于展示和选择医生可预约的时间段。

### 1.2 Task Objectives
- 创建 `TimeSlotPicker.vue` 组件
- 支持按日期选择可用时段
- 显示每个时段的剩余号源
- 组件风格与 Ant Design Vue 一致

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-002 (预约时段展示)
- User Story: Story 1

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 组件接收 props：`doctorId`, `selectedDate`, `schedules`
- 展示选定日期的可用时段（上午/下午/晚上）
- 每个时段显示：时段名称、剩余号源、选择状态
- 禁用已满号源的时段
- 支持 emit 事件：`select(slot: TimeSlot)`

### 2.2 Technical Requirements
- 使用 Vue 3 Composition API
- 组件放置于 `src/components/` 目录
- 使用 Ant Design Vue 组件（Card、Tag、Button）
- 支持 TypeScript props 类型定义

### 2.3 Constraints and Limitations
- 组件为纯展示组件，不包含预约提交逻辑

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 创建 `src/components/TimeSlotPicker.vue`
- 使用 Day.js 处理日期显示
- 从 `src/data/appointment.ts` 导入数据类型

### 3.2 Implementation Steps
1. 创建 `src/components/TimeSlotPicker.vue`
2. 定义 Props 接口：
   ```typescript
   interface Props {
     doctorId: string
     selectedDate: string
     schedules: Schedule[]
   }
   ```
3. 实现 computed 属性计算可用时段
4. 实现 `getSlotInfo(slot: TimeSlot)` 方法获取时段信息
5. 实现 `isSlotAvailable(slot: TimeSlot)` 检查是否可选
6. 实现 `handleSelect(slot: TimeSlot)` 触发选择事件
7. 编写组件模板，使用 Ant Design Vue 样式
8. **Validation Step**: 运行 `npm run build` 验证编译

### 3.3 Technical Considerations
- 使用 `h()` 函数或 template 语法
- 参考 `src/components/AppHeader.vue` 样式

### 3.4 Reference to Project Context
- `.asdm/contexts/standard-coding-style.md`: Vue 组件规范
- `src/components/AppHeader.vue`: 组件风格参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: 组件可正确显示可用时段
  - Test method: 传入不同排班数据验证显示
  - **Validation tool**: `npm run build`
- **Criterion 2**: 已满号源时段被正确禁用
  - Test method: 传入号源为 0 的时段验证
  - **Validation tool**: `npm run build`
- **Criterion 3**: 选择时段后正确 emit 事件
  - Test method: 单元测试或手动测试

### 4.2 Edge Cases
- 无排班数据时显示"无可预约时段"
- 传入无效日期格式的处理

### 4.3 Negative Tests
- 不传 doctorId 时的降级处理

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: TASK-001 (数据模型设计)
- **Blocks**: TASK-004 (预约表单页面)

### 5.2 External Dependencies
- Ant Design Vue 4.2
- Day.js 1.11
- `src/data/appointment.ts` (TASK-001 产出)

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 1.5 小时
- **Complexity**: Medium
- **Risk**: Low

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Exit criteria**: 所有命令 exit code 为 0

### 7.2 Manual Testing
- 测试组件在不同数据下的显示效果

## 8. Implementation Notes

- 组件应保持可复用性
- 考虑添加加载状态

## 9. Risks and Mitigations

### Risk 1: 与 Ant Design Vue 样式冲突
- **Impact**: Low
- **Mitigation**: 使用 scoped CSS

## 10. Deliverables

- `src/components/TimeSlotPicker.vue`
- **Build output**: TypeScript 编译无错误

---
