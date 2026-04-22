# 代码风格标准文档

## 概述

本文档定义了 qa-live-healthcare 项目的代码编写规范和风格指南，确保代码的一致性和可维护性。

## 技术栈规范

### 核心框架
- **Vue 3**: 使用组合式 API (`<script setup>`)
- **TypeScript**: 强类型支持
- **Ant Design Vue**: UI 组件库 (v4.2.6)

### 开发工具
- **Vite**: 构建工具 (v5.4.8)
- **Vue Router**: 路由管理 (v4.6.3)

## 文件结构规范

### 文件命名
```
components/          # 组件目录 (PascalCase)
├── AppHeader.vue    # 应用头部组件
├── AppFooter.vue    # 应用底部组件
└── HelloWorld.vue   # 示例组件

views/               # 页面视图 (PascalCase)
├── Home.vue         # 首页
├── Consultation.vue # 咨询页面
└── DoctorRoom.vue   # 医生诊室

data/                # 数据文件 (camelCase)
├── doctor-user-list.json
├── patient-user.json
└── question-list.json
```

### 导入路径规范
- 使用相对路径: `import { store } from '../store'`
- 避免路径别名
- 按模块分组导入

## Vue 组件规范

### 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入语句
// 响应式数据定义
// 计算属性
// 方法定义
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 组合式 API 规范
```typescript
// ✅ 推荐：使用 ref 和 computed
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// ✅ 推荐：使用 watch
export const route = useRoute()
watch(() => route.path, (newPath) => {
  // 路径变化处理
})

// ✅ 推荐：使用 reactive 处理复杂对象
const formState = reactive({
  username: '',
  password: ''
})
```

## TypeScript 规范

### 接口定义
```typescript
// 使用 PascalCase 命名接口
export interface Doctor {
  id: string
  username: string
  password: string
  name: string
  title: string
  department: string
  avatar: string
  experience: string
  specialties: string[]
  isActive: boolean
}

// 使用字面量类型定义状态
export interface Question {
  status: 'pending' | 'answered'
}
```

### 类型使用
```typescript
// ✅ 推荐：明确类型注解
const currentDoctor = computed(() => store.state.currentDoctor)

// ✅ 推荐：函数返回类型注解
const getDoctorByUsername = (username: string): Doctor | undefined => {
  return state.doctors.find(d => d.username === username)
}

// ✅ 推荐：使用 Omit 类型
addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>)
```

## 响应式数据规范

### 状态管理
```typescript
// ✅ 推荐：使用 reactive 管理复杂状态
interface State {
  doctors: Doctor[]
  patients: Patient[]
  questions: Question[]
  currentDoctor: Doctor | null
  currentPatient: Patient | null
}

const state = reactive<State>({ /* 初始状态 */ })
```

### 计算属性
```typescript
// ✅ 推荐：使用 computed
const pendingQuestions = computed(() => 
  state.questions.filter(q => q.status === 'pending' && q.doctorId === currentDoctor.value?.id)
)

const answeredQuestions = computed(() => 
  state.questions.filter(q => q.status === 'answered' && q.doctorId === currentDoctor.value?.id)
)
```

## 样式规范

### CSS 类命名
```css
/* ✅ 推荐：使用 BEM 风格命名 */
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 40px;
  width: 40px;
  border-radius: 8px;
  object-fit: cover;
}
```

### 响应式设计
```css
/* ✅ 推荐：移动端适配 */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 40px 24px;
  }
  
  .hero h1 {
    font-size: 32px;
  }
}
```

## 业务逻辑规范

### 数据操作
```typescript
// ✅ 推荐：统一的数据操作方法
export const store = {
  // 登录逻辑
  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    )
    if (doctor) {
      state.currentDoctor = doctor
      return doctor
    }
    return null
  },

  // 数据验证
  verifyPatient(name: string, birthday: string): Patient {
    let patient = state.patients.find(
      p => p.name === name && p.birthday === birthday
    )

    if (!patient) {
      // 动态创建患者
      patient = {
        id: `patient${Date.now()}`,
        name,
        birthday,
        phone: '',
        gender: '',
      }
      state.patients.push(patient)
    }

    state.currentPatient = patient
    return patient
  }
}
```

### 事件处理
```typescript
// ✅ 推荐：清晰的事件处理方法
const navigateTo = (path: string) => {
  router.push(path)
}

const submitAnswer = () => {
  if (selectedQuestion.value && answerText.value.trim()) {
    submitting.value = true
    store.answerQuestion(selectedQuestion.value.id, answerText.value.trim())
    closeAnswerModal()
    submitting.value = false
  }
}
```

## 代码格式化规范

### 缩进和空格
- 使用 2 个空格缩进
- 对象字面量前后留空格
- 操作符前后留空格

### 换行规范
```typescript
// ✅ 推荐：适当的换行
const statistics = computed(() => ({
  totalDoctors: state.doctors.length,
  totalQuestions: state.questions.length,
  activeSessions: state.questions.filter(q => q.status === 'pending').length,
  totalSessions: state.doctors.filter(d => d.isActive).length,
}))
```

## 注释规范

### 文档注释
```typescript
/**
 * 医生登录方法
 * @param username - 用户名
 * @param password - 密码
 * @returns 登录成功的医生对象，失败返回 null
 */
loginDoctor(username: string, password: string): Doctor | null
```

### 代码注释
```typescript
// 验证患者身份，如果不存在则创建新患者
const verifyPatient = (name: string, birthday: string): Patient => {
  // ... 实现逻辑
}
```

## 最佳实践

### 性能优化
- 使用 `computed` 缓存计算结果
- 使用 `watch` 监听响应式数据变化
- 避免在模板中进行复杂计算

### 可维护性
- 保持组件单一职责
- 提取可复用的工具函数
- 使用清晰的变量命名

### 错误处理
- 使用 TypeScript 类型检查
- 添加必要的空值检查
- 提供用户友好的错误提示

## 代码示例

### 完整的组件示例
```vue
<template>
  <div class="doctor-room">
    <div class="room-container" v-if="currentDoctor">
      <!-- 组件内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'

const route = useRoute()
const router = useRouter()

const username = route.params.username as string
const currentDoctor = computed(() => store.state.currentDoctor)
const pendingQuestions = computed(() => 
  store.getQuestionsByDoctor(currentDoctor.value?.id || '').filter(q => q.status === 'pending')
)

const answerModalVisible = ref(false)
const selectedQuestion = ref<Question | null>(null)
const answerText = ref('')

const showAnswerModal = (question: Question) => {
  selectedQuestion.value = question
  answerText.value = ''
  answerModalVisible.value = true
}

const closeAnswerModal = () => {
  answerModalVisible.value = false
  selectedQuestion.value = null
}

const submitAnswer = () => {
  if (selectedQuestion.value && answerText.value.trim()) {
    store.answerQuestion(selectedQuestion.value.id, answerText.value.trim())
    closeAnswerModal()
  }
}
</script>

<style scoped>
.doctor-room {
  min-height: 100vh;
  background: #f5f5f5;
}

.room-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
```

## 总结

本代码风格标准文档为 qa-live-healthcare 项目提供了统一的开发规范，涵盖了 Vue 3 组合式 API、TypeScript 类型系统、样式编写、业务逻辑实现等各个方面。遵循这些规范将有助于提高代码质量、可维护性和团队协作效率。

---

*文档版本: 1.0*  
*最后更新: 2026-04-21*