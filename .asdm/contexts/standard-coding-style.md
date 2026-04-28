# 编码风格规范

> 本文档描述 **QA Live Healthcare** 项目的实际编码风格和规范，供 AI 模型在生成、修改代码时保持一致性。

---

## 技术栈与语言

- **主语言**：TypeScript 5.5+
- **框架**：Vue 3（Composition API + `<script setup>`）
- **构建工具**：Vite 5
- **UI 组件库**：Ant Design Vue 4
- **路由**：Vue Router 4
- **状态管理**：Vue 3 `reactive`（无 Pinia/Vuex）

---

## Vue 单文件组件（.vue）规范

### 结构顺序
```vue
<script setup lang="ts">
// 1. 导入语句
// 2. 接口/类型定义（如有）
// 3. Store / Router 使用
// 4. 响应式数据定义（ref / reactive / computed）
// 5. 方法定义
// 6. 生命周期钩子
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 样式（推荐使用 scoped） */
</style>
```

### 使用 `<script setup>` 语法
```vue
<!-- ✅ 正确 -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { store } from '../store';

const doctors = computed(() => store.getActiveDoctors());
</script>

<!-- ❌ 避免使用 Options API（与现有代码风格不一致） -->
<script lang="ts">
export default {
  data() { return {} }
}
</script>
```

### Props 定义（使用 TypeScript 接口）
```vue
<script setup lang="ts">
interface Props {
  doctorId: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: true,
});
</script>
```

---

## TypeScript 规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 接口（Interface） | PascalCase | `Doctor`、`Patient`、`Question` |
| 类型别名 | PascalCase | `UserRole`、`QuestionStatus` |
| 变量、函数 | camelCase | `loginDoctor`、`currentPatient` |
| 常量 | camelCase 或 UPPER_SNAKE_CASE | `store`、`MAX_RETRY` |
| Vue 组件 | PascalCase（文件名 + 引用名） | `DoctorRoom`、`AppHeader` |

### 类型声明
```typescript
// ✅ 始终使用显式类型（避免 any）
export interface Doctor {
  id: string;
  username: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  isActive: boolean;
}

// ✅ 函数返回类型显式声明
function loginDoctor(username: string, password: string): Doctor | null { }

// ✅ 使用联合类型替代 any
status: 'pending' | 'answered';
answer: string | null;

// ✅ 使用 Omit 创建子类型
type NewQuestion = Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>;
```

### 格式规范
```typescript
// ✅ 2 空格缩进
function example() {
  if (condition) {
    doSomething();
  }
}

// ✅ 使用单引号
const name = 'John';
const template = `Hello ${name}`;

// ✅ 语句末尾加分号
const doctor = state.doctors.find(d => d.id === id);
```

---

## Store 使用规范

本项目使用自定义 `reactive` Store，**不使用 Pinia/Vuex**。

```typescript
// ✅ 导入方式
import { store } from '../store';
import type { Doctor, Patient, Question } from '../store';

// ✅ 访问状态
const doctors = store.state.doctors;
const currentDoctor = store.state.currentDoctor;

// ✅ 调用方法
const doctor = store.loginDoctor(username, password);
store.answerQuestion(questionId, answerText);

// ✅ 在模板中使用 computed 包裹（保持响应式）
const activeDoctors = computed(() => store.getActiveDoctors());
```

---

## Vue Router 使用规范

```typescript
// ✅ 在 setup 中使用
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ✅ 命名路由跳转（推荐）
router.push({ name: 'DoctorRoom', params: { username: doctor.username } });

// ✅ 读取路由参数
const username = route.params.username as string;
const doctorUsername = route.params.doctorUsername as string | undefined;
```

---

## Ant Design Vue 使用规范

```vue
<!-- ✅ 全量导入（main.ts 已全局注册，无需单独导入） -->
<template>
  <a-button type="primary" @click="handleLogin">登录</a-button>
  <a-form :model="formData" @finish="onFinish">
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="formData.username" />
    </a-form-item>
  </a-form>
</template>

<!-- ✅ 使用 message / modal 等 API -->
<script setup lang="ts">
import { message } from 'ant-design-vue';
message.success('登录成功');
message.error('用户名或密码错误');
</script>
```

---

## 模板规范

```vue
<template>
  <!-- ✅ 单根元素（或使用 Fragment） -->
  <div class="page-container">
    
    <!-- ✅ v-for 必须带 :key -->
    <a-card v-for="doctor in doctors" :key="doctor.id">
      {{ doctor.name }}
    </a-card>

    <!-- ✅ v-if / v-else-if / v-else 同级使用 -->
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="hasError">加载失败</div>
    <div v-else>内容</div>

    <!-- ✅ 事件处理函数命名：handle + 动作 -->
    <a-button @click="handleSubmit">提交</a-button>
    <a-input @change="handleInputChange" />
  </div>
</template>
```

---

## 样式规范

```vue
<style scoped>
/* ✅ 优先使用 scoped 防止样式污染 */

/* ✅ 使用语义化类名（kebab-case） */
.doctor-card { }
.question-list { }
.submit-button { }

/* ✅ 避免直接覆盖 Ant Design 样式（使用 :deep() 选择器） */
:deep(.ant-card-body) {
  padding: 16px;
}
</style>
```

---

## 文件组织规范

### 新增视图页面
1. 在 `src/views/` 创建 `PascalCase.vue`
2. 在 `src/router/index.ts` 添加路由记录
3. 如需导航链接，在 `AppHeader.vue` 添加菜单项

### 新增共享组件
1. 在 `src/components/` 创建 `PascalCase.vue`
2. 因为已全局注册 Ant Design，无需在 `main.ts` 手动注册自定义组件（在 Vue 3 中直接 `import` 使用即可）

### 新增数据字段
1. 修改 `src/store/index.ts` 中对应的 Interface
2. 更新 `src/data/*.json` 中的 Mock 数据
3. 更新 `.asdm/contexts/data-models.md`

---

## 注释规范

```typescript
// ✅ 单行注释：说明"为什么"，而非"做什么"
// 使用 Date.now() 生成唯一 ID，避免引入 uuid 依赖
id: `patient${Date.now()}`,

// ✅ 接口注释（JSDoc 风格）
/**
 * 验证患者身份：姓名+生日匹配则返回已有患者，否则自动创建新患者记录
 */
verifyPatient(name: string, birthday: string): Patient

// ✅ TODO 注释（标注未来改进点）
// TODO: 接入真实后端 API 替换 Mock 数据
// TODO: 添加密码加密（当前明文存储）
```

---

## 代码审查检查项

在提交或修改代码前，请确认：

- [ ] TypeScript 类型完整，无 `any`（除非必要）
- [ ] Vue 组件使用 `<script setup lang="ts">` 语法
- [ ] `v-for` 包含 `:key` 属性
- [ ] 事件处理函数命名为 `handleXxx`
- [ ] 样式使用 `scoped`
- [ ] Store 方法调用正确（参考 `api.md`）
- [ ] 无控制台调试代码残留（`console.log`）

---

*本文档随代码风格演进而更新，使用 `/asdm-context-update` 命令保持同步。*
