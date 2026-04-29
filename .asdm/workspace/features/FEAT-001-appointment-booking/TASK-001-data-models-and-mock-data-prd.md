# Task PRD: 排班与预约数据模型及 Mock 数据

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-001
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 定义预约挂号功能所需的全部 TypeScript 数据类型接口，并生成对应的 Mock JSON 数据文件
- **目的**: 为后续所有视图和 Store 方法提供数据基础，是整个功能的根基
- **关联需求**: REQ-001（排班数据）、REQ-002（预约数据）

### 1.2 任务目标
- 定义 `Schedule`（排班时段）类型接口
- 定义 `ScheduleSlot`（具体号源）类型接口
- 定义 `Appointment`（预约记录）类型接口
- 生成 `schedule-list.json` 排班 Mock 数据（5 位医生 × 2 周排期）
- 生成 `appointment-list.json` 预约 Mock 数据（含各状态示例数据）

### 1.3 关联功能需求
- Feature PRD 需求: REQ-001, REQ-002
- 关联用户故事: Story 1, Story 2, Story 3, Story 4

---

## 2. 详细需求

### 2.1 功能需求
- 在 `src/store/index.ts` 中新增 `Schedule`、`ScheduleSlot`、`Appointment` 三个接口定义
- 创建 `src/data/schedule-list.json`: 包含每位活跃医生的排班信息
- 创建 `src/data/appointment-list.json`: 包含不同状态的预约示例数据

### 2.2 技术需求
- 类型定义使用 TypeScript interface，与现有 Doctor/Patient/Question 风格一致
- Mock 数据格式为 JSON 数组
- 日期格式统一使用 ISO 格式 `YYYY-MM-DD`
- 时间格式使用 24 小时制 `HH:mm`

### 2.3 约束与限制
- 不修改任何现有接口或数据文件
- 排班数据覆盖未来 14 天，每位活跃医生每天至少 1 个时段
- 每个时段的 totalCapacity 范围: 10~30

---

## 3. 实施方法

### 3.1 推荐方案
在现有 store 文件中追加新接口定义；独立创建两个新的 JSON Mock 数据文件。

### 3.2 实施步骤
1. **定义 ScheduleSlot 接口** — 单个可预约时段的数据结构
2. **定义 Schedule 接口** — 医生某天的排班计划（包含多个 Slot）
3. **定义 Appointment 接口** — 预约记录的完整数据结构
4. **生成 schedule-list.json** — 为 doc001-doc003, doc005（4 位活跃医生）生成 14 天排班
5. **生成 appointment-list.json** — 生成 8~12 条涵盖 PENDING/CONFIRMED/CANCELLED/COMPLETED 状态的预约数据

**验证步骤**: 运行 `npx vue-tsc --noEmit` 确认无类型错误。

### 3.3 技术考量
- 参考现有的 Question 接口的 id 命名规范（如 `q1234567890`）为新接口设计 id 规则
- Appointment 的 id 可用 `apt` + 时间戳
- Schedule 的 id 用医生 id + 日期拼接

### 3.4 项目上下文引用
- `.asdm/contexts/index.md` — 了解项目结构和技术栈
- `src/store/index.ts` — 现有接口定义风格参考
- `src/data/doctor-user-list.json` — 医生数据，用于关联排班

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: `Schedule`, `ScheduleSlot`, `Appointment` 三个接口在 store 中正确定义
  - 验证方式: 检查 `src/store/index.ts` 中存在三个 export interface
  - **验证工具**: `grep -c "export interface" src/store/index.ts` 输出 ≥ 6（原有3个+新增3个）

- **标准 2**: `schedule-list.json` 包含有效的排班数据
  - 验证方式: JSON 格式合法，包含 ≥4 位活跃医生的排班
  - **验证工具**: `python3 -m json.tool src/data/schedule-list.json > /dev/null && echo "valid"`

- **标准 3**: `appointment-list.json` 包含多种状态的预约数据
  - 验证方式: JSON 合法，包含 PENDING / CONFIRMED / CANCELLED / COMPLETED 四种状态
  - **验证工具**: `python3 -m json.tool src/data/appointment-list.json > /dev/null && echo "valid"`

- **标准 4**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 排班中应包含已过时的日期（模拟历史数据场景）
- 号源 remaining = 0 表示已满

### 4.3 负面测试
- 无效日期格式应被 TypeScript 类型系统拒绝

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: 无（起始任务）
- **被阻塞**: TASK-002, TASK-004

### 5.2 外部依赖
- 无

### 5.3 前置条件
- 已了解现有数据模型结构

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 低（AI 约 5 分钟）
- **复杂度**: 低
- **风险**: 低

### 6.2 影响因素
- 数据模型设计需要考虑后续扩展性

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **构建验证**: `npx vue-tsc --noEmit` — TypeScript 类型检查通过
- **JSON 格式校验**: `python3 -m json.tool <file>` — 两个 JSON 文件语法合法
- **退出条件**: 所有命令退出码为 0

---

## 8. 实施备注
- 排班模板建议: 每位医生每周出诊 3 天（周一三五 或 周二四六），每天 2 个时段（上午 08:00-12:00, 下午 14:00-17:00）
- Appointment.status 使用联合类型: `'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'`

---

## 9. 交付物
- `src/store/index.ts` — 新增 3 个 interface 导出
- `src/data/schedule-list.json` — 排班 Mock 数据
- `src/data/appointment-list.json` — 预约 Mock 数据

---
