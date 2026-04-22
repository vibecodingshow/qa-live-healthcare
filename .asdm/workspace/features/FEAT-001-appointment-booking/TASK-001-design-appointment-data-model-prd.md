# Task PRD: 设计预约数据模型

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-001
**Created Date**: 2026-04-21
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务是预约挂号功能的数据模型设计阶段，目标是设计 `Appointment`（预约）、`ClinicSchedule`（门诊时间表）、`TimeSlot`（时段）等实体的完整数据结构及其关系。这是整个功能开发的基础，为后续的类型定义和模拟数据提供依据。

### 1.2 Task Objectives

- 设计完整的预约数据模型，包含所有必要字段
- 设计门诊时间表数据结构，支持灵活的排班设置
- 设计时段数据结构，支持容量管理
- 定义预约状态枚举和状态流转规则
- 绘制 ER 图展示实体关系
- 确保数据模型与现有 Patient 和 Doctor 模型保持一致

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001 门诊时间管理
- **Feature Requirement**: REQ-006 预约状态流转
- **Related User Story**: Story 1, Story 2, Story 3, Story 4
- **Source Document**: `.asdm/workspace/features/FEAT-001-appointment-booking/feature-prd.md` 第 366-410 行

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 预约实体设计 | 设计 `Appointment` 接口，包含患者、医生、时间、状态等完整字段 |
| FR-002 | 门诊时间表设计 | 设计 `ClinicSchedule` 接口，支持按周配置门诊时间 |
| FR-003 | 时段实体设计 | 设计 `TimeSlot` 接口，包含时间范围和容量信息 |
| FR-004 | 预约状态枚举 | 定义 `AppointmentStatus` 枚举，包含 pending/confirmed/completed/cancelled |
| FR-005 | 医生扩展字段 | 在 `Doctor` 类型中添加门诊相关可选字段 |
| FR-006 | 关系设计 | 设计 Appointment 与 Doctor、Patient 的关系 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | TypeScript 类型 | 所有实体必须使用 TypeScript interface 定义 |
| TR-002 | 现有类型复用 | 复用现有的 `Patient` 和 `Doctor` 接口，避免重复定义 |
| TR-003 | 日期格式规范 | 日期使用 ISO 8601 格式 (YYYY-MM-DD)，时间使用 HH:mm 格式 |
| TR-004 | ID 生成规则 | 预约 ID 使用 `apt-` 前缀，如 `apt-001` |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 模拟数据限制 | 当前为前端演示，数据存储在内存中 |
| CL-002 | 无后端接口 | 暂不设计后端 API 接口 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

采用 **Design First** 方法：
1. 参考现有的 `Question` 问诊模型设计模式
2. 保持与现有数据模型风格一致
3. 参考 Feature PRD 中的数据模型草稿进行完善

### 3.2 Implementation Steps

1. **分析现有数据模型**
   - 读取 `src/types/index.ts` 或 `src/store/index.ts` 中的现有类型定义
   - 理解 Patient 和 Doctor 的完整字段

2. **设计 Appointment 实体**
   - 定义所有必要字段（参考 Feature PRD）
   - 确定字段类型和验证规则

3. **设计 ClinicSchedule 实体**
   - 支持按周配置
   - 支持每日多时段

4. **设计 TimeSlot 实体**
   - 包含开始时间、结束时间、最大容量

5. **绘制 ER 图**
   - 使用 Mermaid 语法绘制实体关系图
   - 展示实体之间的关联关系

6. **验证数据模型完整性**
   - 确保满足所有功能需求
   - 检查字段命名一致性

### 3.3 Technical Considerations

- **ID 命名规范**: 预约 ID 使用 `apt-` 前缀，如 `apt-001`
- **日期时间处理**: 使用 dayjs 库（项目已集成）
- **类型导出**: 所有类型应从 `src/store/index.ts` 统一导出

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`: 现有数据模型参考
- `.asdm/contexts/standard-coding-style.md`: 命名规范参考
- `.asdm/workspace/features/FEAT-001-appointment-booking/feature-prd.md`: 功能需求来源

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: 定义了完整的 Appointment 接口 | 检查接口包含所有必要字段 | 代码审查 |
| **AC-002**: 定义了 ClinicSchedule 接口 | 检查支持按周配置 | 代码审查 |
| **AC-003**: 定义了 TimeSlot 接口 | 检查包含时间范围和容量 | 代码审查 |
| **AC-004**: 定义了 AppointmentStatus 枚举 | 检查包含所有状态值 | 代码审查 |
| **AC-005**: 绘制了 ER 图 | 检查 Mermaid 语法正确 | 渲染验证 |
| **AC-006**: 类型定义可被 TypeScript 编译 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| 日期格式错误 | 应使用 ISO 8601 格式 |
| 状态值非法 | 使用枚举类型避免 |
| 容量为负数 | 添加最小值验证 (≥0) |

### 4.3 Negative Tests

| Negative Test | Expected Behavior |
|---------------|------------------|
| 缺少必填字段 | TypeScript 编译报错 |
| 类型不匹配 | TypeScript 编译报错 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: 无
- **Blocks**: TASK-002, TASK-003

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| 无 | 本任务为设计任务，不依赖外部资源 |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| Feature PRD 已完成 | 提供功能需求和约束 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 现有数据模型参考 | 降低复杂度 |
| 功能需求明确 | 减少返工 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |

### 7.2 Manual Testing

- 代码审查：检查数据模型设计合理性
- ER 图验证：使用 Markdown 预览工具验证 Mermaid 语法

## 8. Implementation Notes

### 8.1 数据模型草稿

参考 Feature PRD 中的设计：

```typescript
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;      // YYYY-MM-DD
  appointmentTime: string;      // "09:00-09:30"
  location: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### 8.2 需要扩展的 Doctor 类型

```typescript
interface Doctor {
  // ... 现有字段
  clinicSchedule?: ClinicSchedule[];
  clinicLocation?: string;
  maxPatientsPerSlot?: number;
}
```

## 9. Risks and Mitigations

### Risk 1: 数据模型与实际需求不匹配

- **Impact**: Medium
- **Mitigation**: 详细阅读 Feature PRD，确保覆盖所有功能需求

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 预约数据模型定义 | TypeScript 接口定义 | `src/store/index.ts` |
| ER 图 | Mermaid 语法实体关系图 | 文档化 |
| 类型扩展说明 | 对现有类型的修改说明 | 文档化 |

**Mandatory Deliverable**: Validation Results
- **Build output**: `npm run build` 成功
- **Type check**: `tsc --noEmit` 无错误

---

## Status Management

| Current Status | 说明 |
|----------------|------|
| DONE | 任务已完成并通过验证 |

### Status Transitions

- `TODO` → `IN PROGRESS`: 开始任务执行
- `IN PROGRESS` → `DONE`: 任务完成并通过验证

---

## Implementation Summary

### 完成内容

1. **定义了完整的 Appointment 接口**
   - 包含患者、医生、时间、状态等所有必要字段
   - 使用 `apt-` 前缀作为 ID 规范

2. **定义了 AppointmentStatus 枚举**
   - PENDING: 待确认
   - CONFIRMED: 已确认
   - COMPLETED: 已完成
   - CANCELLED: 已取消
   - REJECTED: 已拒绝

3. **定义了 ClinicSchedule 接口**
   - 支持按周配置门诊时间
   - 包含 WeeklySchedule 和 DayScheduleConfig

4. **定义了 TimeSlotCapacity 接口**
   - 包含时间范围和容量信息
   - 支持可用/已满/关闭状态

5. **定义了 AvailableSlot 接口**
   - 用于患者选择可预约时段

6. **绘制了 ER 图 (Mermaid)**
   - 添加到 feature-prd.md 的 5.5 节
   - 展示 Doctor、Patient、Appointment、ClinicSchedule 的关系

7. **更新了 Store State 接口**
   - 添加 appointments 数组
   - 添加 clinicSchedules 数组

### 验证结果

- ✅ TypeScript 类型检查通过 (`tsc --noEmit`)
- ✅ 构建成功 (`npm run build`)

### 下一步

- TASK-002: 创建预约相关数据类型和模拟数据
