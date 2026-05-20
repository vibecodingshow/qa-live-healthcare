# 项目结构标准文档

## 概述

本文档定义了在线医疗健康咨询平台（qa-live-healthcare）的标准项目结构。它提供了组织文件和目录的指南，以保持一致性并促进协作。

## 当前项目结构

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # AI 上下文文件
│   └── toolsets/                       # 已安装的工具集
├── .codebuddy/                         # CodeBuddy 配置
│   └── commands/                       # 自定义命令
├── public/                             # 静态公共资源
│   └── *.svg                           # SVG 图标文件
├── src/                                # 源代码目录
│   ├── assets/                         # 资源文件
│   ├── components/                     # 公共组件
│   ├── data/                           # 本地数据文件
│   ├── router/                         # 路由配置
│   ├── store/                          # 状态管理
│   ├── views/                          # 页面视图组件
│   ├── App.vue                         # 根组件
│   ├── main.ts                         # 应用入口文件
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 类型声明
├── index.html                          # HTML 入口文件
├── package.json                        # 项目依赖配置
├── tsconfig.json                       # TypeScript 根配置
├── tsconfig.app.json                   # 应用 TypeScript 配置
├── tsconfig.node.json                  # 节点 TypeScript 配置
├── vite.config.ts                      # Vite 构建配置
├── README.md                           # 项目说明文档
└── .gitignore                          # Git 忽略规则
```

## 目录说明

### 核心目录

| 目录 | 用途 | 规范 |
|------|------|------|
| `src/` | 所有源代码存放位置 | 禁止放静态资源 |
| `src/views/` | 页面级组件，每个页面一个文件 | 使用 PascalCase |
| `src/components/` | 可复用组件 | 按功能模块组织 |
| `src/router/` | 路由配置 | 集中管理路由 |
| `src/store/` | 状态管理 | 单一数据源 |
| `src/data/` | 本地 JSON 数据 | 仅存放静态数据 |
| `src/assets/` | 需处理的资源 | 图片、字体等 |
| `public/` | 无需处理的静态资源 | 直接复制到输出目录 |

### 配置目录

| 目录/文件 | 用途 |
|-----------|------|
| `vite.config.ts` | Vite 构建配置 |
| `tsconfig.json` | TypeScript 配置 |
| `package.json` | npm 依赖和脚本 |
| `.gitignore` | Git 忽略文件模式 |

## 源代码结构详解

### Vue 3 应用结构

```
src/
├── main.ts                 # 应用入口
│   ├── 挂载 Vue 实例
│   ├── 引入路由
│   ├── 引入全局样式
│   └── 引入 UI 组件库
│
├── App.vue                 # 根组件
│   ├── 布局组件
│   ├── 路由视图
│   └── 全局状态
│
├── router/
│   └── index.ts           # 路由配置
│       ├── 路由定义
│       ├── 路由守卫
│       └── 路由元信息
│
├── store/
│   └── index.ts           # 状态管理
│       ├── 数据接口定义
│       ├── 状态对象
│       └── 操作方法
│
├── views/                 # 页面组件
│   ├── Home.vue           # 首页
│   ├── Consultation.vue   # 咨询页面
│   ├── DoctorLogin.vue    # 医生登录
│   ├── DoctorRoom.vue     # 医生诊室
│   ├── Doctors.vue        # 医生列表
│   └── About.vue          # 关于页面
│
├── components/            # 公共组件
│   ├── AppHeader.vue      # 页头组件
│   ├── AppFooter.vue      # 页脚组件
│   └── HelloWorld.vue     # 示例组件
│
├── data/                  # 本地数据
│   ├── doctor-user-list.json    # 医生数据
│   ├── patient-user.json        # 患者数据
│   └── question-list.json       # 咨询问题数据
│
├── assets/                # 资源文件
│   └── (图片、字体等)
│
└── style.css              # 全局样式
```

### 页面组件职责（Views）

| 页面 | 路由 | 职责 |
|------|------|------|
| `Home.vue` | `/` | 首页，展示平台概览 |
| `Consultation.vue` | `/consultation` | 患者发起咨询页面 |
| `Doctors.vue` | `/doctors` | 医生列表页面 |
| `About.vue` | `/about` | 关于页面 |
| `DoctorLogin.vue` | `/doctor/login` | 医生登录页面 |
| `DoctorRoom.vue` | `/doctor/room/:username` | 医生诊室页面 |

### 公共组件职责（Components）

| 组件 | 用途 | 依赖 |
|------|------|------|
| `AppHeader.vue` | 页面顶部导航栏 | Ant Design Vue |
| `AppFooter.vue` | 页面底部版权信息 | - |
| `HelloWorld.vue` | 示例/测试组件 | Vue |

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `DoctorLogin.vue` |
| TypeScript 文件 | camelCase | `index.ts` |
| 路由文件 | camelCase | `router/index.ts` |
| 数据文件 | kebab-case | `doctor-user-list.json` |
| 样式文件 | kebab-case | `style.css` |
| 配置文件 | kebab-case | `vite.config.ts` |

### 目录命名

| 目录 | 规范 | 示例 |
|------|------|------|
| 源代码目录 | PascalCase | `components/` |
| 页面目录 | PascalCase | `views/` |
| 路由目录 | camelCase | `router/` |
| 状态管理目录 | camelCase | `store/` |
| 资源目录 | kebab-case | `public/` |
| ASDM 目录 | kebab-case | `.asdm/` |

### 代码命名

```typescript
// 接口命名 - PascalCase，前缀表示类型
interface Doctor {}
interface Patient {}
interface Question {}

// 方法命名 - camelCase，动宾结构
loginDoctor()
verifyPatient()
addQuestion()
getQuestionsByDoctor()

// 变量命名 - camelCase
const currentDoctor
const questionList
```

## 路由配置规范

```typescript
// src/router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: DoctorRoom,
    props: true,  // 路由参数作为 props 传递
  },
];
```

## 状态管理规范

```typescript
// src/store/index.ts
interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

export const store = {
  state,

  // 方法必须是箭头函数以保持 this 上下文
  loginDoctor(username: string, password: string): Doctor | null {
    // ...
  },
};
```

## 数据文件规范

### JSON 数据文件

```json
// src/data/doctor-user-list.json
[
  {
    "id": "doc001",
    "username": "dr-zhang-wei",
    "password": "123456",
    "name": "张伟医生",
    "title": "主任医师",
    "department": "心内科",
    "avatar": "https://...",
    "experience": "15年临床经验",
    "specialties": ["高血压", "冠心病"],
    "isActive": true
  }
]
```

### 字段命名规范

- 使用 camelCase 或 snake_case（JSON 中常用 camelCase）
- ID 使用字符串类型
- 布尔值使用 is/has/can 前缀
- 数组使用复数名词

## 组件开发规范

### Vue 组件结构

```vue
<!-- src/components/ComponentName.vue -->
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// 导入语句

// Props 定义
interface Props {
  title: string;
  count?: number;
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// Emits 定义
const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

// 响应式数据
const data = ref();

// 计算属性
const computedValue = computed(() => data.value * 2);

// 方法
function handleClick() {
  emit('update', computedValue.value);
}
</script>

<style scoped>
.component-name {
  /* 组件样式 */
}
</style>
```

## 构建和部署

### 开发命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 类型检查并构建
npm run build

# 预览生产构建
npm run preview
```

### 构建产物

```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── index.html
└── (其他静态资源)
```

## 扩展项目结构

随着项目发展，可扩展以下目录：

| 新增目录 | 用途 | 创建时机 |
|----------|------|----------|
| `src/api/` | API 请求封装 | 添加后端接口时 |
| `src/utils/` | 工具函数 | 需要复用工具时 |
| `src/types/` | 类型定义文件 | 类型较多时 |
| `src/composables/` | 组合式函数 | 需要复用逻辑时 |
| `src/constants/` | 常量定义 | 常量较多时 |
| `tests/` | 测试文件 | 添加测试时 |

---

*本项目结构文档会随着项目演进而更新。工作区发生变更时使用 `/asdm-context-update` 更新。*
