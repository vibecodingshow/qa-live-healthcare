# 工作空间上下文索引

## 概述
这是一个基于 Vue.js 和 TypeScript 的医疗健康相关前端项目。项目使用现代前端技术栈构建，专注于提供高质量的医疗健康服务界面。

## 项目结构

### 主要目录结构
```
qa-live-healthcare-main/
├── src/                    # 源代码目录
│   ├── components/          # Vue 组件
│   ├── views/               # 页面视图
│   ├── router/              # 路由配置
│   ├── store/               # 状态管理
│   ├── utils/               # 工具函数
│   └── assets/              # 静态资源
├── public/                  # 公共静态资源
├── .asdm/                   # ASDM 配置
│   └── contexts/            # 上下文文件
└── .codebuddy/              # CodeBuddy 配置
```

### 技术栈
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **语言**: TypeScript + JavaScript
- **样式**: CSS（可能包含预处理器）
- **包管理**: npm

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
- 用户界面组件
- 路由导航系统
- 状态管理
- 工具函数库
- 资源管理

### 开发环境
- 开发服务器：Vite Dev Server
- 构建工具：Vite
- 包管理器：npm

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

---
*此文件由 Context Builder 工具集生成，最后更新于 2026-04-21*