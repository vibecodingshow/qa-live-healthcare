# 项目结构规范

## 概述

本文档定义了在线医疗问诊平台的项目结构规范，为文件和目录的组织提供指导，以保持一致性和便于协作。

## 当前项目结构

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # AI 模型上下文文件
│   └── toolsets/                      # 安装的 ASDM 工具集
├── .bolt/                              # Bolt 配置
├── .codebuddy/                         # CodeBuddy 配置
│   └── commands/                      # 快捷命令
├── public/                             # 静态公共资源
│   └── vite.svg                       # Vite 图标
├── src/                                # 源代码目录
│   ├── assets/                         # 本地资源文件
│   │   └── vue.svg                    # Vue logo
│   ├── components/                    # 公共组件
│   │   ├── AppFooter.vue             # 页脚组件
│   │   ├── AppHeader.vue             # 页头组件
│   │   └── HelloWorld.vue            # 示例组件
│   ├── data/                          # 静态数据文件
│   │   ├── doctor-user-list.json     # 医生用户列表
│   │   ├── patient-user.json          # 患者用户数据
│   │   └── question-list.json         # 问诊问题列表
│   ├── router/                        # 路由配置
│   │   └── index.ts                  # 路由定义
│   ├── store/                         # 状态管理
│   │   └── index.ts                  # Pinia/Vuex store
│   ├── views/                         # 页面视图组件
│   │   ├── Home.vue                  # 首页
│   │   ├── Consultation.vue          # 问诊页面
│   │   ├── DoctorLogin.vue           # 医生登录页
│   │   ├── DoctorRoom.vue            # 医生诊室
│   │   ├── Doctors.vue               # 医生列表
│   │   └── About.vue                 # 关于页面
│   ├── App.vue                       # 根组件
│   ├── main.ts                       # 应用入口文件
│   ├── style.css                     # 全局样式
│   └── vite-env.d.ts                # Vite 类型声明
├── index.html                         # HTML 入口文件
├── package.json                        # 项目依赖配置
├── vite.config.ts                     # Vite 构建配置
├── tsconfig.json                     # TypeScript 根配置
├── tsconfig.app.json                 # 应用 TypeScript 配置
├── tsconfig.node.json                #  Node 环境 TypeScript 配置
├── README.md                          # 项目说明文档
├── .env                              # 环境变量
└── .gitignore                        # Git 忽略规则
```

## 目录说明

### 源代码目录 (`src/`)

| 目录 | 用途 | 规范 |
|------|------|------|
| `assets/` | 存放本地静态资源（图片、字体等） | 图片使用压缩格式，字体文件控制大小 |
| `components/` | 公共可复用组件 | 组件名使用 PascalCase，如 `AppHeader.vue` |
| `data/` | JSON 静态数据文件 | 用于模拟后端数据，支持开发和测试 |
| `router/` | 路由配置 | 集中管理路由，类型安全的路由定义 |
| `store/` | 状态管理 | 包含应用全局状态和业务逻辑方法 |
| `views/` | 页面级组件 | 每个视图对应一个路由，文件名与路由相关 |

### 静态资源目录 (`public/`)

| 目录 | 用途 | 规范 |
|------|------|------|
| `public/` | 不会被构建处理的静态资源 | 直接映射到服务器根路径 |

## Vue 3 项目结构最佳实践

### 推荐的分层结构

```
src/
├── assets/                    # 构建时处理的资源
│   ├── images/               # 图片资源
│   ├── styles/               # 全局样式
│   └── fonts/                # 字体文件
├── components/                # 公共组件 (Atomic Design: atoms/molecules)
│   ├── common/               # 通用组件
│   ├── business/             # 业务组件
│   └── layout/              # 布局组件
├── composables/              # 组合式函数 (Vue 3 Composition API)
│   ├── useAuth.ts           # 认证相关逻辑
│   ├── useApi.ts            # API 调用
│   └── usePagination.ts     # 分页逻辑
├── constants/                 # 常量定义
│   ├── api.ts               # API 端点常量
│   ├── routes.ts             # 路由名称常量
│   └── config.ts            # 应用配置常量
├── hooks/                     # 自定义 hooks (与 composables 相同)
├── interfaces/                # TypeScript 接口定义
│   ├── user.ts               # 用户相关接口
│   ├── doctor.ts             # 医生相关接口
│   └── question.ts          # 问诊相关接口
├── layouts/                   # 页面布局组件
│   ├── DefaultLayout.vue    # 默认布局
│   └── BlankLayout.vue      # 空布局
├── pages/                    # 页面组件 (可选，与 views 相同)
├── router/                   # 路由管理
│   ├── index.ts             # 路由实例
│   ├── guards.ts            # 路由守卫
│   └── routes/              # 路由模块化
│       ├── index.ts
│       ├── home.ts
│       └── user.ts
├── services/                  # API 服务层
│   ├── api.ts                # axios 实例配置
│   ├── doctor.ts            # 医生相关 API
│   └── question.ts          # 问诊相关 API
├── store/                    # 状态管理
│   ├── index.ts             # store 实例
│   └── modules/             # store 模块化
│       ├── user.ts
│       └── doctor.ts
├── types/                    # 类型声明
│   ├── global.d.ts          # 全局类型声明
│   └── shims-vue.d.ts      # Vue 模块声明
├── utils/                     # 工具函数
│   ├── format.ts            # 格式化工具
│   ├── validate.ts          # 验证工具
│   └── storage.ts           # 存储工具
├── views/                    # 页面组件
│   └── [module]/            # 按模块组织
│       ├── Home.vue
│       ├── Doctor/
│       └── Consultation/
├── App.vue                   # 根组件
├── main.ts                   # 入口文件
└── env.d.ts                 # 环境变量类型
```

## 文件命名规范

### Vue 组件

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase，与路由对应 | `Home.vue`, `DoctorLogin.vue` |
| 布局组件 | `Layout` 后缀 | `DefaultLayout.vue` |
| 业务组件 | PascalCase，描述性名称 | `DoctorCard.vue`, `QuestionForm.vue` |
| 基础组件 | Atomic 命名 | `BaseButton.vue`, `BaseInput.vue` |

### TypeScript 文件

| 类型 | 规范 | 示例 |
|------|------|------|
| 接口/类型 | PascalCase | `UserInterface.ts`, `types.ts` |
| 工具函数 | camelCase | `formatDate.ts`, `validateForm.ts` |
| 组合式函数 | camelCase，`use` 前缀 | `useAuth.ts`, `usePagination.ts` |
| 样式文件 | kebab-case | `common-styles.scss` |

### 目录命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 功能目录 | kebab-case | `doctor-list/`, `question-form/` |
| 组件目录 | PascalCase 或 kebab-case | `components/`, `MyComponent/` |
| 工具目录 | camelCase | `utils/`, `helpers/` |

## 模块组织策略

### 按页面/功能组织 (推荐)

```
src/views/
├── Home/
│   ├── index.vue           # 页面入口
│   ├── components/        # 页面私有组件
│   └── composables/       # 页面私有逻辑
├── Consultation/
│   ├── index.vue
│   ├── components/
│   └── composables/
└── Doctor/
    ├── Login.vue
    ├── Room.vue
    └── components/
```

### 混合组织

对于中小型项目，可以采用混合方式：
- 公共组件放在 `components/`
- 页面组件放在 `views/`
- 复杂页面的子组件放在页面目录内的 `components/`

## 导入路径规范

```typescript
// 使用路径别名
import { store } from '@/store';
import { router } from '@/router';
import AppHeader from '@/components/AppHeader.vue';
import type { Doctor } from '@/interfaces/doctor';
```

```typescript
// vite.config.ts 配置
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }
  }
});
```

## 测试文件结构 (建议扩展)

```
src/
├── components/
│   └── __tests__/          # 组件测试
│       └── AppHeader.spec.ts
├── views/
│   └── __tests__/         # 页面测试
│       └── Home.spec.ts
└── utils/
    └── __tests__/         # 工具测试
        └── format.spec.ts
```

## 环境配置结构 (建议扩展)

```
config/
├── .env                    # 默认环境变量
├── .env.development        # 开发环境
├── .env.staging            # 预发布环境
└── .env.production         # 生产环境
```

## Git 工作流配置 (建议扩展)

```
.github/
├── workflows/
│   ├── ci.yml             # 持续集成
│   └── cd.yml             # 持续部署
└── PULL_REQUEST_TEMPLATE.md
```

## 最佳实践

### 1. 保持简洁
- 避免过度嵌套，控制在 3-4 层以内
- 每个目录应有明确的职责
- 定期重构，移除不再使用的文件和目录

### 2. 组件设计原则
- **单一职责**: 每个组件只做一件事
- **可复用性**: 通用组件放在 `components/common/`
- **可测试性**: 组件逻辑分离到 composables

### 3. 模块化
- 按功能模块组织相关文件
- 模块间通过导出接口进行通信
- 避免模块间的循环依赖

### 4. 类型安全
- 使用 TypeScript 严格模式
- 为所有接口定义类型
- 避免使用 `any` 类型

### 5. 静态数据管理
- JSON 数据文件用于模拟后端响应
- 数据结构变更时同步更新接口定义
- 生产环境应替换为真实 API 调用

## 扩展建议

随着项目发展，可以考虑以下扩展：

1. **API 服务层**: 将 API 调用封装到 `services/` 目录
2. **单元测试**: 添加 Jest/Vitest 测试框架
3. **国际化**: 添加 vue-i18n 支持多语言
4. **状态管理**: 使用 Pinia 替代当前的 reactive 方案
5. **样式预处理器**: 使用 SCSS/Less 替代普通 CSS
6. **环境配置**: 扩展 `.env` 文件支持多环境

---

*最后更新: 2026-04-21*
