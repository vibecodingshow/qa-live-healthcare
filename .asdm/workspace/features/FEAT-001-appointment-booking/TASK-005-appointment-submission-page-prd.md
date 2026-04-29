# Task PRD: 预约提交页面（含确认流程）

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-005
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 完善 `Appointment.vue` 预约主页面，集成排班日历组件、预约表单、确认弹窗和回执展示的完整流程
- **目的**: 实现 User Story 2（提交预约申请）的完整用户旅程
- **关联需求**: REQ-004（预约提交表单与确认流程）

### 1.2 任务目标
- 将占位的 Appointment.vue 替换为完整的预约页面
- 集成 ScheduleCalendar 组件进行时段选择
- 实现预约确认弹窗（含病情描述输入）
- 提交成功后展示预约回执/凭证
- 处理未登录患者的身份引导

### 1.3 关联功能需求
- Feature PRD 需求: REQ-004
- 关联用户故事: Story 2

---

## 2. 详细需求

### 2.1 功能需求

**页面整体布局（从上到下）:**
1. **医生信息卡片**: 显示目标医生的头像、姓名、职称、科室、擅长领域
2. **排班日历区域**: 嵌入 ScheduleCalendar 组件
3. **病情描述输入框**: 选中年段后激活，最多 200 字
4. **提交预约按钮**: 仅在选中时段 + 已登录时可点击
5. **确认弹窗 (`<a-modal>`)**: 
   - 再次展示医生信息和选定时间
   - 就诊须知（静态文本）
   - 病情描述确认
   - "确认提交" / "取消" 按钮
6. **预约回执区**（提交成功后显示，替换表单区域）:
   - 预约编号、医生、时间、状态(PENDING)
   - "查看我的预约"链接

**URL query 参数处理:**
- `? doctor=xxx` → 自动加载该医生的排班
- 无参数 → 显示医生选择下拉框

**未登录处理:**
- 未检测到 currentPatient 时，显示引导提示"请先完成身份验证"
- 提供"前往验证"链接指向 `/consultation`

### 2.2 技术需求
- 修改 `src/views/Appointment.vue`（替换占位内容）
- 使用 Ant Design Vue 组件: a-card, a-modal, a-form, a-textarea, a-button, a-result, a-descriptions
- 调用 store.createAppointment() 提交数据
- 使用 vue-router 获取 query 参数

### 2.3 约束与限制
- 页面最大宽度 1200px 居中
- 遵循现有渐变主题色和圆角规范
- 病情描述字数实时统计

---

## 3. 实施方法

### 3.1 推荐方案
单页面多状态模式: 用一个 ref `step` 控制页面状态（selecting → confirming → success）。

### 3.2 实施步骤
1. 重构 Appointment.vue，引入必要的 imports（store, router, components）
2. 实现医生信息展示区（从 route.query.doctor 或用户选择获取 doctorId）
3. 嵌入 `<ScheduleCalendar v-model="selectedSlot" :doctorId="..." />`
4. 实现病情描述 textarea（字数计数）
5. 实现提交按钮及点击逻辑 → 打开确认 Modal
6. 实现 `<a-modal>` 确认弹窗内容及"确认提交"逻辑
7. 实现回执展示（`<a-result>` 组件 success 状态）
8. 添加未登录状态的引导 UI
9. 添加响应式样式
10. 运行 TypeScript 检查和开发验证

**验证步骤**: `npx vue-tsc --noEmit` + `npm run dev` 完整流程走查。

### 3.3 技术考量
- step 状态机: `'selecting' | 'confirming' | 'success'`
- selectedSlot 类型为 ScheduleSlot | null
- Modal 确认后调用 `store.createAppointment({ ... })`
- 回执数据来自 createAppointment 的返回值

### 3.4 项目上下文引用
- `src/views/Appointment.vue` — 本任务主要修改文件
- `src/components/ScheduleCalendar.vue` — TASK-004 产物
- `src/store/index.ts` — createAppointment 方法
- `src/views/Consultation.vue` — 身份验证流程参考

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: 完整的预约提交流程可用（选时段→填描述→确认→看回执）
  - 验证方式: 端到端走查全流程
  - **验证工具**: `npm run dev` 手动测试

- **标准 2**: 医生信息正确展示
  - 验证方式: 通过 URL ?doctor=xxx 进入，医生信息匹配
  - **验证工具**: 浏览器查看

- **标准 3**: 确认弹窗信息准确无误
  - 验证方式: 弹窗中医生/时间/病情与选择一致
  - **验证工具**: 浏览器查看

- **标准 4**: 预约回执显示正确的编号和信息
  - 验证方式: 提交后回执区显示预约详情
  - **验证工具**: 浏览器查看

- **标准 5**: 未登录时显示引导提示
  - 验证方式: 清除登录状态后进入页面
  - **验证工具**: 浏览器查看

- **标准 6**: 病情描述超过 200 字时禁止提交
  - 验证方式: 输入 >200 字后按钮禁用或截断
  - **验证工具**: 浏览器交互测试

- **标准 7**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 不选时段直接点提交 → 按钮禁用或提示
- 未登录点提交 → 弹出身份验证引导

### 4.3 负面测试
- 快速重复提交同一时段 → 第二次因号源不足应失败或提示

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: TASK-002（Store 方法）, TASK-004（排班日历组件）
- **被阻塞**: 无

### 5.2 外部依赖
- Ant Design Vue 4.x
- vue-router

### 5.3 前置条件
- TASK-002, TASK-004 已完成

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 中（AI 约 10 分钟）
- **复杂度**: 中
- **风险**: 中

### 6.2 影响因素
- 多状态页面逻辑较复杂
- 需要处理多种边界情况（未登录、无选择、重复提交等）

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — 编译无错误
- **退出条件**: 退出码为 0

### 7.2 手动验证（完整 checklist）
- [ ] 有 doctor 参数进入 → 自动加载该医生
- [ ] 无 doctor 参数 → 显示医生选择
- [ ] 选择时段 → 高亮 + 表单激活
- [ ] 填写病情 → 字数计数正常
- [ ] 点提交 → 弹出确认 Modal
- [ ] Modal 确认 → 调用 createAppointment
- [ ] 成功 → 显示回执
- [ ] 未登录 → 显示引导
- [ ] 移动端布局正常

---

## 8. 实施备注
- 就诊须知静态文本: "请提前15分钟到达医院候诊；请携带身份证和既往病历；如需改期请提前24小时取消"
- 回执使用 `<a-result status="success">` 组件
- 预约编号格式: `APT-YYYYMMDD-XXXXX`

---

## 9. 交付物
- `src/views/Appointment.vue` — 完整的预约提交页面（替换占位内容）

---
