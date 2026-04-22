# 标准项目结构

## 项目概述
QA Live Healthcare 是一个基于 Vue 3 + TypeScript + Vite 的在线医疗问诊平台前端应用。项目采用现代化的前端技术栈，提供医生与患者之间的实时在线咨询功能。

## 目录结构详解

### 根目录结构
```
qa-live-healthcare-main/
├── src/                          # 源代码目录
│   ├── components/               # 公共组件
│   ├── views/                    # 页面视图组件
│   ├── router/                   # 路由配置
│   ├── store/                    # 状态管理
│   ├── data/                     # 静态数据
│   ├── assets/                   # 静态资源
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 应用入口
│   ├── style.css                 # 全局样式
│   └── vite-env.d.ts             # Vite 类型定义
├── public/                       # 公共静态资源
├── .asdm/                        # ASDM 配置目录
│   └── contexts/                 # 上下文文件
├── .codebuddy/                   # CodeBuddy 配置目录
├── package.json                  # 项目配置和依赖
├── vite.config.ts               # Vite 构建配置
├── tsconfig.json                # TypeScript 配置
├── index.html                   # HTML 入口文件
└── README.md                    # 项目说明文档
```

### 核心目录功能

#### src/components/ - 公共组件
- **AppHeader.vue**: 应用头部导航组件
- **AppFooter.vue**: 应用底部组件
- **HelloWorld.vue**: 示例组件

#### src/views/ - 页面视图
- **Home.vue**: 首页，展示平台介绍和统计信息
- **Consultation.vue**: 问诊页面
- **DoctorLogin.vue**: 医生登录页面
- **DoctorRoom.vue**: 医生诊室页面
- **Doctors.vue**: 医生列表页面
- **About.vue**: 关于页面

#### src/router/ - 路由配置
- **index.ts**: 路由定义和配置

#### src/store/ - 状态管理
- 应用状态管理和数据存储

#### src/data/ - 静态数据
- 医生信息、诊室数据等静态配置

## 技术架构

### 前端框架
- **Vue 3**: 使用组合式 API (Composition API)
- **TypeScript**: 提供类型安全和更好的开发体验

### UI 组件库
- **Ant Design Vue**: 企业级 UI 组件库
- 包含丰富的图标和交互组件

### 路由管理
- **Vue Router**: 单页面应用路由管理

### 构建工具
- **Vite**: 快速的构建工具和开发服务器
- **vue-tsc**: Vue 类型检查工具

### 样式处理
- **CSS**: 使用标准 CSS 和 CSS3 特性
- 支持响应式设计和移动端适配

## 项目特色功能

### 核心业务模块
1. **首页展示**
   - 平台介绍和特色功能展示
   - 实时统计信息（医生数量、问题总数等）
   - 开放诊室列表

2. **问诊功能**
   - 患者与医生实时沟通
   - 诊室管理和状态跟踪

3. **医生管理**
   - 医生登录和认证
   - 诊室创建和管理

### 用户体验特性
- 响应式设计，支持移动端访问
- 现代化的界面设计
- 流畅的页面切换和动画效果
- 直观的导航和操作流程

## 开发规范

### 文件命名约定
- Vue 组件：PascalCase (如 `AppHeader.vue`)
- TypeScript 文件：camelCase (如 `main.ts`)
- 目录：kebab-case (如 `components/`)

### 代码组织原则
- 组件化开发，保持组件的单一职责
- 状态集中管理，使用 Vuex 或 Pinia
- 路由按功能模块划分
- 样式按组件作用域组织

## 部署结构

### 构建输出
构建后的项目结构：
```
dist/
├── assets/           # 打包后的静态资源
├── index.html        # 入口 HTML 文件
└── 其他构建文件
```

### 环境配置
- 开发环境：Vite 开发服务器
- 生产环境：Vite 构建输出

## 扩展性考虑

项目结构设计考虑了未来的扩展需求：
- 支持模块化开发
- 易于添加新的功能模块
- 良好的代码组织结构便于维护
- 清晰的目录结构便于新成员上手

---
*此文件由 Context Builder 工具集生成，最后更新于 2026-04-21*