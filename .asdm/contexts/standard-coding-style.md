# 代码风格标准

## 概述

本文档定义了 QA Live Healthcare 项目的编码标准和样式指南。统一的代码风格可提高可读性、可维护性，并促进团队协作。

**技术栈**：Vue 3 + TypeScript + Ant Design Vue + Vite

## 基本原则

### 1. 可读性优先
- 代码应易于阅读和理解
- 使用有意义的变量、函数和组件名称
- 编写自解释的代码

### 2. 一致性
- 整个代码库遵循相同模式
- 使用语言和框架的既定约定
- 团队成员保持一致

### 3. 可维护性
- 编写易于修改和扩展的代码
- 保持函数和组件职责单一
- 避免不必要的复杂性

## TypeScript 命名规范

### 变量和函数

```typescript
// ✅ 推荐：使用 camelCase
const userName = '张三';
const isActive = true;
function calculateTotal() { }
function getDoctorById() { }

// ❌ 避免：语义不明确
const n = '张三';
const flag = true;
function calc() { }
```

### 接口和类型

```typescript
// ✅ 推荐：使用 PascalCase
interface User {
  id: string;
  name: string;
  email: string;
}

interface Doctor extends User {
  title: string;
  department: string;
  specialties: string[];
}

// ✅ 推荐：类型别名使用 PascalCase
type QuestionStatus = 'pending' | 'answered';
```

### 常量

```typescript
// ✅ 推荐：全大写 + 下划线
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const PAGE_SIZE = 10;
```

### 私有成员

```typescript
// 不使用下划线前缀，TypeScript 用 private 修饰符
class UserService {
  private cache: Map<string, User>;
  
  private fetchUser(id: string): User {
    // ...
  }
}
```

## Vue 组件规范

### 组件结构

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Card } from 'ant-design-vue';

// 2. Props 定义
interface Props {
  title: string;
  data?: DataType[];
}

// 3. Props 声明（使用 withDefaults）
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
});

// 4. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: DataType): void;
  (e: 'delete', id: string): void;
}>();

// 5. 响应式数据
const loading = ref(false);
const selectedId = ref<string | null>(null);

// 6. 计算属性
const filteredData = computed(() => {
  return props.data.filter(item => item.active);
});

// 7. 方法
const handleClick = () => {
  // ...
};

// 8. 生命周期钩子
onMounted(() => {
  // ...
});
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式内容 */
</style>
```

### 组件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase，与路由对应 | `DoctorProfile.vue` |
| 公共组件 | PascalCase | `AppHeader.vue`、`DataTable.vue` |
| 原子组件 | PascalCase + 前缀 | `BaseButton.vue`、`BaseInput.vue` |
| 业务组件 | PascalCase + 业务前缀 | `DoctorCard.vue`、`QuestionList.vue` |

### Props 定义

```typescript
// ✅ 推荐：使用 TypeScript 接口 + withDefaults
interface Props {
  title: string;           // 必需
  data?: DataType[];       // 可选
  size?: 'small' | 'medium' | 'large';  // 可选 + 类型联合
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  size: 'medium',
  disabled: false,
});

// ❌ 避免：使用对象语法
// props: {
//   title: String,
//   data: Array,
// }
```

### Emit 定义

```typescript
// ✅ 推荐：使用 defineEmits 泛型
const emit = defineEmits<{
  (e: 'update', value: DataType): void;
  (e: 'delete', id: string): void;
  (e: 'click'): void;
}>();

// 使用
emit('update', newValue);
emit('delete', itemId);
```

## 代码格式化

### 缩进和空格

```typescript
// ✅ 使用 2 空格缩进
function example() {
  if (condition) {
    doSomething();
  }
}

// ✅ 运算符前后加空格
const total = a + b;
const isValid = name !== '';

// ❌ 避免
const total=a+b;
```

### 引号使用

```typescript
// ✅ 优先使用单引号
const name = '张三';
const message = 'Hello World';

// ✅ 字符串插值使用模板字符串
const greeting = `Welcome, ${userName}`;

// ❌ 避免
const name = "张三";
```

### 分号

```typescript
// ✅ 一致使用分号
const name = '张三';
function getData() {
  return fetch(url);
}
```

### 行长度

```typescript
// ✅ 单行不超过 100 字符，必要时换行
const longFunctionCall = someLongFunctionName(
  param1,
  param2,
  param3,
);

// ✅ 链式调用换行
const result = someArray
  .filter(item => item.active)
  .map(item => item.value)
  .reduce((a, b) => a + b, 0);
```

### 空行使用

```typescript
// ✅ 逻辑块之间使用空行分隔
import { ref } from 'vue';
import { Button } from 'ant-design-vue';

const count = ref(0);

function increment() {
  count.value++;
}

function decrement() {
  if (count.value > 0) {
    count.value--;
  }
}

// ❌ 避免连续空行
const a = 1;


const b = 2;
```

## TypeScript 类型规范

### 类型注解

```typescript
// ✅ 始终指定返回类型
function add(a: number, b: number): number {
  return a + b;
}

// ✅ 使用显式类型而非 any
// ❌ 避免
function process(data: any) { }

// ✅ 推荐
function process(data: UserData) { }
```

### 接口 vs 类型别名

```typescript
// ✅ 对象形状使用 interface
interface User {
  id: string;
  name: string;
}

// ✅ 联合类型和原始类型使用 type
type UserRole = 'admin' | 'doctor' | 'patient';
type UserId = string;
```

### 可选属性

```typescript
interface User {
  id: string;
  name: string;
  email?: string;      // 可选属性使用 ?
  phone?: string;
}
```

## Ant Design Vue 使用规范

### 组件导入

```typescript
// ✅ 按需导入
import { Button, Card, Table, Form, Input, Select } from 'ant-design-vue';

// ❌ 避免全量导入
// import Antd from 'ant-design-vue';
```

### 组件使用

```vue
<!-- ✅ 使用 a- 前缀 -->
<a-button type="primary">按钮</a-button>
<a-input v-model:value="form.name" placeholder="请输入" />
<a-table :dataSource="data" :columns="columns" />
<a-form :model="form" @finish="onFinish">
  <a-form-item label="姓名" name="name">
    <a-input v-model:value="form.name" />
  </a-form-item>
</a-form>

<!-- ❌ 避免使用非 a- 前缀 -->
<!-- <Button>按钮</Button> -->
```

### 图标使用

```typescript
import {
  HomeOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';

// 模板中使用
<a-button type="primary">
  <template #icon><PlusOutlined /></template>
  新增
</a-button>
```

## 样式规范

### scoped 样式

```vue
<style scoped>
/* ✅ 所有样式使用 scoped 避免污染 */
.button {
  padding: 8px 16px;
}

.button:hover {
  background: #f0f0f0;
}

/* ✅ 使用 CSS 变量 */
.card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
</style>
```

### 样式命名

```vue
<style scoped>
/* ✅ 使用 kebab-case */
.app-header { }
.main-content { }
.user-card { }
.doctor-list { }

/* ❌ 避免 camelCase 或 PascalCase */
.AppHeader { }
.mainContent { }
```

### CSS 变量

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --border-color: #d9d9d9;
  --text-color: #333;
}
```

## 路由使用规范

### 路由定义

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Doctors from '../views/Doctors.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: Doctors,
  },
  // 动态路由参数
  {
    path: '/doctor/:username',
    name: 'DoctorRoom',
    component: () => import('../views/DoctorRoom.vue'),  // 懒加载
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

### 路由跳转

```typescript
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 编程式导航
router.push('/doctors');
router.push({ name: 'Doctors' });
router.push({ path: '/doctors' });

// 带参数
router.push({ name: 'DoctorRoom', params: { username: 'dr-zhang-wei' } });

// 获取参数
const username = route.params.username;
```

## Store 状态管理规范

```typescript
// src/store/index.ts

// 1. 类型定义（导出供外部使用）
export interface Doctor {
  id: string;
  username: string;
  name: string;
  // ...
}

// 2. State 接口
interface State {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
}

// 3. 状态初始化
const state = reactive<State>({
  doctors: [],
  currentDoctor: null,
});

// 4. Store 导出
export const store = {
  state,

  // 方法命名规范
  login(username: string, password: string): boolean {
    // ...
    return true;
  },

  logout(): void {
    // ...
  },

  getDoctorById(id: string): Doctor | undefined {
    return state.doctors.find(d => d.id === id);
  },

  addItem(item: Item): void {
    // ...
  },
};
```

## 注释规范

### 函数/方法注释

```typescript
/**
 * 根据用户名获取医生信息
 * @param username 医生用户名
 * @returns 医生信息，未找到返回 undefined
 */
function getDoctorByUsername(username: string): Doctor | undefined {
  return doctors.find(d => d.username === username);
}
```

### 业务逻辑注释

```typescript
// ✅ 解释"为什么"而非"是什么"
// 由于 API 限制，需要等待 500ms 后重试
await delay(500);
await retry();

// ❌ 避免无意义的注释
// 设置 count 为 0
count.value = 0;
```

### 组件注释

```vue
<script setup lang="ts">
/**
 * 医生卡片组件
 * 用于展示医生基本信息、专长和在线状态
 */
</script>
```

## 错误处理

```typescript
// ✅ 使用 try-catch 处理异步错误
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw new Error('获取数据失败，请稍后重试');
  }
}

// ✅ 条件检查
function validateInput(data: unknown): data is UserData {
  return typeof data === 'object' && data !== null && 'name' in data;
}
```

## 相关文档

- [项目结构](./standard-project-structure.md)
- [数据模型](./data-models.md)

---

*本文档由 ASDM Context Builder 自动生成。代码风格变更时请更新本文档并使用 `/asdm-context-update` 同步更新。*
