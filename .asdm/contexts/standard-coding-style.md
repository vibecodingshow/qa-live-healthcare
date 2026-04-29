# 编码风格标准文档

> **项目**: QA Live Healthcare
> **生成时间**: 2026-04-29
> **语言**: 中文 (zh)
> **基于版本**: 所有现有源码文件的静态分析结果

---

## 目录

1. [Vue 单文件组件 (SFC) 规范](#1-vue-单文件组件-sfc-规范)
2. [TypeScript 编码规范](#2-typescript-编码规范)
3. [CSS / 样式编写规范](#3-css--样式编写规范)
4. [命名约定](#4-命名约定)
5. [状态管理编码模式](#5-状态管理编码模式)
6. [Ant Design Vue 使用规范](#6-ant-design-vue-使用规范)
7. [组件设计模式](#7-组件设计模式)
8. [路由与导航规范](#8-路由与导航规范)
9. [代码组织与导入顺序](#9-代码组织与导入顺序)

---

## 1. Vue 单文件组件 (SFC) 规范

### 1.1 文件结构顺序

**强制顺序**: `<template>` → `<script setup lang="ts">` → `<style scoped>`

```vue
<!-- ✅ 正确: 标准结构 -->
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 逻辑代码
</script>

<style scoped>
/* 样式代码 */
</style>
```

### 1.2 Script 部分内部顺序

```
<script setup lang="ts">
// ─── 1. 导入区（按类别分组）─────────────────────────
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';                          // 第三方库
import { UserOutlined, PlusOutlined } from '@ant-design/icons-vue';  // 图标
import { store, Doctor, Question } from '../store';   // 内部模块

// ─── 2. 路由/上下文初始化 ────────────────────────────
const router = useRouter();
const route = useRoute();

// ─── 3. 响应式数据定义 ──────────────────────────────
const loading = ref(false);
const formState = reactive({ ... });

// ─── 4. 计算属性 ───────────────────────────────────
const dataList = computed(() => store.getItems());

// ─── 5. 组件生命周期钩子 ───────────────────────────
onMounted(() => { ... });

// ─── 6. Watch 监听器 ──────────────────────────────
watch(() => route.path, (newPath) => { ... });

// ─── 7. 方法定义 ──────────────────────────────────
const handleSubmit = () => { ... };
const handleCancel = () => { ... };
</script>
```

### 1.3 模板编写规范

```vue
<!-- ✅ 推荐: 使用语义化 HTML + Ant Design 组件 -->
<template>
  <div class="page-container">
    <section class="section-header">
      <h1>页面标题</h1>
      <p class="subtitle">副标题描述</p>
    </section>

    <div class="content-area">
      <a-card v-for="item in list" :key="item.id" class="card-item">
        <!-- 卡片内容 -->
      </a-card>
    </div>
  </div>
</template>
```

**模板规则**:
- 根元素必须只有一个 `<div>` 包裹（Vue 3 Fragment 支持多根，但本项目统一单根）
- 使用 `v-for` 时**必须**提供 `:key`
- 条件渲染优先使用 `v-if/v-else`，列表切换用 `v-show`
- 事件绑定统一使用 `@` 简写（如 `@click`, `@finish`）
- 属性绑定统一使用 `:` 简写（如 `:model`, `:rules`）

---

## 2. TypeScript 编码规范

### 2.1 配置要求（来自 tsconfig.app.json）

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标
    "module": "ESNext",           // ES Module
    "strict": true,               // ✅ 严格模式（必须开启）
    "noUnusedLocals": true,       // ✅ 禁止未使用的局部变量
    "noUnusedParameters": true,   // ✅ 禁止未使用的参数
    "noFallthroughCasesInSwitch": true  // ✅ switch 必须有 break
  }
}
```

### 2.2 接口定义规范

```typescript
// ✅ 正确: 接口定义放在 Store 中集中导出（本项目做法）
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

export interface Question {
  id: string;
  status: 'pending' | 'answered';  // 字面量联合类型作为枚举
  answer: string | null;            // 可空字段明确标注
}
```

**接口定义位置**: 本项目中所有接口统一定义在 [src/store/index.ts](../src/store/index.ts)，供各视图组件 import 复用。

### 2.3 类型使用规范

| 场景 | 类型写法 | 示例 |
|------|----------|------|
| 可空属性 | 显式 ` \| null` | `answer: string \| null` |
| 枚举状态 | 字面量联合类型 | `status: 'pending' \| 'answered'` |
| 组件 ref | 泛型标注 | `const doctor = ref<Doctor \| null>(null)` |
| 计算属性 | 返回值自动推断 | `computed(() => store.getDoctors())` |
| 事件参数 | 类型断言或泛型 | `route.params.username as string` |
| 表单对象 | reactive + 内联类型 | `reactive<{ name: string; password: string }>()` |
| dayjs 日期 | Dayjs 类型导入 | `import dayjs, { Dayjs } from 'dayjs'` |

### 2.4 变量声明风格

```typescript
// ✅ 响应式基本类型: 使用 ref()
const loading = ref(false);
const submitModalVisible = ref(false);
const selectedQuestion = ref<Question | null>(null);

// ✅ 响应式对象: 使用 reactive()
const formState = reactive({
  username: '',
  password: '',
});

// ✅ 计算属性: 使用 computed()
const pendingQuestions = computed(() =>
  currentDoctor.value
    ? store.getQuestionsByDoctor(currentDoctor.value.id).filter(q => q.status === 'pending')
    : []
);

// ❌ 避免: 不要用 ref() 包装对象（应使用 reactive）
// const formState = ref({ username: '', password: '' });  // 不推荐
```

---

## 3. CSS / 样式编写规范

### 3.1 Scoped CSS（强制使用）

**所有 `.vue` 组件必须使用 `<style scoped>`**，避免全局样式污染：

```vue
<style scoped>
.my-component {
  /* 这些样式仅作用于当前组件 */
}
</style>
```

**唯一例外**: [src/App.vue](../src/App.vue) 的全局样式使用无 scoped 的 `<style>`（CSS Reset + 全局字体）。

### 3.2 布局常量

| 常量 | 值 | 用途 |
|------|-----|------|
| 最大内容宽度 | `max-width: 1200px; margin: 0 auto` | 页面主容器 |
| Header 高度 | `64px` | 固定顶部导航 |
| Header 补偿 | `padding-top: 64px` | 各页面内容区偏移 |
| 最小页面高度 | `min-height: calc(100vh - 64px)` | 内容区域铺满 |

### 3.3 设计令牌（Design Tokens）

```css
/* 主题色 */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 渐变主色 */
--primary-blue: #1890ff;       /* Ant Design 主色 */
--success-green: #52c41a;      /* 成功/在线状态 */

/* 圆角 */
--radius-sm: 8px;              /* 按钮、标签 */
--radius-md: 12px;             /* 卡片 */
--radius-lg: 16px;             /* 大卡片、登录框 */

/* 阴影 */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);   /* 轻微阴影 */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);  /* 卡片悬浮 */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);  /* 登录框、Hero 图片 */

/* 字体 */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;

/* 响应式断点 */
--breakpoint-mobile: 768px;
```

### 3.4 BEM 风格的 CSS 类命名

本项目采用**类 BEM 命名**（Block__Element--Modifier 的简化版）：

```css
/* Block: 页面/组件级容器 */
.doctor-room { }
.consultation { }
.home { }

/* Element: Block 下的子元素 */
.doctor-room-header { }
.doctor-room-avatar { }
.question-card { }
.question-card-header { }
.question-card-content { }

/* 状态/变体 */
.doctor-card.active { }        /* 在线医生高亮 */
.stat-icon.doctor { }         /* 医生统计图标颜色 */
.stat-icon.question { }       /* 问题统计图标颜色 */
```

**命名规则**:
- 全部小写
- 多单词用连字符 `-` 连接（kebab-case）
- 不使用缩写（除非通用缩写如 `btn`, `icon`, `img`）
- 不使用 CSS 选择器嵌套超过 2 层

### 3.5 响应式断点规范

```css
/* 统一移动端断点: 768px */
@media (max-width: 768px) {
  /* 移动端适配样式 */
  .hero {
    flex-direction: column;     /* 纵向排列 */
    padding: 40px 24px;          /* 减少内边距 */
  }

  .hero h1 {
    font-size: 32px;            /* 缩小标题字号 */
  }

  .statistics,
  .rooms-grid,
  .doctors-grid {
    grid-template-columns: 1fr; /* 网格变单列 */
  }
}
```

**响应式处理要点**:
- Grid 布局: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` 自动折叠
- Flex 布局: 移动端改为 `flex-direction: column`
- 字号: 标题从 48px→32px, 36px→28px, 24px→20px 等
- 间距: padding 从 80px→40px 或 48px→24px

---

## 4. 命名约定

### 4.1 文件和目录命名

| 类型 | 规范 | 示例 |
|------|------|------|
| **Vue 组件文件** | PascalCase | `AppHeader.vue`, `DoctorRoom.vue` |
| **TypeScript 文件** | camelCase | `main.ts`, `vite.config.ts` |
| **目录名** | kebab-case | `src/views/`, `src/components/` |
| **JSON 数据文件** | kebab-case-描述 | `doctor-user-list.json` |
| **CSS 类名** | kebab-case | `.doctor-avatar`, `.room-header` |

### 4.2 代码标识符命名

| 元素 | 规范 | 示例 |
|------|------|------|
| **变量 (variables)** | camelCase | `currentPatient`, `submitModalVisible`, `answerText` |
| **常量 (constants)** | UPPER_SNAKE_CASE 或 camelCase | （本项目无全局常量） |
| **函数 (functions)** | 动词开头 camelCase | `verifyPatient()`, `submitAnswer()`, `copyRoomUrl()` |
| **计算属性 (computed)** | 名词/名词短语 camelCase | `pendingQuestions`, `activeDoctors`, `roomUrl` |
| **接口/类型 (interfaces)** | PascalCase | `Doctor`, `Patient`, `Question`, `State` |
| **Props / Emits** | camelCase | `doctorId`, `questionText` |
| **CSS 类名** | kebab-case | `.stat-card`, `.section-header`, `.login-btn` |
| **路由名称** | PascalCase | `'Home'`, `'ConsultationRoom'`, `'DoctorLogin'` |
| **路由参数** | camelCase | `:doctorUsername`, `:username` |
| **表单字段** | camelCase | `formState.username`, `authForm.birthday` |
| **事件处理器** | `on` + 动词 | `onFinish`, `handleSubmit`, `onMounted` |

### 4.3 布尔变量命名

```typescript
// ✅ 推荐: 使用 is/has/can/should/show 前缀
const isLoading = ref(false);
const showModal = ref(false);
const isActive = true;
const hasErrors = false;

// ✅ 本项目的实际用法
const submitting = ref(false);       // 提交中状态
const loading = ref(false);          // 加载中状态
```

### 4.4 异步操作相关命名

```typescript
// 提交/保存操作
const submitQuestion = () => { };
const submitAnswer = () => { };

// 模态框操作
const showSubmitModal = () => { };
const closeSubmitModal = () => { };
const closeAnswerModal = () => { };

// 数据操作
const verifyPatient = () => { };     // 验证并可能创建
const logoutPatient = () => { };      // 登出清除
const refreshQuestions = () => { };  // 刷新列表
const copyRoomUrl = () => { };        // 复制到剪贴板
```

---

## 5. 状态管理编码模式

### 5.1 Store 架构模式

本项目采用 **手写 reactive Store**（非 Pinia/Vuex），核心模式如下：

```typescript
// src/store/index.ts - 标准模板
import { reactive } from 'vue';

// ① 定义接口
export interface Entity {
  id: string;
  // ... 字段
}

// ② 定义 State 接口
interface State {
  entities: Entity[];
  currentEntity: Entity | null;
}

// ③ 创建响应式 State
const state = reactive<State>({
  entities: [],
  currentEntity: null,
});

// ④ 导出 Store 对象
export const store = {
  state,

  // 查询方法: 返回数据，不修改 state
  getEntities(): Entity[] { ... },
  getEntityById(id: string): Entity | undefined { ... },

  // 写入方法: 直接修改 state 中的响应式数据
  createEntity(data): Entity {
    const newEntity = { ...data, id: generateId() };
    state.entities.push(newEntity);
    return newEntity;
  },

  updateEntity(id, data): void {
    const entity = state.entities.find(e => e.id === id);
    if (entity) Object.assign(entity, data);
  },
};
```

### 5.2 组件中使用 Store

```vue
<script setup lang="ts">
// ✅ 正确: 解构导入需要的接口和方法
import { store, Doctor, Question } from '../store';

// ✅ 通过 computed 访问 state（保持响应式）
const currentDoctor = computed(() => store.state.currentDoctor);
const activeDoctors = computed(() => store.getActiveDoctors());

// ✅ 方法直接调用
const handleSubmit = () => {
  store.addQuestion({ ... });
  message.success('操作成功');
};
</script>
```

### 5.3 新增实体时的 ID 生成策略

```typescript
// 问题: q + 时间戳
id: `q${Date.now()}`        // 例: q1714382400000

// 患者: patient + 时间戳
id: `patient${Date.now()}`  // 例: patient1714382400000

// 预置数据: 前缀 + 3位序号
// doc001, doc002... / patient001, patient002... / q001, q002...
```

---

## 6. Ant Design Vue 使用规范

### 6.1 注册方式

本项目采用 **全量注册**（在 `main.ts` 中）：

```typescript
// src/main.ts
import Antd from 'ant-design-vue';
app.use(Antd);  // 全局注册所有组件
```

使用时无需单独 import 组件，直接在模板中使用即可：
```vue
<template>
  <a-button type="primary">按钮</a-button>
  <a-form :model="form" @finish="onFinish">...</a-form>
  <a-modal v-model:open="visible">...</a-modal>
</template>
```

### 6.2 常用组件使用模式

#### 表单 (Form)

```vue
<!-- 标准 Form 模式 -->
<a-form
  :model="formState"
  :rules="rules"
  @finish="handleSubmit"
  layout="vertical"           <!-- 或 "horizontal" -->
>
  <a-form-item label="标签名" name="fieldName">
    <a-input v-model:value="formState.fieldName" size="large" />
  </a-form-item>
  <a-form-item>
    <a-button type="primary" html-type="submit" size="large" block>
      提交
    </a-button>
  </a-form-item>
</a-form>
```

#### 表单验证规则

```typescript
// ✅ 简洁的内联规则定义
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

// rules 与 a-form-item 的 name 属性一一对应
```

#### 模态框 (Modal)

```vue
<!-- 受控 Modal 模式 -->
<a-modal
  v-model:open="modalVisible"
  title="弹窗标题"
  @ok="handleOk"
  @cancel="handleCancel"
  :confirmLoading="submitting"
>
  <!-- 弹窗内容 -->
</a-modal>
```

```typescript
const modalVisible = ref(false);
const submitting = ref(false);

const handleOk = () => {
  // 执行异步操作...
  submitting.value = true;
  setTimeout(() => {
    // 操作完成
    modalVisible.value = false;
    submitting.value = false;
  }, 500);
};
```

#### 消息提示 (Message)

```typescript
import { message } from 'ant-design-vue';

message.success('操作成功');     // 成功（绿色）
message.error('操作失败');       // 错误（红色）
message.info('提示信息');         // 信息（蓝色）
message.warning('警告信息');     // 警告（橙色）
```

#### 图标 (Icons)

```typescript
// 从 @ant-design/icons-vue 按需导入
import {
  UserOutlined,          // 用户
  LockOutlined,           // 锁
  HomeOutlined,           // 首页
  PlusOutlined,           // 加号
  EditOutlined,           // 编辑
  CopyOutlined,           // 复制
  LogoutOutlined,         // 登出
  CheckOutlined,          // 对勾
  ReloadOutlined,         // 刷新
  TeamOutlined,           // 团队
  InfoCircleOutlined,     // 信息
  MessageOutlined,        // 消息
  FileTextOutlined,       // 文件
  ClockCircleOutlined,    // 时钟
  CheckCircleOutlined,    // 对勾圆圈
  SafetyCertificateOutlined,  // 安全证书
  MobileOutlined,         // 手机
  PhoneOutlined,          // 电话
  MailOutlined,           // 邮件
  EnvironmentOutlined,    // 地址
} from '@ant-design/icons-vue';

// 模板中使用
<template #prefix>
  <UserOutlined />
</template>
```

### 6.3 组件 Size 规范

| 场景 | size 值 | 说明 |
|------|---------|------|
| 主要操作按钮/输入框 | `size="large"` | 登录表单、提交按钮等 |
| 次要操作 | 默认（medium） | 列表中的操作按钮 |
| 表格/紧凑场景 | 默认或 `size="small"` | 当前项目未使用 small |

---

## 7. 组件设计模式

### 7.1 页面组件 (Views) vs 公共组件 (Components)

| 维度 | Views（页面） | Components（公共组件） |
|------|---------------|------------------------|
| **位置** | `src/views/` | `src/components/` |
| **路由绑定** | ✅ 是（router 关联） | ❌ 否 |
| **职责** | 完整业务页面 | 可复用的 UI 片段 |
| **当前示例** | Home, Consultation, DoctorRoom... | AppHeader, AppFooter |
| **复杂度** | 较高（150-480 行） | 较低（107-121 行） |
| **Store 依赖** | 通常依赖 | 通常不依赖 |

### 7.2 条件渲染模式

**双状态切换（如登录前后）**:

```vue
<template>
  <!-- 模式 1: v-if / v-else 切换整个区块 -->
  <div v-if="!currentUser" class="auth-section">
    <!-- 未登录界面 -->
  </div>
  <div v-else class="portal-section">
    <!-- 已登录界面 -->
  </div>
</template>
```

**列表空状态**:

```vue
<template>
  <a-empty v-if="list.length === 0" description="暂无数据" />
  <div v-else class="list-container">
    <div v-for="item in list" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>
```

### 7.3 异步操作模拟模式

本项目无后端 API，使用 `setTimeout` 模拟网络延迟：

```typescript
const handleSubmit = async () => {
  loading.value = true;                    // ① 设置加载状态

  setTimeout(() => {                       // ② 模拟延迟 (500ms)
    const result = store.someMethod();     // ③ 执行业务逻辑
    if (result) {
      message.success('成功');             // ④ 成功提示
    } else {
      message.error('失败');               // ⑤ 失败提示
    }
    loading.value = false;                 // ⑥ 清除加载状态
  }, 500);
};
```

---

## 8. 路由与导航规范

### 8.1 路由定义格式

```typescript
// src/router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/',                  // 路径: 以 / 开头
    name: 'Home',               // 名称: PascalCase
    component: Home,            // 组件: 直接引用（非懒加载）
  },
  {
    path: '/consultation/:doctorUsername',  // 动态参数
    name: 'ConsultationRoom',
    component: Consultation,                // 组件复用
  },
];
```

### 8.2 导航方式

```typescript
// ✅ 编程式导航（推荐）
const router = useRouter();
router.push('/path');                   // 字符串路径
router.push({ name: 'Home' });          // 路由名称
router.push(`/consultation/${username}`); // 动态路径拼接

// ✅ 声明式导航（模板中）
<router-link to="/">首页</router-link>
<!-- 或使用自定义方法 -->
<a @click="navigateTo('/doctors')">医生</a>
```

### 8.3 参数获取

```typescript
const route = useRoute();

// 路径参数
const username = route.params.username as string;
const doctorUsername = route.params.doctorUsername as string;

// 查询参数（本项目未使用）
// const searchQuery = route.query.q as string;
```

### 8.4 权限守卫模式（组件内实现）

本项目**不使用**全局导航守卫，而是在目标组件的 `onMounted` 中检查权限：

```typescript
onMounted(() => {
  if (!currentDoctor.value || currentDoctor.value.username !== username) {
    message.error('请先登录');
    router.push('/doctor/login');    // 重定向到登录页
  }
});
```

---

## 9. 代码组织与导入顺序

### 9.1 Import 分组顺序（强制）

```typescript
<script setup lang="ts">
// ════════════════════════════════════════
// 1. Vue 核心 API
// ════════════════════════════════════════
import { ref, reactive, computed, onMounted, watch } from 'vue';

// ════════════════════════════════════════
// 2. Vue Router
// ════════════════════════════════════════
import { useRouter, useRoute } from 'vue-router';

// ════════════════════════════════════════
// 3. Ant Design Vue
// ════════════════════════════════════════
import { message } from 'ant-design-vue';

// ════════════════════════════════════════
// 4. 第三方库
// ════════════════════════════════════════
import dayjs, { Dayjs } from 'dayjs';

// ════════════════════════════════════════
// 5. Ant Design Icons
// ════════════════════════════════════════
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';

// ════════════════════════════════════════
// 6. 项目内部模块（相对路径）
// ════════════════════════════════════════
import { store, Doctor, Question } from '../store';
</script>
```

### 9.2 同组内按字母排序

```typescript
// ✅ 图标按字母顺序排列
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  EditOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
```

### 9.3 空行分隔规则

- import 块之间：**1 行空行**
- 不同逻辑分区之间：**1 行空行**
- 函数/方法定义之间：**1 行空行**
- 严禁连续 2 个以上空行

---

## 快速检查清单 (Checklist)

在提交新代码前，请确认以下事项：

### Vue SFC
- [ ] 文件顺序: `<template>` → `<script setup lang="ts">` → `<style scoped>`
- [ ] `<style>` 标签包含 `scoped` 属性（除非是全局样式）
- [ ] `v-for` 提供了 `:key` 属性
- [ ] 根元素为单一 `<div>` 包裹

### TypeScript
- [ ] 无 `any` 类型（使用具体类型或 `unknown`）
- [ ] 无未使用的变量和参数（tsconfig strict 检查）
- [ ] 可空字段显式标注 `\| null`
- [ ] 枚举使用字面量联合类型（如 `'pending' \| 'answered'`）

### 样式
- [ ] CSS 类名使用 kebab-case
- [ ] 页面主容器使用 `max-width: 1200px; margin: 0 auto`
- [ ] Header 补偿: `padding-top: 64px`
- [ ] 包含 `@media (max-width: 768px)` 响应式适配
- [ ] 圆角使用项目标准值: 8px / 12px / 16px

### 命名
- [ ] 组件文件: PascalCase（如 `MyComponent.vue`）
- [ ] 变量/函数: camelCase（如 `myVariable`）
- [ ] CSS 类: kebab-case（如 `my-class`）
- [ ] 接口/类型: PascalCase（如 `MyInterface`）

### Ant Design
- [ ] 主要操作的 input/button 设置 `size="large"`
- [ ] 表单使用 `:model` + `:rules` + `@finish` 模式
- [ ] Modal 使用 `v-model:open` 双向绑定
- [ ] 操作结果使用 `message.success()` / `message.error()` 反馈

---

*此文件由 Context Builder toolset 基于源码静态分析自动生成。*
