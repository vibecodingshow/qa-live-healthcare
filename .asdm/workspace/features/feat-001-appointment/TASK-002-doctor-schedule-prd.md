# Task PRD: 扩展Doctor实体添加排班管理功能

**Feature ID**: feat-001-appointment
**Feature Name**: 预约挂号功能
**Task ID**: task-002-doctor-schedule
**Created Date**: 2026-04-21
**Status**: TODO
**Language**: 简体中文

## 1. Task Overview

### 1.1 Task Summary

扩展现有的Doctor实体，添加医生排班管理相关功能，包括排班数据存储、Schedule实体与Doctor的关联、排班数据JSON文件等。这是预约挂号功能的关键基础，支持医生设置和管理门诊时间。

### 1.2 Task Objectives

**目标1**: 扩展Doctor实体添加排班相关字段
**目标2**: 创建医生排班数据JSON文件
**目标3**: 实现Schedule与Doctor的关联关系
**目标4**: 提供排班数据的基础操作方法
**目标5**: 确保与现有系统集成良好

### 1.3 Related Feature Requirements

- Feature requirement: REQ-002 (医生排班管理)
- Related user story: Story 2 (医生排班管理)
- Dependencies: TASK-001 (Appointment数据模型)

## 2. Detailed Requirements

### 2.1 Functional Requirements

**FR-001**: Doctor实体扩展
- 添加可选的schedules字段引用排班列表
- 或创建独立的Schedule实体并通过doctorId关联

**FR-002**: Schedule实体实现
- 排班ID（唯一标识）
- 医生ID（外键关联Doctor）
- 工作日期
- 开始时间
- 结束时间
- 是否可用
- 最大预约数
- 当前预约数

**FR-003**: 排班数据存储
- 创建 `src/data/schedule-list.json` 文件
- 包含示例排班数据
- 支持后续扩展

**FR-004**: 排班数据操作
- 获取医生的排班列表
- 获取特定日期的排班
- 更新排班状态

### 2.2 Technical Requirements

**TR-001**: 数据一致性
- Schedule的doctorId必须引用存在的Doctor
- 日期和时间格式统一

**TR-002**: Store扩展
- 在现有Pinia Store中添加排班相关状态
- 添加schedule相关的方法

**TR-003**: 向后兼容
- 不影响现有的Doctor实体使用
- 扩展字段为可选

### 2.3 Constraints and Limitations

- 不能修改现有Doctor的JSON数据文件
- 必须兼容现有的认证和登录逻辑
- 排班功能应不影响医生咨询功能

## 3. Implementation Approach

### 3.1 Recommended Methodology

**步骤1**: 读取现有Doctor实体定义
- 查看 `src/types/` 中的Doctor接口
- 查看 `src/data/doctor-user-list.json` 数据

**步骤2**: 设计扩展方案
- 选择方案A：在Doctor中添加schedules字段
- 选择方案B：创建独立的Schedule实体（推荐）

**步骤3**: 创建Schedule实体文件
- `src/types/schedule.ts` 或在 `src/types/appointment.ts` 中定义

**步骤4**: 创建排班数据JSON
- `src/data/schedule-list.json`
- 包含3-5个医生的示例排班数据

**步骤5**: 扩展Store
- 在 `src/store/index.ts` 中添加schedule状态
- 添加schedule相关方法

**验证步骤**: 运行TypeScript编译和构建
- 命令：`npm run build` 或 `vue-tsc --noEmit`
- 预期：编译成功，无错误

### 3.2 Implementation Steps

1. 阅读现有Doctor实体和数据文件
2. 设计Schedule实体结构
3. 创建Schedule类型定义
4. 创建schedule-list.json示例数据
5. 扩展Store添加schedule状态和方法
6. 验证类型安全
7. 更新相关文档

### 3.3 Technical Considerations

- Schedule与Doctor为一对多关系
- 一个医生可以有多个排班（不同日期）
- 排班状态影响预约可用性

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`: 现有数据模型参考
- `.asdm/contexts/architecture.md`: Store架构设计
- `.asdm/contexts/standard-coding-style.md`: 代码规范
- 现有 `src/store/index.ts`: Store实现参考

## 4. Acceptance Criteria

### 4.1 Primary Criteria

**AC-001**: Schedule实体定义完整
- 验收标准：包含所有必要字段（id, doctorId, date, startTime, endTime, isAvailable, maxAppointments, currentAppointments）
- **验证工具**: `tsc --noEmit` - TypeScript类型检查

**AC-002**: 排班数据JSON文件创建
- 验收标准：`src/data/schedule-list.json` 包含有效的JSON数据和示例排班
- **验证工具**: `cat src/data/schedule-list.json | jq .` - JSON格式验证

**AC-003**: Store扩展完成
- 验收标准：Store包含schedule状态和相关方法
- **验证工具**: `grep -A 20 "schedule" src/store/index.ts`

**AC-004**: 与Doctor关联正确
- 验收标准：Schedule的doctorId可正确关联到Doctor
- **验证工具**: TypeScript编译检查

**AC-005**: 不影响现有功能
- 验收标准：现有Doctor登录和咨询功能正常工作
- **验证工具**: `npm run build` - 编译成功

### 4.2 Edge Cases

**EC-001**: 医生无排班数据
- 场景：医生尚未设置排班
- 预期：返回空数组，不报错

**EC-002**: 历史排班数据
- 场景：查询过去的排班
- 预期：正常返回，可标记为不可用

**EC-003**: 超出最大预约数
- 场景：当前预约数等于最大预约数
- 预期：排班状态变为不可用

### 4.3 Negative Tests

**NT-001**: 无效的doctorId
- 验证：TypeScript类型检查应捕获
- 工具：`tsc --noEmit`

**NT-002**: 格式错误的时间
- 验证：JSON验证应捕获
- 工具：`jq . src/data/schedule-list.json`

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001 (Appointment数据模型)
- **Blocks**: TASK-004 (医生排班管理界面)

### 5.2 External Dependencies

- Vue 3: 前端框架
- Pinia: 状态管理
- TypeScript: 类型系统

### 5.3 Prerequisites

- TASK-001已完成并通过验证
- 了解现有Store结构
- 熟悉JSON数据存储方式

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 复用现有的数据存储模式
- Schedule实体相对简单
- 主要是数据模型扩展

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

**Build validation**:
- 命令: `npm run build`
- 预期: 编译成功，无类型错误
- 退出码: 0

**Type checking**:
- 命令: `vue-tsc --noEmit`
- 预期: 无类型错误
- 退出码: 0

### 7.2 Unit Testing

- 可选：添加schedule相关的方法测试
- 验证方法：`npm test` (如果有测试配置)

### 7.3 Integration Testing

- 验证Schedule与Doctor的关联
- 验证Store方法正常工作

### 7.4 Manual Testing

- 检查排班数据JSON格式
- 确认Store方法签名正确

## 8. Implementation Notes

### Schedule实体设计

```typescript
interface Schedule {
  id: string;
  doctorId: string;
  date: string;                    // YYYY-MM-DD
  startTime: string;               // HH:mm
  endTime: string;                // HH:mm
  isAvailable: boolean;
  maxAppointments: number;
  currentAppointments: number;
}
```

### 示例JSON数据

```json
{
  "schedules": [
    {
      "id": "sched001",
      "doctorId": "doc001",
      "date": "2026-04-22",
      "startTime": "09:00",
      "endTime": "12:00",
      "isAvailable": true,
      "maxAppointments": 10,
      "currentAppointments": 3
    }
  ]
}
```

## 9. Risks and Mitigations

### Risk 1：与现有数据冲突

- **描述**: 新的schedule字段可能与现有数据结构冲突
- **影响**: Low
- **缓解**: 使用独立的Schedule实体，避免修改Doctor

### Risk 2：Store扩展影响性能

- **描述**: 添加新状态可能影响Store性能
- **影响**: Low
- **缓解**: 使用计算属性优化查询

## 10. Deliverables

**交付物清单**:

1. **src/types/schedule.ts**: Schedule类型定义
2. **src/data/schedule-list.json**: 排班示例数据
3. **更新的Store**: `src/store/index.ts` 包含schedule状态和方法
4. **更新的文档**: `.asdm/contexts/data-models.md` 更新

**Mandatory Deliverable**: Validation Results
- **Build output**: 编译成功日志
- **Test results**: 测试结果（如果有）
- **Quality checks**: 类型检查通过
- **Validation log**: `tsc --noEmit` 执行结果