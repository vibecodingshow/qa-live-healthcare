# 标准项目结构

## 概述

本文档定义了在线医疗咨询平台（qa-live-healthcare）的标准项目结构。它提供了组织和维护文件目录的指南，以确保代码库的一致性和可协作性。

## 项目结构

### 整体结构

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # AI 模型上下文文件
│   │   ├── index.md                    # 工作区索引和导航
│   │   ├── standard-project-structure.md # 项目结构规范
│   │   ├── standard-coding-style.md    # 代码编写规范
│   │   ├── data-models.md              # 数据模型定义
│   │   ├── deployment.md               # 部署配置
│   │   ├── api.md                      # API 接口文档
│   │   └── architecture.md             # 系统架构
│   └── toolsets/                      # ASDM 工具集
│       ├── context-builder/            # 上下文构建工具
│       └── prototype-builder/          # 原型构建工具
├── src/                                # 源代码目录
│   ├── assets/                         # 静态资源
│   │   └── [静态资源文件]               # 图片、字体等
│   ├── components/                     # 可复用组件
│   │   ├── AppHeader.vue               # 应用头部导航
│   │   ├── AppFooter.vue               # 应用底部
│   │   └── HelloWorld.vue              # 示例组件
│   ├── views/                          # 页面视图
│   │   ├── Home.vue                    # 首页
│   │   ├── Consultation.vue            # 咨询页面
│   │   ├── Doctors.vue                 # 医生列表页
│   │   ├── DoctorLogin.vue             # 医生登录页
│   │   ├── DoctorRoom.vue              # 医生工作室
│   │   └── About.vue                   # 关于页面
│   ├── router/                         # 路由配置
│   │   └── index.ts                    # 路由定义
│   ├── store/                          # 状态管理
│   │   └── index.ts                    # Pinia store 配置
│   ├── data/                           # 静态数据
│   │   ├── doctor-user-list.json       # 医生用户数据
│   │   ├── patient-user.json           # 患者用户数据
│   │   └── question-list.json          # 问题列表数据
│   ├── App.vue                         # 根组件
│   ├── main.ts                         # 应用入口
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 类型声明
├── public/                             # 公共静态资源
│   └── [SVG图标文件]                    # 公共图标等
├── index.html                          # HTML 入口文件
├── package.json                        # 项目依赖配置
├── vite.config.ts                      # Vite 构建配置
├── tsconfig.json                       # TypeScript 基础配置
├── tsconfig.app.json                   # TypeScript 应用配置
├── tsconfig.node.json                  # TypeScript Node 配置
└── README.md                           # 项目说明文档
```

## 目录说明

### 源代码目录（src/）

#### `src/components/`

**目的**：存放可复用的 Vue 组件

**规范**：
- 组件文件使用 **PascalCase** 命名：`UserCard.vue`、`DoctorList.vue`
- 组件内部使用 **`<script setup>`** 语法（Vue 3 组合式 API）
- 样式使用 **`<style scoped>`** 限制作用域
- 组件应该职责单一，一个组件只负责一个功能块

**示例组件结构**：
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入
import { ref, computed } from 'vue';
import { Button } from 'ant-design-vue';

// Props 定义
interface Props {
  title: string;
  disabled?: boolean;
}

// Emits 定义
const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

// 响应式数据
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const handleClick = () => {
  emit('click', count.value);
};
</script>

<style scoped>
/* 组件样式 */
.component {
  padding: 16px;
}
</style>
```

#### `src/views/`

**目的**：存放页面级组件（路由组件）

**规范**：
- 页面组件命名与路由名称对应：`Home.vue`、`DoctorLogin.vue`
- 每个视图对应一个路由
- 视图组件负责页面布局和数据组装
- 复杂业务逻辑应抽取到 store 或 composables

**页面组件职责**：
1. 接收路由参数
2. 从 store 获取数据
3. 组合子组件
4. 处理页面级事件

#### `src/router/`

**目的**：集中管理路由配置

**文件**：`index.ts`

**规范**：
```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 按需导入页面组件
import Home from '../views/Home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  // 动态路由参数使用 :paramName 语法
  {
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: () => import('../views/DoctorRoom.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

#### `src/store/`

**目的**：状态管理（使用 Pinia）

**文件**：`index.ts`

**规范**：
```typescript
import { createPinia } from 'pinia';
import type { Doctor, Consultation } from 'vue-router';

interface AppState {
  doctors: Doctor[];
  currentConsultation: Consultation | null;
  isLoading: boolean;
}

const pinia = createPinia();

// Store 导出
export const store = {
  getDoctors: () => Doctor[],
  getActiveDoctors: () => Doctor[],
  getStatistics: () => Statistics,
  getDoctorByUsername: (username: string) => Doctor | undefined,
  // ... 其他方法
};
```

#### `src/data/`

**目的**：存放静态 JSON 数据文件

**规范**：
- 使用 JSON 格式存储模拟数据
- 文件命名使用 **kebab-case**：`doctor-user-list.json`
- 数据结构应与 TypeScript 接口对应

**示例数据结构**：
```typescript
// doctor-user-list.json
interface Doctor {
  id: number;
  username: string;
  name: string;
  avatar: string;
  department: string;
  title: string;
  specialties: string[];
  experience: string;
  online: boolean;
}
```

#### `src/assets/`

**目的**：存放需要处理的静态资源

**规范**：
- 图片、字体等静态文件
- 较大的资源应考虑 CDN 托管
- 小图标优先使用 Ant Design Icons

### 配置文件

#### `vite.config.ts`

**目的**：Vite 构建工具配置

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

#### `tsconfig.json`

**目的**：TypeScript 编译配置

- `tsconfig.json`：基础配置，继承自 Node 配置
- `tsconfig.app.json`：应用特定配置
- `tsconfig.node.json`：Node 环境配置

#### `package.json`

**目的**：项目依赖和脚本配置

**关键依赖**：
- `vue`：核心框架
- `vue-router`：路由管理
- `ant-design-vue`：UI 组件库
- `dayjs`：日期处理

**开发依赖**：
- `typescript`：类型系统
- `vite`：构建工具
- `vue-tsc`：类型检查

### ASDM 目录（.asdm/）

#### `.asdm/contexts/`

**目的**：存放 AI 模型的上下文文件

**文件列表**：
- `index.md`：工作区索引和导航
- `standard-project-structure.md`：项目结构规范
- `standard-coding-style.md`：代码编写规范
- `data-models.md`：数据模型定义
- `deployment.md`：部署配置
- `api.md`：API 接口文档
- `architecture.md`：系统架构

#### `.asdm/toolsets/`

**目的**：存放 ASDM 工具集

**已安装工具集**：
- `context-builder`：上下文构建工具
- `prototype-builder`：原型构建工具

### 公共目录（public/）

**目的**：存放无需处理的静态资源

**规范**：
- 直接映射到网站根路径
- 存放 favicon、robots.txt 等
- 不参与构建打包

## 文件命名规范

### Vue 组件

| 类型 | 命名方式 | 示例 | 说明 |
|------|----------|------|------|
| 页面组件 | PascalCase | `Home.vue` | 对应路由 |
| 业务组件 | PascalCase | `DoctorCard.vue` | 可复用业务组件 |
| 基础组件 | PascalCase | `BaseButton.vue` | 基础UI组件 |
| 布局组件 | PascalCase + Layout | `AppHeader.vue` | 布局相关 |

### TypeScript 文件

| 类型 | 命名方式 | 示例 | 说明 |
|------|----------|------|------|
| 类型定义 | PascalCase | `types.ts` | 导出多个类型 |
| 路由配置 | camelCase | `router.ts` | 路由相关 |
| Store | camelCase | `store.ts` | 状态管理 |
| 工具函数 | camelCase | `utils.ts` | 通用工具 |

### 配置文件

| 类型 | 命名方式 | 示例 | 说明 |
|------|----------|------|------|
| 配置 | kebab-case | `vite.config.ts` | 构建配置 |
| 数据 | kebab-case | `doctor-list.json` | 静态数据 |

## 最佳实践

### 1. 模块化设计

- **组件独立性**：每个组件应该尽可能独立，减少对外部状态的依赖
- **数据向下流动**：父组件通过 props 传递数据，子组件通过 emit 触发事件
- **单一职责**：每个文件只负责一个功能

### 2. 目录组织原则

- **按功能组织**：相关的文件放在一起
- **按角色分离**：组件、视图、路由、状态分离管理
- **避免深层嵌套**：目录层级一般不超过 3 层

### 3. 导入顺序

```typescript
// 1. Vue/框架核心
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// 2. UI 组件库
import { Button, Card } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';

// 3. 路由组件
import Home from '../views/Home.vue';

// 4. Store/状态
import { store } from '../store';

// 5. 工具函数
import { formatDate } from '../utils/date';

// 6. 类型定义
import type { Doctor } from '../types';
```

### 4. 路径别名

在 `vite.config.ts` 中配置路径别名：

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

使用：`import Home from '@/views/Home.vue'`

### 5. 类型安全

- 所有 props 和 emit 都应定义类型
- 使用 `interface` 定义对象结构
- 避免使用 `any` 类型
- 启用 TypeScript 严格模式

## 项目特定规范

### 医疗咨询平台特殊要求

1. **数据隐私**：不存储真实的患者敏感信息
2. **咨询状态**：严格区分待回复、进行中、已完成等状态
3. **医生信息**：确保医生资质信息的准确性展示

### 状态管理约定

- 医生列表数据存储在 `store/index.ts`
- 使用 `store.getActiveDoctors()` 获取在线医生
- 使用 `store.getStatistics()` 获取统计数据

### 路由约定

- 患者端路由：`/`、`/consultation`、`/doctors`、`/about`
- 医生端路由：`/doctor/login`、`/doctor/room/:username`
- 动态路由参数使用 `:paramName` 语法

## 开发流程

### 新增页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 添加路由配置
3. 如需状态管理，在 `src/store/index.ts` 添加相关方法
4. 如需静态数据，在 `src/data/` 添加 JSON 文件
5. 更新上下文文件 `architecture.md` 和相关文档

### 新增组件

1. 在 `src/components/` 创建组件文件
2. 使用 `<script setup lang="ts">` 语法
3. 定义 Props 和 Emits 类型
4. 使用 `<style scoped>` 限制样式作用域

---

**生成时间**: 2026-04-21  
**工具集**: Context Builder (ID: context-builder)  
**语言**: 简体中文 (zh-CN)
