# 代码规范与风格指南

## 概述
本文档定义了 QA Live Healthcare 项目的代码规范和风格指南，确保代码质量和团队协作的一致性。

## 语言和编码标准

### 主要开发语言
- **TypeScript**: 主开发语言，提供类型安全
- **Vue Template**: 模板语法，遵循 Vue 3 规范
- **CSS**: 样式编写，支持现代 CSS 特性

### 文件编码
- 所有文件使用 **UTF-8** 编码
- 使用 **LF** 换行符（Unix 风格）

## TypeScript 编码规范

### 类型定义
```typescript
// 接口定义 - 使用 PascalCase
interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

// 类型别名 - 使用 PascalCase
type DoctorStatus = 'online' | 'offline' | 'busy';

// 枚举 - 使用 PascalCase
enum ConsultationStatus {
  Pending = 'pending',
  Active = 'active',
  Completed = 'completed'
}
```

### 变量和函数命名
```typescript
// 变量 - 使用 camelCase
const userName = '张三';
const isActive = true;

// 函数 - 使用 camelCase
function getUserInfo(id: number): UserInfo {
  // 函数实现
}

// 异步函数 - 使用 async/await
async function fetchDoctorList(): Promise<Doctor[]> {
  const response = await api.get('/doctors');
  return response.data;
}
```

### 组件 Props 定义
```typescript
// 组件 Props 接口
interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

// 在组件中使用
defineProps<AppHeaderProps>();
```

## Vue 组件规范

### 组件结构
```vue
<template>
  <!-- 模板部分 -->
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
// 脚本部分 - 使用 Composition API
import { ref, computed, onMounted } from 'vue';

// 组件逻辑
</script>

<style scoped>
/* 组件样式 - 使用 scoped */
.component-name {
  /* 样式规则 */
}
</style>
```

### 组件命名规范
- Vue 组件文件：**PascalCase** (如 `AppHeader.vue`)
- 组件名称：**PascalCase** (如 `AppHeader`)
- 事件命名：**kebab-case** (如 `@user-login`)

### 模板语法规范
```vue
<!-- 使用 kebab-case 属性名 -->
<app-header 
  title="页面标题"
  :show-back="true"
  @back-click="handleBack"
/>

<!-- 条件渲染 -->
<div v-if="isLoading">加载中...</div>
<div v-else-if="hasError">错误信息</div>
<div v-else>正常内容</div>

<!-- 列表渲染 -->
<div 
  v-for="doctor in doctors" 
  :key="doctor.id"
  class="doctor-item"
>
  {{ doctor.name }}
</div>
```

## CSS 样式规范

### 命名约定
- 类名：**kebab-case** (如 `.app-header`)
- ID：**kebab-case** (如 `#user-profile`)

### 样式组织
```css
/* 组件样式 */
.app-header {
  /* 布局属性 */
  display: flex;
  align-items: center;
  
  /* 盒模型属性 */
  padding: 16px;
  margin: 0;
  
  /* 视觉属性 */
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* 文字属性 */
  font-size: 16px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 12px;
    font-size: 14px;
  }
}
```

### 颜色和主题
```css
/* 设计系统颜色变量 */
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #333;
  --text-secondary: #666;
  --background-color: #f5f5f5;
}
```

## 代码质量要求

### 可读性
- 使用有意义的变量名和函数名
- 添加必要的注释说明复杂逻辑
- 保持代码简洁，避免过度嵌套

### 可维护性
- 遵循单一职责原则
- 组件功能明确，职责单一
- 避免过大的组件，适当拆分

### 性能考虑
- 使用 `v-if` 和 `v-show` 适当
- 合理使用计算属性和监听器
- 避免不必要的重新渲染

## 开发工具配置

### ESLint 配置
项目使用 ESLint 进行代码质量检查，确保代码规范一致。

### Prettier 配置
使用 Prettier 进行代码格式化，保持代码风格统一。

### Git 提交规范
- 提交信息使用中文描述
- 遵循约定式提交格式
- 每次提交只包含一个完整的功能或修复

## 最佳实践

### Vue 开发最佳实践
1. **使用 Composition API**：提高代码可复用性和组织性
2. **类型安全**：充分利用 TypeScript 的类型系统
3. **响应式数据**：合理使用 `ref` 和 `reactive`
4. **组件通信**：优先使用 props/events，必要时使用 provide/inject

### 性能优化
1. **组件懒加载**：使用 `defineAsyncComponent`
2. **代码分割**：合理使用路由懒加载
3. **图片优化**：使用合适的图片格式和尺寸
4. **缓存策略**：合理使用浏览器缓存

---
*此文件由 Context Builder 工具集生成，最后更新于 2026-04-21*