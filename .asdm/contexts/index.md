# QA Live Healthcare - 工作区索引

> **项目名称**: QA Live Healthcare（QA在线医疗健康问诊平台）
> **生成时间**: 2026-04-29
> **语言**: 中文 (zh)
> **AI 提供者**: Tencent CodeBuddy

---

## 项目概述

**QA Live Healthcare** 是一个在线医疗健康问诊平台的前端原型/Demo 应用。该平台连接患者与医生，提供在线问诊、问题提交、医生回复等核心功能。

### 核心特性

- **患者端**: 身份验证、浏览医生、提交问诊问题、查看回复
- **医生端**: 账号登录、诊室工作台、查看/回复患者问题
- **纯前端实现**: 使用 Mock 数据驱动，无需后端服务即可运行
- **响应式设计**: 支持桌面端和移动端适配

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) | ^3.5.10 |
| UI 组件库 | Ant Design Vue 4.x | ^4.2.6 |
| 路由管理 | Vue Router 4 | ^4.6.3 |
| 构建工具 | Vite 5 | ^5.4.8 |
| 类型系统 | TypeScript 5 (严格模式) | ^5.5.3 |
| 日期处理 | dayjs | ^1.11.19 |

---

## 项目结构

```
qa-live-healthcare/
├── index.html                    # 入口 HTML 文件
├── package.json                  # 项目配置与依赖管理
├── vite.config.ts                # Vite 构建配置（极简）
├── tsconfig.json                 # TS 主配置（Project References）
├── tsconfig.app.json             # 应用代码 TS 配置
├── tsconfig.node.json            # Node 端 TS 配置
└── src/
    ├── main.ts                   # 应用入口：创建 Vue 实例、注册插件
    ├── App.vue                   # 根组件：布局骨架（Header + RouterView + Footer）
    ├── router/
    │   └── index.ts              # 路由定义（7 个路由规则）
    ├── store/
    │   └── index.ts              # 响应式状态管理（手写 reactive Store）
    ├── data/
    │   ├── doctor-user-list.json # 医生用户数据（5 条）
    │   ├── patient-user.json     # 患者数据（5 条）
    │   └── question-list.json    # 问诊问题数据（7 条）
    ├── components/
    │   ├── AppHeader.vue         # 顶部导航栏组件
    │   ├── AppFooter.vue         # 页脚组件
    │   └── HelloWorld.vue        # Vite 默认示例（未使用）
    └── views/
        ├── Home.vue              # 首页：Hero 区域 + 统计 + 开放诊室列表
        ├── Consultation.vue      # 患者问诊页面：身份验证 + 问题提交/查看
        ├── Doctors.vue           # 医生团队展示页
        ├── About.vue             # 关于我们页面
        ├── DoctorLogin.vue       # 医生登录页面
        └── DoctorRoom.vue        # 医生诊室工作台：查看/回复问题
```

---

## 数据模型

本项目包含三个核心数据模型：

| 模型 | 说明 | 数据源 | 详细文档 |
|------|------|--------|----------|
| **Doctor** | 医生信息（账号、职称、科室、擅长领域等） | `src/data/doctor-user-list.json` | [data-models.md](./data-models.md) |
| **Patient** | 患者信息（姓名、生日、联系方式） | `src/data/patient-user.json` | [data-models.md](./data-models.md) |
| **Question** | 问诊问题（问题内容、状态、回复等） | `src/data/question-list.json` | [data-models.md](./data-models.md) |

### 全局状态 (State)

```typescript
interface State {
  doctors: Doctor[];              // 全部医生列表
  patients: Patient[];            // 全部患者列表
  questions: Question[];          // 全部问题列表
  currentDoctor: Doctor | null;   // 当前登录的医生
  currentPatient: Patient | null; // 当前登录的患者
}
```

---

## 路由系统

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | Home | `Home.vue` | 首页 |
| `/consultation` | Consultation | `Consultation.vue` | 患者通用问诊入口 |
| `/consultation/:doctorUsername` | ConsultationRoom | `Consultation.vue` | 指定医生的诊室入口 |
| `/doctors` | Doctors | `Doctors.vue` | 医生团队展示 |
| `/about` | About | `About.vue` | 关于我们 |
| `/doctor/login` | DoctorLogin | `DoctorLogin.vue` | 医生登录页 |
| `/doctor/room/:username` | DoctorRoom | `DoctorRoom.vue` | 医生工作台（需登录） |

> 完整 API/路由说明见 [api.md](./api.md)

---

## Store 方法（模拟 API 层）

| 方法名 | 功能 | 参数 |
|--------|------|------|
| `loginDoctor()` | 医生身份验证 | username, password |
| `logoutDoctor()` | 医生登出 | - |
| `verifyPatient()` | 患者验证（自动注册或查找） | name, birthday |
| `logoutPatient()` | 患者登出 | - |
| `getQuestionsByDoctor()` | 获取医生的问题列表 | doctorId |
| `getQuestionsByPatient()` | 获取患者的问题列表 | patientId |
| `addQuestion()` | 创建新问题 | questionData |
| `answerQuestion()` | 文字回复问题 | questionId, answer |
| `markQuestionAsAnswered()` | 口述解答标记 | questionId |
| `getActiveDoctors()` | 获取在线医生列表 | - |
| `getStatistics()` | 获取平台统计数据 | - |

---

## 代码规范概要

### 编码风格

- **组件语法**: 统一使用 `<script setup lang="ts">` Composition API
- **SFC 结构**: `<template>` -> `<script setup>` -> `<style scoped>`
- **样式隔离**: 所有 `.vue` 文件使用 `scoped CSS`

### 命名约定

| 元素 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `AppHeader.vue`, `DoctorRoom.vue` |
| 视图文件 | PascalCase | `Consultation.vue` |
| 变量/函数 | camelCase | `currentPatient`, `submitQuestion` |
| 接口/类型 | PascalCase | `Doctor`, `Question`, `Patient` |
| CSS 类名 | kebab-case | `doctor-avatar`, `room-header` |

### UI 设计规范

- 最大内容宽度: `max-width: 1200px; margin: 0 auto`
- Header 高度: 固定 `64px`
- 渐变主题色: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- 卡片圆角: `12px-16px`，按钮圆角: `8px`
- 响应式断点: `@media (max-width: 768px)`

> 完整编码规范见 [standard-coding-style.md](./standard-coding-style.md)

---

## 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 医生 | `dr-zhang-wei` | `123456` | 张伟主任医师 - 心内科 |
| 患者 | （任意姓名） | （匹配生日） | 自动注册/登录 |

---

## 可用命令

安装 Context Builder 后，可使用以下命令：

| 命令 | 功能 |
|------|------|
| `asdm-context-build` | 生成初始上下文（当前已执行） |
| `asdm-context-update` | 更新已有上下文（当工作区变更时使用） |

---

## 待生成的上下文文件

以下文件可按需逐个生成：

| 序号 | 文件名 | 内容说明 | 状态 |
|------|--------|----------|------|
| 1 | `index.md` | 工作区索引和指南 | ✅ 已生成 |
| 2 | `standard-project-structure.md` | 标准项目结构详解 | ⏳ 待生成 |
| 3 | `standard-coding-style.md` | 编码标准和风格指南 | ⏳ 待生成 |
| 4 | `data-models.md` | 数据模型和关系图 | ⏳ 待生成 |
| 5 | `deployment.md` | 部署配置和流程 | ⏳ 待生成 |
| 6 | `api.md` | API 定义和文档 | ⏳ 待生成 |
| 7 | `architecture.md` | 系统架构和设计决策 | ⏳ 待生成 |

---

## 关键源代码链接

| 文件 | 路径 | 说明 |
|------|------|------|
| Store | [src/store/index.ts](../src/store/index.ts) | 状态管理和数据操作核心 |
| 路由 | [src/router/index.ts](../src/router/index.ts) | 路由定义和导航守卫 |
| 根组件 | [src/App.vue](../src/App.vue) | 应用布局框架 |
| 医生诊室 | [src/views/DoctorRoom.vue](../src/views/DoctorRoom.vue) | 医生工作台主界面 |
| 问诊页面 | [src/views/Consultation.vue](../src/views/Consultation.vue) | 患者问诊流程 |

---

*此文件由 Context Builder toolset 自动生成。*
