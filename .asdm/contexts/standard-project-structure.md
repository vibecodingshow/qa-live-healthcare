# 标准项目结构

> 本文档描述 **QA Live Healthcare**（在线问诊平台）的实际项目结构，供 AI 模型理解、导航和维护本工作区代码时参考。

---

## 实际项目结构

```
qa-live-healthcare/
├── .asdm/                                  # ASDM 配置目录
│   ├── contexts/                           # AI 上下文文件
│   │   ├── index.md                        # 项目总览与导航（主入口）
│   │   ├── data-models.md                  # 数据模型详解
│   │   ├── standard-project-structure.md   # 本文档
│   │   ├── standard-coding-style.md        # 编码风格规范
│   │   ├── deployment.md                   # 部署配置
│   │   ├── api.md                          # Store API 文档
│   │   └── architecture.md                 # 系统架构设计
│   └── toolsets/
│       └── context-builder/                # ASDM Context Builder 工具集
│           ├── actions/
│           │   ├── asdm-context-build.md   # 构建 context 的指令
│           │   └── asdm-context-update.md  # 更新 context 的指令
│           ├── specs/                      # 各类上下文的生成规范模板
│           ├── manifest.json
│           ├── INSTALL.md
│           └── README.md
├── .codebuddy/
│   └── commands/                           # CodeBuddy Slash 命令
│       ├── asdm-context-build.md           # /asdm-context-build
│       └── asdm-context-update.md          # /asdm-context-update
├── public/
│   └── vite.svg                            # 静态资源（网站图标）
├── src/                                    # 前端源码目录（核心）
│   ├── assets/                             # 静态资源（图片/SVG 等）
│   ├── components/                         # 全局共享组件
│   │   ├── AppHeader.vue                   # 顶部导航栏
│   │   ├── AppFooter.vue                   # 底部页脚
│   │   └── HelloWorld.vue                  # 示例组件（可删除）
│   ├── data/                               # Mock 静态数据（JSON）
│   │   ├── doctor-user-list.json           # 医生数据（5 条）
│   │   ├── patient-user.json               # 患者数据
│   │   └── question-list.json              # 问诊记录（7 条）
│   ├── router/
│   │   └── index.ts                        # Vue Router 路由配置（7 条路由）
│   ├── store/
│   │   └── index.ts                        # 全局状态管理（reactive store）
│   ├── views/                              # 页面视图组件
│   │   ├── Home.vue                        # 首页（平台入口）
│   │   ├── Doctors.vue                     # 医生列表页
│   │   ├── Consultation.vue                # 患者问诊页
│   │   ├── DoctorLogin.vue                 # 医生登录页
│   │   ├── DoctorRoom.vue                  # 医生工作台
│   │   └── About.vue                       # 关于页面
│   ├── App.vue                             # 根组件（含路由出口）
│   ├── main.ts                             # 应用入口（注册插件）
│   ├── style.css                           # 全局样式
│   └── vite-env.d.ts                       # Vite 环境变量类型声明
├── index.html                              # SPA HTML 入口
├── package.json                            # 依赖与脚本配置
├── package-lock.json
├── tsconfig.json                           # TypeScript 根配置
├── tsconfig.app.json                       # 应用代码 TS 配置
├── tsconfig.node.json                      # Node 工具 TS 配置
├── vite.config.ts                          # Vite 构建配置
└── README.md                               # 项目说明文档
```

---

## 目录职责说明

### `src/views/` — 页面视图
每个文件对应一个路由页面，是主要的业务逻辑入口：

| 文件 | 路由路径 | 职责 |
|------|----------|------|
| `Home.vue` | `/` | 首页，展示平台简介和入口导航 |
| `Doctors.vue` | `/doctors` | 展示在线医生列表，患者可选择医生 |
| `Consultation.vue` | `/consultation` / `/consultation/:doctorUsername` | 患者身份验证 + 提交问诊问题 |
| `DoctorLogin.vue` | `/doctor/login` | 医生账号密码登录 |
| `DoctorRoom.vue` | `/doctor/room/:username` | 医生工作台，查看并回复患者问题 |
| `About.vue` | `/about` | 平台介绍页 |

### `src/components/` — 全局组件
跨页面复用的 UI 组件，当前有：

- `AppHeader.vue`：顶部导航，包含页面链接（首页/医生列表/关于）和医生登录入口
- `AppFooter.vue`：底部页脚，包含版权信息
- `HelloWorld.vue`：Vite 模板示例组件，**无业务用途，可安全删除**

### `src/store/index.ts` — 状态管理
使用 Vue 3 `reactive` API 实现的轻量全局 Store，无需 Pinia/Vuex。详见 `api.md`。

### `src/data/` — Mock 数据
纯 JSON 文件，应用启动时直接导入到 Store。**无后端接口，所有数据变更仅存在于内存中，页面刷新后重置。**

### `src/router/index.ts` — 路由配置
使用 `createWebHistory`（HTML5 History 模式），共 7 条路由。

---

## 命名规范（本项目实际使用）

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 单文件组件 | PascalCase | `DoctorRoom.vue`、`AppHeader.vue` |
| TypeScript 文件 | camelCase | `index.ts` |
| JSON 数据文件 | kebab-case | `doctor-user-list.json` |
| 目录名 | kebab-case / camelCase | `src/`、`router/`、`store/` |
| 接口（Interface） | PascalCase | `Doctor`、`Patient`、`Question` |
| 变量 / 函数 | camelCase | `loginDoctor`、`currentPatient` |

---

## 添加新功能的标准位置

| 需求 | 应修改的文件/目录 |
|------|-----------------|
| 新增页面 | `src/views/` 添加 `.vue`，`src/router/index.ts` 注册路由 |
| 新增全局组件 | `src/components/` |
| 新增数据字段/接口 | `src/store/index.ts`（Interface 定义），`src/data/*.json`（Mock 数据） |
| 新增 Store 方法 | `src/store/index.ts` 的 `store` 对象 |
| 新增全局样式 | `src/style.css` |
| 新增静态图片 | `src/assets/` |

---

## 与标准模板的差异说明

本项目是**纯前端 SPA（无后端）**，与通用项目结构模板的主要差异：

1. **无后端目录**：无 `server/`、`api/`、`backend/` 等服务端代码
2. **无测试目录**：无 `test/`、`spec/` 目录，未配置测试框架
3. **无 Docker/K8s 配置**：无 `Dockerfile`、`docker-compose.yml`
4. **无 CI/CD 配置**：无 `.github/workflows/`
5. **简化状态管理**：使用 Vue 3 `reactive` 替代 Pinia/Vuex
6. **Mock 数据**：使用 JSON 文件替代真实数据库/API

---

*本文档随项目结构变化而更新，使用 `/asdm-context-update` 命令保持同步。*
