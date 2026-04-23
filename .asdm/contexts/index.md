# 在线医疗问诊平台 - 工作区索引

## 项目概述

**项目名称**: qa-live-healthcare  
**项目类型**: 在线医疗问诊平台 (Vue 3 + TypeScript)  
**核心功能**: 连接专业医生与患者，提供便捷、高效的医疗咨询服务

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue.js | 3.5.10 |
| 类型系统 | TypeScript | 5.5.3 |
| UI 组件库 | Ant Design Vue | 4.2.6 |
| 路由管理 | Vue Router | 4.6.3 |
| 构建工具 | Vite | 5.4.8 |
| 日期处理 | Day.js | 1.11.19 |

---

## 项目结构

```
qa-live-healthcare/
├── public/                     # 静态资源
│   └── vite.svg
├── src/                        # 源代码目录
│   ├── assets/                 # 资源文件
│   │   └── vue.svg
│   ├── components/             # 公共组件
│   │   ├── AppFooter.vue       # 页脚组件
│   │   ├── AppHeader.vue       # 页头组件
│   │   └── HelloWorld.vue      # 欢迎组件
│   ├── data/                   # 静态数据
│   │   ├── doctor-user-list.json   # 医生用户列表
│   │   ├── patient-user.json       # 患者用户数据
│   │   └── question-list.json      # 问诊问题列表
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── store/                 # 状态管理
│   │   └── index.ts
│   ├── views/                 # 页面视图
│   │   ├── Home.vue           # 首页
│   │   ├── Consultation.vue   # 问诊页面
│   │   ├── DoctorLogin.vue     # 医生登录页
│   │   ├── DoctorRoom.vue      # 医生诊室
│   │   ├── Doctors.vue         # 医生列表页
│   │   └── About.vue          # 关于页面
│   ├── App.vue                # 根组件
│   ├── main.ts                # 入口文件
│   ├── style.css              # 全局样式
│   └── vite-env.d.ts          # Vite 类型声明
├── index.html                  # HTML 入口
├── package.json               # 项目配置
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── .asdm/                    # ASDM 配置
    ├── contexts/             # 上下文文件 (本文档)
    └── toolsets/             # 工具集
```

---

## 核心数据模型

### 医生 (Doctor)
```typescript
interface Doctor {
  id: string;           // 医生ID
  username: string;     // 用户名
  password: string;     // 密码
  name: string;         // 姓名
  title: string;        // 职称 (主任医师/副主任医师/主治医师)
  department: string;   // 科室
  avatar: string;       // 头像URL
  experience: string;   // 临床经验
  specialties: string[]; // 专业领域
  isActive: boolean;   // 是否在线
}
```

### 患者 (Patient)
```typescript
interface Patient {
  id: string;      // 患者ID
  name: string;     // 姓名
  birthday: string; // 出生日期
  phone: string;    // 电话
  gender: string;   // 性别
}
```

### 问题 (Question)
```typescript
interface Question {
  id: string;           // 问题ID
  patientId: string;    // 患者ID
  patientName: string;   // 患者姓名
  doctorId: string;      // 医生ID
  doctorName: string;    // 医生姓名
  question: string;      // 问题内容
  submitTime: string;   // 提交时间
  status: 'pending' | 'answered';  // 状态
  answer: string | null; // 回复内容
  answerTime: string | null;       // 回复时间
}
```

---

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页，展示医生和统计信息 |
| `/consultation` | Consultation.vue | 问诊页面 |
| `/consultation/:doctorUsername` | Consultation.vue | 指定医生诊室 |
| `/doctors` | Doctors.vue | 医生列表 |
| `/about` | About.vue | 关于页面 |
| `/doctor/login` | DoctorLogin.vue | 医生登录 |
| `/doctor/room/:username` | DoctorRoom.vue | 医生工作台 |

---

## 功能模块

### 1. 首页 (Home)
- 平台介绍与功能展示
- 统计数据展示 (医生数、问题数、待响应数、在线诊室)
- 开放诊室卡片展示

### 2. 问诊功能 (Consultation)
- 患者身份验证 (姓名+出生日期)
- 问题提交与查看
- 医生回复展示

### 3. 医生端 (Doctor)
- 医生登录系统
- 诊室管理
- 问题回复

### 4. 医生列表 (Doctors)
- 全部医生展示
- 按科室筛选
- 在线状态显示

---

## 状态管理 (Store)

项目使用 Vue 3 Reactive API 进行状态管理，提供以下功能：

- `loginDoctor()` - 医生登录
- `logoutDoctor()` - 医生登出
- `verifyPatient()` - 患者身份验证
- `logoutPatient()` - 患者登出
- `addQuestion()` - 添加问题
- `answerQuestion()` - 回复问题
- `getActiveDoctors()` - 获取在线医生
- `getStatistics()` - 获取统计数据

---

## 相关上下文文件

- [standard-project-structure.md](./standard-project-structure.md) - 项目结构规范
- [standard-coding-style.md](./standard-coding-style.md) - 编码规范
- [data-models.md](./data-models.md) - 数据模型详解
- [architecture.md](./architecture.md) - 架构设计
- [api.md](./api.md) - API 定义
- [deployment.md](./deployment.md) - 部署配置

---

## 开发指南

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

*最后更新: 2026-04-21*
