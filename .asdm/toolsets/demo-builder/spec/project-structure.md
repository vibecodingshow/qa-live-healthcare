# 项目结构模板

## 概述

本文档定义了演示站点项目的标准目录结构和文件组织规范，确保项目的一致性和可维护性。

## 完整项目结构

```
demo-site/                             # 项目根目录
├── .github/                          # GitHub工作流配置
│   ├── workflows/
│   │   ├── deploy.yml               # 自动部署配置
│   │   └── tests.yml                # 自动化测试配置
│   └── dependabot.yml               # 依赖更新配置
├── .vscode/                         # VS Code配置
│   ├── extensions.json              # 推荐扩展
│   ├── settings.json                # 工作区设置
│   └── tasks.json                   # 任务配置
├── public/                          # 静态资源目录
│   ├── favicon.ico                  # 网站图标
│   ├── apple-touch-icon.png         # iOS图标
│   ├── manifest.json                # PWA清单文件
│   ├── robots.txt                   # 搜索引擎爬虫配置
│   └── images/                      # 公共图片资源
│       ├── logo.svg
│       └── background.jpg
├── src/                             # 源代码目录
│   ├── assets/                      # 静态资源
│   │   ├── images/                  # 图片资源
│   │   │   ├── icons/               # 图标文件
│   │   │   └── illustrations/       # 插画文件
│   │   ├── styles/                  # 样式文件
│   │   │   ├── base.css             # 基础样式
│   │   │   ├── components.css       # 组件样式
│   │   │   └── utilities.css        # 工具类样式
│   │   └── fonts/                   # 字体文件
│   ├── components/                  # 可复用组件
│   │   ├── common/                  # 通用组件
│   │   │   ├── Button/
│   │   │   │   ├── Button.vue
│   │   │   │   └── Button.stories.ts
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.vue
│   │   │   │   └── index.ts
│   │   │   └── Loader/
│   │   │       ├── Loader.vue
│   │   │       └── index.ts
│   │   ├── layout/                  # 布局组件
│   │   │   ├── Header/
│   │   │   │   ├── Header.vue
│   │   │   │   └── Navigation.vue
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.vue
│   │   │   │   └── Menu.vue
│   │   │   └── Footer/
│   │   │       ├── Footer.vue
│   │   │       └── index.ts
│   │   └── demo/                    # 演示专用组件
│   │       ├── DemoPlayer/
│   │       │   ├── DemoPlayer.vue
│   │       │   ├── Controls.vue
│   │       │   └── ProgressBar.vue
│   │       ├── PageViewer/
│   │       │   ├── PageViewer.vue
│   │       │   ├── ContentRenderer.vue
│   │       │   └── CodeBlock.vue
│   │       └── Navigation/
│   │           ├── Pagination.vue
│   │           ├── TOC.vue
│   │           └── KeyboardShortcuts.vue
│   ├── composables/                 # 组合式函数
│   │   ├── useMarkdownParser.ts     # Markdown解析
│   │   ├── useFullscreen.ts         # 全屏控制
│   │   ├── useKeyboardNavigation.ts # 键盘导航
│   │   ├── useTheme.ts              # 主题管理
│   │   └── index.ts                 # 统一导出
│   ├── router/                      # 路由配置
│   │   ├── index.ts                 # 路由主文件
│   │   ├── routes/                  # 路由定义
│   │   │   ├── demo.ts              # 演示路由
│   │   │   └── index.ts             # 路由聚合
│   │   └── guards/                  # 路由守卫
│   │       ├── auth.ts              # 认证守卫
│   │       └── demo.ts              # 演示守卫
│   ├── stores/                      # 状态管理
│   │   ├── demo.store.ts            # 演示状态
│   │   ├── theme.store.ts           # 主题状态
│   │   ├── user.store.ts            # 用户状态
│   │   └── index.ts                 # 统一导出
│   ├── types/                       # TypeScript类型定义
│   │   ├── demo.ts                  # 演示相关类型
│   │   ├── markdown.ts              # Markdown解析类型
│   │   ├── api.ts                   # API接口类型
│   │   └── index.ts                 # 类型聚合
│   ├── utils/                       # 工具函数
│   │   ├── markdownParser.ts        # Markdown解析器
│   │   ├── domUtils.ts              # DOM操作工具
│   │   ├── stringUtils.ts           # 字符串工具
│   │   ├── dateUtils.ts             # 日期工具
│   │   ├── validation.ts            # 验证工具
│   │   └── index.ts                 # 统一导出
│   ├── views/                       # 页面组件
│   │   ├── Home.vue                 # 首页
│   │   ├── DemoPage.vue             # 演示页面
│   │   ├── About.vue                # 关于页面
│   │   ├── NotFound.vue             # 404页面
│   │   └── Layout.vue               # 布局组件
│   ├── App.vue                      # 根组件
│   ├── main.ts                      # 应用入口
│   └── env.d.ts                     # 环境变量类型定义
├── tests/                           # 测试文件
│   ├── unit/                        # 单元测试
│   │   ├── components/              # 组件测试
│   │   ├── composables/             # 组合式函数测试
│   │   ├── utils/                   # 工具函数测试
│   │   └── __mocks__/               # 测试mock
│   ├── e2e/                         # 端到端测试
│   │   ├── specs/                   # 测试用例
│   │   └── support/                 # 测试支持文件
│   └── fixtures/                    # 测试数据
├── docs/                            # 项目文档
│   ├── api/                         # API文档
│   ├── guide/                       # 使用指南
│   ├── development/                 # 开发文档
│   └── deployment/                  # 部署文档
├── scripts/                         # 构建脚本
│   ├── build.js                     # 构建脚本
│   ├── deploy.js                    # 部署脚本
│   ├── analyze.js                   # 分析脚本
│   └── generate.js                  # 生成脚本
├── dist/                            # 构建输出目录（自动生成）
├── node_modules/                    # 依赖包目录（自动生成）
├── .env.example                     # 环境变量示例
├── .env.local                       # 本地环境变量
├── .env.production                  # 生产环境变量
├── .gitignore                       # Git忽略文件
├── .eslintrc.js                     # ESLint配置
├── .prettierrc                      # Prettier配置
├── .stylelintrc.js                  # Stylelint配置
├── .browserslistrc                  # 浏览器兼容配置
├── .npmrc                           # npm配置
├── package.json                     # 项目配置
├── package-lock.json                # 依赖锁文件
├── tsconfig.json                    # TypeScript配置
├── tsconfig.node.json               # Node.js TypeScript配置
├── vite.config.ts                   # Vite配置
├── tailwind.config.js               # Tailwind CSS配置
├── postcss.config.js                # PostCSS配置
├── CHANGELOG.md                     # 变更日志
└── README.md                        # 项目说明
```

## 核心文件说明

### 配置文件

#### package.json

```json
{
  "name": "demo-site",
  "version": "1.0.0",
  "description": "基于Markdown的交互式演示站点",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "cypress run",
    "lint": "eslint . --ext .vue,.js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .vue,.js,.jsx,.ts,.tsx --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "marked": "^9.0.0",
    "highlight.js": "^11.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "@vue/tsconfig": "^0.4.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "vitest": "^0.34.0",
    "@vue/test-utils": "^2.4.0",
    "@types/marked": "^4.0.0",
    "eslint": "^8.45.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-plugin-vue": "^9.15.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=7.0.0"
  }
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          markdown: ['marked', 'highlight.js']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

#### tsconfig.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue", "tests/**/*"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 核心组件结构

#### App.vue

```vue
<template>
  <div id="app" :class="themeClass">
    <RouterView />
    <GlobalLoader v-if="isLoading" />
    <ErrorBoundary>
      <NotificationContainer />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'
import { useAppStore } from '@/stores/app.store'

const themeStore = useThemeStore()
const appStore = useAppStore()

const themeClass = computed(() => ({
  'theme-light': themeStore.isLight,
  'theme-dark': themeStore.isDark
}))

const isLoading = computed(() => appStore.isLoading)
</script>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

.theme-dark {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
</style>
```

#### 主入口文件 main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
```

## 开发规范

### 命名规范

#### 文件命名

- **Vue组件**: `PascalCase`，如 `DemoPlayer.vue`
- **TypeScript文件**: `camelCase`，如 `markdownParser.ts`
- **样式文件**: `kebab-case`，如 `base.css`
- **测试文件**: 与源文件同名，加 `.spec` 后缀，如 `DemoPlayer.spec.ts`

#### 变量命名

- **组件属性**: `camelCase`，如 `currentPage`
- **常量**: `UPPER_SNAKE_CASE`，如 `MAX_PAGE_COUNT`
- **枚举**: `PascalCase`，如 `PageStatus`
- **类型定义**: `PascalCase`，如 `PageConfig`

### 导入导出规范

#### 模块导入顺序

```typescript
// 1. 第三方库
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 2. 项目工具
import { parseMarkdown } from '@/utils/markdownParser'
import type { Page } from '@/types/demo'

// 3. 本地组件
import DemoPlayer from '@/components/demo/DemoPlayer.vue'
```

#### 统一导出

每个目录应包含 `index.ts` 文件进行统一导出：

```typescript
// src/components/demo/index.ts
export { default as DemoPlayer } from './DemoPlayer/DemoPlayer.vue'
export { default as PageViewer } from './PageViewer/PageViewer.vue'
export { default as Navigation } from './Navigation/Navigation.vue'
```

### 代码组织原则

#### 单一职责

每个文件/组件应只负责一个明确的功能：

```
❌ 不好的做法：一个组件处理所有演示功能
✅ 好的做法：
- DemoPlayer: 控制播放状态
- PageViewer: 渲染页面内容
- Navigation: 处理页面导航
```

#### 依赖注入

使用组合式函数实现依赖注入：

```typescript
// 使用组合式函数
const { currentPage, nextPage, prevPage } = usePageNavigation()

// 而不是直接操作store
const store = useDemoStore()
store.currentPage++ // 不推荐
```

## 构建和部署

### 环境配置

#### 开发环境 (.env.development)

```env
VITE_APP_TITLE=演示站点 - 开发版
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DEBUG=true
```

#### 生产环境 (.env.production)

```env
VITE_APP_TITLE=演示站点
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXXXXXX-X
```

### 构建优化

#### 代码分割策略

```javascript
// 按路由分割
const DemoPage = () => import('@/views/DemoPage.vue')

// 按功能分割
const HeavyComponent = () => import('@/components/HeavyComponent.vue')
```

#### 资源优化

- 图片使用WebP格式
- 字体文件子集化
- CSS/JS压缩和Tree Shaking
- 使用CDN加速静态资源

## 测试策略

### 测试金字塔

```
        /\\\
       /___\\\
      /_____\\\
     /_______\\\
    /_________\\\
   /___________\\\
  /单元测试/集成测试/端到端测试/
```

### 测试文件组织

```
tests/
├── unit/                    # 单元测试 (70%)
│   ├── components/         # 组件测试
│   ├── composables/        # 组合式函数测试
│   └── utils/              # 工具函数测试
├── integration/            # 集成测试 (20%)
│   ├── store-integration/  # 状态管理集成
│   └── api-integration/    # API集成测试
└── e2e/                    # 端到端测试 (10%)
    ├── demo-flow/          # 演示流程测试
    └── navigation-flow/    # 导航流程测试
```

## 文档要求

### 组件文档

每个组件应包含：

```markdown
# DemoPlayer

演示播放器组件，支持全屏播放和键盘导航。

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| pages | Page[] | [] | 页面数据 |
| autoPlay | boolean | false | 自动播放 |

## 事件

- `page-change`: 页面切换时触发
- `play-start`: 开始播放时触发
- `play-end`: 播放结束时触发

## 使用示例

```vue
<DemoPlayer :pages="pages" @page-change="handlePageChange" />
```
```

### API文档

使用TypeDoc生成API文档：

```typescript
/**
 * 解析Markdown文件
 * @param content - Markdown内容
 * @param options - 解析选项
 * @returns 解析后的页面结构
 */
function parseMarkdown(content: string, options?: ParseOptions): ParseResult {
  // 实现...
}
```

## 版本控制

### Git工作流

使用Git Flow工作流：

```
main        - 主分支，稳定版本
develop     - 开发分支，集成特性
feature/*   - 特性分支
release/*   - 发布分支
hotfix/*    - 热修复分支
```

### 提交信息规范

使用Conventional Commits规范：

```
feat: 添加全屏播放功能
fix: 修复页面切换动画问题
docs: 更新使用文档
style: 调整组件样式
refactor: 重构Markdown解析器
test: 添加键盘导航测试
chore: 更新依赖版本
```

---

*本文档最后更新: 2025-04-22*  
*版本: 1.0.0*