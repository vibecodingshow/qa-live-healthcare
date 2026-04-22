# 工作区索引 - 在线医疗咨询平台

## 项目概述

**项目名称**: qa-live-healthcare  
**项目类型**: 在线医疗咨询系统（Vue.js + TypeScript）  
**技术栈**: Vue 3, TypeScript, Vite, Ant Design Vue, Vue Router, Pinia  
**项目描述**: 一个在线医疗咨询平台，支持患者与医生进行远程问诊、医生登录管理等功能

## 技术架构

### 前端框架
- **核心框架**: Vue 3.5.10 (组合式API)
- **类型系统**: TypeScript 5.5.3
- **构建工具**: Vite 5.4.8
- **UI组件库**: Ant Design Vue 4.2.6
- **路由管理**: Vue Router 4.6.3
- **状态管理**: Pinia (预留)
- **日期处理**: Day.js 1.11.19

### 开发工具
- **Vue CLI插件**: @vitejs/plugin-vue 5.1.4
- **类型检查**: vue-tsc 2.1.6

## 项目结构

```
qa-live-healthcare/
├── src/                      # 源代码目录
│   ├── components/           # 可复用组件
│   │   ├── AppHeader.vue     # 应用头部导航
│   │   ├── AppFooter.vue     # 应用底部
│   │   └── HelloWorld.vue    # 示例组件
│   ├── views/                # 页面视图
│   │   ├── Home.vue          # 首页
│   │   ├── Consultation.vue  # 咨询页面
│   │   ├── Doctors.vue       # 医生列表页
│   │   ├── DoctorLogin.vue   # 医生登录页
│   │   ├── DoctorRoom.vue    # 医生工作室
│   │   └── About.vue         # 关于页面
│   ├── router/               # 路由配置
│   │   └── index.ts          # 路由定义和守卫
│   ├── store/                # 状态管理
│   │   └── index.ts          # Pinia store配置
│   ├── data/                 # 静态数据
│   │   ├── doctor-user-list.json   # 医生用户数据
│   │   ├── patient-user.json       # 患者用户数据
│   │   └── question-list.json      # 问题列表数据
│   ├── assets/               # 静态资源
│   ├── App.vue               # 根组件
│   ├── main.ts               # 应用入口
│   ├── style.css             # 全局样式
│   └── vite-env.d.ts         # Vite类型声明
├── public/                   # 公共静态资源
├── .asdm/                    # ASDM上下文目录
│   ├── contexts/            # 工作区上下文文件
│   └── toolsets/            # ASDM工具集
├── index.html                # HTML入口文件
├── package.json              # 项目依赖配置
├── vite.config.ts            # Vite配置
└── tsconfig.json             # TypeScript配置
```

## 路由结构

| 路径 | 组件 | 名称 | 说明 |
|------|------|------|------|
| `/` | Home.vue | 首页 | 平台首页，展示主要功能入口 |
| `/consultation` | Consultation.vue | 咨询页 | 患者发起咨询页面 |
| `/consultation/:doctorUsername` | Consultation.vue | 咨询室 | 指定医生的咨询室 |
| `/doctors` | Doctors.vue | 医生列表 | 展示所有可用医生 |
| `/doctor/login` | DoctorLogin.vue | 医生登录 | 医生身份认证入口 |
| `/doctor/room/:username` | DoctorRoom.vue | 医生工作室 | 医生专属工作区 |
| `/about` | About.vue | 关于 | 平台介绍页面 |

## 核心功能模块

### 1. 患者端功能
- **首页浏览**: 查看平台介绍和功能入口
- **医生列表**: 浏览和搜索可用医生
- **发起咨询**: 选择医生进行在线问诊
- **咨询管理**: 查看和管理自己的咨询记录

### 2. 医生端功能
- **医生登录**: 医生身份认证和登录
- **医生工作室**: 管理咨询会话、查看患者信息
- **咨询回复**: 回复患者的咨询问题

### 3. 通用功能
- **响应式设计**: 适配不同屏幕尺寸
- **组件化开发**: 基于Vue 3组合式API
- **路由导航**: SPA无缝页面切换

## 数据模型

### 医生用户
- 用户名（唯一标识）
- 姓名
- 科室
- 头像
- 擅长领域
- 咨询状态

### 患者用户
- 用户ID
- 姓名
- 年龄
- 性别
- 联系方式
- 病史摘要

### 咨询记录
- 咨询ID
- 患者ID
- 医生用户名
- 问题描述
- 创建时间
- 咨询状态（待回复/进行中/已完成）
- 回复内容

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 常用命令

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产环境构建
npm run build

# 预览构建结果
npm run preview

# 类型检查
vue-tsc -b
```

### 代码规范
- 使用 TypeScript 严格模式
- Vue 组件使用 `<script setup>` 语法
- 组件命名遵循 PascalCase
- 样式使用 Scoped CSS
- API 接口遵循 RESTful 规范

## 相关资源链接

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Ant Design Vue 文档](https://antdv.com/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 文档](https://router.vuejs.org/)

## 其他上下文文件

本索引提供了工作区的总体概览。详细的技术文档请参阅以下文件：

- **standard-project-structure.md**: 标准项目结构详解
- **standard-coding-style.md**: 代码编写规范和最佳实践
- **data-models.md**: 数据模型和数据库设计
- **deployment.md**: 部署配置和流程
- **api.md**: API接口定义文档
- **architecture.md**: 系统架构和设计决策

---

**生成时间**: 2026-04-21  
**工具集**: Context Builder (ID: context-builder)  
**语言**: 简体中文 (zh-CN)
