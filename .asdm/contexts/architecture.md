# 系统架构

## 概述
QA Live Healthcare 是一个基于现代前端技术栈的单页面应用（SPA），采用 Vue 3 + TypeScript 构建的在线医疗健康平台。系统采用组件化、模块化的架构设计，具有良好的可扩展性和维护性。

## 架构总览

```mermaid
graph TB
    subgraph "前端应用层"
        A1[Vue 3 应用] --> A2[路由管理]
        A1 --> A3[状态管理]
        A1 --> A4[UI 组件库]
    end
    
    subgraph "数据层"
        B1[API 服务] --> B2[localStorage 存储]
        B3[Vue 响应式状态] --> B2
        B1 --> B3
    end
    
    subgraph "构建与部署层"
        C1[Vite 构建] --> C2[开发服务器]
        C1 --> C3[生产构建]
        C1 --> C4[静态资源优化]
    end
    
    A1 --> B1
    A1 --> C1
```

## 技术架构

### 前端架构
```mermaid
graph LR
    A[用户界面] --> B[Vue 组件]
    B --> C[状态管理]
    B --> D[路由管理]
    C --> E[数据存储]
    D --> F[页面导航]
    
    G[构建工具] --> H[开发环境]
    G --> I[生产环境]
    
    B --> G
```

### 核心框架选择

#### Vue 3 + Composition API
- **优势**: 更好的类型支持、逻辑复用、代码组织
- **特点**: 组合式 API、响应式系统、TypeScript 集成

#### TypeScript
- **类型安全**: 编译时类型检查
- **开发体验**: 智能提示、代码重构
- **维护性**: 清晰的接口定义

#### Vite 构建工具
- **开发效率**: 快速的冷启动、热更新
- **构建优化**: 代码分割、Tree Shaking
- **插件生态**: 丰富的插件支持

## 应用架构

### 组件架构
```mermaid
graph TD
    A[App.vue] --> B[AppHeader]
    A --> C[AppFooter]
    A --> D[RouterView]
    
    D --> E[Home.vue]
    D --> F[Consultation.vue]
    D --> G[Doctors.vue]
    D --> H[AppointmentDoctors.vue]
    D --> I[AppointmentConfirm.vue]
    D --> J[AppointmentDetail.vue]
    D --> K[MyAppointments.vue]
    D --> L[DoctorLogin.vue]
    D --> M[DoctorRoom.vue]
    D --> N[DoctorSchedule.vue]
    D --> O[DoctorAppointments.vue]
    
    H --> P[ScheduleCard]
    H --> Q[TimeSlotPicker]
    I --> R[AppointmentItem]
    J --> S[AppointmentStats]
    
    M --> T[DoctorAppointmentItem]
    O --> U[ScheduleForm]
```

### 预约模块架构
```mermaid
graph TB
    subgraph "预约模块"
        A[AppointmentConfirm] --> B[预约确认页]
        C[AppointmentDetail] --> D[预约详情页]
        E[MyAppointments] --> F[我的预约页]
        G[AppointmentItem] --> H[预约项组件]
        I[AppointmentStats] --> J[预约统计组件]
    end
    
    subgraph "医生端预约"
        K[DoctorAppointments] --> L[预约管理页]
        M[DoctorAppointmentItem] --> N[预约项组件]
        O[DoctorSchedule] --> P[排班管理页]
        Q[ScheduleForm] --> R[排班表单]
    end
    
    subgraph "数据层"
        S[API Services]
        T[localStorage]
    end
    
    B --> S
    F --> S
    L --> S
    P --> S
    S --> T
```

### 路由架构
```mermaid
graph LR
    A[首页 /] --> B[问诊页 /consultation]
    A --> C[医生列表 /doctors]
    A --> D[预约医生 /appointment/doctors]
    A --> E[我的预约 /my-appointments]
    
    D --> F[预约确认 /appointment/confirm]
    F --> G[预约详情 /appointment/detail/:id]
    
    H[医生登录 /doctor/login] --> I[医生诊室 /doctor/room/:username]
    I --> J[预约管理 /doctor/appointments]
    I --> K[排班管理 /doctor/schedule]
    
    L[关于页 /about]
```

### 状态管理架构
```mermaid
graph TB
    A[Store 状态] --> B[医生数据]
    A --> C[患者数据]
    A --> D[预约数据]
    A --> E[排班数据]
    A --> F[问诊数据]
    A --> G[当前用户]
    
    H[组件] --> I[状态读取]
    H --> J[状态修改]
    H --> K[API 调用]
    
    I --> A
    J --> A
    K --> A
```

## 模块设计

### 核心模块

#### 1. 用户认证模块
- **功能**: 医生登录、患者验证
- **组件**: `DoctorLogin.vue`, 患者身份验证组件
- **状态**: `currentDoctor`, `currentPatient`
- **存储**: localStorage (`currentDoctor`, `currentPatient`)

#### 2. 预约挂号模块
- **功能**: 
  - 医生排班管理（创建、编辑、启用/禁用）
  - 时段管理（添加、删除、修改时段）
  - 预约创建（选择医生、时段、填写信息）
  - 预约状态管理（待确认、已确认、待就诊、已完成、已拒绝、已取消）
  - 预约取消（患者/医生取消）
  - 预约统计（待确认数、已确认数、已完成数等）
- **组件**: 
  - 患者端: `AppointmentDoctors.vue`, `AppointmentConfirm.vue`, `AppointmentDetail.vue`, `MyAppointments.vue`
  - 医生端: `DoctorSchedule.vue`, `DoctorAppointments.vue`
  - 公共组件: `ScheduleCard.vue`, `TimeSlotPicker.vue`, `AppointmentItem.vue`, `AppointmentStats.vue`
- **状态**: `appointments`, `schedules`
- **存储**: localStorage (`appointments`, `schedules`)

#### 3. 问诊管理模块
- **功能**: 问题提交、问题查看、问题回答
- **组件**: `Consultation.vue`, `DoctorRoom.vue`
- **状态**: `questions` 列表

#### 4. 医生管理模块
- **功能**: 医生列表展示、医生详情、排班管理
- **组件**: `Doctors.vue`, `Home.vue`（医生卡片）, `DoctorSchedule.vue`
- **状态**: `doctors` 列表

#### 5. 统计展示模块
- **功能**: 平台数据统计、预约统计、实时状态展示
- **组件**: `Home.vue`（统计部分）, `AppointmentStats.vue`
- **状态**: 计算属性动态生成

### 数据流设计

#### 预约创建数据流
```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 组件
    participant A as API 服务
    participant L as localStorage
    participant S as Store
    
    U->>C: 选择医生和时段
    C->>A: 调用 createAppointment API
    A->>L: 保存预约数据
    L-->>A: 保存成功
    A-->>C: 返回预约结果
    C->>S: 更新预约列表
    S-->>C: 状态更新
    C-->>U: 显示预约成功
```

#### 预约取消数据流
```mermaid
sequenceDiagram
    participant U as 用户
    participant I as AppointmentItem
    participant P as 父组件
    participant A as API 服务
    participant L as localStorage
    
    U->>I: 点击取消按钮
    I->>I: 显示取消确认弹窗
    U->>I: 选择取消原因并确认
    I->>P: emit('cancel', callback)
    P->>A: 调用 cancelAppointment API
    A->>L: 更新 localStorage 数据
    L-->>A: 更新成功
    A-->>P: 返回结果
    P-->>I: 执行回调 (成功/失败)
    I-->>U: 显示取消结果消息
```

#### 状态同步数据流
```mermaid
sequenceDiagram
    participant P as 患者端
    participant D as 医生端
    participant A as API 服务
    participant L as localStorage
    
    P->>A: 创建/取消预约
    A->>L: 更新数据
    L-->>A: 保存成功
    
    Note over D,L: 数据共享 (同一浏览器)
    D->>L: 读取数据
    L-->>D: 返回数据
    D->>A: 确认/拒绝预约
    A->>L: 更新数据
    L-->>A: 保存成功
    
    P->>L: 读取最新数据
    L-->>P: 返回更新后的数据
```

## 性能优化策略

### 1. 代码分割
```typescript
// 路由懒加载
const Home = () => import('./views/Home.vue')
const AppointmentDoctors = () => import('./views/AppointmentDoctors.vue')
const MyAppointments = () => import('./views/MyAppointments.vue')
```

### 2. 组件优化
- 使用 `v-if` 和 `v-show` 合理
- 计算属性缓存
- 事件处理防抖
- 组件懒加载

### 3. 资源优化
- 图片懒加载
- 字体文件优化
- CSS 压缩

### 4. 构建优化
- Tree Shaking 移除未使用代码
- 代码分割按需加载
- Gzip 压缩

## 安全架构

### 前端安全措施
1. **输入验证**: 所有用户输入进行验证
2. **XSS 防护**: 使用 Vue 的模板转义
3. **CSRF 防护**: 后续可添加 token 验证
4. **数据脱敏**: 敏感信息显示处理

### 认证安全
- 医生密码前端加密（后续可改为后端加密）
- 会话超时处理
- 权限控制

### 数据安全
- localStorage 数据加密存储（可选）
- 敏感信息不持久化

## 扩展性设计

### 微前端架构准备
```mermaid
graph LR
    A[主应用] --> B[预约模块]
    A --> C[问诊模块]
    A --> D[医生模块]
    A --> E[患者模块]
    A --> F[统计模块]
    
    B --> G[子应用1]
    C --> H[子应用2]
```

### 插件化设计
- 组件可插拔设计
- 功能模块化
- 配置外部化

### API 抽象层
- 统一的 HTTP 客户端
- 错误处理中间件
- 请求/响应拦截器
- 数据缓存机制

## 部署架构

### 开发环境
```mermaid
graph LR
    A[本地开发] --> B[Vite 开发服务器]
    B --> C[热重载]
    B --> D[类型检查]
    B --> E[ESLint]
```

### 生产环境
```mermaid
graph LR
    A[源代码] --> B[Vite 构建]
    B --> C[静态资源]
    C --> D[CDN 分发]
    C --> E[Web 服务器]
    E --> F[用户访问]
```

### 环境配置
- 开发环境：热重载、调试工具
- 测试环境：完整功能测试
- 生产环境：优化构建、CDN 加速

## 监控与日志

### 前端监控
- 错误捕获和上报
- 性能指标监控
- 用户行为分析

### 日志系统
- 操作日志记录
- 错误日志收集
- 调试信息输出

## 未来架构演进

### 技术栈升级路径
1. **Vue 3** → **Vue 3.5+**（保持最新）
2. **状态管理** → **Pinia**（替代当前实现）
3. **构建工具** → **Vite 5+**（性能优化）

### 架构演进方向
1. **微服务化**: 后端服务拆分
2. **实时通信**: WebSocket 集成（预约状态实时推送）
3. **移动端**: PWA 或原生应用
4. **国际化**: 多语言支持

### 预约功能扩展方向
1. **多种预约类型**: 普通门诊、专家门诊、复诊
2. **智能推荐**: 根据科室、症状推荐医生
3. **提醒功能**: 就诊前自动提醒
4. **评价系统**: 就诊后患者评价

---
*此文件由 Context Builder 工具集生成，最后更新于 2026-04-23*
