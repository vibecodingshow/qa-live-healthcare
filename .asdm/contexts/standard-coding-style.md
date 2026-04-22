# 标准编码风格

## 概述

本文档定义了 Vue 3 + TypeScript + Vite 应用的编码标准和风格约定。这些规范确保代码的一致性、可维护性，并符合项目实际编码模式。

## TypeScript 规范

### 类型定义
- 所有代码使用 **TypeScript**
- 为所有数据模型定义 **interface**
- 启用严格类型检查（`strict: true`）

```typescript
// ✅ 正确 - 完整的接口定义
interface Doctor {
  id: string;
  username: string;
  name: string;
  title: string;
  department: string;
}

// ❌ 避免 - 使用 'any' 类型
interface Doctor {
  id: any;
  name: any;
}
```

### 变量声明
- 使用 `const` 声明不会重新赋值的变量
- 使用 `let` 声明需要重新赋值的变量
- 禁止使用 `var`

```typescript
// ✅ 正确
const doctorId: string = 'doc001';
let isLoading: boolean = false;

// ❌ 避免
var doctorName = '张伟';
```

## Vue 3 组件规范

### Composition API
- 使用 Composition API（`<script setup>`）编写组件
- 使用 TypeScript 配合 Vue 组件

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';

// 响应式状态
const loading = ref<boolean>(false);
const doctors = computed(() => store.state.doctors);

// 方法
const handleSubmit = () => {
  // 处理逻辑
};

// 生命周期钩子
onMounted(() => {
  // 初始化逻辑
});
</script>
```

### 组件结构顺序
在 `<script setup>` 中按以下顺序组织代码：
1. 导入语句（Vue、第三方库、内部模块）
2. Props 和 Emits 定义
3. 响应式状态（ref、reactive）
4. 计算属性（computed）
5. 侦听器（watch）
6. 方法定义
7. 生命周期钩子（onMounted、onUnmounted 等）

### 模板规范
- 使用 `v-bind` 简写 `:` 绑定属性
- 使用 `v-on` 简写 `@` 绑定事件
- 使用有意义的插槽名称

```vue
<template>
  <a-button type="primary" @click="handleSubmit">
    提交
  </a-button>
  <doctor-card :doctor="currentDoctor" @select="handleSelect" />
</template>
```

## 命名规范

### 文件命名
- **组件文件**：PascalCase（`DoctorRoom.vue`、`AppHeader.vue`）
- **工具文件**：camelCase（`formatTime.ts`、`validators.ts`）
- **类型文件**：PascalCase（`DoctorModel.ts`）
- **样式文件**：kebab-case（`doctor-card.css`）

### 变量命名
- 使用描述性、有意义的名称
- 变量和函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 类型/接口使用 PascalCase

```typescript
// ✅ 正确
const currentDoctor = ref<Doctor | null>(null);
const MAX_RETRY_COUNT = 3;

// ❌ 避免
const doc = ref<Doctor | null>(null);
const max = 3;
```

## 代码组织

### 导入顺序
按以下分组排列导入语句：

```typescript
// 1. Vue 核心库
import { ref, computed, onMounted } from 'vue';

// 2. Vue 生态（Router、Store 等）
import { useRouter, useRoute } from 'vue-router';

// 3. 第三方库
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

// 4. 图标库
import { UserOutlined, PlusOutlined } from '@ant-design/icons-vue';

// 5. 内部模块（Store、类型）
import { store, Doctor } from '../store';

// 6. 相对导入
import AppHeader from './components/AppHeader.vue';
```

### 函数组织
- 保持函数短小精悍、职责单一
- 使用描述性函数名
- 复杂函数添加注释说明

```typescript
/**
 * 验证患者身份，不存在则自动创建
 * @param name - 患者姓名
 * @param birthday - 生日，格式 YYYY-MM-DD
 * @returns 患者对象
 */
verifyPatient(name: string, birthday: string): Patient {
  // 实现
}
```

## 样式规范

### Scoped CSS
- 所有组件使用 `<style scoped>` 避免样式污染
- 使用标准 CSS，当前项目未使用预处理器

```vue
<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0;
  height: 64px;
}
</style>
```

### 响应式设计
- 使用 `@media (max-width: 768px)` 断点适配移动端
- 采用 Grid + Flexbox 布局

```css
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .rooms-grid {
    grid-template-columns: 1fr;
  }
}
```

### 设计令牌（当前项目中的约定值）

| 用途 | 值 | 使用场景 |
|------|-----|----------|
| 主色 | `#1890ff` | Logo、链接、图标 |
| 成功色 | `#52c41a` | 登录按钮、在线状态 |
| 渐变背景 | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | Hero、Footer、Page Header |
| 最大内容宽度 | `1200px` | 所有页面容器 |
| 顶部导航高度 | `64px` | Header 固定高度 |
| 内容背景 | `#f0f2f5` | 页面背景色 |

## 表单验证规范

使用 Ant Design Vue 的表单验证规则：

```typescript
// ✅ 正确 - 使用 rules 对象定义验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
};

// ✅ 正确 - 提交时手动验证
const submitQuestion = () => {
  if (!questionForm.doctorId) {
    message.error('请选择医生');
    return;
  }
  if (!questionForm.question.trim()) {
    message.error('请输入问题');
    return;
  }
  // 执行提交
};
```

## 错误处理规范

### 用户反馈
- 使用 `message.success()` / `message.error()` 提供操作反馈
- 避免使用 `alert()` 或 `confirm()`

```typescript
// ✅ 正确
message.success('问题提交成功');
message.error('请输入回复内容');

// ❌ 避免
alert('操作成功');
```

### 异步操作
- 使用 `setTimeout` 模拟网络延迟时，配合 loading 状态

```typescript
const submitting = ref(false);

const submitAnswer = () => {
  submitting.value = true;
  setTimeout(() => {
    // 执行操作
    submitting.value = false;
  }, 500);
};
```

## Store 规范

### 接口定义
- 所有数据实体在 `store/index.ts` 中定义 interface 并导出
- Store 方法通过 `export const store = { ... }` 暴露

```typescript
// 导出接口供组件使用
export interface Doctor {
  id: string;
  name: string;
  // ...
}

export const store = {
  state,
  // 方法...
};
```

### Store 使用方式
- 通过 `computed` 创建响应式派生数据
- 直接调用 Store 方法执行操作

```typescript
// ✅ 正确
const statistics = computed(() => store.getStatistics());
const activeDoctors = computed(() => store.getActiveDoctors());
store.loginDoctor(username, password);
```

## 代码审查清单

### 通用检查项
- [ ] TypeScript 类型标注完整且正确
- [ ] Vue 3 Composition API 使用规范
- [ ] 代码可读性和可维护性
- [ ] 导入顺序正确
- [ ] 样式使用 `<style scoped>`
- [ ] 移动端响应式适配
- [ ] 中文提示信息完整

### 业务特定检查项
- [ ] 表单验证规则完备
- [ ] 用户操作有成功/失败反馈（message 提示）
- [ ] 异步操作有 loading 状态
- [ ] 数据模型的字段与 JSON 数据文件一致

---

*此文件由 ASDM Context Builder 工具集生成。最后更新: 2026-04-22*
