# Task PRD: 路由配置与导航入口

**Feature ID**: FEAT-001
**Feature Name**: appointment-booking
**Task ID**: TASK-003
**Created Date**: 2026-04-29
**Status**: TODO
**Language**: 中文 (zh)

---

## 1. 任务概述

### 1.1 任务摘要
- **内容**: 配置预约挂号相关的路由规则，并在导航栏和医生详情页增加入口链接
- **目的**: 建立用户访问预约功能的导航路径
- **关联需求**: REQ-009（路由配置）、REQ-010（导航入口）

### 1.2 任务目标
- 在 `router/index.ts` 中新增 2 条路由规则
- 在 `AppHeader.vue` 导航栏增加"预约挂号"菜单项
- 在 `Doctors.vue` 医生卡片上增加"立即预约"按钮

### 1.3 关联功能需求
- Feature PRD 需求: REQ-009, REQ-010
- 关联用户故事: Story 1, Story 2, Story 3（均需要路由可达）

---

## 2. 详细需求

### 2.1 功能需求
- 新增路由 `/appointment` → `Appointment.vue`（预约主页面，含排班选择+提交）
- 新增路由 `/my-appointments` → `MyAppointments.vue`（我的预约列表页）
- 导航栏 Header 增加"预约挂号" `<router-link>` 链接指向 `/appointment`
- Doctors.vue 每个医生卡片增加"立即预约"按钮，点击跳转 `/appointment?doctor=<doctorUsername>`

### 2.2 技术需求
- 路由组件先创建占位文件（空 Vue SFC），后续任务填充实际内容
- 遵循现有路由命名和路径风格
- 导航项样式与现有菜单项保持一致

### 2.3 约束与限制
- 不修改任何现有路由配置
- 占位组件使用最小有效 Vue SFC 结构
- "立即预约"按钮使用 Ant Design Vue 的 `<a-button type="primary">`

---

## 3. 实施方法

### 3.1 推荐方案
增量修改 router/index.ts 和 AppHeader.vue；新建两个占位 View 组件。

### 3.2 实施步骤
1. 创建 `src/views/Appointment.vue` 占位组件（含基本 template + script setup + scoped style）
2. 创建 `src/views/MyAppointments.vue` 占位组件
3. 在 `router/index.ts` 中 import 并注册两条新路由
4. 在 `src/components/AppHeader.vue` 的导航区域增加 `<router-link to="/appointment">`
5. 在 `src/views/Doctors.vue` 的医生卡片中增加"立即预约"按钮
6. 运行 TypeScript 类型检查和开发服务器验证

**验证步骤**: `npm run dev` 启动后检查路由可访问、导航可见。

### 3.3 技术考量
- AppHeader.vue 可能使用了自定义导航结构，需先阅读理解后再修改
- Doctors.vue 的卡片布局可能需要调整以容纳新按钮
- 路由 query 参数 `? doctor=xxx` 用于预选医生

### 3.4 项目上下文引用
- `src/router/index.ts` — 路由配置文件
- `src/components/AppHeader.vue` — 导航栏组件
- `src/views/Doctors.vue` — 医生展示页面

---

## 4. 验收标准

### 4.1 主要标准
- **标准 1**: 两条新路由注册成功并可访问（显示占位内容即可）
  - 验证方式: 浏览器访问 `/appointment` 和 `/my-appointments` 不 404
  - **验证工具**: `npm run dev` 手动验证

- **标准 2**: 导航栏出现"预约挂号"链接
  - 验证方式: 页面顶部 Header 可见该链接
  - **验证工具**: 浏览器手动查看

- **标准 3**: 医生卡片有"立即预约"按钮
  - 验证方式: Doctors 页面每个活跃医生卡片有按钮
  - **验证工具**: 浏览器手动查看

- **标准 4**: TypeScript 编译无错误
  - **验证工具**: `npx vue-tsc --noEmit` (exit code 0)

### 4.2 边界情况
- 点击"立即预约"时 URL 应携带正确的 doctorUsername 参数
- 未登录状态下导航链接仍然可见（身份校验由页面内部处理）

### 4.3 负面测试
- 访问不存在的新路由参数不应导致白屏

---

## 5. 依赖关系

### 5.1 任务依赖
- **依赖于**: 无（可与 TASK-001 并行）
- **被阻塞**: TASK-006, TASK-008

### 5.2 外部依赖
- 无

### 5.3 前置条件
- 已了解现有路由结构和导航栏实现

---

## 6. 工作量估算

### 6.1 估算
- **预估工作量**: 低（AI 约 5 分钟）
- **复杂度**: 低
- **风险**: 低

### 6.2 影响因素
- 需要阅读理解 AppHeader.vue 和 Doctors.vue 的现有结构

---

## 7. 测试策略

### 7.1 自动化验证（必需）
- **类型检查**: `npx vue-tsc --noEmit` — 编译无错误
- **构建验证**: `npm run build` — 构建成功
- **退出条件**: 退出码为 0

### 7.2 手动验证
- 开发服务器启动成功
- 新路由可访问
- 导航链接和按钮可见且可点击

---

## 8. 实施备注
- 占位组件内容建议: 显示标题文字（如 "预约挂号" 和 "我的预约"），便于确认路由生效
- 导航顺序建议放在"问诊"之后、"关于我们"之前

---

## 9. 交付物
- `src/views/Appointment.vue` — 占位组件
- `src/views/MyAppointments.vue` — 占位组件
- `src/router/index.ts` — 新增 2 条路由
- `src/components/AppHeader.vue` — 新增导航链接
- `src/views/Doctors.vue` — 新增"立即预约"按钮

---
