# 系统架构

## Overview
QA Live Healthcare 是一个纯前端单页应用（SPA），无后端服务、无数据库、无微服务。采用 Vue 3 Composition API 架构，数据存储在浏览器内存中。

## Architecture Diagram

```mermaid
graph TB
    subgraph "Browser"
        subgraph "Vue 3 Application"
            MAIN[main.ts<br/>应用入口]
            ROUTER[Vue Router<br/>路由管理]
            STORE[reactive Store<br/>状态管理]
            MAIN --> ROUTER
            MAIN --> STORE
        end

        subgraph "Views 页面层"
            HOME[Home.vue<br/>首页]
            CONS[Consultation.vue<br/>患者问诊]
            DOC_LOGIN[DoctorLogin.vue<br/>医生登录]
            DOC_ROOM[DoctorRoom.vue<br/>医生诊室]
            DOCS[Doctors.vue<br/>医生列表]
            ABOUT[About.vue<br/>关于我们]
            ROUTER --> HOME
            ROUTER --> CONS
            ROUTER --> DOC_LOGIN
            ROUTER --> DOC_ROOM
            ROUTER --> DOCS
            ROUTER --> ABOUT
        end

        subgraph "Components 组件层"
            HEADER[AppHeader.vue<br/>顶部导航]
            FOOTER[AppFooter.vue<br/>底部页脚]
            HOME --> HEADER
            HOME --> FOOTER
        end

        subgraph "Data 数据层"
            JSON_DOC[doctor-user-list.json]
            JSON_PAT[patient-user.json]
            JSON_Q[question-list.json]
            STORE --> JSON_DOC
            STORE --> JSON_PAT
            STORE --> JSON_Q
        end
    end

    subgraph "External"
        CDN_Pexels[Pexels CDN<br/>图片资源]
        CDN_AVATAR[Ant Design Icons<br/>图标库]
        HOME -.-> CDN_Pexels
        HOME -.-> CDN_AVATAR
    end
```

## Architecture Layers

### 1. Entry Layer（入口层）
- **`index.html`** - SPA 入口 HTML，加载 `/src/main.ts`
- **`main.ts`** - 注册 Ant Design Vue（全量引入）+ Vue Router，挂载到 `#app`

### 2. Routing Layer（路由层）
- **`src/router/index.ts`** - 7 条路由，HTML5 History 模式
- **无路由守卫** - DoctorRoom 页面的鉴权在 `onMounted` 中手动检查

### 3. State Layer（状态层）
- **`src/store/index.ts`** - 自定义 reactive Store（非 Pinia/Vuex）
- 包含 Doctor、Patient、Question 三个接口定义
- 提供 11 个 Store 方法（登录/验证/查询/提交/回复等）

### 4. View Layer（视图层）
- 6 个页面组件，每个对应一个路由
- 共用 Header + Footer 全局布局（在 App.vue 中组合）

### 5. Data Layer（数据层）
- 3 个静态 JSON 文件作为初始数据
- 构建时打包进 bundle，运行时加载到 reactive state

## Component Architecture

```mermaid
graph TB
    APP[App.vue] --> HEADER[AppHeader.vue]
    APP --> RV[RouterView]
    APP --> FOOTER[AppFooter.vue]

    RV --> HOME[Home.vue]
    RV --> CONS[Consultation.vue]
    RV --> DLOGIN[DoctorLogin.vue]
    RV --> DROOM[DoctorRoom.vue]
    RV --> DOCS[Doctors.vue]
    RV --> ABOUT[About.vue]

    subgraph "Ant Design Vue 组件使用"
        A_LAYOUT[a-layout]
        A_MENU[a-menu]
        A_FORM[a-form]
        A_CARD[a-card]
        A_MODAL[a-modal]
        A_COLLAPSE[a-collapse]
        A_TABLE[a-empty]
        A_TAG[a-tag]
        A_BADGE[a-badge]
        A_ALERT[a-alert]
        A_BUTTON[a-button]
        A_DATE[a-date-picker]
        A_SELECT[a-select]
        A_INPUT[a-input]
        A_TEXTAREA[a-textarea]
        A_DIVIDER[a-divider]
    end

    HOME --> A_LAYOUT
    HOME --> A_CARD
    HOME --> A_TAG
    HOME --> A_BADGE
    HOME --> A_BUTTON

    CONS --> A_FORM
    CONS --> A_DATE
    CONS --> A_MODAL
    CONS --> A_SELECT
    CONS --> A_TEXTAREA
    CONS --> A_CARD
    CONS --> A_TAG
    CONS --> A_ALERT
    CONS --> A_DIVIDER

    DLOGIN --> A_FORM
    CONS --> A_INPUT

    DROOM --> A_CARD
    DROOM --> A_COLLAPSE
    DROOM --> A_MODAL
    DROOM --> A_TEXTAREA
    DROOM --> A_BUTTON
    DROOM --> A_ALERT
    DROOM --> A_EMPTY
```

## Key Business Flows

### Patient Consultation Flow（患者问诊流程）

```mermaid
sequenceDiagram
    actor P as 患者
    participant C as Consultation.vue
    participant S as Store
    participant R as Router

    P->>C: 访问 /consultation
    C->>C: 检查 currentPatient
    alt 未验证
        P->>C: 输入姓名+生日
        C->>S: verifyPatient(name, birthday)
        S-->>C: 返回 Patient
        C->>C: message.success('验证成功')
    end

    P->>C: 点击"提交问题"
    C->>C: 打开 Modal（医生选择+问题输入）
    P->>C: 选择医生并填写问题
    C->>S: addQuestion(data)
    Note over C: setTimeout 500ms 模拟延迟
    S-->>C: 返回新 Question
    C->>C: message.success('提交成功')
```

### Doctor Room Flow（医生诊室流程）

```mermaid
sequenceDiagram
    actor D as 医生
    participant L as DoctorLogin.vue
    participant R as DoctorRoom.vue
    participant S as Store
    participant RT as Router

    D->>L: 访问 /doctor/login
    D->>L: 输入用户名+密码
    L->>S: loginDoctor(username, password)
    alt 认证成功
        S-->>L: 返回 Doctor
        L->>RT: push(/doctor/room/:username)
    else 认证失败
        S-->>L: 返回 null
        L->>L: message.error('用户名或密码错误')
    end

    RT->>R: 加载 DoctorRoom
    R->>R: onMounted 检查 currentDoctor
    alt 未登录
        R->>L: push(/doctor/login)
    end

    D->>R: 查看待响应问题
    R->>S: getQuestionsByDoctor(id)
    S-->>R: 返回 Question[]

    alt 文字回复
        D->>R: 点击"文字回复"
        R->>R: 打开回复 Modal
        D->>R: 输入回复内容
        R->>S: answerQuestion(id, answer)
    else 标记已解答
        D->>R: 点击"标记已解答"
        R->>S: markQuestionAsAnswered(id)
    end
```

## Design Decisions

### 为什么使用 reactive Store 而非 Pinia/Vuex？
- 项目为演示原型，数据量小且无持久化需求
- `reactive()` 足以满足简单的内存状态管理
- 减少依赖和代码复杂度

### 为什么无路由守卫？
- DoctorRoom 的鉴权在 `onMounted` 中通过 `store.state.currentDoctor` 检查
- 这是一个简化方案，生产环境应使用 `router.beforeEach` 全局守卫

### 为什么全量引入 Ant Design Vue？
- 简化配置，快速开发
- 缺点：打包体积大，生产环境应配置按需加载（unplugin-vue-components）

### 为什么使用 setTimeout 模拟异步？
- 无后端服务，用 500ms 延迟模拟网络请求
- 提供 loading 状态的真实感

## Technology Decision Matrix

| 决策点 | 选择 | 备选方案 | 选择理由 |
|--------|------|----------|----------|
| 状态管理 | reactive() | Pinia / Vuex | 项目简单，无需复杂状态管理 |
| UI 组件库 | Ant Design Vue | Element Plus | 医疗行业企业级风格 |
| CSS 方案 | Scoped CSS + 纯 CSS | SCSS / Tailwind | 减少构建依赖 |
| 日期处理 | dayjs | moment.js | 更轻量（2KB vs 67KB） |
| HTTP 客户端 | 无（内存数据） | axios / fetch | 项目无后端 |
| 图标方案 | @ant-design/icons-vue | 自定义 SVG | 与 Ant Design 风格统一 |

## External Dependencies

### CDN Resources
- **Pexels Images**: 医生头像和 Hero 背景图
  - `https://images.pexels.com/photos/5215024/...`
  - `https://images.pexels.com/photos/4386467/...`
  - 等 5 个不同的 Pexels 图片 URL

### NPM Dependencies
```json
{
  "dependencies": {
    "ant-design-vue": "^4.2.6",    // UI 组件库
    "dayjs": "^1.11.19",           // 日期格式化
    "vue": "^3.5.10",              // 核心框架
    "vue-router": "^4.6.3"         // 路由
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.4", // Vue Vite 插件
    "typescript": "^5.5.3",        // TypeScript 编译器
    "vite": "^5.4.8",              // 构建工具
    "vue-tsc": "^2.1.6"            // Vue TS 类型检查
  }
}
```

## Known Limitations

1. **无数据持久化** - 刷新页面丢失所有操作数据
2. **无真实后端** - 所有操作仅内存模拟
3. **无路由守卫** - 仅在组件内手动鉴权
4. **明文密码** - 医生密码以明文存储
5. **无并发控制** - 多标签页操作可能导致状态冲突
6. **全量打包** - Ant Design Vue 未做按需加载
7. **无错误边界** - 组件错误可能导致白屏
8. **HelloWorld.vue 残留** - 脚手架示例文件未清理

---

*此架构文档应在重大设计变更时更新。使用 `/asdm-context-update architecture` 保持文档最新。*
