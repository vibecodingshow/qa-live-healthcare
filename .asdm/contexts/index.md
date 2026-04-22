# Workspace Context Guide

## Overview
这是一个基于 **Vue 3 + TypeScript + Vite** 的在线医疗问诊平台（QA Live Healthcare）。项目为纯前端 SPA 应用，使用 Ant Design Vue 作为 UI 组件库，采用内存数据存储（JSON 静态文件 + reactive 状态管理），无后端服务和数据库。支持医生在线接诊和患者提问咨询两大核心功能。

## Technology Stack

### Core Framework
- **Vue 3** (^3.5.10) - Composition API + `<script setup>` 语法
- **TypeScript** (^5.5.3) - 严格模式，ES2020 目标
- **Vite** (^5.4.8) - 构建工具和开发服务器

### UI Components
- **Ant Design Vue** (^4.2.6) - 全量引入，含 reset.css
- **@ant-design/icons-vue** - 图标库（20+ 图标组件）
- **dayjs** (^1.11.19) - 日期格式化

### Routing
- **Vue Router** (^4.6.3) - HTML5 History 模式

### State Management
- **Vue 3 reactive()** - 自定义 Store，无 Pinia/Vuex

### Not Used
- 无后端 API 调用（无 axios/fetch 封装）
- 无 Pinia/Vuex
- 无 CSS 预处理器
- 无 i18n 国际化
- 无测试框架
- 无环境变量配置（.env 为空）

## Project Structure

```
qa-live-healthcare/
├── src/
│   ├── assets/           # 静态资源（vue.svg）
│   ├── components/       # 可复用组件
│   │   ├── AppHeader.vue       # 顶部导航栏（Logo + 菜单 + 登录按钮）
│   │   ├── AppFooter.vue       # 底部页脚（四栏布局）
│   │   └── HelloWorld.vue      # 脚手架示例（未使用）
│   ├── data/              # 静态 JSON 数据
│   │   ├── doctor-user-list.json  # 医生列表（5条）
│   │   ├── patient-user.json      # 患者列表（5条）
│   │   └── question-list.json     # 问题列表（7条）
│   ├── router/
│   │   └── index.ts       # 路由配置（7条路由）
│   ├── store/
│   │   └── index.ts       # 状态管理（Doctor/Patient/Question 接口 + Store 方法）
│   ├── views/             # 页面视图
│   │   ├── Home.vue             # 首页（Hero + 统计 + 在线诊室）
│   │   ├── Consultation.vue     # 患者问诊（验证 → 提交问题 → 查看回复）
│   │   ├── DoctorLogin.vue      # 医生登录
│   │   ├── DoctorRoom.vue       # 医生诊室（待响应 + 已解答）
│   │   ├── Doctors.vue          # 医生列表
│   │   └── About.vue            # 关于我们
│   ├── App.vue            # 根组件（Header + RouterView + Footer）
│   ├── main.ts            # 入口（注册 Antd + Router）
│   ├── style.css          # 全局样式
│   └── vite-env.d.ts      # Vite 类型声明
├── public/
│   └── vite.svg
├── .asdm/                 # ASDM 工具集配置
│   ├── contexts/          # 上下文文件
│   └── toolsets/          # 工具集
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── index.html
```

## Available Context Files

本工作区上下文包含以下文件：

1. **[index.md](index.md)** - 工作区总览和导航（本文件）
2. **[standard-project-structure.md](standard-project-structure.md)** - 项目结构规范
3. **[standard-coding-style.md](standard-coding-style.md)** - 编码标准和风格约定
4. **[data-models.md](data-models.md)** - 数据模型和实体关系
5. **[architecture.md](architecture.md)** - 系统架构和设计决策
6. **[api.md](api.md)** - Store API 定义和方法文档
7. **[deployment.md](deployment.md)** - 构建和部署配置

## Development Workflow

### Development Commands
```bash
# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建
npm run preview
```

### Key Features
- **Hot Module Replacement** - Vite 开发服务器即时更新
- **TypeScript Strict Mode** - 全量类型检查
- **Scoped CSS** - 所有组件使用 `<style scoped>`
- **响应式设计** - 多页面有 `@media (max-width: 768px)` 断点适配
- **医疗问诊** - 医生接诊 + 患者提问的完整流程

### Route Map
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/consultation` | Consultation | 通用问诊入口 |
| `/consultation/:doctorUsername` | Consultation | 指定医生问诊 |
| `/doctors` | Doctors | 医生列表 |
| `/about` | About | 关于我们 |
| `/doctor/login` | DoctorLogin | 医生登录 |
| `/doctor/room/:username` | DoctorRoom | 医生诊室 |

## Next Steps

要更新或重新生成上下文文件，使用以下命令：

- `/asdm-context-build` - 重新生成全部上下文
- `/asdm-context-update <file>` - 更新指定上下文文件

## Support

- Vue 3 文档: https://vuejs.org/
- Ant Design Vue: https://antdv.com/
- TypeScript: https://www.typescriptlang.org/
- Vite: https://vitejs.dev/

---

*此上下文文件由 ASDM Context Builder 工具集生成。最后更新: 2026-04-22*
