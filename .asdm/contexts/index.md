# 工作空间上下文索引

## 概述
本文档作为 AI 模型理解和操作该工作空间的索引和指南，提供工作空间内容的结构化概览，并引导 AI 模型找到相关上下文。

## 工作空间信息

### 基本信息
- **工作空间名称**: QA Live Healthcare
- **描述**: 专业在线医疗问诊平台，连接患者与医生进行异步文字医疗问答
- **创建日期**: 2025 年
- **最后更新**: 2026-05-11

### 技术栈
- **主要语言**: TypeScript
- **前端框架**: Vue 3（Composition API + `<script setup>`）
- **UI 组件库**: Ant Design Vue 4.x
- **路由**: Vue Router 4.x（HTML5 History 模式）
- **构建工具**: Vite 5.x
- **类型检查**: vue-tsc
- **包管理器**: npm
- **状态管理**: Vue 3 reactive()（无 Vuex/Pinia）
- **数据持久化**: 无（纯前端内存态，静态 JSON 数据源）
- **测试框架**: 无

### 业务上下文
- **业务领域**: 在线医疗问诊
- **核心业务流程**:
  1. 患者通过姓名+生日验证身份（新用户自动创建）
  2. 患者向在线医生提交文字问诊问题
  3. 医生登录后查看待处理问题，文字回复或标记已解答
  4. 患者查看医生回复
- **业务规则**:
  - 患者认证为开放式（无密码，姓名+生日即可）
  - 医生认证使用用户名+明文密码
  - 只有 `isActive` 状态的医生可接受问诊
  - 问诊问题有 pending/answered 两种状态
  - 所有数据仅存于内存，刷新页面即丢失

## 工作空间结构

### 文件树与说明
```
qa-live-healthcare/
├── .asdm/                          # ASDM 配置和工具集
│   ├── contexts/                   # 上下文文件（本目录）
│   └── toolsets/                   # 已安装工具集
├── .codebuddy/                     # Codebuddy 配置
│   └── commands/                   # 自定义命令
├── public/                         # 静态资源
├── src/                            # 源代码目录
│   ├── assets/                     # 静态资源（SVG 等）
│   ├── components/                 # 公共组件
│   │   ├── AppHeader.vue           # 全局导航头部
│   │   ├── AppFooter.vue           # 全局页脚
│   │   └── HelloWorld.vue          # 示例组件（未使用）
│   ├── data/                       # 静态 JSON 数据源
│   │   ├── doctor-user-list.json   # 医生列表（5 条）
│   │   ├── patient-user.json       # 患者列表（5 条）
│   │   └── question-list.json      # 问诊问题列表（7 条）
│   ├── router/                     # 路由配置
│   │   └── index.ts                # Vue Router 路由定义
│   ├── store/                      # 状态管理
│   │   └── index.ts                # 响应式 Store（数据+方法）
│   ├── views/                      # 页面视图
│   │   ├── Home.vue                # 首页/仪表盘
│   │   ├── Consultation.vue        # 患者问诊页面
│   │   ├── DoctorLogin.vue         # 医生登录页
│   │   ├── DoctorRoom.vue          # 医生诊室页面
│   │   ├── Doctors.vue             # 医生目录页
│   │   └── About.vue               # 关于平台页
│   ├── App.vue                     # 根组件
│   ├── main.ts                     # 应用入口
│   ├── style.css                   # 全局样式
│   └── vite-env.d.ts               # Vite 类型声明
├── index.html                      # HTML 入口
├── package.json                    # 项目依赖和脚本
├── tsconfig.json                   # TypeScript 主配置
├── tsconfig.app.json               # 应用 TS 配置
├── tsconfig.node.json              # Node TS 配置
├── vite.config.ts                  # Vite 构建配置
└── .env                            # 环境变量（当前为空）
```

### 关键目录说明
- **`src/views/`**: 页面级组件，AI 应重点关注此处进行功能实现
- **`src/store/`**: 核心业务逻辑和数据模型，所有状态变更通过此模块
- **`src/data/`**: 模拟数据源，了解业务实体结构
- **`src/components/`**: 可复用的公共组件
- **`src/router/`**: 路由配置，定义了 7 条路由

## 路由结构

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | Home | Home.vue | 首页仪表盘 |
| `/consultation` | Consultation | Consultation.vue | 患者问诊入口 |
| `/consultation/:doctorUsername` | ConsultationRoom | Consultation.vue | 指定医生的问诊页 |
| `/doctors` | Doctors | Doctors.vue | 医生目录 |
| `/about` | About | About.vue | 关于平台 |
| `/doctor/login` | DoctorLogin | DoctorLogin.vue | 医生登录 |
| `/doctor/room/:username` | DoctorRoom | DoctorRoom.vue | 医生诊室 |

## 开发指南

### 构建与编译
```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 代码质量
- **类型检查**: `vue-tsc -b`（集成在 build 命令中）
- **无独立 lint/format 配置**: 项目未配置 ESLint 或 Prettier

### 关键代码模式
- **组件风格**: `<script setup lang="ts">` + Composition API
- **状态管理**: 直接使用 `reactive()` + 导出的对象方法，非 Vuex/Pinia
- **路由导航**: 使用 `useRouter()` 和 `useRoute()` 组合式 API
- **模拟延迟**: 关键操作使用 `setTimeout(500ms)` 模拟网络延迟
- **UI 一致性**: 紫色渐变（`#667eea` → `#764ba2`）贯穿全站头部和强调区域

## 上下文文件参考

本工作空间在 `.asdm/contexts/` 目录下提供以下上下文文件：

1. **[asdm.standard-project-structure.md](./asdm.standard-project-structure.md)** - 标准项目结构和组织方式
2. **[asdm.standard-coding-style.md](./asdm.standard-coding-style.md)** - 编码标准和风格指南
3. **[asdm.data-models.md](./asdm.data-models.md)** - 数据模型、关系和图表
4. **[asdm.deployment.md](./asdm.deployment.md)** - 部署配置和流程
5. **[asdm.api.md](./asdm.api.md)** - API 定义、端点和文档
6. **[asdm.architecture.md](./asdm.architecture.md)** - 系统架构和设计决策

## AI 模型指引

### 如何使用本上下文
1. **从本索引开始**，理解工作空间整体结构
2. **根据任务查阅对应上下文文件**
3. **遵循开发指南**进行构建、测试和部署
4. **保持与现有模式和约定的一致性**

### 常见任务
- **添加新功能**: 先查看架构和数据模型
- **修改页面**: 参考现有视图组件的模式
- **数据模型变更**: 更新 store 接口和 JSON 数据源
- **添加新路由**: 在 `src/router/index.ts` 中定义，在 `AppHeader.vue` 中添加导航项

### 注意事项
- 本项目为纯前端应用，**无后端 API**，所有数据操作在内存中完成
- 刷新页面所有状态会丢失
- 医生密码为明文存储（`123456`），仅用于演示
- 新建患者/问题的 ID 使用 `Date.now()` 生成，仅适用于演示

## 版本历史
| 版本 | 日期 | 变更 | 作者 |
|------|------|------|------|
| 1.0.0 | 2026-05-11 | 初始上下文创建 | Context Builder |

---

*本上下文文件由 Context Builder 工具集维护。当工作空间发生变更时，使用 `/asdm-context-update` 进行更新。*