# 编码规范

## 概述

本文档定义了在线医疗问诊平台的编码标准和样式指南。一致的编码风格可提高可读性、可维护性和团队协作效率。

## 通用原则

### 1. 可读性优先

- 代码应易于阅读和理解
- 使用有意义的变量、函数和类名
- 编写自解释的代码，明确表达意图

### 2. 一致性

- 在整个代码库中遵循相同的模式
- 使用语言和框架的既定约定
- 保持团队成员之间的风格一致

### 3. 可维护性

- 编写易于修改和扩展的代码
- 保持函数和类的单一职责
- 避免不必要的复杂性

## TypeScript/JavaScript 规范

### 命名约定

```typescript
// 变量和函数 - camelCase
const userName = '张三';
function calculateTotal() { }

// 类和接口 - PascalCase
class UserService { }
interface UserData { }

// 常量 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 类型别名 - PascalCase
type DoctorStatus = 'active' | 'inactive';
```

### 代码格式

```typescript
// 使用 2 空格缩进
function example() {
  if (condition) {
    // ...
  }
}

// 一致使用分号
const name = '张三';

// 最大行长度：100 字符
// 长行需换行以提高可读性

// 字符串使用单引号
const message = '你好';
const template = `Hello ${name}`;
```

### 类型注解

```typescript
// 始终指定返回类型
function add(a: number, b: number): number {
  return a + b;
}

// 优先使用显式类型，避免 any
// 不推荐
function process(data: any) { }

// 推荐
function process(data: UserData) { }

// 使用 interface 定义对象结构
interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  isActive: boolean;
}
```

## Vue 3 规范

### 组件结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { store } from '../store';
import type { Doctor } from '../store';

// 2. 响应式状态
const doctors = ref<Doctor[]>([]);
const loading = ref(false);

// 3. 计算属性
const activeDoctors = computed(() => 
  doctors.value.filter(d => d.isActive)
);

// 4. 方法
const fetchDoctors = async () => {
  loading.value = true;
  // ...
  loading.value = false;
};

// 5. 生命周期
onMounted(() => {
  fetchDoctors();
});
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

### Props 定义

```typescript
// 使用 defineProps 和类型定义
const props = defineProps<{
  doctor: Doctor;
  isSelectable?: boolean;
}>();

// 带默认值的 props
const props = withDefaults(defineProps<{
  title: string;
  size?: 'small' | 'medium' | 'large';
}>(), {
  size: 'medium'
});
```

### 事件定义

```typescript
// 定义 emits
const emit = defineEmits<{
  (e: 'select', doctor: Doctor): void;
  (e: 'update', value: string): void;
}>();

// 触发事件
emit('select', doctor);
```

## 状态管理规范

### Store 结构

```typescript
// src/store/index.ts
import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';

export interface Doctor {
  id: string;
  username: string;
  name: string;
  // ...
}

// 状态接口
interface State {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
}

// 响应式状态
const state = reactive<State>({
  doctors: doctorData as Doctor[],
  currentDoctor: null,
});

// Store API
export const store = {
  state,

  loginDoctor(username: string, password: string): Doctor | null {
    // 实现逻辑
  },

  logoutDoctor() {
    state.currentDoctor = null;
  },
};
```

## 路由规范

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Consultation from '../views/Consultation.vue';

// 路由记录类型
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/consultation/:doctorUsername?',
    name: 'Consultation',
    component: Consultation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

## 注释规范

### 何时注释

- 解释"为什么"而非"是什么"（代码应自解释）
- 记录复杂的算法或业务逻辑
- 标注临时解决方案或变通方法
- 为公共 API 和接口添加文档

### 注释样式

```typescript
/**
 * 根据用户名获取医生信息
 * 
 * @param username - 医生用户名
 * @returns 医生对象，未找到则返回 undefined
 */
function getDoctorByUsername(username: string): Doctor | undefined {
  // 处理特殊情况
  return state.doctors.find(d => d.username === username);
}
```

## JSON 数据规范

```json
{
  "// 注释键": "说明",
  "id": "doc001",
  "name": "张伟医生",
  "isActive": true
}
```

### 数据验证规则

```typescript
// 医生数据验证
const doctorValidationRules = {
  id: {
    required: true,
    pattern: /^doc\d{3}$/,
  },
  username: {
    required: true,
    minLength: 3,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  specialties: {
    required: true,
    minItems: 1,
  },
};

// 问诊问题数据验证
const questionValidationRules = {
  patientId: {
    required: true,
  },
  doctorId: {
    required: true,
  },
  question: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  status: {
    required: true,
    enum: ['pending', 'answered'],
  },
};
```

## API 调用规范（本项目使用模拟数据）

```typescript
// 模拟 API 调用（实际项目中替换为真实 API）
const api = {
  async getDoctors(): Promise<Doctor[]> {
    return store.state.doctors;
  },

  async getDoctor(username: string): Promise<Doctor | undefined> {
    return store.getDoctorByUsername(username);
  },

  async submitQuestion(data: QuestionData): Promise<Question> {
    return store.addQuestion(data);
  },
};
```

## 错误处理规范

```typescript
// 使用 try-catch 处理预期错误
try {
  const doctor = store.loginDoctor(username, password);
  if (!doctor) {
    throw new Error('用户名或密码错误');
  }
} catch (error) {
  console.error('登录失败:', error);
  // 显示错误提示
}

// 不要吞掉异常
// 不推荐
try {
  riskyOperation();
} catch (e) {
  // 空捕获块
}

// 推荐
try {
  riskyOperation();
} catch (e) {
  console.error('操作失败', e);
  throw new Error('操作失败，请重试');
}
```

## 样式规范

### CSS 命名

- 使用 kebab-case
- 使用语义化类名
- 组件样式添加 `scoped`

```vue
<style scoped>
.app-header {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}
</style>
```

### 响应式设计

```css
/* 使用媒体查询 */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 40px 24px;
  }
}
```

## 相关文档

- [项目结构](./standard-project-structure.md)
- [数据模型](./data-models.md)

---

*本编码规范基于 Vue 3 + TypeScript 最佳实践制定，可根据团队需求进行调整。*
