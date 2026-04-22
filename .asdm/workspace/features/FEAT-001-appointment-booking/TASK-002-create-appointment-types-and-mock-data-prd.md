# Task PRD: 创建预约相关数据类型和模拟数据

**Feature ID**: FEAT-001
**Feature Name**: 预约挂号
**Task ID**: TASK-002
**Created Date**: 2026-04-21
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

本任务基于 TASK-001 设计的数据模型，在 TypeScript 和 JSON 文件中实现预约相关的类型定义和模拟数据。包括在 `src/store/index.ts` 中添加预约相关类型，创建 `src/data/appointment-list.json` 预约模拟数据，以及扩展现有的医生数据添加门诊时间字段。

### 1.2 Task Objectives

- 在 `src/store/index.ts` 中定义 Appointment、ClinicSchedule、TimeSlot 类型
- 在 `src/store/index.ts` 中定义 AppointmentStatus 枚举
- 扩展 Doctor 类型添加门诊相关可选字段
- 创建 `src/data/appointment-list.json` 模拟数据文件
- 扩展 `src/data/doctor-user-list.json` 添加门诊时间字段
- 验证类型定义和模拟数据的正确性

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001 门诊时间管理
- **Feature Requirement**: REQ-002 预约列表展示
- **Feature Requirement**: REQ-003 预约表单
- **Related Task**: TASK-001 (前置依赖)

## 2. Detailed Requirements

### 2.1 Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-001 | 类型定义 - Appointment | 定义完整的 Appointment 接口 |
| FR-002 | 类型定义 - ClinicSchedule | 定义门诊时间表接口 |
| FR-003 | 类型定义 - TimeSlot | 定义时段接口 |
| FR-004 | 类型定义 - AppointmentStatus | 定义预约状态枚举 |
| FR-005 | 类型扩展 - Doctor | 扩展 Doctor 接口添加门诊字段 |
| FR-006 | 模拟数据 - appointment-list.json | 创建预约列表 JSON 文件 |
| FR-007 | 模拟数据 - 扩展 doctor-user-list.json | 扩展医生数据添加门诊时间 |

### 2.2 Technical Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| TR-001 | 导出所有类型 | 所有类型必须使用 `export` 导出 |
| TR-002 | 遵循命名规范 | 使用 camelCase (变量)、PascalCase (类型) |
| TR-003 | JSON 格式 | JSON 文件必须符合 RFC 8259 标准 |
| TR-004 | 模拟数据量 | 每个 JSON 文件至少包含 3 条记录 |

### 2.3 Constraints and Limitations

| ID | Constraint | Description |
|----|------------|-------------|
| CL-001 | 模拟数据限制 | 仅用于前端演示，不连接后端 |
| CL-002 | 保持向后兼容 | 不修改现有的 Patient 和 Question 类型 |

## 3. Implementation Approach

### 3.1 Recommended Methodology

**增量式实现**：
1. 先添加类型定义
2. 再创建模拟数据
3. 最后验证一致性

### 3.2 Implementation Steps

1. **读取现有类型定义**
   - 读取 `src/store/index.ts` 了解现有结构

2. **添加预约相关类型**
   - 在 `src/store/index.ts` 末尾添加新类型
   - 确保类型定义完整

3. **创建 appointment-list.json**
   - 在 `src/data/` 目录创建
   - 包含不同状态的预约示例

4. **扩展 doctor-user-list.json**
   - 为每个医生添加 clinicSchedule 字段
   - 配置门诊时间表

5. **验证类型一致性**
   - 运行 TypeScript 编译检查
   - 确保 JSON 数据与类型定义匹配

### 3.3 Technical Considerations

- **类型导出位置**: 所有预约类型从 `src/store/index.ts` 导出
- **JSON 数据路径**: `src/data/appointment-list.json`
- **数据加载方式**: 参考现有的 `loadDoctorData()` 和 `loadPatientData()` 方法

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`: 数据模型参考
- `.asdm/contexts/standard-project-structure.md`: 文件组织规范
- `.asdm/workspace/features/FEAT-001-appointment-booking/TASK-001-design-appointment-data-model-prd.md`: 数据模型设计

## 4. Acceptance Criteria

### 4.1 Primary Criteria

| Criterion | Test Method | Validation Tool |
|-----------|-------------|-----------------|
| **AC-001**: Appointment 接口定义完整 | 检查包含所有字段 | 代码审查 |
| **AC-002**: AppointmentStatus 枚举包含 4 种状态 | 检查 pending/confirmed/completed/cancelled | 代码审查 |
| **AC-003**: appointment-list.json 包含至少 3 条记录 | 检查 JSON 文件内容 | JSON 解析 |
| **AC-004**: 医生数据包含门诊时间字段 | 检查 clinicSchedule 字段 | 代码审查 |
| **AC-005**: TypeScript 编译无错误 | 运行 `tsc --noEmit` | **Validation tool**: `npm run build` |
| **AC-006**: JSON 文件格式正确 | JSON.parse() 解析成功 | Node.js 验证 |

### 4.2 Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| JSON 文件缺失 | 应用应能正常启动（可选功能） |
| 字段类型不匹配 | TypeScript 编译报错 |

### 4.3 Negative Tests

| Negative Test | Expected Behavior |
|---------------|------------------|
| 导入不存在的类型 | TypeScript 编译报错 |
| JSON 语法错误 | JSON.parse() 抛出异常 |

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: TASK-001 设计预约数据模型
- **Blocks**: TASK-003, TASK-007

### 5.2 External Dependencies

| Dependency | Description |
|------------|-------------|
| `src/store/index.ts` | 需要修改的文件 |
| `src/data/doctor-user-list.json` | 需要扩展的文件 |

### 5.3 Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| TASK-001 已完成 | 提供数据类型设计 |

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1 小时
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

| Factor | Impact |
|--------|--------|
| 有 TASK-001 数据模型设计 | 降低复杂度 |
| 参考现有类型定义模式 | 提高效率 |

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

| Validation | Command | Success Criteria |
|------------|---------|------------------|
| **类型检查** | `tsc --noEmit` | 无编译错误 |
| **构建验证** | `npm run build` | 构建成功 |
| **JSON 验证** | `node -e "JSON.parse(require('fs').readFileSync('src/data/appointment-list.json'))"` | 无错误 |

### 7.2 Manual Testing

- JSON 文件格式验证
- 类型定义完整性检查

## 8. Implementation Notes

### 8.1 类型定义示例

```typescript
// src/store/index.ts 末尾添加

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface TimeSlot {
  startTime: string;  // "09:00"
  endTime: string;    // "09:30"
  maxPatients: number;
}

export interface ClinicSchedule {
  dayOfWeek: number;  // 0-6 (周日-周六)
  slots: TimeSlot[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;   // YYYY-MM-DD
  appointmentTime: string;   // "09:00-09:30"
  location: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
```

### 8.2 模拟数据结构

```json
// src/data/appointment-list.json
{
  "appointments": [
    {
      "id": "apt-001",
      "patientId": "patient001",
      "patientName": "赵明",
      "doctorId": "doc001",
      "doctorName": "张伟医生",
      "appointmentDate": "2026-04-25",
      "appointmentTime": "09:00-09:30",
      "location": "市第一医院 门诊楼 3楼 心内科",
      "reason": "最近总是感觉胸闷气短",
      "status": "pending",
      "createdAt": "2026-04-21T10:00:00",
      "updatedAt": "2026-04-21T10:00:00"
    }
  ]
}
```

## 9. Risks and Mitigations

### Risk 1: 修改现有文件可能影响现有功能

- **Impact**: Medium
- **Mitigation**: 
  - 仅在文件末尾添加新类型，不修改现有代码
  - 修改 JSON 文件时保留原有数据

## 10. Deliverables

| Deliverable | Description | File Path |
|-------------|-------------|-----------|
| 类型定义 | Appointment、ClinicSchedule、TimeSlot 类型 | `src/store/index.ts` |
| 枚举定义 | AppointmentStatus 枚举 | `src/store/index.ts` |
| 预约模拟数据 | 预约列表 JSON | `src/data/appointment-list.json` |
| 扩展医生数据 | 添加门诊时间的医生数据 | `src/data/doctor-user-list.json` |

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

1. **创建预约模拟数据** `src/data/appointment-list.json`
   - 包含 7 条预约记录
   - 覆盖所有预约状态 (pending, confirmed, completed, cancelled, rejected)
   - 包含不同科室的预约

2. **扩展医生数据** `src/data/doctor-user-list.json`
   - 为每个医生添加 `clinicSchedule` 字段
   - 配置每周的门诊时间
   - 设置每时段可预约人数
   - 配置门诊地点

3. **扩展 Doctor 类型**
   - 添加 `clinicSchedule?: ClinicSchedule` 可选字段

4. **更新 Store 数据加载**
   - 导入 `appointment-list.json`
   - 初始化 `appointments` 状态

### 验证结果

- ✅ TypeScript 类型检查通过
- ✅ 构建成功 (`npm run build`)

### 下一步

- TASK-003: 实现预约 Store 状态管理
