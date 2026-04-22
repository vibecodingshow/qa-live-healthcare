# 标准代码风格

## 概述

本文档定义了在线医疗咨询平台（qa-live-healthcare）的代码编写规范和风格指南。本项目基于 Vue 3 + TypeScript + Ant Design Vue 技术栈，所有代码都应遵循本文档的规范以确保代码库的一致性、可读性和可维护性。

## 技术栈规范

### 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.10 | 核心框架 |
| TypeScript | ^5.5.3 | 类型系统 |
| Vite | ^5.4.8 | 构建工具 |
| Ant Design Vue | ^4.2.6 | UI 组件库 |
| Vue Router | ^4.6.3 | 路由管理 |
| Day.js | ^1.11.19 | 日期处理 |

### 组件语法

**必须使用** `<script setup>` 语法（Vue 3 组合式 API）：

```vue
<script setup lang="ts">
// 代码内容
</script>
```

---

## Vue 组件规范

### 组件结构顺序

组件代码应按以下顺序组织：

```vue
<template>
  <!-- 1. 模板结构 -->
</template>

<script setup lang="ts">
// 2. 导入部分
// 3. 类型/接口定义
// 4. Props 和 Emits
// 5. 响应式数据
// 6. 计算属性
// 7. 生命周期钩子
// 8. 方法函数
</script>

<style scoped>
/* 4. 样式部分 */
</style>
```

### 导入顺序

```typescript
// 1. Vue 核心
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 2. UI 组件库 - Ant Design Vue
import { message } from 'ant-design-vue';
import { Button, Card, Form } from 'ant-design-vue';

// 3. 图标 - Ant Design Icons
import { UserOutlined, PlusOutlined } from '@ant-design/icons-vue';

// 4. 路由组件（页面组件一般不在这儿导入）
// import Home from '../views/Home.vue';

// 5. Store / 状态管理
import { store, Doctor } from '../store';

// 6. 工具函数
import { formatDate } from '../utils/date';

// 7. 类型定义
import type { Patient } from '../types';
```

---

## TypeScript 规范

### 命名约定

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 变量/函数 | camelCase | `userName`, `getDoctorById()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 类/接口/类型 | PascalCase | `UserInfo`, `DoctorDTO` |
| Vue 组件文件 | PascalCase + .vue | `DoctorCard.vue` |
| TypeScript 文件 | camelCase | `store.ts`, `router.ts` |
| JSON 数据文件 | kebab-case | `doctor-user-list.json` |

### 类型定义

#### 接口定义

```typescript
// 推荐：使用 interface 定义对象结构
interface Doctor {
  id: string;
  username: string;
  name: string;
  isActive: boolean;
}

// 推荐：联合类型定义状态
type QuestionStatus = 'pending' | 'answered';

// 推荐：函数类型定义
type LoginHandler = (username: string, password: string) => boolean;
```

#### Props 定义

```typescript
// 推荐：使用 defineProps + 类型化
interface Props {
  title: string;
  disabled?: boolean;  // 可选属性用 ?
  count: number;
  items: string[];
}

const props = defineProps<Props>();

// 使用默认值
withDefaults(defineProps<Props>(), {
  disabled: false,
  items: () => []
});
```

#### Emits 定义

```typescript
// 推荐：使用 defineEmits 泛型
const emit = defineEmits<{
  (e: 'click', id: number): void;
  (e: 'update', value: string): void;
  (e: 'change', payload: EventPayload): void;
}>();

// 调用
emit('click', 123);
```

### 响应式数据

```typescript
// 基础类型使用 ref
const count = ref(0);
const name = ref<string>('');
const isLoading = ref(false);

// 对象类型使用 reactive
const formState = reactive({
  username: '',
  password: '',
});

// 数组使用 ref
const list = ref<string[]>([]);

// 带初始值的 ref
const status = ref<'idle' | 'loading' | 'success'>('idle');
```

### 计算属性

```typescript
// 简单计算属性
const doubleCount = computed(() => count.value * 2);

// 带类型的计算属性
const activeDoctors = computed((): Doctor[] => {
  return doctors.value.filter(d => d.isActive);
});

// getter 和 setter
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const parts = value.split(' ');
    firstName.value = parts[0];
    lastName.value = parts[1];
  }
});
```

---

## 模板规范

### 模板语法

```vue
<!-- 推荐：使用 v-if/v-else-if/v-else 链 -->
<div v-if="isLoggedIn">
  <UserProfile />
</div>
<div v-else-if="isLoading">
  <LoadingSpinner />
</div>
<div v-else>
  <LoginForm />
</div>

<!-- 推荐：v-for 配合 :key -->
<a-list>
  <a-list-item v-for="item in items" :key="item.id">
    {{ item.name }}
  </a-list-item>
</a-list>

<!-- 推荐：使用 === 而非 == -->
<div v-if="status === 'active'">

<!-- 推荐：布尔属性简洁写法 -->
<a-input :disabled="isReadonly" />
```

### 事件处理

```vue
<!-- 推荐：使用方法引用 -->
<a-button @click="handleSubmit">提交</a-button>

<!-- 推荐：内联处理简单逻辑 -->
<a-switch v-model:checked="isEnabled" />

<!-- 推荐：传递参数 -->
<a-table @row-click="(record) => handleRowClick(record.id)">
```

---

## 样式规范

### Scoped 样式

**必须使用** `<style scoped>` 限制样式作用域：

```vue
<style scoped>
.button {
  padding: 8px 16px;
}
</style>
```

### 样式组织

```vue
<style scoped>
/* 1. 布局样式 */
.container {
  display: flex;
  padding: 24px;
}

/* 2. 元素样式 */
.title {
  font-size: 24px;
  font-weight: 700;
}

/* 3. 状态样式 */
.is-active {
  color: #1890ff;
}

/* 4. 响应式样式 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}
```

### CSS 变量

```vue
<style scoped>
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
}

.button {
  background: var(--primary-color);
}
</style>
```

---

## Store 规范

### Store 结构

```typescript
import { reactive } from 'vue';
import doctorData from '../data/doctor-user-list.json';

interface State {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
}

// 响应式状态
const state = reactive<State>({
  doctors: doctorData as Doctor[],
  currentDoctor: null,
});

// Store 方法
export const store = {
  state,

  // getter
  getDoctors(): Doctor[] {
    return state.doctors;
  },

  // action
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

  // mutation
  logoutDoctor() {
    state.currentDoctor = null;
  },
};
```

### Store 使用

```typescript
// 在组件中使用
import { store } from '../store';

// 访问状态
const doctors = store.getDoctors();

// 调用方法
store.loginDoctor('username', 'password');

// 直接访问响应式状态
const currentDoctor = computed(() => store.state.currentDoctor);
```

---

## 路由规范

### 路由定义

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: () => import('../views/DoctorRoom.vue'),
    props: true,
    meta: {
      title: '医生工作室',
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

### 动态路由参数

```typescript
// 接收参数
const route = useRoute();
const doctorUsername = route.params.doctorUsername as string;

// 编程式导航
const router = useRouter();
router.push(`/doctor/room/${username}`);

// 使用 props
// 在组件中直接使用 props.username
```

---

## 函数规范

### 函数定义

```typescript
// 普通函数
function formatTime(time: string): string {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}

// 箭头函数
const handleClick = (id: number) => {
  emit('click', id);
};

// 异步函数
const fetchData = async (): Promise<Doctor[]> => {
  const response = await api.getDoctors();
  return response.data;
};
```

### 错误处理

```typescript
// 表单验证
const handleSubmit = () => {
  if (!formState.username) {
    message.error('请输入用户名');
    return;
  }
  if (!formState.password) {
    message.error('请输入密码');
    return;
  }
  // 提交逻辑
};

// 异步错误处理
const loadData = async () => {
  try {
    loading.value = true;
    const data = await fetchDoctors();
    doctors.value = data;
  } catch (error) {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};
```

---

## 注释规范

### 函数注释

```typescript
/**
 * 验证患者身份
 * @param name - 患者姓名
 * @param birthday - 出生日期 (YYYY-MM-DD格式)
 * @returns 患者对象，不存在则创建新患者
 */
function verifyPatient(name: string, birthday: string): Patient {
  // 实现
}

/**
 * 格式化时间显示
 * @param time - ISO 8601 时间字符串
 * @returns 格式化后的时间字符串 (YYYY-MM-DD HH:mm)
 */
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};
```

### 行内注释

```typescript
// 单行注释
const MAX_RETRY = 3; // 最大重试次数

// 逻辑块注释
// 1. 获取医生信息
const doctor = store.getDoctorByUsername(username);

// 2. 验证在线状态
if (!doctor?.isActive) {
  message.warning('医生不在线');
}
```

---

## UI 组件使用规范

### Ant Design Vue

```vue
<!-- 表单 -->
<a-form :model="formState" @finish="onFinish">
  <a-form-item label="用户名" name="username">
    <a-input v-model:value="formState.username" />
  </a-form-item>
</a-form>

<!-- 按钮 -->
<a-button type="primary" @click="handleClick">
  提交
</a-button>

<!-- 消息提示 -->
<script setup>
import { message } from 'ant-design-vue';

message.success('操作成功');
message.error('操作失败');
message.warning('请注意');
</script>
```

### 图标使用

```vue
<script setup>
import { UserOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue';
</script>

<template>
  <a-button>
    <template #icon><PlusOutlined /></template>
    新增
  </a-button>
</template>
```

---

## 常见模式

### 条件渲染模式

```vue
<!-- 加载状态 -->
<div v-if="loading" class="loading">
  <a-spin />
</div>

<!-- 空状态 -->
<a-empty v-else-if="list.length === 0" description="暂无数据" />

<!-- 内容 -->
<div v-else>
  <!-- 列表内容 -->
</div>
```

### 表单处理模式

```typescript
const formState = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位' }
  ],
};

const onFinish = () => {
  console.log('表单提交:', formState);
};
```

### 列表处理模式

```typescript
const selectedKeys = ref<string[]>([]);

const handleSelect = (record: Doctor) => {
  selectedKeys.value = [record.id];
};

const handleBatchDelete = () => {
  if (selectedKeys.value.length === 0) {
    message.warning('请选择要删除的项目');
    return;
  }
  // 执行删除
};
```

---

## ESLint 配置建议

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具变动
```

示例：
```
feat(consultation): 添加患者身份验证功能
fix(doctor): 修复医生登录状态丢失问题
docs(readme): 更新项目说明文档
```

---

**生成时间**: 2026-04-21  
**工具集**: Context Builder (ID: context-builder)  
**语言**: 简体中文 (zh-CN)
