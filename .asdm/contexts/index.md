# 工作区索引与 AI 模型导航指南

> **生成时间**: 2026-04-28  
> **工具集**: Context Builder (`context-builder`)  
> **语言**: 简体中文

---

## 项目概览

| 属性 | 值 |
|------|----|
| **项目名称** | QA Live Healthcare（在线医疗问诊平台） |
| **版本** | 0.0.0 |
| **定位** | 连接医生与患者的在线问诊系统，支持患者提问、医生回答及诊室管理 |
| **架构类型** | 纯前端 SPA（单页应用），无后端服务，使用 JSON 静态数据模拟 |

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3（Composition API + `<script setup>`） | ^3.5.10 |
| 路由管理 | Vue Router 4（HTML5 History 模式） | ^4.6.3 |
| 状态管理 | 自定义轻量级 Store（基于 Vue 3 `reactive`） | — |
| UI 组件库 | Ant Design Vue 4 | ^4.2.6 |
| 时间处理 | dayjs | ^1.11.19 |
| 构建工具 | Vite 5 | ^5.4.8 |
| 开发语言 | TypeScript 5（严格模式） | ^5.5.3 |

---

## 目录结构

```
qa-live-healthcare/
├── index.html                        # HTML 入口
├── package.json                      # 依赖与脚本配置
├── vite.config.ts                    # Vite 构建配置
├── tsconfig.json / tsconfig.app.json # TypeScript 配置
├── public/
│   └── vite.svg
├── src/
│   ├── main.ts                       # 应用入口，挂载 Vue + Router + Ant Design Vue
│   ├── App.vue                       # 根组件（Header + RouterView + Footer）
│   ├── style.css                     # 全局样式（CSS Reset + 基础变量）
│   ├── vite-env.d.ts                 # Vite 环境类型声明
│   ├── router/
│   │   └── index.ts                  # 路由配置（7 条路由）
│   ├── store/
│   │   └── index.ts                  # 全局状态管理 + 业务逻辑
│   ├── components/
│   │   ├── AppHeader.vue             # 固定顶部导航栏
│   │   ├── AppFooter.vue             # 底部信息栏
│   │   └── HelloWorld.vue            # 脚手架默认组件（未使用）
│   ├── views/
│   │   ├── Home.vue                  # 首页（Hero + 统计 + 开放诊室）
│   │   ├── Consultation.vue          # 患者问诊页
│   │   ├── DoctorLogin.vue           # 医生登录页
│   │   ├── DoctorRoom.vue            # 医生诊室管理页
│   │   ├── Doctors.vue               # 医生团队列表页
│   │   └── About.vue                 # 关于我们页
│   └── data/
│       ├── doctor-user-list.json     # 医生 Mock 数据（5 名）
│       ├── patient-user.json         # 患者 Mock 数据（5 名）
│       └── question-list.json        # 问诊记录 Mock 数据（7 条）
└── .asdm/
    ├── contexts/                     # Context Builder 生成的上下文文件（本目录）
    └── toolsets/
        └── context-builder/          # Context Builder 工具集
```

---

## 路由结构

```
路径                              路由名称          组件               说明
/                                 Home              Home.vue           首页
/consultation                     Consultation      Consultation.vue   患者问诊（自选医生）
/consultation/:doctorUsername     ConsultationRoom  Consultation.vue   进入指定医生诊室
/doctors                          Doctors           Doctors.vue        医生团队列表
/about                            About             About.vue          关于我们
/doctor/login                     DoctorLogin       DoctorLogin.vue    医生登录
/doctor/room/:username            DoctorRoom        DoctorRoom.vue     医生工作诊室（需登录）
```

---

## 核心数据模型

### Doctor（医生）
```typescript
interface Doctor {
  id: string           // 唯一标识，如 "doc001"
  username: string     // 登录用户名，如 "dr-zhang-wei"
  password: string     // 登录密码（明文 Mock）
  name: string         // 显示名称，如 "张伟医生"
  title: string        // 职称，如 "主任医师"
  department: string   // 科室，如 "心内科"
  avatar: string       // 头像 URL
  experience: number   // 从业年限
  specialties: string[] // 擅长领域
  isActive: boolean    // 是否在线开诊
}
```

### Patient（患者）
```typescript
interface Patient {
  id: string       // 唯一标识，如 "pat001"
  name: string     // 患者姓名
  birthday: string // 出生日期 YYYY-MM-DD
  phone: string    // 联系电话
  gender: string   // 性别
}
```

### Question（问诊记录）
```typescript
interface Question {
  id: string                          // 唯一标识，如 "q001"
  patientId: string                   // 患者 ID
  patientName: string                 // 患者姓名（冗余）
  doctorId: string                    // 医生 ID
  doctorName: string                  // 医生姓名（冗余）
  question: string                    // 问题描述
  submitTime: string                  // 提交时间 ISO 格式
  status: 'pending' | 'answered'      // 问题状态
  answer?: string                     // 医生回复内容
  answerTime?: string                 // 回复时间
}
```

---

## 功能模块说明

### 患者端流程
1. 访问 `/consultation` → 输入姓名 + 生日验证身份（首次自动注册）
2. 验证通过后 → 查看历史问题列表 + 提交新问题（选择在线医生 + 描述症状）
3. 从首页诊室卡片进入 `/consultation/:doctorUsername` → 自动预选该医生

### 医生端流程
1. 访问 `/doctor/login` → 输入用户名 + 密码登录（测试账号：`dr-zhang-wei` / `123456`）
2. 登录成功 → 跳转至 `/doctor/room/:username`
3. 诊室页 → 查看待响应问题（支持文字回复 / 标记已口述解答）+ 查看已解答问题
4. 可复制诊室链接分享给患者

### 平台统计（首页）
- 专业医生数 / 问题总数 / 待响应问题数 / 在线诊室数（实时从 Store 计算）

---

## 上下文文件导航

以下为 Context Builder 生成的各上下文文件索引，可按需请求生成：

| 文件 | 描述 | 状态 |
|------|------|------|
| [`index.md`](./index.md) | 工作区总览与导航（本文件） | ✅ 已生成 |
| [`standard-project-structure.md`](./standard-project-structure.md) | 项目结构规范 | 待生成 |
| [`standard-coding-style.md`](./standard-coding-style.md) | 编码风格规范 | 待生成 |
| [`data-models.md`](./data-models.md) | 数据模型详解（含 ER 图） | 待生成 |
| [`deployment.md`](./deployment.md) | 部署配置与流程 | 待生成 |
| [`api.md`](./api.md) | API / Store 方法文档 | 待生成 |
| [`architecture.md`](./architecture.md) | 系统架构设计（含架构图） | 待生成 |

---

## 重要注意事项

1. **数据不持久化**：所有运行时数据（新增问题、新患者）在页面刷新后丢失，无 localStorage 或后端存储
2. **无真实鉴权**：医生密码以明文存储于 JSON，仅用于演示
3. **路由守卫缺失**：医生诊室鉴权通过 `onMounted` 实现而非全局路由守卫
4. **无实时通信**：医生诊室刷新为手动触发，无 WebSocket / SSE 机制

---

*本文件由 Context Builder 工具集自动生成。如需更新，请执行 `/asdm-context-update` 命令。*
