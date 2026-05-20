# 标准项目结构

## 概述

本文档定义了在线医疗问诊平台的标准项目结构，为文件组织和目录管理提供指导，以保持一致性和便于协作。

## 项目结构

```
qa-live-healthcare/
├── .asdm/                          # ASDM 配置和工具集
│   ├── contexts/                   # AI 模型上下文文件
│   └── toolsets/                   # 已安装的 ASDM 工具集
├── public/                          # 公共静态资源
│   └── *.svg                       # SVG 图标
├── src/                            # 源代码
│   ├── assets/                     # 静态资源（图片、字体等）
│   ├── components/                 # 公共组件
│   │   ├── AppHeader.vue           # 应用头部导航
│   │   ├── AppFooter.vue           # 应用底部
│   │   └── HelloWorld.vue          # 示例组件
│   ├── data/                       # 模拟数据（JSON）
│   │   ├── doctor-user-list.json   # 医生用户数据
│   │   ├── patient-user.json       # 患者用户数据
│   │   └── question-list.json      # 问诊问题数据
│   ├── router/                     # 路由配置
│   │   └── index.ts               # 路由定义
│   ├── store/                      # 状态管理
│   │   └── index.ts              # 响应式状态与业务逻辑
│   ├── views/                      # 页面组件
│   │   ├── Home.vue               # 首页
│   │   ├── Doctors.vue            # 医生列表
│   │   ├── Consultation.vue       # 问诊页面
│   │   ├── DoctorLogin.vue        # 医生登录
│   │   ├── DoctorRoom.vue         # 医生诊室
│   │   └── About.vue              # 关于我们
│   ├── App.vue                     # 根组件
│   ├── main.ts                     # 应用入口
│   ├── style.css                   # 全局样式
│   └── vite-env.d.ts              # Vite 环境类型声明
├── index.html                       # HTML 入口文件
├── package.json                     # 项目依赖配置
├── vite.config.ts                   # Vite 构建配置
├── tsconfig.json                    # TypeScript 配置
├── tsconfig.app.json               # 应用 TypeScript 配置
├── tsconfig.node.json              # 节点 TypeScript 配置
└── README.md                        # 项目说明文档
```

## 目录说明

### src/

**主源代码目录**，包含所有应用代码。

| 目录 | 用途 |
|------|------|
| `assets/` | 图片、字体等静态资源 |
| `components/` | 可复用的 Vue 组件 |
| `data/` | JSON 模拟数据（替代后端 API） |
| `router/` | Vue Router 路由配置 |
| `store/` | 响应式状态管理 |
| `views/` | 页面级组件（对应路由） |

### src/components/

**公共组件目录**，存放可复用的 UI 组件。

| 组件 | 说明 |
|------|------|
| `AppHeader.vue` | 页面顶部导航栏 |
| `AppFooter.vue` | 页面底部信息栏 |
| `HelloWorld.vue` | 示例/测试组件 |

### src/views/

**页面组件目录**，每个文件对应一个路由页面。

| 页面 | 路由 | 说明 |
|------|------|------|
| `Home.vue` | `/` | 首页，展示平台概览和开放诊室 |
| `Doctors.vue` | `/doctors` | 医生列表页面 |
| `Consultation.vue` | `/consultation` | 问诊页面 |
| `DoctorLogin.vue` | `/doctor/login` | 医生登录页面 |
| `DoctorRoom.vue` | `/doctor/room/:username` | 医生诊室管理 |
| `About.vue` | `/about` | 关于我们页面 |

### src/data/

**模拟数据目录**，存储 JSON 格式的模拟数据。

| 文件 | 说明 |
|------|------|
| `doctor-user-list.json` | 医生用户列表 |
| `patient-user.json` | 患者用户信息 |
| `question-list.json` | 问诊问题记录 |

### src/store/

**状态管理目录**，使用 Vue 3 `reactive` 进行简单状态管理。

| 文件 | 说明 |
|------|------|
| `index.ts` | 全局状态和业务逻辑 |

## 命名规范

### 文件命名

- **Vue 组件**: PascalCase（首字母大写）
  - `AppHeader.vue`, `DoctorRoom.vue`
- **TypeScript 文件**: camelCase
  - `index.ts`, `router.ts`
- **JSON 数据文件**: kebab-case
  - `doctor-user-list.json`

### 目录命名

- 所有目录使用 kebab-case
  - `components/`, `views/`, `router/`

## 新增页面流程

1. 在 `src/views/` 创建页面组件（`.vue` 文件）
2. 在 `src/router/index.ts` 添加路由配置
3. 在 `AppHeader.vue` 中添加导航链接（如需要）

## 新增组件流程

1. 在 `src/components/` 创建组件（`.vue` 文件）
2. 在需要的页面中导入使用

## 相关文档

- [编码规范](./standard-coding-style.md)
- [数据模型](./data-models.md)
- [架构设计](./architecture.md)

---

*本项目结构遵循 Vue 3 + TypeScript + Vite 最佳实践，可根据实际需求进行调整。*
