# 编码规范

## 概述

本文档定义了在线医疗问诊平台的编码标准和风格指南。一致的编码风格可提高代码可读性、可维护性和团队协作效率。

## 基本原则

### 1. 可读性优先
- 代码应易于阅读和理解
- 变量、函数和类使用有意义的名称
- 编写自解释的代码，明确表达意图

### 2. 一致性
- 整个代码库遵循相同的模式
- 使用语言和框架的既定约定
- 团队成员保持一致

### 3. 可维护性
- 编写易于修改和扩展的代码
- 保持函数和类的单一职责
- 避免不必要的复杂性

## TypeScript 编码规范

### 命名规范

```typescript
// 变量和函数 - camelCase
const userName = '张三';
const getDoctorById = (id: string) => { };

// 类和接口 - PascalCase
class UserService { }
interface DoctorData { }
type QuestionStatus = 'pending' | 'answered';

// 常量 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Vue 组件引用 - PascalCase
import AppHeader from '@/components/AppHeader.vue';

// 私有成员 (可选) - 下划线前缀
private _internalMethod() { }
```

### 代码格式

```typescript
// 使用 2 空格缩进
function example() {
  if (condition) {
    doSomething();
  }
}

// 一行一条语句
// 错误
const a = 1; const b = 2;

// 正确
const a = 1;
const b = 2;

// 字符串使用单引号，模板字符串用于插值
const message = '您好';
const greeting = `Hello ${userName}`;

// 最大行长度: 100-120 字符
// 长行应换行以提高可读性
```

### 类型注解

```typescript
// 始终指定返回类型
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 使用 explicit 类型，避免 any
// 错误
function process(data: any) { }

// 正确
function process(data: UserData) { }

// 接口定义对象结构
interface User {
  id: string;
  name: string;
  email: string;
}

// 使用 type 定义联合类型或别名
type QuestionStatus = 'pending' | 'answered';

// 函数式组件指定 props 类型
interface Props {
  title: string;
  count?: number;
}
```

## Vue 3 编码规范

### 组件结构

```vue
<template>
  <!-- 模板部分 -->
  <div class="component">
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Doctor } from '@/types/doctor';

// 2. Props 定义
interface Props {
  doctor: Doctor;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: true
});

// 3. Emits 定义
const emit = defineEmits<{
  (e: 'select', doctor: Doctor): void;
  (e: 'delete', id: string): void;
}>();

// 4. 响应式状态
const isLoading = ref(false);
const selectedId = ref<string | null>(null);

// 5. 计算属性
const activeDoctors = computed(() => 
  doctors.value.filter(d => d.isActive)
);

// 6. 方法
const handleSelect = (doctor: Doctor) => {
  emit('select', doctor);
};

// 7. 生命周期钩子
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 8. 样式部分 - 使用 scoped */
.component {
  padding: 16px;
}
</style>
```

### 组件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase，与路由对应 | `DoctorLogin.vue`, `Consultation.vue` |
| 布局组件 | `Layout` 后缀 | `MainLayout.vue` |
| 业务组件 | PascalCase，描述性名称 | `DoctorCard.vue`, `QuestionItem.vue` |
| 基础组件 | `Base` 前缀或 atomic 命名 | `BaseButton.vue`, `BaseInput.vue` |
| 业务组件集合 | 统一目录 | `components/doctor/`, `components/question/` |

### Props 定义规范

```typescript
// 使用 withDefaults 和 defineProps（推荐）
interface Props {
  title: string;
  count?: number;
  variant?: 'primary' | 'secondary';
  items: Doctor[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary'
});

// 复杂 props 使用单独接口
interface DoctorCardProps {
  doctor: Doctor;
  showActions?: boolean;
}

const props = defineProps<DoctorCardProps>();
```

### 事件命名

```typescript
// 使用 kebab-case 事件名
const emit = defineEmits<{
  (e: 'doctor-selected', doctor: Doctor): void;
  (e: 'question-submitted', question: Question): void;
  (e: 'update:visible', value: boolean): void;
}>();

// 组件使用
// <DoctorCard @doctor-selected="handleSelect" />
```

## 目录结构与文件组织

### 文件导入顺序

```typescript
// 1. Vue 核心库
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// 2. 第三方库
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

// 3. 内部模块 - @ 别名路径
import { store } from '@/store';
import { router } from '@/router';
import type { Doctor } from '@/interfaces/doctor';

// 4. 相对路径导入
import AppHeader from '../components/AppHeader.vue';
import { formatDate } from './utils';

// 5. 类型导入放在一起
import type { PropType } from 'vue';
```

### 路径别名使用

```typescript
// 使用 @ 指向 src 目录
import { store } from '@/store';
import AppHeader from '@/components/AppHeader.vue';
import DoctorCard from '@/components/doctor/DoctorCard.vue';
import type { Question } from '@/interfaces/question';
import { formatTime } from '@/utils/format';
```

## 状态管理规范 (Store)

### 当前项目 Store 结构

```typescript
// store/index.ts

// 1. 类型定义放在文件顶部
export interface Doctor {
  id: string;
  username: string;
  password: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}

// 2. State 接口
interface State {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
  // ...
}

// 3. 响应式 state
const state = reactive<State>({
  doctors: [],
  currentDoctor: null,
});

// 4. 导出的 store 对象包含 state 和方法
export const store = {
  state,
  
  // 方法使用清晰的命名
  loginDoctor(username: string, password: string): Doctor | null {
    // 实现
  },
  
  // 异步方法使用 async/await
  async fetchDoctors(): Promise<Doctor[]> {
    // 实现
  },
};
```

### Store 使用规范

```typescript
// 在组件中使用
import { store } from '@/store';

// 直接使用
const doctors = store.state.doctors;

// 调用方法
const result = store.loginDoctor(username, password);

// 避免直接修改 state
// 错误
store.state.doctors.push(newDoctor);

// 正确
store.addDoctor(newDoctor);
```

## API 请求规范

### 建议的 API 服务层结构

```typescript
// services/api.ts - axios 实例配置
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(config => {
  // 添加 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    // 统一错误处理
    message.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default api;

// services/doctor.ts
import api from './api';
import type { Doctor } from '@/interfaces/doctor';

export const doctorService = {
  getDoctors(): Promise<Doctor[]> {
    return api.get('/doctors');
  },
  
  getDoctorById(id: string): Promise<Doctor> {
    return api.get(`/doctors/${id}`);
  },
  
  login(credentials: { username: string; password: string }): Promise<Doctor> {
    return api.post('/auth/login', credentials);
  },
};
```

## 错误处理规范

### 同步错误处理

```typescript
// 使用 try-catch 处理预期错误
try {
  const doctor = store.loginDoctor(username, password);
  if (!doctor) {
    message.error('用户名或密码错误');
    return;
  }
  router.push('/doctor/room/' + doctor.username);
} catch (error) {
  console.error('登录失败:', error);
  message.error('登录失败，请稍后重试');
}

// 不要吞掉异常
// 错误
try {
  riskyOperation();
} catch (e) {
  // 空 catch 块
}

// 正确
try {
  riskyOperation();
} catch (e) {
  logger.error('操作失败', e);
  throw new OperationError('操作失败', e);
}
```

### 异步错误处理

```typescript
// 使用 Promise.catch 或 async/await
const loadDoctors = async () => {
  try {
    isLoading.value = true;
    const doctors = await doctorService.getDoctors();
    state.doctors = doctors;
  } catch (error) {
    message.error('加载医生列表失败');
  } finally {
    isLoading.value = false;
  }
};
```

## 注释与文档

### 何时注释

- 解释"为什么"而非"是什么"（代码应自解释）
- 记录复杂算法或业务逻辑
- 标注变通方案或临时解决方案
- 为公共 API 和接口添加文档

### 注释风格

```typescript
/**
 * 根据用户名和密码验证医生登录
 * 
 * @param username - 医生用户名
 * @param password - 登录密码
 * @returns 登录成功返回医生信息，否则返回 null
 */
function loginDoctor(username: string, password: string): Doctor | null {
  // 查找匹配的医生账户
  const doctor = state.doctors.find(
    d => d.username === username && d.password === password
  );
  
  if (doctor) {
    state.currentDoctor = doctor;
    return doctor;
  }
  
  return null;
}

// 内联注释用于复杂逻辑
// 使用二分查找优化搜索性能
const index = binarySearch(sortedArray, target);
```

### TypeScript 接口注释

```typescript
/**
 * 医生用户实体
 */
interface Doctor {
  /** 唯一标识符 */
  id: string;
  /** 登录用户名 */
  username: string;
  /** 医生姓名 */
  name: string;
  /** 职称：主任医师/副主任医师/主治医师 */
  title: string;
  /** 所属科室 */
  department: string;
  /** 头像图片 URL */
  avatar: string;
  /** 临床经验年限 */
  experience: string;
  /** 专业领域标签 */
  specialties: string[];
  /** 是否在线接诊 */
  isActive: boolean;
}
```

## CSS 样式规范

### scoped 样式

```vue
<style scoped>
/* 使用 kebab-case 类名 */
.doctor-card {
  padding: 16px;
  border-radius: 8px;
}

/* BEM 命名约定 */
.doctor-card__header {
  display: flex;
  align-items: center;
}

.doctor-card__name {
  font-weight: 600;
}

.doctor-card--highlighted {
  border: 2px solid #1890ff;
}

/* 嵌套限制在 3 层以内 */
.card-body {
  .card-title {
    font-size: 16px;
    
    .title-link {
      color: #1890ff;
    }
  }
}
</style>
```

### 全局样式

```css
/* style.css */

/* 变量定义 */
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --text-color: #333;
  --border-radius: 8px;
}

/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 通用工具类 */
.text-center {
  text-align: center;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## ESLint 配置建议

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": "warn"
  }
}
```

## Git 提交信息规范

```
<type>(<scope>): <subject>

# 类型
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具相关

# 示例
feat(doctor): 添加医生登录功能
fix(consultation): 修复问诊表单提交问题
docs(readme): 更新项目说明文档
```

## 持续集成检查

### 提交前检查

- [ ] 运行 ESLint 检查代码格式
- [ ] 运行 TypeScript 类型检查
- [ ] 运行单元测试
- [ ] 确保所有测试通过

### CI 流水线

1. 代码格式检查 (ESLint)
2. 类型检查 (TypeScript)
3. 单元测试 (Vitest/Jest)
4. 构建验证
5. 安全扫描

---

*最后更新: 2026-04-21*
