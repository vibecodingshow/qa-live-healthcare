# 编码风格标准文档

## 概述

本文档定义了在线医疗健康咨询平台（qa-live-healthcare）的编码标准和样式指南。一致的编码风格可提高代码的可读性、可维护性和团队协作效率。

## 基本原则

### 1. 可读性优先

- 代码应易于阅读和理解
- 变量、函数和类使用有意义的名称
- 编写自解释的代码，表达清晰的意图

### 2. 一致性

- 在整个代码库中遵循相同的模式
- 使用语言和框架的既定约定
- 保持团队成员之间的一致性

### 3. 可维护性

- 编写易于修改和扩展的代码
- 保持函数和类专注于单一职责
- 避免不必要的复杂性

## TypeScript/Vue 编码规范

### 命名规范

```typescript
// 变量和函数 - camelCase
const userName = '张三';
function calculateTotal() { }

// 接口和类型 - PascalCase
interface DoctorData { }
type QuestionStatus = 'pending' | 'answered';

// 常量 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Vue 组件 - PascalCase（文件名）
// DoctorLogin.vue, AppHeader.vue
```

### 代码格式

```typescript
// 使用 2 空格缩进
function example() {
  if (condition) {
    // ...
  }
}

// 坚持使用分号
const name = '张三';

// 行长度：建议 80-120 字符
// 过长时换行以提高可读性

// 字符串使用单引号
const message = '您好';
const template = `Hello ${name}`;
```

### 类型注解

```typescript
// 始终指定返回类型
function add(a: number, b: number): number {
  return a + b;
}

// 使用显式类型而非 any
// ❌ 不推荐
function process(data: any) { }

// ✅ 推荐
function process(data: UserData) { }

// 使用 interface 定义对象形状
interface Doctor {
  id: string;
  username: string;
  name: string;
  isActive: boolean;
}
```

## Vue 3 组件规范

### 单文件组件结构

```vue
<!-- 1. Template: 模板结构 -->
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<!-- 2. Script: 逻辑脚本 -->
<script setup lang="ts">
// 导入语句
import { ref, computed } from 'vue';

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
const data = ref<string>('');

// 计算属性
const computedValue = computed(() => data.value.length);

// 方法
function handleClick() {
  emit('update', computedValue.value);
}
</script>

<!-- 3. Style: 样式 -->
<style scoped>
.component-name {
  padding: 16px;
}
</style>
```

### 组件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面组件 | PascalCase | `DoctorLogin.vue` |
| 业务组件 | PascalCase | `DoctorCard.vue` |
| 基础组件 | PascalCase | `BaseButton.vue` |
| 布局组件 | PascalCase | `AppHeader.vue` |

### Props 定义

```typescript
// ✅ 推荐：使用 TypeScript interface
interface Props {
  doctorName: string;
  doctorTitle: string;
  specialties: string[];
  isActive?: boolean;  // 可选 prop
}

// ❌ 不推荐：使用普通对象
// props: {
//   doctorName: String,
//   isActive: Boolean
// }
```

## Store 状态管理规范

```typescript
// src/store/index.ts

// 1. 接口定义放在文件顶部
export interface Doctor {
  id: string;
  username: string;
  name: string;
  // ...
}

// 2. State 接口
interface State {
  doctors: Doctor[];
  questions: Question[];
  currentDoctor: Doctor | null;
}

// 3. 使用 reactive 创建状态
const state = reactive<State>({
  doctors: [],
  questions: [],
  currentDoctor: null,
});

// 4. 导出 store 对象
export const store = {
  state,

  // 方法命名：动词 + 名词
  loginDoctor(username: string, password: string): Doctor | null {
    // ...
  },

  getActiveDoctors(): Doctor[] {
    return state.doctors.filter(d => d.isActive);
  },
};
```

## 路由配置规范

```typescript
// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 路由类型：RouteRecordRaw
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    // 动态路由参数
    path: '/doctor/room/:username',
    name: 'DoctorRoom',
    component: DoctorRoom,
    props: true,  // 路由参数作为 props 传递
  },
];
```

## CSS 样式规范

### 命名规范

```css
/* 使用 kebab-case */
.component-name { }
.hero-section { }
.doctor-card { }

/* BEM 命名法（可选） */
.card__header { }
.card__body { }
.card--active { }
```

### 样式组织

```css
/* 1. 布局样式 */
.component {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 2. 尺寸样式 */
.component {
  width: 100%;
  height: 200px;
  padding: 16px;
  margin: 8px;
}

/* 3. 外观样式 */
.component {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 4. 交互样式 */
.component:hover {
  transform: translateY(-2px);
}
```

### 响应式设计

```css
/* 使用移动优先的响应式策略 */
.card {
  padding: 12px;
}

@media (min-width: 768px) {
  .card {
    padding: 24px;
  }
}

@media (min-width: 1200px) {
  .card {
    padding: 32px;
  }
}
```

## 注释规范

### 何时注释

- 解释"为什么"而非"是什么"（代码应自解释）
- 记录复杂算法或业务逻辑
- 标注变通方案或临时解决方案
- 为公共 API 和接口添加文档

### 注释风格

```typescript
/**
 * 计算包含税费的总价。
 *
 * @param items - 包含价格和数量的商品数组
 * @param taxRate - 税率（小数形式，如 0.08 表示 8%）
 * @returns 税费计算后的总价
 */
function calculateTotalWithTax(items: Item[], taxRate: number): number {
  // 计算小计
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 应用税费
  return subtotal * (1 + taxRate);
}

// 复杂逻辑的内联注释
// 使用 Dijkstra 算法计算最短路径
const shortestPath = findShortestPath(graph, start, end);
```

## 错误处理规范

```typescript
// 使用 try-catch 处理预期错误
try {
  const result = await apiCall();
} catch (error) {
  // 处理特定错误类型
  if (error instanceof NetworkError) {
    // 重试逻辑
  } else if (error instanceof ValidationError) {
    // 显示用户提示
  }
}

// 不要吞掉异常
// ❌ 不推荐
try {
  riskyOperation();
} catch (e) {
  // 空 catch 块
}

// ✅ 推荐
try {
  riskyOperation();
} catch (e) {
  console.error('操作失败', e);
  throw new OperationFailedError('操作失败，请重试', e);
}
```

## Git 提交规范

### 提交信息格式

```
<type>: <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建或辅助工具 |

### 示例

```
feat: 添加医生登录功能

- 添加 DoctorLogin 页面
- 集成医生用户数据验证
- 添加登录状态管理

Closes #123
```

## 代码审查指南

### 审查要点

1. **功能性**：代码是否按预期工作？
2. **可读性**：代码是否易于理解？
3. **测试**：是否有充分的测试？
4. **性能**：是否有性能问题？
5. **安全性**：是否有安全漏洞？
6. **可维护性**：代码是否易于维护？

### 审查评论

- 要有建设性且具体
- 提供建议而非批评
- 关注代码而非个人
- 使用"我们"的语言："我们应该考虑..."

## 工具配置

### EditorConfig

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.vue]
indent_size = 2

[*.ts]
indent_size = 2
```

### TypeScript 配置

项目使用 `tsconfig.json` 进行 TypeScript 配置，确保：
- 启用严格模式
- 启用 `strictNullChecks`
- 配置合理的 `noUnusedLocals` 和 `noUnusedParameters`

---

*本编码风格文档会随着项目演进而更新。定期审查和更新此文档。*
