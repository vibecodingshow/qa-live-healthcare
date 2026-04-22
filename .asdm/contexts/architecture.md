# 在线医疗咨询平台 - 系统架构文档

## 概述

本文档描述了在线医疗咨询平台（qa-live-healthcare）的系统架构设计，涵盖技术选型、应用结构、模块设计、数据流和安全考虑等方面。

## 技术架构总览

### 技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用                              │
├─────────────────────────────────────────────────────────────┤
│  框架层    │  Vue 3.5.10 + Composition API + TypeScript 5.5 │
├────────────┼────────────────────────────────────────────────┤
│  UI层      │  Ant Design Vue 4.2.6                          │
├────────────┼────────────────────────────────────────────────┤
│  路由层    │  Vue Router 4.6.3                               │
├────────────┼────────────────────────────────────────────────┤
│  状态管理层│  Pinia (状态管理)                                │
├────────────┼────────────────────────────────────────────────┤
│  构建工具  │  Vite 5.4.8                                     │
├────────────┼────────────────────────────────────────────────┤
│  运行时    │  Node.js (开发) + 现代浏览器 (生产)              │
└────────────┴────────────────────────────────────────────────┘
```

### 架构模式

本项目采用 **前后端分离架构**（B/S模式）：

```
┌─────────────┐         HTTP/HTTPS          ┌─────────────────┐
│   浏览器     │ ◄─────────────────────────► │   API 网关/后端  │
│  (SPA应用)  │                             │   (未来扩展)    │
└─────────────┘                             └─────────────────┘
       │
       ├── Vue Router (客户端路由)
       ├── Pinia (本地状态管理)
       └── 本地JSON数据 (当前阶段)
```

### 当前阶段 vs 生产阶段

| 层面 | 当前阶段 | 生产阶段 |
|------|----------|----------|
| 数据存储 | 本地JSON文件 | 后端数据库 |
| 状态管理 | Pinia (浏览器内存) | Pinia + 后端API |
| 认证方式 | 前端验证逻辑 | JWT/SSO认证 |
| 部署方式 | 静态文件托管 | CDN + API服务 |

## 应用架构

### 模块划分

```
qa-live-healthcare
├── components/          # 可复用UI组件
│   ├── AppHeader.vue   # 应用头部导航
│   ├── DoctorCard.vue  # 医生信息卡片
│   └── PatientCard.vue # 患者信息卡片
├── views/              # 页面级组件
│   ├── Home.vue        # 首页（患者端）
│   ├── Doctors.vue     # 医生列表页
│   ├── Consultation.vue # 发起咨询页
│   ├── DoctorLogin.vue  # 医生登录页
│   ├── DoctorRoom.vue  # 医生工作室
│   ├── UserCenter.vue  # 用户中心
│   └── NotFound.vue    # 404页面
├── router/             # 路由配置
│   └── index.ts        # 路由定义和守卫
├── store/              # 状态管理
│   └── index.ts        # Pinia Store定义
├── data/               # 静态数据
│   ├── doctor-user-list.json
│   ├── patient-user.json
│   └── question-list.json
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

### 组件层次

```
App.vue (根组件)
├── AppHeader.vue (全局头部)
│   └── 登录状态显示 / 导航菜单
├── RouterView (路由视图)
│   ├── Home.vue (首页)
│   │   └── DoctorCard.vue (医生卡片列表)
│   ├── Doctors.vue (医生列表)
│   │   └── DoctorCard.vue
│   ├── Consultation.vue (咨询页)
│   ├── DoctorLogin.vue (医生登录)
│   ├── DoctorRoom.vue (医生工作室)
│   │   └── QuestionList (问题列表)
│   ├── UserCenter.vue (用户中心)
│   └── NotFound.vue (404)
└── 全局样式 (style.css)
```

## 核心模块设计

### 1. 路由模块 (Vue Router)

**路由配置**：

```typescript
路由结构：
├── /                    → Home.vue (患者首页)
├── /doctors             → Doctors.vue (医生列表)
├── /consultation/:doctorId → Consultation.vue (发起咨询)
├── /doctor-login        → DoctorLogin.vue (医生登录)
├── /doctor-room         → DoctorRoom.vue (医生工作室，需认证)
├── /user-center         → UserCenter.vue (用户中心)
└── /:pathMatch(.*)     → NotFound.vue (404)
```

**路由守卫逻辑**：

```typescript
// 医生工作室需要登录验证
beforeEnter: (to, from, next) => {
  const isDoctorLoggedIn = checkDoctorAuth();
  if (isDoctorLoggedIn) {
    next();
  } else {
    next('/doctor-login');
  }
}
```

### 2. 状态管理模块 (Pinia)

**Store结构**：

```
store/index.ts
├── 状态定义
│   ├── doctors: Doctor[]           // 医生列表
│   ├── patients: Patient[]         // 患者列表
│   ├── questions: Question[]       // 咨询问题
│   ├── currentDoctor: Doctor | null  // 当前登录医生
│   └── currentPatient: Patient | null // 当前患者
│
├── 认证方法
│   ├── doctorLogin(credentials)   // 医生登录
│   ├── patientVerify(patientId)  // 患者验证
│   └── logout()                   // 登出
│
├── 医生管理方法
│   ├── fetchDoctors()             // 获取医生列表
│   ├── getOnlineDoctors()         // 获取在线医生
│   └── updateDoctorStatus(id, status) // 更新状态
│
├── 咨询管理方法
│   ├── submitQuestion(question)   // 提交问题
│   ├── answerQuestion(id, answer) // 回复问题
│   └── getQuestionsByDoctor(id)   // 获取医生的咨询
│
└── 统计方法
    └── getStatistics()            // 获取统计数据
```

### 3. 数据模型

**核心实体关系**：

```
┌──────────────┐       1:N        ┌──────────────┐
│   Doctor     │◄────────────────│   Question   │
│──────────────│                  │──────────────│
│ id: number   │                  │ id: number   │
│ name: string │                  │ doctorId: number
│ department   │                  │ patientId: number
│ title        │                  │ content: string
│ avatar       │                  │ answer: string
│ status       │                  │ status: string
│ hospital     │                  │ createTime   │
└──────────────┘                  └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Patient    │
│──────────────│
│ id: number   │
│ name: string │
│ age: number   │
│ gender       │
│ phone        │
└──────────────┘
```

### 4. 组件模块

**公共组件**：

| 组件 | 职责 | 使用场景 |
|------|------|----------|
| `AppHeader` | 导航、登录状态显示 | 全局 |
| `DoctorCard` | 医生信息展示 | Home, Doctors |
| `PatientCard` | 患者信息展示 | UserCenter |

**页面组件**：

| 组件 | 职责 | 路由 |
|------|------|------|
| `Home` | 首页、热门医生展示 | `/` |
| `Doctors` | 医生列表、筛选 | `/doctors` |
| `Consultation` | 提交咨询问题 | `/consultation/:id` |
| `DoctorLogin` | 医生登录表单 | `/doctor-login` |
| `DoctorRoom` | 医生工作室、回复咨询 | `/doctor-room` |
| `UserCenter` | 患者个人信息 | `/user-center` |

## 数据流设计

### 用户会话流程

```
┌─────────────────────────────────────────────────────────────┐
│                        患者端流程                            │
└─────────────────────────────────────────────────────────────┘

[访问首页] → [浏览医生] → [选择医生] → [填写咨询] → [提交问题]
     │                                             │
     ▼                                             ▼
[加载医生数据]                              [存储到Store]
     │                                             │
     ▼                                             ▼
[显示医生卡片列表]                        [更新questions]
```

```
┌─────────────────────────────────────────────────────────────┐
│                        医生端流程                            │
└─────────────────────────────────────────────────────────────┘

[医生登录] → [验证账号] → [进入工作室] → [查看咨询] → [回复问题]
     │           │              │             │             │
     ▼           ▼              ▼             ▼             ▼
[表单验证]  [Store验证]   [路由守卫]   [加载问题列表]  [更新状态]
```

### 数据更新流程

```typescript
// 问题提交流程
async function submitQuestion(question: Question) {
  // 1. 表单验证
  if (!validateForm(question)) {
    return { success: false, error: '验证失败' };
  }
  
  // 2. 状态更新
  store.questions.push({
    id: generateId(),
    ...question,
    status: 'pending',
    createTime: new Date().toISOString()
  });
  
  // 3. 持久化到localStorage (可选)
  saveQuestionsToStorage();
  
  return { success: true };
}

// 问题回复流程
async function answerQuestion(questionId: number, answer: string) {
  const question = store.questions.find(q => q.id === questionId);
  
  if (!question) {
    return { success: false, error: '问题不存在' };
  }
  
  if (question.doctorId !== store.currentDoctor?.id) {
    return { success: false, error: '无权回复此问题' };
  }
  
  // 更新问题状态
  question.answer = answer;
  question.status = 'answered';
  
  return { success: true };
}
```

## 安全性设计

### 当前安全措施

```typescript
// 1. 路由守卫 - 防止未授权访问
const routes = [
  {
    path: '/doctor-room',
    component: DoctorRoom,
    beforeEnter: (to, from, next) => {
      if (!store.currentDoctor) {
        next({ path: '/doctor-login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    }
  }
];

// 2. 医生身份验证
function doctorLogin(credentials: { username: string; password: string }) {
  const doctor = store.doctors.find(
    d => d.username === credentials.username && 
         d.password === credentials.password
  );
  
  if (!doctor) {
    throw new Error('用户名或密码错误');
  }
  
  // 清除敏感信息
  delete doctor.password;
  store.currentDoctor = doctor;
  
  return doctor;
}

// 3. 患者身份验证
function patientVerify(patientId: string) {
  const patient = store.patients.find(p => p.id === patientId);
  
  if (!patient) {
    throw new Error('患者不存在');
  }
  
  store.currentPatient = patient;
  
  return patient;
}
```

### 未来安全增强

| 方面 | 当前 | 生产环境建议 |
|------|------|--------------|
| 认证方式 | 前端验证 | JWT Token + Refresh Token |
| 密码存储 | 明文对比 | BCrypt哈希 |
| 传输安全 | HTTP | HTTPS + HSTS |
| 权限控制 | 简单路由守卫 | RBAC/ABAC |
| 数据验证 | 前端表单验证 | 后端双重验证 |
| 会话管理 | 内存存储 | Redis分布式会话 |

## 性能优化

### 前端性能策略

```typescript
// 1. 路由懒加载
const routes = [
  {
    path: '/doctor-room',
    component: () => import('./views/DoctorRoom.vue')
  }
];

// 2. 组件按需加载
// 使用 Ant Design Vue 的按需引入

// 3. 大列表虚拟滚动 (未来扩展)
```

### 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'antdv-vendor': ['ant-design-vue'],
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    // 资源内联阈值
    assetsInlineLimit: 4096
  }
});
```

## 部署架构

### 当前部署模式

```
┌─────────────────────────────────────────────────────────────┐
│                       静态文件部署                            │
└─────────────────────────────────────────────────────────────┘

源代码 (src/)  ──[Vite构建]──►  静态资源 (dist/)
                                        │
                                        ▼
                              ┌─────────────────┐
                              │  Web服务器      │
                              │  (Nginx/Apache) │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              ┌─────────┐        ┌─────────┐        ┌─────────┐
              │ 用户浏览器│        │ CDN节点 │        │ 备份服务器│
              └─────────┘        └─────────┘        └─────────┘
```

### 环境配置

```typescript
// 开发环境
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}

// Vite配置
// vite.config.ts
export default defineConfig({
  base: '/',  // 部署基础路径
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### 生产部署清单

- [ ] 执行 `npm run build` 生成 `dist/` 目录
- [ ] 配置Web服务器处理SPA路由（Vue Router History模式）
- [ ] 配置HTTPS证书
- [ ] 配置静态资源缓存策略
- [ ] 配置Gzip压缩
- [ ] 配置CDN加速（如使用对象存储）
- [ ] 设置域名解析
- [ ] 配置监控和日志

## 扩展性设计

### 模块化架构

```
┌─────────────────────────────────────────────────────────────┐
│                      可扩展模块                              │
└─────────────────────────────────────────────────────────────┘

1. UI组件层 - 可替换/新增组件
   └── components/NewComponent.vue

2. 视图层 - 可新增页面
   └── views/NewPage.vue

3. 路由层 - 动态注册路由
   └── router.addRoutes()

4. 状态层 - Store模块化分割
   └── store/modules/
       ├── doctor.ts
       ├── patient.ts
       └── consultation.ts

5. API层 - 接口统一管理 (未来)
   └── services/api.ts
```

### 功能扩展方向

| 模块 | 扩展功能 | 实现方式 |
|------|----------|----------|
| 认证系统 | 微信登录、手机验证码 | 第三方SDK集成 |
| 咨询功能 | 视频咨询、语音咨询 | WebRTC |
| 支付功能 | 在线挂号、付费咨询 | 微信/支付宝SDK |
| 评价系统 | 医生评价、满意度调查 | 新增评价组件 |
| 通知系统 | 消息推送、短信通知 | 第三方推送服务 |
| 数据分析 | 用户行为分析、统计报表 | 数据埋点 |

## 技术决策记录

| 决策项 | 选择 | 原因 |
|--------|------|------|
| 前端框架 | Vue 3 | 渐进式框架，易于学习，生态成熟 |
| 语言 | TypeScript | 类型安全，提升代码质量 |
| UI框架 | Ant Design Vue | 企业级组件，医疗场景适用 |
| 状态管理 | Pinia | Vue 3官方推荐，轻量易用 |
| 构建工具 | Vite | 快速热更新，开发体验好 |
| 路由方案 | Vue Router | Vue官方路由解决方案 |

## 文档索引

相关架构文档：

- `index.md` - 工作区索引和项目概述
- `standard-project-structure.md` - 项目结构规范
- `data-models.md` - 数据模型详细定义
- `api.md` - API接口文档
- `standard-coding-style.md` - 代码编写规范

---

**最后更新**: 2026-04-21
**文档版本**: 1.0.0
