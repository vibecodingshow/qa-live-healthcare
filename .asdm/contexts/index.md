# qa-live-healthcare 工作空间索引

## 项目概述

**qa-live-healthcare** 是一个基于 Vue 3 + TypeScript + Vite 的在线医疗预约系统，专注于提供高质量的医疗健康服务。

### 项目名称
- **英文**: qa-live-healthcare
- **中文**: 在线医疗预约系统

## 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### UI 组件库
- **Ant Design Vue** (v4.2.6) - 企业级 UI 设计语言

### 状态管理
- **Pinia** - Vue 官方推荐的状态管理库

### 路由管理
- **Vue Router** (v4.6.3) - 官方路由管理器

### 工具库
- **Day.js** (v1.11.19) - 轻量级的日期处理库

## 项目结构

```
qa-live-healthcare/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   ├── components/        # 可复用组件
│   ├── data/              # 数据模型和模拟数据
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── style.css          # 全局样式
├── public/                # 公共资源
├── .asdm/                 # ASDM 工具集配置
│   └── contexts/          # 上下文文件（本目录）
└── 配置文件
    ├── package.json       # 项目依赖配置
    ├── tsconfig.json      # TypeScript 配置
    └── vite.config.ts     # Vite 构建配置
```

## 核心功能模块

### 1. 预约挂号系统
- 患者在线预约医生门诊
- 医生排班管理
- 预约时间管理

### 2. 用户界面
- 响应式布局设计
- 基于 Ant Design Vue 的现代化 UI
- 多语言支持（中英文）

### 3. 数据管理
- 患者信息管理
- 医生信息管理
- 预约记录管理

## 开发环境配置

### 运行项目
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 开发工具要求
- **Node.js**: v24.15.0+
- **npm**: 11.12.1+
- **TypeScript**: 5.5.3+

## 上下文文件索引

以下文件提供了工作空间的详细上下文信息：

1. **[standard-project-structure.md](./standard-project-structure.md)** - 标准项目结构指南
2. **[standard-coding-style.md](./standard-coding-style.md)** - 编码规范和风格指南
3. **[data-models.md](./data-models.md)** - 数据模型和实体关系
4. **[deployment.md](./deployment.md)** - 部署配置和流程
5. **[api.md](./api.md)** - API 接口定义和文档
6. **[architecture.md](./architecture.md)** - 系统架构设计

## 开发规范

### 代码组织
- 使用 TypeScript 进行类型安全开发
- 组件化开发，遵循单一职责原则
- 模块化组织代码结构

### 命名约定
- 文件命名：kebab-case（短横线分隔）
- 组件命名：PascalCase（大驼峰）
- 变量命名：camelCase（小驼峰）

### 代码质量
- 严格的 TypeScript 类型检查
- ESLint 代码规范检查
- 组件单元测试覆盖

## 项目状态

- **开发阶段**: 功能开发中
- **当前分支**: feature_step_1
- **技术栈**: 现代化前端技术栈
- **目标**: 构建高质量的在线医疗预约平台

## 相关链接

- [项目源码](https://github.com/wangjtp/qa-live-healthcare)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Ant Design Vue 文档](https://www.antdv.com/)

---

*本文件由 Context Builder 工具集自动生成，最后更新于 2026-04-21*