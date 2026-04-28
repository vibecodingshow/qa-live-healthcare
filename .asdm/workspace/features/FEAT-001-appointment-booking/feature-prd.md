# Feature PRD: 预约挂号

**Feature ID**: FEAT-001  
**Created Date**: 2026-04-28  
**Status**: PLANNED  
**Language**: 简体中文

---

## 1. 概述

### 1.1 功能摘要

**预约挂号**功能允许患者在 QA Live Healthcare 平台上预约医生的线下门诊时间段。患者通过身份验证后，可浏览医生的可用号源（时间段），选择合适的时间完成预约，并可查看和取消自己的预约记录。医生端可查看当日及未来的预约列表。

本功能基于现有的纯前端 SPA 架构实现，使用 Vue 3 + TypeScript + Ant Design Vue，数据以 Mock JSON + `reactive` Store 形式管理，无需后端服务。

### 1.2 功能目标

- **目标 1**：为患者提供线下门诊预约入口，补充现有在线问诊能力
- **目标 2**：支持患者完整的预约生命周期管理（预约 → 查看 → 取消）
- **目标 3**：为医生提供预约查看能力，方便门诊安排
- **目标 4**：与现有患者身份验证体系（姓名 + 生日）保持一致

---

## 2. 用户故事

### Story 1：患者浏览并预约号源

**As a** 已验证身份的患者  
**I want to** 浏览医生的可用门诊时间段并选择预约  
**So that** 我可以提前安排好线下就诊时间，减少等待

**验收标准**：
- 患者完成姓名 + 生日验证后，可访问预约挂号页面 `/appointment`
- 页面展示所有在线医生（`isActive: true`）的可选号源列表
- 号源以日期 + 时间段展示（如：2026-04-29 上午 09:00）
- 患者选择医生和号源后，点击"确认预约"即完成预约
- 预约成功后显示成功提示，并跳转至预约记录页

### Story 2：患者查看和取消预约

**As a** 已完成预约的患者  
**I want to** 查看我的预约记录并可以取消待就诊的预约  
**So that** 我能方便地管理自己的门诊安排

**验收标准**：
- 患者在 `/appointment` 页面可切换查看"预约号源"和"我的预约"两个 Tab
- "我的预约"列表显示：医生姓名、科室、预约时间、状态（待就诊 / 已取消）
- 状态为"待就诊"的预约可点击"取消预约"按钮
- 取消后状态更新为"已取消"，对应号源恢复可预约状态

### Story 3：医生查看预约列表

**As a** 已登录的医生  
**I want to** 在诊室页面查看患者的预约记录  
**So that** 我可以提前了解门诊安排

**验收标准**：
- 医生诊室页（`DoctorRoom.vue`）新增"预约列表"Tab
- 展示针对该医生的所有预约记录（按预约时间排序）
- 每条记录显示：患者姓名、预约时间、状态

---

## 3. 功能需求

### REQ-001：预约数据模型
- **ID**：REQ-001
- **描述**：新增 `Appointment` 接口和 `TimeSlot` 接口，扩展 Store 状态和相关方法
- **优先级**：High
- **关联 Story**：Story 1、Story 2、Story 3

### REQ-002：号源 Mock 数据
- **ID**：REQ-002
- **描述**：创建 `appointment-slots.json`，为每位在线医生预置 3 天内若干时间段号源
- **优先级**：High
- **关联 Story**：Story 1

### REQ-003：预约挂号页面
- **ID**：REQ-003
- **描述**：新增 `Appointment.vue` 页面，包含"选择号源"和"我的预约"两个 Tab
- **优先级**：High
- **关联 Story**：Story 1、Story 2

### REQ-004：路由注册
- **ID**：REQ-004
- **描述**：在 `router/index.ts` 注册 `/appointment` 路由，并在 `AppHeader.vue` 添加导航入口
- **优先级**：High
- **关联 Story**：Story 1

### REQ-005：医生诊室预约 Tab
- **ID**：REQ-005
- **描述**：在 `DoctorRoom.vue` 现有 Tab 体系中新增"预约列表" Tab
- **优先级**：Medium
- **关联 Story**：Story 3

---

## 4. 非功能需求

### 4.1 性能
- 预约页面初始加载时间不超过现有页面（Vite 热更新，生产构建体积增量 < 50KB）
- 号源列表渲染采用 `v-for` + `:key`，支持 20 条以内数据流畅渲染

### 4.2 安全性
- 患者身份验证复用现有 `store.verifyPatient()` 方法，未验证时不可提交预约
- 与现有系统一致：无真实鉴权，仅演示用途

### 4.3 可维护性
- 新增代码严格遵循现有编码风格（`<script setup lang="ts">`、camelCase 变量命名、scoped 样式）
- 数据模型变更集中在 `src/store/index.ts`，不引入额外状态库

### 4.4 可靠性
- 与现有系统一致：数据不持久化，页面刷新后恢复初始状态（符合 Mock 演示定位）

---

## 5. 技术需求

### 5.1 架构约束

- **纯前端 SPA**：无后端，所有数据变更只在 `reactive` Store 内存中进行
- **组件架构**：`Appointment.vue` 作为页面级组件放置于 `src/views/`，不拆分子组件（保持与现有页面一致的简洁结构）
- **状态管理**：扩展 `src/store/index.ts`，新增 `TimeSlot`、`Appointment` 接口及相关 Store 方法

### 5.2 依赖

- **内部依赖**：
  - `src/store/index.ts`（Patient、Doctor 接口及 `verifyPatient` 方法）
  - `src/router/index.ts`（路由注册）
  - `src/components/AppHeader.vue`（导航入口）
  - `src/views/DoctorRoom.vue`（新增 Tab）
- **外部依赖**：无需新增 npm 包，使用现有 Ant Design Vue 4 的 `a-tabs`、`a-card`、`a-button`、`a-tag`、`a-list` 组件

### 5.3 约束

- 号源数据以 JSON 文件形式存储于 `src/data/appointment-slots.json`
- 预约数据运行时生成，不写入 JSON（与 Question 数据处理方式一致）
- 不引入日历组件库，使用 Ant Design Vue 原生组件 + dayjs 格式化展示时间

---

## 6. 成功标准

- [ ] 患者验证身份后，可在 `/appointment` 页面完成预约操作，控制台无报错
- [ ] 同一号源不可被重复预约（已预约状态下按钮禁用）
- [ ] 患者"我的预约"Tab 展示该患者的所有预约记录
- [ ] 取消预约后号源状态恢复为可预约
- [ ] 医生诊室页"预约列表"Tab 展示该医生收到的预约
- [ ] 新增代码通过 `npm run build` 构建无报错
- [ ] 页面样式与现有页面风格一致（Ant Design Vue + scoped CSS）

---

## 7. 任务拆解原则

### 7.1 粒度
每个任务聚焦单一文件或单一逻辑单元，预计人工 1-2 小时内可完成。

### 7.2 独立性
数据模型任务（Task 1）先于页面和 Store 方法任务，其余任务相对独立可并行。

### 7.3 可测试性
每个任务完成后，通过 `npm run build`（TypeScript 类型检查）+ 浏览器手动验收确认。

### 7.4 任务分类
- 数据模型设计（1 个任务）
- Store 扩展（1 个任务）
- Mock 数据（1 个任务）
- 页面实现（1 个任务）
- 路由 & 导航（1 个任务）
- 医生端集成（1 个任务）

### 7.5 任务数量控制
预计共 **6 个任务**，符合不超过 10 个任务的限制。

---

## 8. 实现说明

- **号源设计**：`TimeSlot` 包含 `id`、`doctorId`、`date`、`startTime`、`endTime`、`isBooked` 字段；初始数据为每位在线医生提供未来 3 天、每天 4 个时间段
- **预约状态**：`Appointment.status` 采用 `'pending' | 'cancelled'` 联合类型，与 `Question.status` 保持风格一致
- **患者验证前置**：`Appointment.vue` 的"选择号源"Tab 在 `store.state.currentPatient` 为 `null` 时显示身份验证表单（复用 `Consultation.vue` 的验证逻辑）
- **时间格式**：使用 dayjs 格式化展示，存储格式保持 ISO 字符串

---

## 9. 风险与应对

### Risk 1：与现有患者身份验证耦合
- **描述**：`Appointment.vue` 需复用 `verifyPatient`，若验证逻辑变更会影响预约功能
- **影响**：Low
- **应对**：直接调用 `store.verifyPatient()`，不重新实现验证逻辑，保持单一来源

### Risk 2：DoctorRoom.vue 改动影响现有功能
- **描述**：在医生诊室页新增 Tab 可能影响现有问题列表 Tab 的样式或逻辑
- **影响**：Medium
- **应对**：仅在现有 `a-tabs` 内追加新 `a-tab-pane`，不修改已有 Tab 的内部逻辑

### Risk 3：号源数量设计不合理
- **描述**：Mock 数据号源过多影响页面性能，过少体验不佳
- **影响**：Low
- **应对**：每位医生提供 3 天 × 4 个时间段 = 12 条号源，总量 ≤ 60 条，完全满足前端渲染性能要求

---

## 10. 附录

### 10.1 参考资料
- 项目上下文：`.asdm/contexts/index.md`
- 数据模型参考：`.asdm/contexts/data-models.md`
- 编码规范：`.asdm/contexts/standard-coding-style.md`
- Ant Design Vue Tabs 组件：https://antdv.com/components/tabs

### 10.2 术语表
- **号源（TimeSlot）**：医生开放的可预约线下门诊时间段
- **预约（Appointment）**：患者针对某一号源发起的挂号记录
- **待就诊（pending）**：已预约、尚未取消的状态
- **已取消（cancelled）**：患者主动取消的预约状态

---

*本文档由 PRD Builder 工具集生成，基于项目上下文 `.asdm/contexts/index.md` 创建。如需更新请修改本文件后执行 `/asdm-prd-breakdown` 进行任务拆解。*
