# Task PRD: Store 层预约相关方法扩展

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-002
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 在 `src/store/index.ts` 中添加预约挂号相关的状态字段和操作方法
- **目的**: 为所有预约相关页面提供统一的数据访问层，遵循项目现有 reactive store 架构
- **关联需求**: REQ-008（Store 层方法扩展）

### 1.2 任务目标
- State 中新增 `schedules` 和 `appointments` 响应式数组
- 实现排班查询方法
- 实现预约 CRUD 方法（创建、查询、取消、确认）
- 实现号源扣减逻辑

### 1.3 关联功能需求
- Feature PRD 需求: REQ-008
- 关联用户故事: 全部（Story 1-4 均依赖 Store 层方法）

---

## 2. 详细需求

### 2.1 功能需求
- 新增 state 字段: `schedules: Schedule[]`, `appointments: Appointment[]`
- 从对应的 JSON 文件初始化数据（import 方式，与 doctors/questions 一致）
- 新增以下 store 方法:

| 方法名 | 功能 | 参数 | 返回值 |
|--------|------|------|--------|
| `getSchedulesByDoctor(doctorId)` | 获取医生排班列表 | doctorId: string | Schedule[] |
| `getScheduleSlots(date)` | 获取指定日期的所有可用时段 | date: string | ScheduleSlot[] |
| `createAppointment(data)` | 创建新预约（含号源扣减） | appointment data | Appointment |
| `getAppointmentsByPatient(patientId)` | 获取患者预约列表 | patientId: string | Appointment[] |
| `getAppointmentsByDoctor(doctorId)` | 获取医生预约列表 | doctorId: string | Appointment[] |
| `cancelAppointment(appointmentId)` | 取消预约（恢复号源） | appointmentId: string | boolean |
| `confirmAppointment(appointmentId)` | 确认预约 | appointmentId: string | boolean |
| `completeAppointment(appointmentId)` | 标记完成 | appointmentId: string | boolean |

### 2.2 技术需求
- 方法风格与现有 store 方法完全一致（同步函数，直接操作 reactive state）
- `createAppointment` 需同时: 1) 扣减对应 slot 的 remaining; 2) 生成唯一 id; 3) 设置默认 status='PENDING'
- `cancelAppointment` 需同时: 1) 仅允许 PENDING 状态取消; 2) 恢复 slot 的 remaining; 3) 更新 status='CANCELLED'
- id 生成规则与现有一致: `apt${Date.now()}`

### 2.3 约束与限制
- 不删除或修改任何现有方法
- 保持纯函数风格，不引入异步操作
- 所有方法导出在同一个 `store` 对象上

---

## 3. 实施方法

### 3.1 推荐方案
直接在 `src/store/index.ts` 的 `State` 接口和 `store` 对象上进行增量修改。

### 3.2 实施步骤
1. import 新增的两个 JSON 数据文件
2. 在 `State` 接口中添加 schedules 和 appointments 字段
3. 在 `reactive<State>({...})` 初始化对象中加入新字段
4. 在 `store` 对象末尾追加所有新方法
5. 运行 TypeScript 类型检查验证

**验证步骤**: `npx vue-tsc --noEmit` 确保无编译错误。

### 3.3 技术考量
- 参考 `addQuestion()` 和 `answerQuestion()` 的实现模式
- 号源扣减需找到具体的 ScheduleSlot 并递减其 `remaining`
- 取消时需反向操作（递增 remaining）

### 3.4 项目上下文引用
- `src/store/index.ts` — 唯一需要修改的文件
- TASK-001 生成的类型定义和数据文件

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: State 正确包含 schedules 和 appointments 字段
  - 验证方式: 检查 State interface 和 reactive 初始化
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

- **标准 2**: 全部 8 个 store 方法正确实现且可调用
  - 验证方式: grep 确认方法名存在
  - **验证工具**: `grep -E "getSchedulesByDoctor|getScheduleSlots|createAppointment|getAppointmentsByPatient|getAppointmentsByDoctor|cancelAppointment|confirmAppointment|completeAppointment" src/store/index.ts`

- **标准 3**: createAppointment 能自动扣减号源
  - 验证方式: 代码审查逻辑正确性

- **标准 4**: cancelAppointment 能正确处理状态校验和号源恢复
  - 验证方式: 代码审查逻辑正确性

- **标准 5**: TypeScript 编译零错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 取消非 PENDING 状态的预约应返回 false（不做操作）
- 号源为 0 时不应再允许创建预约（前端防护）

### 4.3 负面测试
- 传入不存在的 doctorId/patientId 应返回空数组而非报错

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: TASK-001（需要已定义的类型接口和 Mock 数据文件）
- **被阻塞**: TASK-004, TASK-005, TASK-006, TASK-007, TASK-008

### 5.2 外部依赖
- 无

### 5.3 前置条件
- TASK-001 已完成，schedule-list.json 和 appointment-list.json 已就绪

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 低（AI 约 5 分钟）
- **复杂度**: 低
- **风险**: 低

### 6.2 影响因素
- 需要确保与现有代码完美融合，不影响已有功能

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — TypeScript 编译无错误
- **退出条件**: 退出码为 0

---

## 8. 实施备注
- 方法排列顺序: 先查询类 → 再写操作类 → 最后状态变更类
- 每个 public 方法上方加一行简短注释说明用途

---

## 9. 交付物
- `src/store/index.ts` — 增量更新（新增 state 字段 + 8 个方法）

---
