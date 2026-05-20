# 在线医疗问诊平台 - 工作区索引

## 项目概述

**项目名称**: qa-live-healthcare  
**项目类型**: 在线医疗问诊平台 (Vue 3 + TypeScript)  
**技术栈**: Vue 3, TypeScript, Vite, Ant Design Vue, Vue Router, dayjs

本项目是一个专业的在线医疗问诊平台，旨在连接患者与专业医生，提供便捷、高效的医疗咨询服务。

## 核心功能

### 用户角色

| 角色 | 功能描述 |
|------|----------|
| **患者** | 浏览医生、发起问诊、查看回复 |
| **医生** | 登录管理、回复患者问题、诊室管理 |

### 主要页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 平台概览、统计信息、开放诊室展示 |
| 医生列表 | `/doctors` | 展示所有注册医生信息 |
| 问诊页面 | `/consultation` | 患者发起问诊，选择医生 |
| 医生登录 | `/doctor/login` | 医生身份认证入口 |
| 医生诊室 | `/doctor/room/:username` | 医生管理患者问题和回复 |
| 关于我们 | `/about` | 平台介绍 |

## 技术架构

### 项目结构

```
src/
├── assets/           # 静态资源
├── components/        # 公共组件
│   ├── AppHeader.vue  # 应用头部导航
│   ├── AppFooter.vue  # 应用底部
│   └── HelloWorld.vue # 示例组件
├── data/              # 模拟数据
│   ├── doctor-user-list.json  # 医生用户数据
│   ├── patient-user.json      # 患者用户数据
│   └── question-list.json     # 问诊问题数据
├── router/            # 路由配置
│   └── index.ts      # 路由定义
├── store/             # 状态管理
│   └── index.ts      # 响应式状态与业务逻辑
├── views/             # 页面组件
│   ├── Home.vue       # 首页
│   ├── Doctors.vue    # 医生列表
│   ├── Consultation.vue # 问诊页面
│   ├── DoctorLogin.vue # 医生登录
│   ├── DoctorRoom.vue  # 医生诊室
│   └── About.vue       # 关于我们
├── App.vue            # 根组件
├── main.ts            # 应用入口
└── style.css          # 全局样式
```

### 状态管理

项目使用 Vue 3 的 `reactive` 进行简单的状态管理，主要数据结构：

- **Doctor**: 医生信息（ID、用户名、姓名、职称、科室、专长等）
- **Patient**: 患者信息（ID、姓名、生日、电话、性别）
- **Question**: 问诊问题（ID、患者、医生、问题内容、状态、回复）

### 依赖项

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | ^3.5.10 | 核心框架 |
| vue-router | ^4.6.3 | 路由管理 |
| ant-design-vue | ^4.2.6 | UI 组件库 |
| dayjs | ^1.11.19 | 日期处理 |
| typescript | ^5.5.3 | TypeScript 支持 |
| vite | ^5.4.8 | 构建工具 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 开发指南

### 添加新页面

1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 添加路由配置
3. 在头部导航中添加对应链接

### 添加新组件

1. 在 `src/components/` 创建组件
2. 在需要的页面中导入使用

### 数据模拟

项目使用 JSON 文件模拟后端数据，位于 `src/data/` 目录。

## 相关文档

- [标准项目结构](./standard-project-structure.md)
- [编码规范](./standard-coding-style.md)
- [数据模型](./data-models.md)
- [API 定义](./api.md)
- [部署配置](./deployment.md)
- [架构设计](./architecture.md)

## 参考资源

- [Vue 3 文档](https://v3.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Ant Design Vue](https://antdv.com/)
- [Vite 文档](https://vitejs.dev/)
