# Task PRD: 数据模型与静态数据文件

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-001
**Created Date**: 2026-04-22
**Status**: DONE
**Language**: zh

## 1. Task Overview

### 1.1 Task Summary

- **任务描述**：定义 `Appointment` 和 `AppointmentSlot` 两个 TypeScript 接口，并创建对应的 JSON 静态数据文件（`appointment-slots.json` 和 `appointment-list.json`），为预约挂号功能提供数据基础。
- **任务目的**：建立预约挂号的数据模型层，确保数据结构与 Feature PRD 中定义的 ER 关系和状态机一致，为后续 Store 层扩展和页面视图实现提供类型安全的数据基础。
- **关联需求**：满足 Feature PRD REQ-001（预约数据模型）和 REQ-005（排班数据与 Store 方法）的数据定义部分。

### 1.2 Task Objectives

- 目标 1：在 `src/store/index.ts` 中新增 `Appointment` 和 `AppointmentSlot` 两个 TypeScript 接口定义，字段与 Feature PRD 数据模型设计完全一致
- 目标 2：创建 `src/data/appointment-slots.json`，为所有在线医生（`isActive: true`）生成未来 7 天的排班时段数据
- 目标 3：创建 `src/data/appointment-list.json`，生成 2-3 条示例预约记录，覆盖不同状态（pending、confirmed、cancelled）

### 1.3 Related Feature Requirements

- **Feature Requirement**: REQ-001 预约数据模型
- **Related User Story**: Story 1（患者浏览排班并预约）、Story 2（医生管理预约）、Story 3（患者查看预约）

## 2. Detailed Requirements

### 2.1 Functional Requirements

- **FR-1**：`Appointment` 接口包含以下字段：`id`(string)、`patientId`(string)、`patientName`(string)、`doctorId`(string)、`doctorName`(string)、`date`(string, YYYY-MM-DD)、`timeSlot`(string, HH:mm-HH:mm)、`status`('pending'|'confirmed'|'cancelled')、`cancelReason`(string)、`createdAt`(string, ISO 8601)、`updatedAt`(string, ISO 8601)
- **FR-2**：`AppointmentSlot` 接口包含以下字段：`id`(string)、`doctorId`(string)、`date`(string, YYYY-MM-DD)、`timeSlot`(string, HH:mm-HH:mm)、`period`('morning'|'afternoon')、`status`('available'|'booked'|'cancelled')
- **FR-3**：排班数据为所有在线医生（doc001、doc002、doc003、doc005）生成未来 7 天的时段，上午 8 个时段（08:00-12:00，每 30 分钟），下午 6 个时段（14:00-17:00，每 30 分钟），初始状态全部为 `available`
- **FR-4**：示例预约数据至少包含 2 条记录，覆盖 `pending` 和 `confirmed` 状态，`patientId` 和 `doctorId` 引用现有 `patient-user.json` 和 `doctor-user-list.json` 中的 ID

### 2.2 Technical Requirements

- **TR-1**：接口定义写在 `src/store/index.ts` 的 `Question` 接口之后、`State` 接口之前，使用 `export` 关键字导出
- **TR-2**：JSON 数据文件放在 `src/data/` 目录下，文件命名使用 kebab-case
- **TR-3**：排班时段 `id` 格式为 `slot_{doctorId}_{date}_{timeSlot}`，其中 timeSlot 中 `:` 替换为空字符串（如 `slot_doc001_2026-04-23_0800-0830`）
- **TR-4**：示例预约 `id` 格式为 `apt001`、`apt002`，与现有 `q001` 风格保持一致

### 2.3 Constraints and Limitations

- 不修改现有的 `Doctor`、`Patient`、`Question` 接口定义
- 不修改现有的 State 结构和 Store 方法
- JSON 数据使用静态编写，不使用脚本生成
- 排班日期基于当前日期（代码编写时）动态计算未来 7 天

### 2.4 安全要求 (Security Requirements)

- **SEC-1**：示例预约数据中的 `patientName` 和 `doctorName` 必须使用虚构姓名，不得包含任何真实个人身份信息（PII）
- **SEC-2**：JSON 数据文件中不应包含任何敏感信息（如真实手机号、身份证号、住址等）
- **SEC-3**：接口字段定义中，所有用户输入类字段（如 `patientName`）应考虑后续 XSS 防护——接口本身不处理转义，但需预留注释说明渲染层需进行 HTML 转义
- **SEC-4**：`cancelReason` 字段应定义为字符串类型，最大长度应在实现时由 Store 层或 UI 层限制（建议 200 字符），防止存储异常数据

### 2.5 合规要求 (Compliance Requirements)

- **CMP-1**：示例数据遵循数据最小化原则——仅包含业务必需字段，不收集额外个人信息
- **CMP-2**：`Appointment` 接口包含 `createdAt` 和 `updatedAt` 时间戳字段，满足操作审计追溯要求
- **CMP-3**：预约状态使用枚举联合类型（`'pending' | 'confirmed' | 'cancelled'`），确保状态流转的合规性和可追溯性
- **CMP-4**：`cancelReason` 字段为预约取消提供合规的取消原因记录，满足医疗预约场景下的操作留痕要求

## 3. Implementation Approach

### 3.1 Recommended Methodology

- 在现有 `src/store/index.ts` 中追加接口定义，保持与现有接口相同的缩进（2 空格）和注释风格
- JSON 数据文件遵循现有 `doctor-user-list.json` 和 `patient-user.json` 的格式规范（缩进 2 空格、数组格式）

### 3.2 Implementation Steps

**步骤 1：定义 Appointment 接口**

在 `src/store/index.ts` 中 `Question` 接口（约第 38 行）之后、`State` 接口之前，添加以下代码：

```typescript
export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string        // YYYY-MM-DD
  timeSlot: string    // HH:mm-HH:mm
  status: 'pending' | 'confirmed' | 'cancelled'
  cancelReason: string
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}

export interface AppointmentSlot {
  id: string
  doctorId: string
  date: string        // YYYY-MM-DD
  timeSlot: string    // HH:mm-HH:mm
  period: 'morning' | 'afternoon'
  status: 'available' | 'booked'
}
```

**步骤 2：创建排班数据文件**

创建 `src/data/appointment-slots.json`，内容为 JSON 数组。每条记录结构如下：

```json
{
  "id": "slot_doc001_2026-04-23_0800-0830",
  "doctorId": "doc001",
  "date": "2026-04-23",
  "timeSlot": "08:00-08:30",
  "period": "morning",
  "status": "available"
}
```

生成规则：
- 遍历在线医生列表：doc001、doc002、doc003、doc005（排除 doc004）
- 从明天起计算 7 天日期（使用 `dayjs().add(1, 'day')` 到 `dayjs().add(7, 'day')`）
- 每天上午 8 个时段：08:00-08:30, 08:30-09:00, ..., 11:30-12:00（period="morning"）
- 每天下午 6 个时段：14:00-14:30, 14:30-15:00, ..., 16:30-17:00（period="afternoon"）
- 所有时段初始 `status` 为 `"available"`
- 预计总条数：4 × 7 × 14 = 392

**步骤 3：创建示例预约数据文件**

创建 `src/data/appointment-list.json`，包含 3 条示例记录（覆盖 pending、confirmed、cancelled 三种状态），结构与 Appointment 接口完全一致：

```json
[
  {
    "id": "apt001",
    "patientId": "pat001",
    "patientName": "张三",
    "doctorId": "doc001",
    "doctorName": "张伟",
    "date": "2026-04-23",
    "timeSlot": "08:00-08:30",
    "status": "pending",
    "cancelReason": "",
    "createdAt": "2026-04-22T10:00:00",
    "updatedAt": "2026-04-22T10:00:00"
  },
  {
    "id": "apt002",
    "patientId": "pat002",
    "patientName": "李四",
    "doctorId": "doc002",
    "doctorName": "李娜",
    "date": "2026-04-24",
    "timeSlot": "14:00-14:30",
    "status": "confirmed",
    "cancelReason": "",
    "createdAt": "2026-04-21T09:00:00",
    "updatedAt": "2026-04-22T08:00:00"
  },
  {
    "id": "apt003",
    "patientId": "pat001",
    "patientName": "张三",
    "doctorId": "doc003",
    "doctorName": "王强",
    "date": "2026-04-22",
    "timeSlot": "09:00-09:30",
    "status": "cancelled",
    "cancelReason": "患者临时有事",
    "createdAt": "2026-04-20T15:00:00",
    "updatedAt": "2026-04-21T10:00:00"
  }
]
```

> 注意：`patientId` 和 `doctorId` 必须引用 `patient-user.json` 和 `doctor-user-list.json` 中已有的 ID。

**步骤 4：验证**

- 运行 `npm run build` 确认 TypeScript 编译无错误
- 运行 `node -e "JSON.parse(require('fs').readFileSync('src/data/appointment-slots.json','utf8')); console.log('slots OK')"` 验证 JSON 格式
- 运行 `node -e "JSON.parse(require('fs').readFileSync('src/data/appointment-list.json','utf8')); console.log('list OK')"` 验证 JSON 格式

### 3.3 Technical Considerations

- 接口定义使用联合类型字面量（如 `'pending' | 'confirmed' | 'cancelled'`），与现有 `Question.status` 的 `'pending' | 'answered'` 风格一致
- JSON 数据中的 `id` 使用双引号包裹，日期格式统一为 `YYYY-MM-DD`
- 排班数据应排除当日已过的时间段（仅排未来 7 天）

### 3.4 Reference to Project Context

- `.asdm/contexts/data-models.md`：数据模型规范
- `.asdm/contexts/standard-coding-style.md`：编码风格指南
- `.asdm/contexts/standard-project-structure.md`：项目结构规范

## 4. Acceptance Criteria

### 4.1 Primary Criteria

- **AC-1**：`src/store/index.ts` 中导出了 `Appointment` 和 `AppointmentSlot` 两个接口，字段定义与 Feature PRD 第 5.2 节完全一致
  - Test method：检查接口字段名称、类型、联合类型枚举值
  - **Validation tool**: `npm run build`（TypeScript 编译通过，exit code 0）
- **AC-2**：`src/data/appointment-slots.json` 文件存在，包含所有在线医生（doc001/doc002/doc003/doc005）未来 7 天的排班数据
  - Test method：验证 JSON 格式合法、医生数量正确、每日时段数量正确（上午 8 个 + 下午 6 个 = 14 个）
  - **Validation tool**: `node -e "const d=require('./src/data/appointment-slots.json'); console.log(d.length);"` 验证数据条数
- **AC-3**：`src/data/appointment-list.json` 文件存在，包含 3 条示例预约记录，覆盖 `pending`、`confirmed`、`cancelled` 三种状态
  - Test method：验证 JSON 格式合法、patientId/doctorId 引用正确、三种状态各至少一条
  - **Validation tool**: `node -e "const d=require('./src/data/appointment-list.json'); console.log(d.length);"` 验证数据条数
- **AC-4**：`npm run build` 构建成功，无 TypeScript 错误
  - **Validation tool**: `npm run build`（exit code 0）

### 4.2 Edge Cases

- 排班日期计算时需排除今天的已过时段：如果当天下午时段已过，则从明天开始排班；如果当天上午已过但下午未过，则当天只排下午时段（为简化实现，可直接从明天开始计算 7 天）
- JSON 文件内容不应包含尾逗号

### 4.3 Negative Tests

- 现有的 `Doctor`/`Patient`/`Question` 接口未被修改（diff 检查）
- 现有的 JSON 数据文件未被修改
- `npm run build` 不产生新增的 TypeScript 类型错误

## 5. Dependencies

### 5.1 Task Dependencies

- **Depends on**: NONE（本任务为数据基础任务，无前置依赖）
- **Blocks**: TASK-002（Store 层依赖接口定义和数据文件）、TASK-004（页面组件依赖数据模型）

### 5.2 External Dependencies

- 无新增外部依赖

### 5.3 Prerequisites

- 现有 `src/store/index.ts` 文件可正常访问
- 现有 `src/data/doctor-user-list.json` 中的医生 ID 已确认（doc001-doc005）

## 6. Estimated Effort

### 6.1 Effort Estimate

- **Estimated effort**: 1.5 hours
- **Complexity**: Low
- **Risk**: Low

### 6.2 Effort Factors

- 排班数据量较大（约 392 条记录），需注意 JSON 格式正确性
- 日期计算需准确（未来 7 天）

## 7. Testing Strategy

### 7.1 Automated Validation (Required)

- **Build validation**: `npm run build`（TypeScript 编译 + Vite 构建）
- **Exit criteria**: 所有命令 exit code 0

### 7.2 Data Integrity Testing

- 验证 `appointment-slots.json` 格式合法性：`node -e "JSON.parse(require('fs').readFileSync('src/data/appointment-slots.json','utf8')); console.log('OK')"`
- 验证 `appointment-list.json` 格式合法性：`node -e "JSON.parse(require('fs').readFileSync('src/data/appointment-list.json','utf8')); console.log('OK')"`
- 验证排班数据条数：4 个在线医生 × 7 天 × 14 时段 = 392 条
- 验证示例预约中 `patientId` 和 `doctorId` 引用是否存在于 `patient-user.json` 和 `doctor-user-list.json`

### 7.3 Type Safety Testing

- 在 VS Code 中打开 `src/store/index.ts`，将 JSON 数据赋值给接口类型变量，确认无 TypeScript 类型错误
- 验证 `Appointment` 接口的 `status` 字段不接受除 `'pending' | 'confirmed' | 'cancelled'` 以外的值

### 7.4 Security Verification

- 检查 JSON 数据文件中不包含任何真实个人信息（姓名、手机号、身份证号等）
- 检查示例预约数据中的 `cancelReason` 为空（pending/confirmed 状态）或合理文本

### 7.5 Manual Testing

- 在 VS Code 中打开 `src/store/index.ts`，确认接口定义有正确的 TypeScript 类型提示
- 验证 JSON 文件在编辑器中无语法错误

## 8. Implementation Notes

- 排班数据中 `id` 的格式需与 Feature PRD 保持一致：`slot_doc001_2026-04-23_08:00`（Feature PRD 使用冒号，实际实现中建议将冒号替换为空字符串以避免潜在问题，如 `slot_doc001_2026-04-23_0800-0830`）
- 示例预约数据中的 `createdAt` 和 `updatedAt` 使用相对合理的时间戳（如 2026-04-22T10:00:00）
- 现有医生列表中在线医生为 doc001（张伟）、doc002（李娜）、doc003（王强）、doc005（陈杰），doc004（刘敏）为离线状态，不生成排班

## 9. Risks and Mitigations

### Risk 1

- **Description**: 排班 JSON 数据量大（~392 条），手动编写容易出错
- **Impact**: Low
- **Mitigation**: 严格按照模板格式编写，使用脚本辅助生成数据

### Risk 2

- **Description**: TypeScript 接口定义与后续 Store 方法类型不匹配
- **Impact**: Medium
- **Mitigation**: 严格按照 Feature PRD 定义编写，确保类型与 Store 方法签名一致

## 10. Deliverables

- `src/store/index.ts`：新增 `Appointment` 和 `AppointmentSlot` 接口导出
- `src/data/appointment-slots.json`：排班时段静态数据文件
- `src/data/appointment-list.json`：示例预约数据文件
- **Build output**: `npm run build` 成功，无 TypeScript 错误

---

*此任务 PRD 由 Task Breakdown 工具集生成。*
