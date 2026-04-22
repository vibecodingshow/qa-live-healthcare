# Task PRD: 设计和实现Appointment数据模型

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-001-appointment-data-model
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

设计和实现预约挂号功能的核心数据模型Appointment，包括预约记录实体定义、数据结构、状态机和业务规则。该数据模型是整个预约挂号功能的基础，将被其他任务依赖和使用。

### 1.2 Task Objectives

**目标1**: 定义完整的Appointment接口，包含所有必要字段
**目标2**: 设计预约状态机和状态转换规则
**目标3**: 建立Appointment与其他实体（Doctor、Patient）的关系
**目标4**: 定义预约相关的业务规则和验证约束
**目标5**: 在现有数据模型文档中添加Appointment实体

### 1.3 Related Feature Requirements

- Feature requirement: REQ-001 (预约管理模块)
- Related user story: Story 1 (患者预约门诊)
- Dependencies: 无

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: 定义Appointment接口
- 预约ID（唯一标识）
- 患者ID（外键关联）
- 医生ID（外键关联）
- 预约日期（YYYY-MM-DD格式）
- 预约时间段（开始时间和结束时间）
- 预约状态（待确认、已确认、已完成、已取消）
- 创建时间
- 更新时间
- 备注信息

**FR-002**: 定义Schedule接口（医生排班）
- 排班ID（唯一标识）
- 医生ID（外键关联）
- 工作日期
- 开始时间
- 结束时间
- 是否可用
- 最大预约数

**FR-003**: 定义TimeSlot接口（时间段）
- 时间段ID
- 排班ID
- 开始时间
- 结束时间
- 状态（可用、已预约、不可用）

### 2.2 Technical Requirements

**TR-001**: TypeScript类型定义
- 所有接口必须使用TypeScript interface定义
- 使用可选字段处理可选属性
- 使用枚举类型定义状态值

**TR-002**: 数据验证规则
- 预约日期不能早于当前日期
- 时间段必须有效（开始时间 < 结束时间）
- 患者和医生ID必须引用存在的实体

**TR-003**: 状态机设计
- 状态：pending（待确认）、confirmed（已确认）、completed（已完成）、cancelled（已取消）
- 状态转换规则明确

### 2.3 Constraints and Limitations

- 必须兼容现有的数据存储方式（JSON文件）
- 不能修改现有的Doctor和Patient实体结构
- 保持与现有Question实体的命名一致性

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 分析现有数据模型结构
- 阅读 `.asdm/contexts/data-models.md`
- 了解现有的Doctor和Patient实体结构
- 保持命名和风格一致性

**步骤2**: 设计Appointment实体
- 参考Question实体的定义方式
- 包含所有必要的业务字段
- 设计合理的数据结构

**步骤3**: 设计Schedule和TimeSlot辅助实体
- 支持医生排班管理
- 支持时间段管理
- 便于后续任务使用

**步骤4**: 定义状态机和业务规则
- 明确状态转换条件
- 定义验证规则
- 考虑边界情况

**步骤5**: 更新数据模型文档
- 在 `.asdm/contexts/data-models.md` 中添加新实体
- 保持文档格式一致

**验证步骤**: 确保TypeScript编译无错误
- 命令：`npm run build` 或 `vue-tsc --noEmit`
- 预期：编译成功，无类型错误

### 3.2 Implementation Steps

1. 阅读现有数据模型文档
2. 设计Appointment接口结构
3. 设计Schedule接口结构
4. 设计TimeSlot接口结构
5. 定义状态枚举和状态机
6. 创建示例数据JSON文件
7. 更新数据模型文档
8. 验证TypeScript类型定义

### 3.3 Technical Considerations

- 使用TypeScript `interface` 而非 `type` 定义实体
- 字段命名遵循camelCase规范
- 日期时间使用ISO 8601格式字符串
- 状态值使用字符串枚举

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`: 数据模型规范和现有实体示例
- `.asdm/contexts/standard-coding-style.md`: TypeScript编码规范
- `.asdm/contexts/architecture.md`: 整体架构设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

**AC-001**: Appointment接口定义完整
- 验收标准：包含所有必要字段（id, patientId, doctorId, date, timeSlot, status, createTime, updateTime, notes）
- 验证方法：检查接口定义是否包含所有字段
- **验证工具**: `tsc --noEmit src/types/appointment.ts` - TypeScript类型检查

**AC-002**: Schedule接口支持排班管理
- 验收标准：包含医生、排班日期、时间范围、可用状态等字段
- 验证方法：检查Schedule接口是否满足排班管理需求
- **验证工具**: `tsc --noEmit src/types/schedule.ts` - TypeScript类型检查

**AC-003**: 状态机设计合理
- 验收标准：支持pending → confirmed → completed和cancelled的转换
- 验证方法：检查状态机定义是否符合业务逻辑
- **验证工具**: 代码审查，确认状态转换逻辑正确

**AC-004**: 数据验证规则明确
- 验收标准：定义了日期验证、时间验证、ID引用验证等规则
- 验证方法：检查验证规则是否完整
- **验证工具**: `tsc --noEmit` - 确保验证逻辑无类型错误

**AC-005**: 数据模型文档已更新
- 验收标准：`.asdm/contexts/data-models.md` 包含Appointment相关实体
- 验证方法：读取文档确认新实体已添加
- **验证工具**: `grep -A 50 "Appointment" .asdm/contexts/data-models.md`

### 4.2 Edge Cases

**EC-001**: 预约历史日期
- 场景：尝试创建过去日期的预约
- 预期：验证失败，提示"预约日期不能早于当前日期"

**EC-002**: 无效时间段
- 场景：开始时间晚于结束时间
- 预期：验证失败，提示"时间段无效"

**EC-003**: 空的必填字段
- 场景：必填字段为空
- 预期：TypeScript编译时类型错误

### 4.3 Negative Tests

**NT-001**: 缺少必填字段
- 验证：TypeScript编译器应报错
- 工具：`tsc --noEmit`

**NT-002**: 无效的ID引用
- 验证：ID类型不匹配时应报错
- 工具：`tsc --noEmit`

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: 无
- **Blocks**: TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008

### 5.2 External Dependencies

- Ant Design Vue: 提供UI组件基础
- Vue 3: 前端框架
- TypeScript: 类型系统
- Day.js: 日期处理（如果需要）

### 5.3 Prerequisites

- 了解现有的Doctor和Patient实体结构
- 熟悉TypeScript接口定义语法
- 了解JSON数据存储方式

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 现有数据模型作为参考，可以复用结构
- TypeScript类型定义相对简单
- 文档更新工作量较小

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

**Build validation**:
- 命令: `npm run build` 或 `vue-tsc --noEmit`
- 预期: 编译成功，无类型错误
- 退出码: 0

**Code quality**:
- 命令: `npm run lint` (如果项目配置了lint)
- 预期: 无lint错误
- 退出码: 0

### 7.2 Unit Testing

- 不需要单元测试（纯数据模型定义）
- 主要依赖TypeScript类型检查

### 7.3 Integration Testing

- 不需要集成测试（数据模型是基础层）

### 7.4 Manual Testing

- 代码审查确认数据模型设计合理
- 确认与现有实体风格一致

## 8. Implementation Notes

### 技术实现要点

```typescript
// Appointment接口示例
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  status: AppointmentStatus;
  createTime: string;
  updateTime: string;
  notes?: string;
}

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
```

### 文件位置建议

- 类型定义: `src/types/appointment.ts`
- 或在现有类型文件中添加: `src/types/index.ts`

## 9. Risks and Mitigations

### Risk 1：与现有系统不兼容

- **描述**: 新实体可能与现有系统存在命名冲突或结构不一致
- **影响**: Medium
- **缓解**: 仔细阅读现有数据模型，保持命名和结构一致

### Risk 2：缺少未来功能扩展性

- **描述**: 数据模型可能无法支持未来的扩展需求
- **影响**: Low
- **缓解**: 设计时考虑扩展性，添加可选字段

## 10. Deliverables

**交付物清单**:

1. **src/types/appointment.ts**: Appointment接口定义文件
2. **src/types/schedule.ts**: Schedule接口定义文件
3. **src/types/timeslot.ts**: TimeSlot接口定义文件
4. **src/data/appointment-list.json**: 预约数据示例文件
5. **src/data/schedule-list.json**: 排班数据示例文件
6. **更新的文档**: `.asdm/contexts/data-models.md` 包含新实体

**Mandatory Deliverable**: Validation Results
- **Build output**: TypeScript编译成功日志
- **Test results**: 不适用（纯数据模型）
- **Quality checks**: Lint检查通过（如果配置）
- **Validation log**: 包含 `tsc --noEmit` 执行结果