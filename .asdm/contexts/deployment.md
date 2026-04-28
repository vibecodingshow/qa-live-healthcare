# 部署配置与流程

> 本文档描述 **QA Live Healthcare** 项目的构建与部署流程，供 AI 模型理解项目的运行环境和部署方式。

---

## 项目类型

**纯前端单页应用（SPA）**，无后端服务。构建产物为静态 HTML/CSS/JS 文件，可部署至任何静态文件托管服务。

---

## 构建工具与运行环境

| 工具 | 版本 | 用途 |
|------|------|------|
| **Vite** | ^5.4.8 | 开发服务器 & 生产构建 |
| **vue-tsc** | ^2.1.6 | TypeScript 类型检查 |
| **Node.js** | ≥ 18（推荐 LTS） | 开发环境运行时 |
| **npm** | ≥ 9 | 包管理 |

---

## NPM Scripts

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vue-tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### 命令说明

| 命令 | 说明 | 输出 |
|------|------|------|
| `npm run dev` | 启动开发服务器（热更新 HMR） | `http://localhost:5173` |
| `npm run build` | 类型检查 + 生产构建 | `dist/` 目录 |
| `npm run preview` | 预览生产构建（本地静态服务） | `http://localhost:4173` |

---

## 本地开发启动流程

```bash
# 1. 克隆项目
git clone <repo-url>
cd qa-live-healthcare

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

---

## 生产构建流程

```bash
# 构建生产包（含 TS 类型检查）
npm run build

# 构建产物位于 dist/ 目录
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js   # JS bundle
# │   └── index-[hash].css  # CSS bundle
# └── vite.svg
```

---

## 部署方式

由于本项目是纯静态 SPA，构建产物（`dist/`）可部署至：

### 方案一：Nginx 静态服务（推荐生产）

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/qa-live-healthcare/dist;
    index index.html;

    # SPA History 模式：所有路由回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> **重要**：必须配置 `try_files` 回退，否则刷新非根路由（如 `/doctors`）会返回 404。

### 方案二：静态托管平台

| 平台 | 命令/步骤 | 备注 |
|------|----------|------|
| **Vercel** | `vercel --prod` 或 GitHub 集成 | 自动检测 Vite 项目 |
| **Netlify** | 拖放 `dist/` 或 GitHub 集成 | 需配置 `_redirects`: `/* /index.html 200` |
| **GitHub Pages** | `gh-pages -d dist` | 需配置 `base` 路径 |
| **腾讯云 COS + CDN** | 上传 `dist/` 至 COS，开启静态网站托管 | 配置自定义域名和错误文档 |

### 方案三：Docker 容器

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建并运行
docker build -t qa-live-healthcare .
docker run -p 80:80 qa-live-healthcare
```

---

## Vite 配置说明

当前 `vite.config.ts`（极简配置）：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### 常用扩展配置参考

```typescript
// vite.config.ts 扩展示例（如有需要）
export default defineConfig({
  plugins: [vue()],
  
  // 部署到子路径时配置（如 GitHub Pages）
  base: '/qa-live-healthcare/',
  
  // 构建优化
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,   // 生产环境关闭 sourcemap
    minify: 'esbuild',
  },
  
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

---

## TypeScript 配置

```
tsconfig.json              ← 根配置（引用以下两个）
├── tsconfig.app.json      ← 应用代码（src/）的 TS 配置
└── tsconfig.node.json     ← Node 工具（vite.config.ts）的 TS 配置
```

关键配置（`tsconfig.app.json`）：
- `target`: ES2020
- `module`: ESNext
- `moduleResolution`: bundler
- `strict`: true（严格模式）
- `jsx`: vue-jsx（支持 JSX）

---

## 依赖清单

### 生产依赖

| 包 | 版本 | 用途 |
|----|------|------|
| `vue` | ^3.5.10 | 前端框架 |
| `vue-router` | ^4.6.3 | 客户端路由 |
| `ant-design-vue` | ^4.2.6 | UI 组件库 |
| `dayjs` | ^1.11.19 | 日期处理工具 |

### 开发依赖

| 包 | 版本 | 用途 |
|----|------|------|
| `vite` | ^5.4.8 | 构建工具 |
| `@vitejs/plugin-vue` | ^5.1.4 | Vite Vue 插件 |
| `typescript` | ^5.5.3 | TypeScript 编译器 |
| `vue-tsc` | ^2.1.6 | Vue TS 类型检查 |

---

## 环境限制与注意事项

1. **无后端 API**：所有数据为内存 Mock，刷新页面后数据重置
2. **无持久化**：无 localStorage/sessionStorage，无数据库
3. **无认证 Token**：医生登录仅通过 `store.state.currentDoctor` 维持会话状态
4. **无环境变量配置**：无 `.env` 文件需求（无 API Base URL 等）
5. **路由模式**：使用 HTML5 History 模式，**生产部署必须配置服务端 URL 回退**

---

## 构建产物大小估算

| 资源 | 估算大小 |
|------|----------|
| JS Bundle（含 Vue + ANTDV） | ~500KB（gzip ~150KB） |
| CSS Bundle | ~100KB（gzip ~30KB） |
| 总计 | ~600KB（gzip ~180KB） |

---

*本文档随部署配置变化而更新，使用 `/asdm-context-update` 命令保持同步。*
