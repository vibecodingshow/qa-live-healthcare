# Task PRD: 预约取消功能

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-007
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 在患者预约列表页面启用取消按钮，实现带二次确认的预约取消流程
- **目的**: 完成 User Story 3 中"支持取消预约"的剩余需求
- **关联需求**: REQ-006（预约取消功能）

### 1.2 任务目标
- 将 MyAppointments.vue 中的取消按钮从 disabled 改为可用
- 点击取消弹出二次确认对话框（`<a-popconfirm>` 或 `<a-modal>`）
- 确认后调用 `store.cancelAppointment(appointmentId)`
- 取消成功后刷新列表（reactive 自动响应）
- 非 PENDING 状态的预约隐藏或保持 disabled 取消按钮

### 1.3 关联功能需求
- Feature PRD 需求: REQ-006
- 关联用户故事: Story 3

---

## 2. 详细需求

### 2.1 功能需求
- **取消按钮**: 操作列的"取消"按钮对 PENDING 状态可用，其他状态隐藏
- **二次确认**: 使用 `<a-popconfirm title="确定要取消该预约吗？取消后将释放号源。">` 包裹按钮
- **取消成功反馈**: 使用 `message.success("预约已取消")` 提示
- **取消失败反馈**: 使用 `message.error("取消失败，请重试")` 提示
- **按钮 loading 状态**: 取消请求处理中按钮显示 loading

### 2.2 技术需求
- 修改 `src/views/MyAppointments.vue`（在 TASK-006 基础上增量改动）
- 使用 Ant Design Vue: a-popconfirm（或 a-modal）, message
- 调用 `store.cancelAppointment()`
- 异步操作使用 async/await

### 2.3 约束与限制
- 只允许取消 PENDING 状态的预约
- 不引入额外的 npm 依赖

---

## 3. 实施方法

### 3.1 推荐方案
在 MyAppointments.vue 的操作列中修改取消按钮的逻辑: 条件渲染 + popconfirm + store 调用。

### 3.2 实施步骤
1. 读取当前 MyAppointments.vue 内容（TASK-006 产物）
2. 修改操作列的自定义渲染:
   - PENDING 状态 → 显示可点击的取消按钮（包裹 a-popconfirm）
   - 其他状态 → 不显示取消按钮
3. 实现 async handleCancel 函数
4. 加入 loading 状态管理
5. 加入成功/失败消息提示
6. TypeScript 检查和手动验证取消流程

**验证步骤**: `npx vue-tsc --noEmit` + `npm run dev` 手动执行取消操作。

### 3.3 技术考量
- a-popconfirm 的 `@confirm` 事件绑定 async handler
- cancelAppointment 返回 boolean，据此决定消息类型
- reactive 数据会自动驱动表格刷新，无需手动 reload

### 3.4 项目上下文引用
- `src/views/MyAppointments.vue` — 唯一修改文件
- `src/store/index.ts` — cancelAppointment 方法

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: PENDING 状态的预约显示可用取消按钮
  - 验证方式: 列表中待确认的行有"取消"按钮
  - **验证工具**: 浏览器查看

- **标准 2**: 点击取消弹出二次确认
  - 验证方式: 点击后出现确认气泡
  - **验证工具**: 浏览器交互测试

- **标准 3**: 确认后调用 store.cancelAppointment 并更新状态
  - 验证方式: 确认后该行状态变为 CANCELLED
  - **验证工具**: 浏览器交互测试

- **标准 4**: 非 PENDING 状态不显示取消按钮
  - 验证方式: 已确认/已完成/已取消的行无取消按钮
  - **验证工具**: 浏览器查看

- **标准 5**: 成功/失败消息提示正确
  - 验证方式: 观察页面右上角 message
  - **验证工具**: 浏览器查看

- **标准 6**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 连续快速多次点击取消 → popconfirm 天然防抖
- 取消过程中网络延迟 → loading 状态防止重复

### 4.3 负面测试
- 尝试取消非 PENDING 状态（如果绕过前端校验）→ store 层应返回 false

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: TASK-006（患者预约列表页面）
- **被阻塞**: 无

### 5.2 外部依赖
- Ant Design Vue 4.x

### 5.3 前置条件
- TASK-006 已完成

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 低（AI 约 5 分钟）
- **复杂度**: 低
- **风险**: 低

### 6.2 影响因素
- 基于 TASK-006 的代码做增量修改，工作量较小

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — 编译无错误
- **退出条件**: 退出码为 0

### 7.2 手动验证
- [ ] PENDING 行显示取消按钮
- [ ] 点取消 → 出现确认弹窗
- [ ] 确认 → 状态变为 CANCELLED + 成功提示
- [ ] 非 PENDING 行无取消按钮
- [ ] 取消中按钮 loading

---

## 8. 实施备注
- popconfirm 的 okText 设为"确定取消"，cancelText 设为"想想再说"
- 取消成功后可考虑显示一条温馨提示:"如需重新预约，请前往预约挂号页面"

---

## 9. 交付物
- `src/views/MyAppointments.vue` — 增量更新（启用取消功能）

---
