# 代码风格标准

## 概述

本文档定义了 QA Live Healthcare 项目的编码标准和风格指南。一致的代码风格可提高可读性、可维护性和团队协作效率。

## 通用原则

### 1. 可读性优先

- 代码应易于阅读和理解
- 使用有意义的变量、函数和组件名称
- 编写自解释的代码，明确意图

### 2. 一致性

- 在整个代码库中遵循相同的模式
- 使用语言和框架的既定约定
- 保持团队成员之间的一致性

### 3. 可维护性

- 编写易于修改和扩展的代码
- 保持函数和组件专注于单一职责
- 避免不必要的复杂性

## TypeScript 规范

### 命名约定

```typescript
// 变量和函数 - camelCase
const userName = '张三';
const getDoctorById = (id: string) => { };

// 类型和接口 - PascalCase
interface Doctor {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  birthday: string;
}

// 类型别名 - PascalCase
type QuestionStatus = 'pending' | 'answered';

// 枚举成员 - PascalCase
enum OrderStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
}

// 常量 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = '/api';
```

### 类型注解

```typescript
// 始终指定返回类型
function addQuestion(question: Omit<Question, 'id'>): Question {
  return { id: `q${Date.now()}`, ...question };
}

// 显式类型优于 any
// ❌ 避免
function processData(data: any) { }

// ✅ 推荐
function processData(data: Question) { }

// 使用 interface 定义对象结构
interface Doctor {
  id: string;
  username: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  isActive: boolean;
}

// 使用 type 定义联合类型
type QuestionStatus = 'pending' | 'answered';

// 可选属性使用 ?
interface Patient {
  id: string;
  name: string;
  phone?: string;  // 可选
}

// 只读属性
interface Config {
  readonly apiUrl: string;
}
```

### 代码格式化

```typescript
// 使用 2 空格缩进
function example() {
  if (condition) {
    doSomething();
  }
}

// 字符串使用单引号
const message = '你好';

// 模板字符串用于插值
const greeting = `欢迎 ${userName}`;

// 一行一个语句
// ❌ 避免
const a = 1; const b = 2;

// ✅ 推荐
const a = 1;
const b = 2;

// 使用分号
const name = '张三';
```

## Vue 3 组件规范

### 组件结构

```vue
<script setup lang="ts">
// 1. 导入依赖（按顺序：Vue → 路由 → 组件库 → Store → 其他）
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { store, Doctor, Patient } from '../store';

// 2. 定义 Props 和 Emits
// const props = defineProps<{ doctorId: string }>();
// const emit = defineEmits<{ (e: 'update', value: string): void }>();

// 3. 响应式状态（ref 用于基本类型，reactive 用于对象）
const loading = ref(false);
const selectedDoctor = ref<Doctor | null>(null);
const formData = reactive({
  name: '',
  question: '',
});

// 4. 计算属性
const isValid = computed(() => formData.name.length > 0);
const activeDoctors = computed(() => store.getActiveDoctors());

// 5. 监听器（必要时使用）
// watch(() => route.params.id, (newId) => { ... });

// 6. 方法
const handleSubmit = () => {
  if (!isValid.value) return;
  // 处理逻辑
};

// 7. 生命周期钩子
onMounted(() => {
  loadData();
});
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式内容（使用 scoped 隔离） */
</style>
```

### 组件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase + 功能描述 | `Home.vue`, `DoctorLogin.vue` |
| 公共组件 | PascalCase + 功能描述 | `AppHeader.vue`, `AppFooter.vue` |
| 基础组件 | PascalCase + 基础类型 | `BaseButton.vue` |

### 模板规范

```vue
<!-- 使用明确的指令 -->
<div v-if="isVisible" class="container">
  <span>{{ title }}</span>
</div>

<!-- 使用 : 绑定属性 -->
<a-button type="primary" :disabled="loading" @click="handleClick">
  提交
</a-button>

<!-- 使用 @ 绑定事件 -->
<a-input @change="handleChange" @blur="handleBlur" />

<!-- 使用 # 使用插槽 -->
<template #prefix>
  <SearchOutlined />
</template>

<!-- 列表渲染使用 :key -->
<div v-for="doctor in doctors" :key="doctor.id">
  {{ doctor.name }}
</div>
```

### Props 定义

```typescript
// 使用 TypeScript 类型定义
interface Props {
  title: string;
  count?: number;        // 可选属性
  items?: string[];      // 数组类型
}

// 带默认值的 Props
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => [],
});

// 或使用 defineProps + 默认值
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
});
```

### 事件定义

```typescript
// 定义 Emits
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'submit', data: FormData): void;
}>();

// 调用事件
emit('update', newValue);
emit('submit', formData);
```

## Store 规范

### Store 结构

```typescript
// 1. 导入依赖
import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';

// 2. 定义接口
export interface Doctor {
  id: string;
  username: string;
  name: string;
  // ...
}

export interface Patient {
  id: string;
  name: string;
  // ...
}

// 3. 定义 State 接口
interface State {
  doctors: Doctor[];
  patients: Patient[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
}

// 4. 创建响应式状态
const state = reactive<State>({
  doctors: doctorData as Doctor[],
  patients: [],
  currentDoctor: null,
  currentPatient: null,
});

// 5. 导出 store 对象
export const store = {
  state,

  // 方法应明确命名
  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    );
    if (doctor) {
      state.currentDoctor = doctor;
      return doctor;
    }
    return null;
  },

  logoutDoctor() {
    state.currentDoctor = null;
  },
};
```

### Store 方法命名

| 操作 | 方法命名 | 示例 |
|------|----------|------|
| 获取单个 | `get` + 名称 | `getDoctorById()` |
| 获取列表 | `get` + 名称 + `s` | `getActiveDoctors()` |
| 添加 | `add` + 名称 | `addQuestion()` |
| 更新 | `update` + 名称 | `updateQuestion()` |
| 删除 | `delete` + 名称 | `deleteQuestion()` |
| 登录 | `login` + 角色 | `loginDoctor()` |
| 登出 | `logout` + 角色 | `logoutPatient()` |

## 样式规范

### CSS 书写顺序

```css
.selector {
  /* 1. 定位 */
  position: absolute;
  top: 0;
  left: 0;

  /* 2. 盒子模型 */
  display: flex;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;

  /* 3. 文字 */
  font-size: 16px;
  color: #333;
  text-align: center;

  /* 4. 背景 */
  background: #fff;

  /* 5. 其他 */
  opacity: 1;
  transition: all 0.3s;
}
```

### 样式命名

```css
/* 使用 kebab-case */
.page-header { }
.doctor-card { }
.consultation-form { }

/* 元素选择器后不使用标签名 */
.card { }           /* ✅ */
div.card { }        /* ❌ */

/* BEM 命名（必要时） */
.question-item__title { }
.question-item--active { }
```

### 响应式断点

```css
/* 移动端优先 */
@media (max-width: 768px) {
  /* 手机端样式 */
}

@media (min-width: 769px) {
  /* 平板端样式 */
}

@media (min-width: 1024px) {
  /* 桌面端样式 */
}
```

### 颜色使用

```css
/* 使用 Ant Design 主题色 */
--primary-color: #1890ff;    /* 主色 */
--success-color: #52c41a;   /* 成功色 */
--warning-color: #faad14;   /* 警告色 */
--error-color: #ff4d4f;     /* 错误色 */

/* 使用设计系统颜色变量 */
color: var(--text-color);
background: var(--background-color);
```

## 文件组织规范

### 导入顺序

```typescript
// 1. Vue 核心
import { ref, reactive, computed } from 'vue';
import { watch, onMounted } from 'vue';

// 2. Vue Router
import { useRoute, useRouter } from 'vue-router';

// 3. UI 组件库
import { message, Modal } from 'ant-design-vue';
import { UserOutlined, SearchOutlined } from '@ant-design/icons-vue';

// 4. Store 和状态管理
import { store, Doctor, Patient } from '../store';

// 5. 其他模块
import dayjs from 'dayjs';

// 6. 类型定义
import type { FormInstance } from 'ant-design-vue';

// 7. 相对路径组件
import AppHeader from './components/AppHeader.vue';
```

### 组件文件位置

```
src/
├── components/          # 公共组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── ...
├── views/               # 页面组件
│   ├── Home.vue
│   ├── Consultation.vue
│   └── ...
├── router/
│   └── index.ts
├── store/
│   └── index.ts
└── data/
    └── *.json
```

## 注释规范

### 何时注释

- 解释"为什么"而不是"是什么"（代码应自解释）
- 记录复杂的业务逻辑或算法
- 说明变通方案或临时解决方案
- 记录公开 API 和接口

### 注释样式

```typescript
/**
 * 添加新问题到问诊列表
 * @param question - 问题内容（不含 id、时间、状态等自动生成字段）
 * @returns 创建的问题对象
 */
function addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status'>): Question {
  const newQuestion: Question = {
    ...question,
    id: `q${Date.now()}`,
    submitTime: new Date().toISOString(),
    status: 'pending',
    answer: null,
    answerTime: null,
  };
  state.questions.push(newQuestion);
  return newQuestion;
}

// 内联注释用于复杂逻辑
// 使用 dayjs 格式化时间
const formattedTime = dayjs(time).format('YYYY-MM-DD HH:mm');

// TODO 注释
// TODO: 后续实现真实 API 调用
```

## 错误处理规范

```typescript
// 表单验证
const handleSubmit = () => {
  if (!formData.name.trim()) {
    message.error('请输入姓名');
    return;
  }

  if (!formData.question.trim()) {
    message.error('请输入问题');
    return;
  }

  // 业务逻辑
};

// 条件检查
const verifyPatient = () => {
  if (!authForm.birthday) {
    message.error('请选择生日');
    return;
  }

  // 验证逻辑
  store.verifyPatient(authForm.name, birthday);
  message.success('验证成功');
};
```

## Git 提交规范

### 提交信息格式

```
<类型>: <简短描述>

[可选的详细描述]
```

### 提交类型

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat: 添加医生登录功能` |
| fix | 修复 Bug | `fix: 修复问诊提交失败问题` |
| docs | 文档更新 | `docs: 更新 README` |
| style | 代码格式 | `style: 格式化组件样式` |
| refactor | 重构 | `refactor: 重构 Store 结构` |
| test | 测试 | `test: 添加问诊流程测试` |

### 示例

```
feat: 添加医生回复问题功能

- 添加 answerQuestion 方法
- 更新问题状态为 answered
- 显示回复时间
```

## ESLint 配置

项目使用 TypeScript + Vue 3，应配置以下规则：

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-debugger": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/multi-word-component-names": "off"
  }
}
```

## 快捷命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建结果 |

---

*本代码风格文档会随项目演进而更新。建议定期审查和更新。使用 `/asdm-context-update` 更新上下文。*
