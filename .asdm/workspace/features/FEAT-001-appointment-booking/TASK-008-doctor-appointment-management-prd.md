# Task PRD: 医生端预约管理视图

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-008
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 在医生诊室工作台（DoctorRoom.vue）中增加"预约管理"Tab，展示和管理患者的预约列表
- **目的**: 实现 User Story 4（医生查看预约列表）
- **关联需求**: REQ-007（医生端预约管理视图）

### 1.2 任务目标
- 在 DoctorRoom.vue 中新增预约管理的 Tab 面板
- 按日期分组展示预约（今日优先）
- 每条预约显示: 患者姓名、预约时间、病情简述、状态
- 支持按状态筛选
- 支持确认/完成预约的操作按钮

### 1.3 关联功能需求
- Feature PRD 需求: REQ-007
- 关联用户故事: Story 4

---

## 2. 详细需求

### 2.1 功能需求
- **Tab 入口**: 在 DoctorRoom.vue 现有的 Tab 栏中增加"预约管理" Tab
- **预约列表展示**:
  - 按日期分组（今日 / 未来日期）
  - 每组内按时间排序（早→晚）
  - 每条预约以 `<a-card>` 或 Table 行形式展示:
    - 患者姓名、性别
    - 预约时段
    - 病情简述（截断显示）
    - 状态 Tag（颜色与患者端一致）
    - 操作按钮: PENDING→"确认", CONFIRMED→"完成"
- **状态筛选**: 顶部 SegmentedButton 组（全部 / 待确认 / 已确认 / 已完成 / 已取消）
- **空状态**: 该状态下无预约时显示 empty 提示
- **操作结果**:
  - "确认": 调用 store.confirmAppointment() → message.success
  - "完成": 调用 store.completeAppointment() → message.success

### 2.2 技术需求
- 修改 `src/views/DoctorRoom.vue`（增量添加 Tab 面板）
- 使用 Ant Design Vue: a-tabs, a-card/a-table, a-tag, a-segmented, a-empty, a-popconfirm, message
- 调用 `store.getAppointmentsByDoctor(doctorId)` 获取数据
- 使用 computed 派发分组数据和筛选数据

### 2.3 约束与限制
- 必须在医生登录后才可见此 Tab（复用现有登录守卫逻辑）
- 不影响现有的"问题回复"Tab 功能
- 与 DoctorRoom.vue 现有视觉风格保持一致

---

## 3. 实施方法

### 3.1 推荐方案
在 DoctorRoom.vue 的 `<a-tabs>` 中新增一个 tab-pane，内容为预约管理面板。

### 3.2 实施步骤
1. 阅读 DoctorRoom.vue 理解现有 Tabs 结构和样式
2. 引入 store 方法和必要的组件
3. 新增 `<a-tab-pane key="appointments" tab="预约管理">`
4. 实现状态筛选控件（`<a-segmented>`）
5. 实现 computed 分组逻辑（今日组 + 未来日期组）
6. 实现预约卡片/列表渲染
7. 实现确认/完成操作按钮及 handler
8. 添加空状态处理
9. TypeScript 检查和手动验证

**验证步骤**: `npx vue-tsc --noEmit` + 以医生账号登录后验证。

### 3.3 技术考量
- 日期分组: `groupBy(appointment => appointment.date)` 然后 sort keys
- "今日"判断: `dayjs(appt.date).isSame(dayjs(), 'day')`
- 确认操作使用 `<a-button type="link">` 或 `<a-popconfirm>`
- 复用 DoctorRoom.vue 的 `state.currentDoctor` 获取当前医生

### 3.4 项目上下文引用
- `src/views/DoctorRoom.vue` — 主要修改文件
- `src/store/index.ts` — getAppointmentsByDoctor, confirmAppointment, completeAppointment
- DoctorRoom.vue 的现有 Tabs 布局作为样式参考

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: 医生工作台新增"预约管理"Tab 且可见
  - 验证方式: 医生登录后看到新 Tab
  - **验证工具**: `npm run dev` + 医生账号登录查看

- **标准 2**: 预约按日期分组展示，今日排在最前
  - 验证方式: 看到"今日"分组和其他日期分组
  - **验证工具**: 浏览器查看

- **标准 3**: 每条预约信息完整（患者、时间、病情、状态）
  - 验证方式: 卡片/行内容完整
  - **验证工具**: 浏览器查看

- **标准 4**: 状态筛选功能正常
  - 验证方式: 切换筛选，列表正确过滤
  - **验证工具**: 浏览器交互测试

- **标准 5**: "确认"和"完成"操作按钮可用且效果正确
  - 验证方式: 点击后状态变更
  - **验证工具**: 浏览器交互测试

- **标准 6**: 原"问题回复"Tab 功能不受影响
  - 验证方式: 切换到原 Tab，功能正常
  - **验证工具**: 浏览器验证

- **标准 7**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 医生无任何预约记录时显示空状态
- 所有预约均为同一状态时筛选正常
- 未登录时整个 Tab 不可见（受路由守卫保护）

### 4.3 负面测试
- 医生注销后不再显示预约数据

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: TASK-002（Store 方法）, TASK-003（路由）
- **被阻塞**: 无

### 5.2 外部依赖
- Ant Design Vue 4.x

### 5.3 前置条件
- TASK-002, TASK-003 已完成

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 中（AI 约 10 分钟）
- **复杂度**: 中
- **风险**: 中

### 6.2 影响因素
- 需要深入理解 DoctorRoom.vue 的现有结构
- 日期分组逻辑有一定复杂度
- 需要保持与现有 Tab 风格一致

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — 编译无错误
- **退出条件**: 退出码为 0

### 7.2 手动验证
- [ ] 医生登录后看到"预约管理"Tab
- [ ] 今日预约在最前面
- [ ] 信息展示完整
- [ ] 5 种状态筛选正常
- [ ] 确认操作将 PENDING→CONFIRMED
- [ ] 完成操作将 CONFIRMED→COMPLETED
- [ ] 原 Tab 不受影响
- [ ] 移动端适配正常

---

## 8. 实施备注
- 今日分组标题使用醒目样式（如蓝色 badge "今日"）
- 每张预约卡片底部右侧放置操作按钮
- 预约卡片使用浅色背景区分不同日期组

---

## 9. 交付物
- `src/views/DoctorRoom.vue` — 增量更新（新增预约管理 Tab 面板）

---
