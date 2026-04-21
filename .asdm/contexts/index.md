# 工作区上下文索引

## 概述

本文档作为 AI 模型理解和处理此工作区的索引和指南。它提供了工作区内容的结构化概述，并引导 AI 模型找到相关上下文。

## 工作区信息

### 基本信息

- **工作区名称**: QA Live Healthcare
- **描述**: 专业在线医疗问诊平台，连接专业医生与患者，提供便捷、高效的医疗咨询服务
- **创建日期**: 2026-04-21
- **最后更新**: 2026-04-21

### 技术栈

- **主要语言**: TypeScript + JavaScript
- **前端框架**: Vue 3 (Composition API + `<script setup>`)
- **UI 组件库**: Ant Design Vue 4.2.6
- **路由**: Vue Router 4
- **日期处理**: Day.js
- **构建工具**: Vite 5
- **开发语言**: TypeScript 5
- **部署平台**: Web (SPA 单页应用)

### 业务上下文

- **业务领域**: 医疗健康 - 在线问诊
- **主要业务流程**:
  - 患者浏览医生列表
  - 患者发起问诊咨询
  - 医生登录诊室
  - 医患在线沟通
- **业务规则**:
  - 医生需要登录才能进入诊室
  - 患者可选择在线医生进行问诊
  - 支持多个科室和专长分类

## 工作区结构

### 文件树结构

```
qa-live-healthcare/
├── .asdm/                              # ASDM 配置和工具集
│   ├── contexts/                       # 上下文文件目录（本目录）
│   └── toolsets/                       # 已安装的工具集
├── public/                              # 静态公共资源
│   └── *.svg                            # SVG 图标文件
├── src/                                 # 源代码目录
│   ├── assets/                         # 静态资源
│   ├── components/                     # 公共组件
│   │   ├── AppHeader.vue               # 应用头部导航
│   │   ├── AppFooter.vue               # 应用底部
│   │   └── HelloWorld.vue              # 示例组件
│   ├── data/                           # 模拟数据文件
│   │   ├── doctor-user-list.json       # 医生用户列表
│   │   ├── patient-user.json           # 患者用户数据
│   │   └── question-list.json          # 问题列表
│   ├── router/                         # 路由配置
│   │   └── index.ts                    # 路由定义
│   ├── store/                          # 状态管理
│   │   └── index.ts                    # Pinia 状态存储
│   ├── views/                          # 页面视图
│   │   ├── Home.vue                    # 首页
│   │   ├── Consultation.vue            # 问诊页面
│   │   ├── DoctorLogin.vue             # 医生登录页
│   │   ├── DoctorRoom.vue              # 医生诊室
│   │   ├── Doctors.vue                 # 医生列表页
│   │   └── About.vue                   # 关于页面
│   ├── App.vue                         # 根组件
│   ├── main.ts                         # 应用入口
│   ├── style.css                       # 全局样式
│   └── vite-env.d.ts                   # Vite 类型声明
├── index.html                          # HTML 入口文件
├── package.json                        # 项目依赖配置
├── vite.config.ts                      # Vite 构建配置
├── tsconfig.json                       # TypeScript 配置
└── README.md                           # 项目说明文档
```

### 关键目录说明

- **`.asdm/contexts/`**: 包含 AI 模型参考的所有上下文文件
- **`src/views/`**: 页面视图组件 - AI 实现功能时应关注此处
- **`src/components/`**: 公共可复用组件
- **`src/router/`**: 路由配置 - 定义页面导航结构
- **`src/store/`**: 状态管理 - 应用全局状态
- **`src/data/`**: 模拟数据 - 用于开发和测试

## 路由结构

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | Home | Home.vue | 首页 |
| `/consultation` | Consultation | Consultation.vue | 问诊列表 |
| `/consultation/:doctorUsername` | ConsultationRoom | Consultation.vue | 指定医生问诊 |
| `/doctors` | Doctors | Doctors.vue | 医生列表 |
| `/about` | About | About.vue | 关于我们 |
| `/doctor/login` | DoctorLogin | DoctorLogin.vue | 医生登录 |
| `/doctor/room/:username` | DoctorRoom | DoctorRoom.vue | 医生诊室 |

## 开发指南

### 构建和编译

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```

### 测试

```bash
# 暂无测试配置
```

### 代码质量

- **类型检查**: vue-tsc (已集成到 build 命令)
- **代码格式化**: 使用 IDE 默认格式化

## 上下文文件参考

本工作区有以下上下文文件，位于 `.asdm/contexts/`:

1. **[standard-project-structure.md](./standard-project-structure.md)** - 标准项目结构
2. **[standard-coding-style.md](./standard-coding-style.md)** - 编码规范和样式指南
3. **[data-models.md](./data-models.md)** - 数据模型和关系图
4. **[deployment.md](./deployment.md)** - 部署配置和流程
5. **[api.md](./api.md)** - API 定义和文档
6. **[architecture.md](./architecture.md)** - 系统架构和设计决策

## AI 模型指导

### 如何使用本上下文

1. **从本索引开始** 了解工作区结构
2. **根据任务需要** 参考特定上下文文件
3. **遵循开发指南** 进行构建、测试和部署
4. **保持一致性** 与现有模式和约定

### 常见任务

- **添加新功能**: 先检查架构和数据模型
- **修改页面**: 在 `src/views/` 目录下对应组件
- **添加新页面**: 在 `src/router/index.ts` 添加路由配置
- **添加组件**: 在 `src/components/` 目录创建组件

### 组件使用规范

```vue
<script setup lang="ts">
// 使用 TypeScript 定义 props 和 emits
import { ref, computed } from 'vue'

// Ant Design Vue 组件导入
import { Button, Card } from 'ant-design-vue'
</script>

<template>
  <!-- 使用 Ant Design 组件 -->
  <a-button type="primary">按钮</a-button>
</template>

<style scoped>
/* 使用 scoped 样式 */
</style>
```

### 故障排除

- 如果遇到问题，检查相关上下文文件
- 构建问题：验证依赖和配置
- 运行问题：检查路由和环境配置

## 版本历史

| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| 1.0.0 | 2026-04-21 | 初始上下文创建 | ASDM Context Builder |

---

*本上下文文件由 Context Builder 工具集维护。工作区变更时请使用 `/asdm-context-update` 更新。*
