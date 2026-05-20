# 工作区上下文索引

## 概述

本文档作为 AI 模型理解和操作此工作区的索引和指南。它提供了工作区内容的结构化概览，并指导 AI 模型找到相关上下文。

## 工作区信息

### 基本信息
- **工作区名称**: qa-live-healthcare (在线医疗健康咨询平台)
- **描述**: 一个基于 Vue 3 + TypeScript 构建的在线医疗健康咨询平台
- **创建日期**: 2026-05-20
- **最后更新**: 2026-05-20

### 技术栈
- **主要语言**: TypeScript / JavaScript
- **前端框架**: Vue 3.5
- **组件库**: Ant Design Vue 4.2
- **路由**: Vue Router 4.6
- **构建工具**: Vite 5.4
- **日期处理**: Day.js 1.11
- **开发语言**: TypeScript 5.5
- **部署平台**: 待定

### 业务背景
- **业务领域**: 医疗健康 / 在线咨询
- **核心功能**: 在线医生咨询、预约、患者管理
- **主要用户角色**: 患者、医生

## 工作区结构

### 文件树结构
```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # 上下文文件（本目录）
│   └── toolsets/                       # 已安装的工具集
├── public/                             # 静态资源
│   └── *.svg                           # SVG 图标
├── src/                                # 源代码目录
│   ├── assets/                         # 资源文件
│   ├── components/                     # 公共组件
│   │   ├── AppFooter.vue               # 页脚组件
│   │   ├── AppHeader.vue               # 页头组件
│   │   └── HelloWorld.vue              # 示例组件
│   ├── data/                           # 数据文件
│   ├── router/                         # 路由配置
│   ├── store/                          # 状态管理（待定）
│   ├── views/                          # 页面视图
│   │   ├── About.vue                   # 关于页面
│   │   ├── Consultation.vue            # 咨询页面
│   │   ├── DoctorLogin.vue             # 医生登录页面
│   │   ├── DoctorRoom.vue              # 医生诊室页面
│   │   ├── Doctors.vue                 # 医生列表页面
│   │   └── Home.vue                    # 首页
│   ├── App.vue                         # 根组件
│   ├── main.ts                         # 入口文件
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 类型声明
├── index.html                          # HTML 入口
├── package.json                        # 项目依赖配置
├── tsconfig.json                       # TypeScript 配置
├── vite.config.ts                      # Vite 构建配置
└── README.md                           # 项目说明
```

### 关键目录说明
- **`.asdm/contexts/`**: 包含 AI 模型参考的所有上下文文件
- **`src/views/`**: 页面视图 - AI 应关注此处进行页面开发
- **`src/components/`**: 公共组件 - AI 应维护组件一致性
- **`src/router/`**: 路由配置 - AI 应理解页面导航结构
- **`public/`**: 静态资源 - 直接服务给客户端

## 开发指南

### 构建和编译
```bash
# 开发服务器
npm run dev

# 类型检查并构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 测试
当前项目未配置测试框架，可按需添加 Jest/Vitest。

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 风格
- 组件文件使用 PascalCase 命名
- 样式文件使用 kebab-case 命名

## 上下文文件参考

本工作区在 `.asdm/contexts/` 目录下提供以下上下文文件：

1. **[standard-project-structure.md](./standard-project-structure.md)** - 标准项目结构和组织规范
2. **[standard-coding-style.md](./standard-coding-style.md)** - 编码规范和样式指南
3. **[data-models.md](./data-models.md)** - 数据模型、关系和图表
4. **[deployment.md](./deployment.md)** - 部署配置和流程
5. **[api.md](./api.md)** - API 定义、端点和文档
6. **[architecture.md](./architecture.md)** - 系统架构和设计决策

## AI 模型指导

### 如何使用本上下文
1. **从索引开始** - 了解工作区结构
2. **参考特定上下文文件** - 根据任务需求查阅相关文件
3. **遵循开发指南** - 了解构建、测试和部署流程
4. **保持一致性** - 与现有模式和约定保持一致

### 常见任务
- **添加新功能**: 先查看架构和数据模型
- **修改页面**: 参考 views 目录下的页面组件
- **添加组件**: 参考 components 目录下的组件结构
- **路由变更**: 更新 router 目录下的路由配置

### 故障排除
- 如果遇到问题，检查相关上下文文件
- 构建问题：验证依赖和配置
- 运行问题：检查部署和环境配置

## 版本历史

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| 1.0.0 | 2026-05-20 | 初始上下文创建 | ASDM Context Builder |

---

*本上下文文件由 Context Builder 工具集维护。工作区发生变更时使用 `/asdm-context-update` 更新。*
