# Task PRD: 预约状态枚举和工具函数

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号功能
**Task ID**: TASK-002
**Created Date**: 2026-04-22
**Status**: TODO
**Language**: zh (简体中文)

## 1. Task Overview

### 1.1 Task Summary

本任务基于 TASK-001 定义的数据类型，创建预约状态枚举、预约状态流转验证工具函数、日期时间处理工具等通用工具，为预约功能的实现提供基础工具支持。

### 1.2 Task Objectives

- 创建预约状态流转验证函数
- 创建日期时间处理工具函数
- 创建预约取消时间验证函数
- 导出所有工具函数供其他模块使用

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-003（预约下单与确认）, REQ-004（预约记录管理）
- **Related User Story**: Story 2, Story 3
- **Technical Spec**: 第5.4节约束条件

## 2. Detailed Requirements

### 2.1 Functional Requirements

- 创建 `isValidStatusTransition()` 状态流转验证函数
- 创建 `getCancelDeadline()` 取消截止时间计算函数
- 创建 `canCancelAppointment()` 取消资格验证函数
- 创建 `formatAppointmentDate()` 日期格式化函数
- 创建 `getAppointmentStatusText()` 状态文本转换函数
- 创建 `getAvailableTimeSlots()` 可用时段过滤函数

### 2.2 Technical Requirements

- 工具函数文件位置：`src/utils/appointment.ts`
- 使用 TypeScript 纯函数风格
- 遵循项目编码规范（camelCase 命名）
- 100% 单元测试覆盖
- 无副作用的纯函数设计

### 2.3 Constraints and Limitations

- 取消预约需在就诊前 2 小时完成
- 预约时段显示未来 7 天
- 状态流转必须遵循预定义规则

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用函数式编程范式：
1. 使用纯函数，无副作用
2. 参数校验前置
3. 返回类型明确

### 3.2 Implementation Steps

1. **创建工具函数文件**
   - 创建 `src/utils/appointment.ts`
   - 导入 AppointmentStatus 枚举

2. **实现状态流转验证**
   ```typescript
   const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
     PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
     CONFIRMED: ['SCHEDULED', 'CANCELLED'],
     SCHEDULED: ['COMPLETED', 'CANCELLED'],
     COMPLETED: [],
     CANCELLED: [],
     REJECTED: []
   };
   ```

3. **实现取消资格验证**
   - 计算取消截止时间（就诊前 2 小时）
   - 判断当前时间是否在可取消范围内

4. **实现日期时间工具**
   - 日期格式化函数
   - 时段列表过滤函数

5. **验证步骤**
   - 运行 `npm run test` 确保单元测试通过
   - 运行 `npm run lint` 确保代码风格符合规范

### 3.3 Technical Considerations

- 使用 dayjs 进行日期时间处理（项目已有依赖）
- 纯函数设计便于单元测试
- 错误处理使用明确的返回值

### 3.4 Reference to Project Context

- `.asdm/contexts/standard-coding-style.md`: 函数命名规范
- `.asdm/contexts/architecture.md`: 工具层设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **Criterion 1**: 状态流转验证函数正确识别有效/无效转换
  - Test method: 测试所有状态对的流转验证
  - **Validation tool**: `npm run test` - 单元测试通过

- **Criterion 2**: 取消资格验证函数正确判断是否可取消
  - Test method: 测试不同时间场景
  - **Validation tool**: `npm run test` - 单元测试通过

- **Criterion 3**: 所有工具函数有完整的单元测试
  - Test method: 测试覆盖率检查
  - **Validation tool**: `npm run test -- --coverage`

### 4.2 Edge Cases

- 临界时间点（恰好 2 小时前）的取消判断
- 跨天预约的时间计算
- 时区处理

### 4.3 Negative Tests

- 无效状态转换被拒绝
- 过期取消请求被拒绝
- 非法日期格式被正确处理

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001（数据模型和类型定义）
- **Blocks**: TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009

### 5.2 External Dependencies

- dayjs 1.11.19（项目已有依赖）
- vitest（测试框架）

### 5.3 Prerequisites

- TASK-001 已完成
- TypeScript 类型系统可用

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 hour
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 工具函数相对独立简单
- 复用现有 dayjs 库

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Unit tests**: `npm run test` - 运行所有单元测试
- **Coverage**: 测试覆盖率报告
- **Linting**: `npm run lint` - 代码质量检查
- **Exit criteria**: 测试通过率 100%，覆盖率 ≥ 80%

### 7.2 Unit Testing

- 状态流转测试用例
- 取消时间计算测试用例
- 日期格式化测试用例

### 7.3 Integration Testing

- 与 TASK-001 类型的集成验证

### 7.4 Manual Testing

- 边界条件手动验证

## 8. Implementation Notes

- 工具函数统一放置在 `src/utils/` 目录
- 每个函数独立，可单独导入使用
- 添加完整的 JSDoc 注释
- 包含使用示例

## 9. Risks and Mitigations

### Risk 1: 时间计算错误

- **Description**: 时区或夏令时导致时间计算偏差
- **Impact**: High
- **Mitigation**: 使用 dayjs 的 UTC 模式

### Risk 2: 测试覆盖率不足

- **Description**: 未覆盖的代码路径可能存在 bug
- **Impact**: Medium
- **Mitigation**: 要求 100% 路径覆盖

## 10. Deliverables

- `src/utils/appointment.ts` - 预约工具函数文件
- `src/utils/__tests__/appointment.test.ts` - 单元测试文件
- 测试覆盖率报告

**Mandatory Deliverable**: Validation Results
- **Test results**: 所有单元测试通过
- **Coverage report**: 覆盖率 ≥ 80%
- **Validation log**: 完整的验证命令执行记录

## 11. 安全与合规要求

### 11.1 安全要求

- **函数纯度**: 工具函数应为纯函数，无副作用，确保可预测性
- **参数校验**: 所有函数入口参数必须校验，防止恶意输入
- **错误处理**: 错误信息不得泄露敏感系统信息

### 11.2 合规要求

- **时间标准**: 统一使用 ISO 8601 时间格式，符合国际标准
- **代码规范**: 遵循项目编码规范（camelCase 命名）
- **测试覆盖**: 关键业务逻辑必须达到 100% 测试覆盖

---

**Document Version**: 1.1
**Created Date**: 2026-04-22
**Last Updated**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
**Created Date**: 2026-04-22
**Created by**: ASDM PRD Builder
**Feature**: FEAT-001-appointment-registration
