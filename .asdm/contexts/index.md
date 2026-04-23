# 工作空间上下文索引

## 概述
这是一个基于 Vue.js 和 TypeScript 的医疗健康相关前端项目。项目使用现代前端技术栈构建，提供预约挂号、在线问诊等医疗服务界面。

## 项目结构

### 主要目录结构
```
qa-live-healthcare-main/
├── src/                    # 源代码目录
│   ├── api/               # API 接口服务
│   ├── components/         # Vue 组件
│   ├── views/             # 页面视图
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── data/              # 静态数据
│   └── assets/            # 静态资源
├── public/                 # 公共静态资源
├── .asdm/                # ASDM 配置
│   └── contexts/          # 上下文文件
└── .codebuddy/           # CodeBuddy 配置
```

### 技术栈
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **语言**: TypeScript + JavaScript
- **UI组件库**: Ant Design Vue
- **样式**: CSS（可能包含预处理器）
- **包管理**: npm
- **数据存储**: localStorage
- **日期处理**: dayjs

## 导航链接

以下是可用的上下文文件链接：

- [标准项目结构](standard-project-structure.md) - 项目组织架构和文件结构说明
- [代码规范](standard-coding-style.md) - 编码标准和风格指南
- [数据模型](data-models.md) - 数据结构和实体关系
- [部署配置](deployment.md) - 部署流程和环境配置
- [API 文档](api.md) - API 接口定义和调用说明
- [系统架构](architecture.md) - 系统架构和设计决策

## 关键组件

### 主要功能模块

#### 1. 预约挂号模块
- **患者端组件**:
  - `AppointmentDoctors.vue` - 预约医生列表
  - `AppointmentConfirm.vue` - 预约确认页面
  - `AppointmentDetail.vue` - 预约详情页面
  - `MyAppointments.vue` - 我的预约页面
  - `AppointmentItem.vue` - 预约项组件
  - `AppointmentStats.vue` - 预约统计组件
  - `ScheduleCard.vue` - 排班卡片组件
  - `TimeSlotPicker.vue` - 时段选择器组件

- **医生端组件**:
  - `DoctorAppointments.vue` - 医生预约管理页面
  - `DoctorSchedule.vue` - 医生排班管理页面
  - `DoctorAppointmentItem.vue` - 医生端预约项组件
  - `ScheduleForm.vue` - 排班表单组件

#### 2. 问诊模块
- `Consultation.vue` - 在线问诊页面
- `DoctorRoom.vue` - 医生诊室页面

#### 3. 用户认证模块
- `DoctorLogin.vue` - 医生登录页面
- `AppHeader.vue` - 应用头部（含患者身份验证）

#### 4. 公共组件
- `AppHeader.vue` - 应用头部导航
- `AppFooter.vue` - 应用底部

### API 服务模块

- `api/appointment.ts` - 患者端预约 API
- `api/doctor-appointment.ts` - 医生端预约 API
- `api/request.ts` - HTTP 请求封装

### 类型定义模块

- `types/appointment.ts` - 预约相关类型定义
- `types/index.ts` - 类型统一导出

### 工具函数模块

- `utils/appointment.ts` - 预约工具函数（状态流转、数据同步）

### 开发环境

- 开发服务器：Vite Dev Server
- 构建工具：Vite
- 包管理器：npm
- 类型检查：vue-tsc

## 核心功能特性

### 预约挂号
- 医生排班管理
- 时段预约选择
- 预约状态流转（PENDING → CONFIRMED → SCHEDULED → COMPLETED）
- 预约取消（患者/医生）
- 预约统计展示

### 在线问诊
- 患者提交问题
- 医生回答问题
- 问诊状态跟踪

### 用户认证
- 医生登录
- 患者身份验证

### 数据管理
- localStorage 数据持久化
- API 数据同步

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

## 注意事项

- 本项目使用 TypeScript 进行类型检查
- 遵循 Vue 3 组合式 API 规范
- 项目配置包含 ESLint 和 Prettier 代码规范检查
- 支持热重载开发体验
- 使用 localStorage 进行数据持久化
- 患者ID格式：`patient_{姓名}_{日期}`

---

*此文件由 Context Builder 工具集生成，最后更新于 2026-04-23*
