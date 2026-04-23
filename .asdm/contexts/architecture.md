# 架构设计

## 概述

本文档描述在线医疗问诊平台的系统架构、设计决策和技术模式。

## 架构概览

```mermaid
graph TB
    subgraph "客户端层"
        WEB[Web浏览器]
        MOBILE[移动端]
    end
    
    subgraph "前端应用层"
        VUE[Vue 3 应用]
        ROUTER[Vue Router 路由]
        STORE[Vue Reactive Store]
        UI[Ant Design Vue]
    end
    
    subgraph "数据层"
        JSON[(JSON 静态数据)]
    end
    
    WEB --> VUE
    MOBILE --> VUE
    VUE --> ROUTER
    VUE --> STORE
    VUE --> UI
    STORE --> JSON
```

## 技术架构

### 技术栈概览

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Vue 3 | 渐进式 JavaScript 框架 |
| **类型系统** | TypeScript | 类型安全的 JavaScript 超集 |
| **UI 组件库** | Ant Design Vue | 企业级 UI 组件库 |
| **路由管理** | Vue Router | Vue.js 官方路由管理器 |
| **构建工具** | Vite | 下一代前端构建工具 |
| **状态管理** | Vue Reactive | Vue 3 响应式 API |

### 架构特点

```mermaid
graph LR
    A[Vue 3 单文件组件] --> B[Composition API]
    B --> C[逻辑复用<br/>Composables]
    C --> D[类型安全<br/>TypeScript]
    D --> E[响应式状态<br/>Reactive API]
    E --> A
```

## 应用架构

### 整体架构图

```mermaid
graph TB
    subgraph "入口层"
        index[ index.html ]
        main[ main.ts ]
    end
    
    subgraph "应用层"
        App[ App.vue ]
        Header[ AppHeader.vue ]
        Footer[ AppFooter.vue ]
    end
    
    subgraph "视图层 Views"
        Home[ Home.vue ]
        Consultation[ Consultation.vue ]
        DoctorLogin[ DoctorLogin.vue ]
        DoctorRoom[ DoctorRoom.vue ]
        Doctors[ Doctors.vue ]
        About[ About.vue ]
    end
    
    subgraph "组件层 Components"
        Card[ DoctorCard ]
        Form[ QuestionForm ]
        List[ QuestionList ]
    end
    
    subgraph "业务逻辑层"
        Router[ router/index.ts ]
        Store[ store/index.ts ]
    end
    
    subgraph "数据层"
        DoctorData[ doctor-user-list.json ]
        PatientData[ patient-user.json ]
        QuestionData[ question-list.json ]
    end
    
    index --> main
    main --> App
    App --> Header
    App --> Router
    App --> Footer
    Router --> Home
    Router --> Consultation
    Router --> DoctorLogin
    Router --> DoctorRoom
    Router --> Doctors
    Router --> About
    
    Home --> Store
    Consultation --> Store
    DoctorLogin --> Store
    DoctorRoom --> Store
    Doctors --> Store
    
    Store --> DoctorData
    Store --> PatientData
    Store --> QuestionData
```

## 页面路由架构

### 路由配置

```mermaid
graph TB
    subgraph "路由配置"
        R1["/ → Home"]
        R2["/consultation → Consultation"]
        R3["/consultation/:doctorUsername → Consultation"]
        R4["/doctors → Doctors"]
        R5["/about → About"]
        R6["/doctor/login → DoctorLogin"]
        R7["/doctor/room/:username → DoctorRoom"]
    end
    
    subgraph "路由守卫"
        Guard[路由守卫]
    end
    
    subgraph "状态同步"
        Sync[Store 状态同步]
    end
```

### 路由表

| 路径 | 组件 | 用途 | 访问控制 |
|------|------|------|----------|
| `/` | Home.vue | 首页 | 公开 |
| `/consultation` | Consultation.vue | 问诊页 | 公开 |
| `/consultation/:doctorUsername` | Consultation.vue | 指定医生诊室 | 公开 |
| `/doctors` | Doctors.vue | 医生列表 | 公开 |
| `/about` | About.vue | 关于页面 | 公开 |
| `/doctor/login` | DoctorLogin.vue | 医生登录 | 公开 |
| `/doctor/room/:username` | DoctorRoom.vue | 医生工作台 | 需登录 |

## 状态管理架构

### Store 结构

```mermaid
classDiagram
    class Store {
        +state: State
        +loginDoctor()
        +logoutDoctor()
        +verifyPatient()
        +logoutPatient()
        +addQuestion()
        +answerQuestion()
        +getStatistics()
    }
    
    class State {
        +doctors: Doctor[]
        +patients: Patient[]
        +questions: Question[]
        +currentDoctor: Doctor | null
        +currentPatient: Patient | null
    }
    
    class Doctor {
        +id: string
        +username: string
        +name: string
        +title: string
        +department: string
        +isActive: boolean
    }
    
    class Patient {
        +id: string
        +name: string
        +birthday: string
    }
    
    class Question {
        +id: string
        +patientName: string
        +doctorName: string
        +question: string
        +status: string
        +answer: string
    }
    
    Store o-- State
    State o-- Doctor
    State o-- Patient
    State o-- Question
```

### 状态流

```mermaid
sequenceDiagram
    participant U as 用户
    participant V as Vue组件
    participant S as Store
    participant D as JSON数据
    
    U->>V: 执行操作
    V->>S: 调用store方法
    S->>D: 读取/修改数据
    D-->>S: 返回数据
    S-->>V: 更新响应式状态
    V-->>U: 界面更新
```

## 设计模式

### 1. 单文件组件模式 (SFC)

```vue
<template>
  <!-- 视图结构 -->
  <div class="component">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 逻辑代码
import { ref, computed } from 'vue';
</script>

<style scoped>
/* 样式代码 */
</style>
```

### 2. 组合式函数模式

```typescript
// composables/useDoctor.ts
import { computed } from 'vue';
import { store } from '@/store';

export function useDoctor(doctorId: string) {
  const doctor = computed(() => 
    store.state.doctors.find(d => d.id === doctorId)
  );
  
  const questions = computed(() => 
    store.getQuestionsByDoctor(doctorId)
  );
  
  return { doctor, questions };
}
```

### 3. 响应式状态模式

```typescript
// store/index.ts
import { reactive } from 'vue';

interface State {
  doctors: Doctor[];
  questions: Question[];
}

const state = reactive<State>({
  doctors: [],
  questions: [],
});

export const store = {
  state,
  // 方法...
};
```

## 页面组件架构

### 首页 (Home)

```mermaid
graph TB
    subgraph "Home.vue"
        H1[Hero区域]
        H2[统计卡片]
        H3[医生诊室列表]
    end
    
    subgraph "子组件"
        C1[AppHeader]
        C2[AppFooter]
    end
    
    subgraph "数据来源"
        D1[getStatistics()]
        D2[getActiveDoctors()]
    end
    
    H1 --> D1
    H2 --> D1
    H3 --> D2
    H1 --> C1
    H3 --> C2
```

### 问诊页面 (Consultation)

```mermaid
graph TB
    subgraph "Consultation.vue"
        P1[医生选择]
        P2[患者验证表单]
        P3[问题提交表单]
        P4[问题列表展示]
    end
    
    subgraph "Store方法"
        S1[verifyPatient()]
        S2[addQuestion()]
        S3[getQuestionsByPatient()]
    end
    
    P2 --> S1
    P3 --> S2
    P4 --> S3
```

### 医生端 (Doctor)

```mermaid
graph TB
    subgraph "DoctorLogin.vue"
        L1[登录表单]
    end
    
    subgraph "DoctorRoom.vue"
        R1[问题列表]
        R2[回复表单]
        R3[统计数据]
    end
    
    subgraph "Store方法"
        M1[loginDoctor()]
        M2[getQuestionsByDoctor()]
        M3[answerQuestion()]
        M4[logoutDoctor()]
    end
    
    L1 --> M1
    R1 --> M2
    R2 --> M3
    R1 --> M4
```

## 数据流程

### 患者问诊流程

```mermaid
sequenceDiagram
    participant P as 患者
    participant FE as 前端
    participant S as Store
    participant D as JSON
    
    P->>FE: 访问首页
    FE->>S: 加载医生数据
    S->>D: 读取doctor-user-list.json
    D-->>S: 返回医生列表
    S-->>FE: 更新界面
    
    P->>FE: 选择医生
    FE->>FE: 路由到诊室
    
    P->>FE: 填写身份信息
    FE->>S: verifyPatient(name, birthday)
    S->>D: 验证患者
    D-->>S: 返回/创建患者
    S-->>FE: 患者已验证
    
    P->>FE: 提交问题
    FE->>S: addQuestion()
    S->>D: 保存问题
    S-->>FE: 问题已添加
    
    Note over S: status = 'pending'
```

### 医生回答流程

```mermaid
sequenceDiagram
    participant D as 医生
    participant FE as 前端
    participant S as Store
    participant Data as JSON
    
    D->>FE: 登录
    FE->>S: loginDoctor(username, password)
    S->>Data: 验证医生
    Data-->>S: 返回医生信息
    S-->>FE: 登录成功
    
    FE->>S: getQuestionsByDoctor(doctorId)
    S-->>FE: 返回待回答问题
    
    D->>FE: 选择问题
    FE->>FE: 显示问题详情
    
    D->>FE: 输入回复内容
    FE->>S: answerQuestion(questionId, answer)
    S->>Data: 更新问题状态
    S-->>FE: 回复成功
    
    Note over S: status = 'answered'
```

## 模块职责

| 模块 | 职责 | 文件位置 |
|------|------|----------|
| 路由管理 | 页面导航、路由守卫 | `router/index.ts` |
| 状态管理 | 数据存储、业务逻辑 | `store/index.ts` |
| 视图组件 | 页面展示、用户交互 | `views/*.vue` |
| 公共组件 | 复用组件 | `components/*.vue` |
| 静态数据 | 模拟后端数据 | `data/*.json` |

## 扩展建议

### 当前架构的优势

1. **轻量级**: 使用 Vue 3 响应式 API，无需额外状态管理库
2. **类型安全**: TypeScript 提供完整的类型检查
3. **组件化**: SFC 模式便于代码复用和维护
4. **简单数据流**: 静态 JSON 数据简化了数据管理

### 未来扩展方向

1. **API 服务层**: 添加 axios 封装真实 API 调用
2. **持久化存储**: 使用 localStorage 或 IndexedDB 持久化数据
3. **用户认证**: 添加 JWT token 认证机制
4. **实时通信**: WebSocket 实现医生回复实时通知
5. **移动端适配**: 响应式布局支持移动设备

---

*最后更新: 2026-04-21*
