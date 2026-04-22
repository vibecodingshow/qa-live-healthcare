# 工作区上下文索引

## 概述

本文档是 AI 模型理解和处理此工作区的索引和指南，提供工作区内容的结构化概览，并引导 AI 模型找到相关上下文。

## 工作区信息

### 基本信息

- **项目名称**: QA Live Healthcare（在线医疗问诊平台）
- **项目描述**: 一个功能完整的在线医疗问诊系统原型，支持患者发起问诊、医生登录管理、问题回答等功能
- **创建日期**: 2026年4月22日
- **最后更新**: 2026年4月22日

### 技术栈

- **主要语言**: TypeScript
- **前端框架**: Vue 3.5.10（使用 Composition API + `<script setup>` 语法）
- **UI 组件库**: Ant Design Vue 4.2.6
- **路由管理**: Vue Router 4.6.3
- **构建工具**: Vite 5.4.8
- **TypeScript 版本**: 5.5.3
- **日期处理**: dayjs 1.11.19

### 业务背景

- **业务领域**: 医疗健康 - 在线问诊平台
- **核心业务流程**:
  - 患者浏览医生列表并发起问诊
  - 医生登录诊室查看和管理患者问题
  - 在线问答交互
- **业务规则**:
  - 患者可选择指定医生发起问诊
  - 医生需登录后才能进入诊室
  - 问题状态跟踪（待回答/已回答）

## 工作区结构

### 目录树

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # 上下文文件（本目录）
│   │   └── index.md                    # 本索引文件
│   └── toolsets/                       # 安装的工具集
│       └── context-builder/            # Context Builder 工具集
├── src/                                # 源代码目录
│   ├── main.ts                         # 应用入口
│   ├── App.vue                         # 根组件
│   ├── vite-env.d.ts                   # Vite 类型声明
│   ├── style.css                       # 全局样式
│   ├── assets/                         # 静态资源
│   │   └── vue.svg                     # Vue Logo
│   ├── components/                     # 可复用组件
│   │   ├── AppHeader.vue               # 顶部导航栏
│   │   ├── AppFooter.vue               # 底部版权
│   │   └── HelloWorld.vue              # 示例组件
│   ├── views/                          # 页面视图
│   │   ├── Home.vue                    # 首页
│   │   ├── Consultation.vue            # 问诊页面
│   │   ├── Doctors.vue                 # 医生列表
│   │   ├── DoctorLogin.vue             # 医生登录
│   │   ├── DoctorRoom.vue              # 医生诊室
│   │   └── About.vue                   # 关于页面
│   ├── router/                         # 路由配置
│   │   └── index.ts                    # 路由定义
│   ├── store/                          # 状态管理
│   │   └── index.ts                    # Pinia 状态存储
│   └── data/                           # 模拟数据
│       ├── doctor-user-list.json       # 医生用户数据
│       ├── patient-user.json           # 患者用户数据
│       └── question-list.json          # 问诊问题数据
├── public/                             # 公共静态资源
│   └── *.svg                           # SVG 图标
├── index.html                          # 入口 HTML
├── package.json                        # 项目依赖配置
├── vite.config.ts                     # Vite 构建配置
├── tsconfig.json                       # TypeScript 配置引用
└── tsconfig.app.json                   # 应用 TypeScript 配置
```

### 关键目录说明

- **`.asdm/contexts/`**: 包含所有 AI 模型参考的上下文文件
- **`src/views/`**: 页面组件 - 实现主要业务页面
- **`src/components/`**: 可复用组件 - Header、Footer 等公共组件
- **`src/store/`**: 状态管理 - 管理医生、患者、问诊状态
- **`src/router/`**: 路由配置 - 定义页面导航规则
- **`src/data/`**: 模拟数据 - 用于开发和测试

## 路由配置

| 路径 | 组件 | 功能 |
|------|------|------|
| `/` | Home.vue | 首页 - 展示平台概览和统计数据 |
| `/consultation` | Consultation.vue | 问诊页面 - 患者发起问诊 |
| `/consultation/:doctorUsername` | Consultation.vue | 指定医生问诊 |
| `/doctors` | Doctors.vue | 医生列表 - 展示所有可用医生 |
| `/about` | About.vue | 关于页面 - 项目介绍 |
| `/doctor/login` | DoctorLogin.vue | 医生登录页 |
| `/doctor/room/:username` | DoctorRoom.vue | 医生诊室 - 管理患者问题 |

## 开发指南

### 构建和编译

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 开发环境

- 开发服务器默认端口：5173
- TypeScript 严格模式已启用
- 使用 ES2020 目标版本

### 状态管理（Store）

Store 提供以下功能：
- **医生管理**: 登录、登出、查询医生信息
- **患者管理**: 验证身份、登出
- **问诊管理**: 提问、回答、状态跟踪
- **统计分析**: 医生数、问题数、活跃会话数

## 上下文文件参考

本工作区包含以下上下文文件（位于 `.asdm/contexts/`）：

1. **[standard-project-structure.md](./standard-project-structure.md)** - 标准项目结构和组织
2. **[standard-coding-style.md](./standard-coding-style.md)** - 编码规范和样式指南
3. **[data-models.md](./data-models.md)** - 数据模型和关系图
4. **[deployment.md](./deployment.md)** - 部署配置和流程
5. **[api.md](./api.md)** - API 定义和文档
6. **[architecture.md](./architecture.md)** - 系统架构和设计决策

## AI 模型指导

### 如何使用本上下文

1. **从本索引开始** - 了解工作区结构
2. **根据任务参考特定上下文文件** - 查看相关章节
3. **遵循开发指南** - 按照构建、测试和部署规范
4. **保持一致性** - 与现有模式和约定保持一致

### 常见任务

- **添加新功能**: 先检查架构和数据模型
- **修改页面**: 参考 views/ 目录下的现有页面
- **状态管理**: 查看 store/index.ts 了解现有状态结构
- **路由变更**: 修改 router/index.ts

### 故障排查

- 构建问题：检查依赖和配置
- 运行时问题：检查部署和环境配置
- 组件问题：参考现有组件模式

## 版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2026-04-22 | 初始上下文创建 | Context Builder |

---

*本上下文文件由 Context Builder 工具集维护。当工作区发生变更时，使用 `/asdm-context-update` 更新。*
