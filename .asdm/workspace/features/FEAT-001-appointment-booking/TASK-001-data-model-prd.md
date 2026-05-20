# Task PRD: 数据模型设计

**Feature ID**: FEAT-001-appointment-booking
**Feature Name**: 预约挂号功能
**Task ID**: TASK-001
**Created Date**: 2026-05-20
**Status**: TODO
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary
设计预约挂号功能的数据模型，包括医生排班、预约记录、时段等核心数据结构，并实现本地存储方案。

### 1.2 Task Objectives
- 定义医生排班数据结构（日期、时段、号源）
- 定义预约记录数据结构（患者、医生、时间、状态）
- 设计数据存储接口（支持本地存储模拟）
- 确保数据结构与现有项目风格一致

### 1.3 Related Feature Requirements
- Feature Requirement: REQ-001 (医生排班管理)
- Feature Requirement: REQ-003 (在线挂号)
- Feature Requirement: REQ-005 (预约状态变更)
- User Story: Story 1, Story 2, Story 3, Story 4

## 2. Detailed Requirements

### 2.1 Functional Requirements
- 医生排班数据包含：医生ID、日期、上午/下午/晚上时段、每个时段号源数
- 预约记录包含：预约ID、患者ID、医生ID、预约日期、时段、状态、创建时间
- 支持预约状态：PENDING（待就诊）、COMPLETED（已就诊）、CANCELLED（已取消）
- 数据存储接口需支持 CRUD 操作

### 2.2 Technical Requirements
- 使用 TypeScript 定义数据类型
- 遵循 Vue 3 Composition API 风格
- 数据文件放置于 `src/data/` 目录
- 导出类型定义和操作函数

### 2.3 Constraints and Limitations
- 初期使用 localStorage 模拟数据持久化
- 不涉及后端 API 对接

## 3. Implementation Approach

### 3.1 Recommended Methodology
- 在 `src/data/` 目录创建 `appointment.ts` 文件
- 定义 TypeScript 接口和类型
- 实现基于 localStorage 的 CRUD 操作函数
- 导出统一的数据访问接口

### 3.2 Implementation Steps
1. 创建 `src/data/appointment.ts` 文件
2. 定义 `Schedule`（排班）接口
3. 定义 `Appointment`（预约）接口
4. 定义 `TimeSlot`（时段枚举）
5. 定义 `AppointmentStatus`（状态枚举）
6. 实现 localStorage 操作函数：
   - `getSchedules(doctorId: string, date: string)`
   - `saveSchedule(schedule: Schedule)`
   - `getAppointments(patientId: string)`
   - `createAppointment(appointment: Omit<Appointment, 'id'>)`
   - `cancelAppointment(id: string)`
   - `updateAppointmentStatus(id: string, status: AppointmentStatus)`
7. **Validation Step**: 运行 `npm run build` 验证 TypeScript 类型正确性

### 3.3 Technical Considerations
- 使用 `crypto.randomUUID()` 生成唯一 ID
- 考虑数据初始化逻辑（添加示例医生和排班数据）
- 参考现有 `src/data/` 目录结构

### 3.4 Reference to Project Context
- `.asdm/contexts/standard-coding-style.md`: TypeScript 编码规范
- `.asdm/contexts/data-models.md`: 现有数据模型参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria
- **Criterion 1**: TypeScript 接口定义完整且无编译错误
  - Test method: 检查编译输出
  - **Validation tool**: `npm run build` 或 `npx tsc --noEmit`
- **Criterion 2**: 所有 CRUD 操作函数已实现
  - Test method: 代码审查
  - **Validation tool**: `npm run build`
- **Criterion 3**: 数据可正确存储和读取
  - Test method: 手动测试 localStorage 读写

### 4.2 Edge Cases
- localStorage 容量不足时的处理
- 数据格式损坏时的容错处理

### 4.3 Negative Tests
- 传入无效参数时的错误处理
- 预约不存在的医生或时段时的行为

## 5. Dependencies

### 5.1 Task Dependencies
- **Depends on**: 无（首个任务）
- **Blocks**: TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007

### 5.2 External Dependencies
- TypeScript 5.5
- Vue 3.5
- Day.js 1.11（日期处理）

### 5.3 Prerequisites
- 了解现有项目数据结构
- 熟悉 TypeScript 接口定义

## 6. Estimated Effort

### 6.1 Effort Estimate
- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors
- 现有 localStorage 示例可参考
- 需求相对明确

## 7. Testing Strategy

### 7.1 Automated Validation (Required)
- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Exit criteria**: 所有命令 exit code 为 0

### 7.2 Unit Testing
- 暂不配置单元测试
- 通过手动测试验证

### 7.3 Integration Testing
- 通过后续任务集成测试

### 7.4 Manual Testing
- 测试 localStorage 数据存取

## 8. Implementation Notes

- 参考 `src/data/` 目录现有文件结构
- 使用 `readonly` 和 `as const` 提升类型安全
- 考虑添加数据初始化辅助函数

## 9. Risks and Mitigations

### Risk 1: localStorage 容量限制
- **Impact**: Low
- **Mitigation**: 提示用户清理浏览器存储

## 10. Deliverables

- `src/data/appointment.ts`: 数据模型和存储接口
- **Build output**: TypeScript 编译无错误
- **Validation log**: `npm run build` 输出

---
