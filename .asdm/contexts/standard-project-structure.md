# 标准项目结构

## 概述

本文档定义了 Vue 3 + TypeScript + Vite 应用的标准项目结构规范。项目遵循 Vue.js 最佳实践，并结合医疗问诊领域的组织方式。

## 目录结构

### 根目录结构

```
qa-live-healthcare/
├── src/                    # 源代码
├── public/                 # 静态公共资源
├── .asdm/                  # ASDM 工具集配置
├── .codebuddy/             # CodeBuddy 配置
├── .git/                   # Git 版本控制
├── node_modules/           # 依赖（自动生成）
├── package.json            # 项目依赖和脚本
├── package-lock.json       # 依赖锁定文件
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 构建配置
├── index.html              # HTML 入口
└── README.md               # 项目文档
```

### 源代码结构（`src/`）

#### 当前实际结构

```
src/
├── assets/                 # 静态资源（图片、图标）
│   └── vue.svg             # Vue 图标
├── components/             # 可复用 Vue 组件
│   ├── AppHeader.vue       # 全局顶部导航栏
│   ├── AppFooter.vue       # 全局底部页脚
│   └── HelloWorld.vue      # 脚手架示例（未使用，可清理）
├── views/                  # 页面级组件（路由组件）
│   ├── Home.vue            # 首页
│   ├── Consultation.vue    # 患者问诊
│   ├── DoctorLogin.vue     # 医生登录
│   ├── DoctorRoom.vue      # 医生诊室
│   ├── Doctors.vue         # 医生列表
│   └── About.vue           # 关于我们
├── router/                 # Vue Router 配置
│   └── index.ts            # 路由定义（7 条路由）
├── store/                  # 状态管理
│   └── index.ts            # reactive Store + 接口定义
├── data/                   # 静态 JSON 数据
│   ├── doctor-user-list.json   # 医生列表（5 条）
│   ├── patient-user.json       # 患者列表（5 条）
│   └── question-list.json      # 问题列表（7 条）
├── App.vue                 # 根 Vue 组件
├── main.ts                 # 应用入口
├── style.css               # 全局样式
└── vite-env.d.ts           # Vite 环境类型声明
```

#### 推荐的扩展结构

当项目规模增长时，建议按以下方式扩展：

```
src/
├── assets/                 # 静态资源
│   ├── images/             # 图片文件
│   ├── icons/              # 图标文件（优先 SVG）
│   └── fonts/              # 自定义字体
├── components/             # 可复用组件
│   ├── common/             # 通用共享组件
│   ├── forms/              # 表单相关组件
│   └── layout/             # 布局组件（Header、Footer、Sidebar）
├── views/                  # 页面级组件
├── router/                 # 路由配置
│   ├── index.ts            # 主路由配置
│   └── guards/             # 路由守卫和权限
├── store/                  # 状态管理
│   ├── index.ts            # Store 配置
│   └── modules/            # Store 模块（如拆分 Pinia）
├── services/               # API 服务和数据层
├── utils/                  # 工具函数和辅助方法
├── types/                  # TypeScript 类型定义
└── styles/                 # 全局样式和主题
```

## 医疗领域组织方式

### 领域模块划分

当业务复杂度提升时，建议按领域组织代码：

```
src/
├── domains/                # 领域模块
│   ├── doctors/            # 医生领域
│   │   ├── components/     # 医生相关组件
│   │   ├── services/       # 医生 API 服务
│   │   └── types/          # 医生数据类型
│   ├── patients/           # 患者领域
│   │   ├── components/     # 患者相关组件
│   │   ├── services/       # 患者 API 服务
│   │   └── types/          # 患者数据类型
│   └── consultations/      # 问诊领域
│       ├── components/     # 问诊相关组件
│       ├── services/       # 问诊 API 服务
│       └── types/          # 问诊数据类型
```

## 文件命名规范

### 组件文件
- 使用 **PascalCase** 命名组件文件：`PatientCard.vue`、`DoctorRoom.vue`
- 使用 **kebab-case** 注册组件：`patient-card`、`doctor-room`
- Vue 单文件组件使用 `.vue` 扩展名

### TypeScript 文件
- 工具文件使用 **camelCase**：`apiHelper.ts`、`validationUtils.ts`
- 类和类型使用 **PascalCase**：`PatientModel.ts`、`DoctorService.ts`

### 样式文件
- 使用 **kebab-case** 命名样式文件：`patient-card.css`、`global-styles.css`

## 模块组织原则

### 关注点分离
- **Components**：处理 UI 渲染和用户交互
- **Services**：处理 API 通信和业务逻辑
- **Store**：管理应用状态
- **Utils**：提供可复用的工具函数

### 可扩展性考虑
- 使用模块化架构便于添加新功能
- 为医疗数据实现适当的错误处理
- 确保数据隐私和安全合规

## 新功能开发指南

### 开发流程
1. 在合适的目录下创建功能文件
2. 添加组件、服务（如需）和类型定义
3. 更新路由配置（如需新页面）
4. 添加 Store 方法（如需状态管理）
5. 在 `data/` 中添加静态数据（如需）

### 组件开发
- 保持组件单一职责
- 使用 Composition API 处理复杂逻辑
- 实现完整的 TypeScript 类型标注
- 遵循 Vue 3 最佳实践

## 构建输出结构

```
dist/                       # 生产构建输出
├── assets/                 # 编译后的资源文件
│   ├── index-[hash].js     # 主 JS 包
│   └── index-[hash].css    # 主 CSS 包
└── index.html              # 入口 HTML
```

---

*此文件由 ASDM Context Builder 工具集生成。最后更新: 2026-04-22*
