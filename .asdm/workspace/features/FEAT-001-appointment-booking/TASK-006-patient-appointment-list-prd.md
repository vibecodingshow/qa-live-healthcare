# Task PRD: 患者预约列表页面

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-006
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 完善 `MyAppointments.vue` 页面，展示当前登录患者的所有预约记录
- **目的**: 实现 User Story 3（管理我的预约）中的列表展示部分
- **关联需求**: REQ-005（患者预约列表页面）

### 1.2 任务目标
- 将占位的 MyAppointments.vue 替换为完整的预约列表页面
- 以表格/卡片形式展示预约记录
- 每条记录显示完整信息: 医生、科室、预约时间、状态、病情简述
- 状态标签使用颜色区分
- 支持按状态筛选

### 1.3 关联功能需求
- Feature PRD 需求: REQ-005
- 关联用户故事: Story 3

---

## 2. 详细需求

### 2.1 功能需求
- **页面标题**: "我的预约"
- **筛选区**: 状态筛选 tabs 或 dropdown（全部 / 待确认 / 已确认 / 已取消 / 已完成）
- **列表展示**（推荐使用 `<a-table>`）:
  - 列: 预约编号 | 医生 | 科室 | 预约日期 | 预约时段 | 状态标签 | 病情简述 | 操作
  - 操作列预留"取消"按钮位置（TASK-007 实现）
- **状态标签颜色映射**:
  - PENDING → `<a-tag color="orange">待确认</a-tag>`
  - CONFIRMED → `<a-tag color="green">已确认</a-tag>`
  - CANCELLED → `<a-tag color="default">已取消</a-tag>`
  - COMPLETED → `<a-tag color="blue">已完成</a-tag>`
- **空状态**: 无预约数据时显示 `<a-empty description="暂无预约记录" />`
- **未登录引导**: 同 Appointment.vue 的处理方式

### 2.2 技术需求
- 修改 `src/views/MyAppointments.vue`（替换占位内容）
- 使用 Ant Design Vue: a-table, a-tag, a-empty, a-tabs 或 a-select
- 调用 `store.getAppointmentsByPatient(patientId)` 获取数据
- 使用 computed 派发筛选后的列表

### 2.3 约束与限制
- 最大宽度 1200px 居中
- 表格支持移动端（小屏幕下改为卡片列表或横向滚动）
- 操作列目前仅预留取消按钮槽位（disabled 或隐藏，由 TASK-007 启用）

---

## 3. 实施方法

### 3.1 推荐方案
使用 `<a-table>` 作为主展示组件，配合 `<a-radio-group>` 或 `<a-segmented>` 做状态筛选。

### 3.2 实施步骤
1. 重构 MyAppointments.vue，引入必要 imports
2. 实现未登录检测和引导
3. 实现状态筛选控件
4. 实现 computed 筛选逻辑（filteredAppointments）
5. 配置 table columns（含自定义状态列渲染）
6. 实现空状态展示
7. 添加操作列预留（取消按钮 disabled，显示 tooltip "即将上线"）
8. 添加响应式适配
9. TypeScript 检查和手动验证

**验证步骤**: `npx vue-tsc --noEmit` + `npm run dev` 手动验证。

### 3.3 技术考量
- 筛选逻辑: `computed(() => { if filter==='all' return all; else return all.filter(a=>a.status===filter) })`
- 表格 column 的 customRender 用于渲染状态 tag
- 操作列的 cancel 按钮暂时 disabled，TASK-007 会启用它

### 3.4 项目上下文引用
- `src/views/MyAppointments.vue` — 主要修改文件
- `src/store/index.ts` — getAppointmentsByPatient 方法
- `src/views/Consultation.vue` — 未登录引导参考

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: 正确展示当前患者的所有预约记录
  - 验证方式: 登录患者后进入页面，看到预约列表
  - **验证工具**: `npm run dev` 手动验证

- **标准 2**: 状态标签颜色正确
  - 验证方式: PENDING=橙, CONFIRMED=绿, CANCELLED=灰, COMPLETED=蓝
  - **验证工具**: 浏览器视觉检查

- **标准 3**: 状态筛选功能正常
  - 验证方式: 切换筛选 tab，列表正确过滤
  - **验证工具**: 浏览器交互测试

- **标准 4**: 空状态正确展示
  - 验证方式: 无数据时显示 empty 组件
  - **验证工具**: 浏览器查看

- **标准 5**: 未登录时显示引导
  - 验证方式: 未登录进入页面
  - **验证工具**: 浏览器查看

- **标准 6**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 患者有大量预约记录时表格分页或滚动
- 所有预约均为同一种状态时筛选是否正常

### 4.3 负面测试
- 注销登录后页面不再显示数据

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: TASK-002（Store 方法）, TASK-003（路由占位）
- **被阻塞**: TASK-007

### 5.2 外部依赖
- Ant Design Vue 4.x

### 5.3 前置条件
- TASK-002, TASK-003 已完成

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 中（AI 约 8 分钟）
- **复杂度**: 中
- **风险**: 低

### 6.2 影响因素
- 表格配置较为繁琐但属于常规 CRUD

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — 编译无错误
- **退出条件**: 退出码为 0

### 7.2 手动验证
- [ ] 列表数据正确加载
- [ ] 4 种状态标签颜色正确
- [ ] 5 种筛选选项均工作正常
- [ ] 空状态显示
- [ ] 未登录引导
- [ ] 移动端适配

---

## 8. 实施备注
- table 的 `rowKey` 使用 `"id"`
- 预约编号列可做截断处理（tooltip 显示完整编号）
- 筛选控件放在表格上方左侧

---

## 9. 交付物
- `src/views/MyAppointments.vue` — 完整的患者预约列表页面（替换占位内容）

---
