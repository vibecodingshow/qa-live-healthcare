# Task PRD: 数据模型和类型定义

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-001
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务旨在为预约挂号功能创建完整的 TypeScript 类型定义体系，包括预约记录（Appointment）、医生排班（DoctorSchedule）、时段（TimeSlot）等核心数据模型，以及相关的接口和枚举类型定义。

### 1.2 Task Objectives

- 定义预约挂号功能所需的所有数据类型
- 确保类型定义与现有数据模型（Doctor、Patient）保持一致
- 提供完整的类型安全保障
- 为后续任务开发提供类型基础

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-ALL（所有预约挂号相关需求）
- **Related User Story**: Story 1-6（所有用户故事）
- **Technical Spec**: 第5.1节 Architecture Considerations

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 创建 `Appointment` 预约记录类型，包含完整字段定义
- 创建 `DoctorSchedule` 医生排班类型，包含时段列表
- 创建 `TimeSlot` 时段类型，包含号源管理字段
- 创建 `AppointmentStatus` 预约状态枚举
- 创建 `CancelReason` 取消原因枚举
- 导出所有类型定义供其他模块使用

### 2.2 Technical Requirements

- 类型定义文件位置：`src/types/appointment.ts`
- 使用 TypeScript 严格模式
- 遵循项目编码规范（PascalCase 命名）
- 复用现有 `Doctor` 和 `Patient` 类型
- 兼容 Vue 3 Composition API

### 2.3 Constraints and Limitations

- 必须复用现有的 Doctor 和 Patient 类型
- 时间格式统一使用 ISO 8601 标准
- 状态枚举值必须与后端 API 保持一致

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用自顶向下的类型定义方法：
1. 先定义基础枚举类型
2. 再定义复合数据类型
3. 最后定义 API 请求/响应类型

### 3.2 Implementation Steps

1. **创建类型定义文件**
   - 创建 `src/types/appointment.ts`
   - 导入必要的依赖类型

2. **定义枚举类型**
   ```typescript
   enum AppointmentStatus {
     PENDING = 'PENDING',        // 待确认
     CONFIRMED = 'CONFIRMED',   // 已确认
     REJECTED = 'REJECTED',     // 已拒绝
     SCHEDULED = 'SCHEDULED',   // 待就诊
     COMPLETED = 'COMPLETED',   // 已完成
     CANCELLED = 'CANCELLED'    // 已取消
   }
   ```

3. **定义基础数据类型**
   - `TimeSlot` - 时段信息
   - `DoctorSchedule` - 医生排班
   - `Appointment` - 预约记录

4. **定义 API 类型**
   - `AppointmentCreateRequest` - 创建预约请求
   - `AppointmentListResponse` - 预约列表响应

5. **验证步骤**
   - 运行 `npm run build` 确保类型编译通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 复用项目现有的类型定义模式
- 使用 `interface` 而非 `type` 便于扩展
- 为可选字段添加合适的默认值
- 添加 JSDoc 注释提高可读性

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: TypeScript 编码规范
- `.asdm/contexts/data-models.md`: 现有数据模型参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 所有类型定义已创建并正确导出
  - Test method: 检查 `src/types/appointment.ts` 文件存在性
  - **Validation tool**: `npm run build` - TypeScript 编译成功

- **Criterion 2**: Appointment 类型包含所有必要字段
  - Test method: 检查字段完整性
  - **Validation tool**: TypeScript 编译器类型检查

- **Criterion 3**: 与现有类型（Doctor, Patient）兼容
  - Test method: 导入测试
  - **Validation tool**: `npx tsc --noEmit`

### 4.2 Edge Cases

- 处理日期时间为空的情况
- 处理预约状态未知值
- 处理医生或患者信息缺失

### 4.3 Negative Tests

- 验证不完整类型定义会被编译器拒绝
- 验证错误的状态值会被类型检查捕获

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: 无
- **Blocks**: TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009

### 5.2 External Dependencies

- Vue 3.5.10
- TypeScript 5.5.3
- Ant Design Vue 4.2.6

### 5.3 Prerequisites

- 项目已初始化 TypeScript 配置
- 现有类型定义（Doctor, Patient）可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 2 hours
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 类型定义相对独立，复杂度低
- 复用现有模式，实施风险小

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`
- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Exit criteria**: 所有命令退出码为 0

### 7.2 Unit Testing

- 不需要单元测试（类型定义文件）
- 类型检查即验证

### 7.3 Integration Testing

- 类型兼容性测试（在后续任务中验证）

### 7.4 Manual Testing

- 代码审查确认类型设计合理性

## 8. Implementation Notes

- 类型定义文件应放置在 `src/types/` 目录
- 导出所有公共类型供其他模块使用
- 添加详细的 JSDoc 注释
- 遵循项目的命名规范

## 9. Risks and Mitigations

### Risk 1: 类型与后端不一致

- **Description**: 前端类型定义与后端 API 数据结构不匹配
- **Impact**: Medium
- **Mitigation**: 预留扩展字段，使用可选类型

### Risk 2: 与现有类型冲突

- **Description**: 新类型与现有 Doctor/Patient 类型命名冲突
- **Impact**: Low
- **Mitigation**: 使用明确的命名空间和导入方式

## 10. Deliverables

- `src/types/appointment.ts` - 预约相关类型定义文件
- 类型编译验证结果
- 类型检查验证结果

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript 编译成功日志
- **Type check**: `npx tsc --noEmit` 成功退出
- **Validation log**: 完整的验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **类型安全**: 使用 TypeScript 严格模式，确保类型定义准确无误
- **数据验证**: 所有类型字段必须经过验证，防止非法数据流入
- **类型隔离**: 不同业务模块的类型定义应保持独立，避免交叉污染

### 11.2 合规要求

- **代码规范**: 遵循项目编码规范（PascalCase 命名）
- **文档合规**: 所有类型定义需添加 JSDoc 注释
- **版本控制**: 类型变更需记录版本号，便于追溯

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
