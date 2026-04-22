# 构建和部署配置

## Overview
QA Live Healthcare 是一个纯前端 SPA 项目，使用 Vite 构建。当前仅配置了开发环境和基础生产构建，无 CI/CD 流水线、无容器化、无云部署配置。

## Build Configuration

### Vite Config

**Source**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

**当前配置特点**:
- 极简配置，仅注册 Vue 插件
- 无路径别名（如 `@/`）
- 无开发服务器代理
- 无环境变量注入
- 无构建优化配置（chunk 分割、gzip 等）

### NPM Scripts

**Source**: `package.json`

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | 启动开发服务器（默认 `http://localhost:5173`） |
| `build` | `vue-tsc -b && vite build` | 先 TypeScript 类型检查，再构建生产包 |
| `preview` | `vite preview` | 预览生产构建（默认 `http://localhost:4173`） |

## TypeScript Configuration

### tsconfig.json（根配置）
使用项目引用模式（Project References）：
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json（应用代码）
**Source**: `tsconfig.app.json`

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `target` | ES2020 | 编译目标 |
| `module` | ESNext | 模块系统 |
| `moduleResolution` | bundler | 模块解析策略 |
| `strict` | true | 严格模式 |
| `noUnusedLocals` | true | 禁止未使用的局部变量 |
| `noUnusedParameters` | true | 禁止未使用的参数 |
| `jsx` | preserve | JSX 保留 |
| `include` | `src/**/*.ts, src/**/*.tsx, src/**/*.vue` | 包含范围 |

### tsconfig.node.json（Node 端）
仅包含 `vite.config.ts`，target 为 ES2022。

## Environment Configuration

### .env File
**Source**: `.env`（当前为空文件）

当前未配置任何环境变量。如需使用，Vite 支持以下模式：
- `.env` - 所有模式
- `.env.development` - `npm run dev`
- `.env.production` - `npm run build`

### 推荐的环境变量（未配置）
```env
# .env.development
VITE_APP_TITLE=QA Live Healthcare (Dev)
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_APP_TITLE=QA Live Healthcare
VITE_API_BASE_URL=https://api.qalive.com
```

## Build Output

### Production Build
运行 `npm run build` 后输出到 `dist/` 目录：

```
dist/
├── assets/
│   ├── index-[hash].js       # 主 JS bundle（含 Vue + Ant Design Vue）
│   ├── index-[hash].css      # 主 CSS（Ant Design reset + 组件样式 + 全局样式）
│   └── vendor-[hash].js      # 第三方依赖 chunk（如有配置）
└── index.html                # 入口 HTML
```

### Build Process
```
npm run build
    │
    ├── Step 1: vue-tsc -b
    │   └── TypeScript 类型检查（所有 .ts/.vue 文件）
    │       └── 失败则中止构建
    │
    └── Step 2: vite build
        ├── 处理 .vue SFC → JS + CSS
        ├── Tree-shaking 未使用代码
        ├── 打包 JS/CSS
        └── 输出到 dist/
```

## Development Setup

### Prerequisites
- **Node.js**: >= 18.x（推荐 LTS）
- **Package Manager**: npm

### Installation
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### Development Server
```bash
npm run dev
# → Local: http://localhost:5173/
# → Network: http://192.168.x.x:5173/
```

## Static Assets

### Public Assets
- `public/vite.svg` - Vite 默认图标
- `src/assets/vue.svg` - Vue 默认图标

### External CDN Images
项目使用 Pexels CDN 图片，不存储在本地：

| 用途 | URL Pattern |
|------|-------------|
| 医生头像 | `https://images.pexels.com/photos/{id}/...` |
| Hero 背景图 | `https://images.pexels.com/photos/4386467/...` |
| Logo 图片 | `https://images.pexels.com/photos/40568/...` |

## Performance Considerations

### Current Issues
1. **Ant Design Vue 全量引入**: 未配置按需加载，打包体积较大
2. **无代码分割**: 所有代码打包到单个 JS 文件
3. **无资源压缩**: 未配置 gzip/brotli 压缩
4. **CDN 图片无优化**: 未使用图片懒加载或 WebP 格式

### Recommended Optimizations
```typescript
// vite.config.ts - 推荐的优化配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()], // 按需加载 Ant Design
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // 路径别名
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ant-design-vue': ['ant-design-vue'],
          'vue-vendor': ['vue', 'vue-router'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

## Deployment Options

### Static Hosting
由于是纯 SPA，可将 `dist/` 部署到任何静态托管服务：

| 服务 | 部署方式 | 说明 |
|------|----------|------|
| **Nginx** | 复制 `dist/` 到 webroot | 需要 SPA fallback 配置 |
| **Vercel** | `vercel` CLI 或 Git 集成 | 自动检测 Vite 项目 |
| **Netlify** | Git 集成 + `_redirects` | 需配置 SPA 重定向 |
| **GitHub Pages** | GitHub Actions | 需要 base URL 配置 |
| **EdgeOne Pages** | CodeBuddy 集成 | 一键部署 |

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name healthcare.example.com;
    root /var/www/qa-live-healthcare/dist;
    index index.html;

    # SPA fallback - 所有路由指向 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

### Netlify _redirects File
```
/*    /index.html   200
```

## Current Limitations

1. **无 CI/CD**: 无自动化构建和部署流水线
2. **无 Docker**: 未容器化
3. **无环境变量**: `.env` 为空，未区分环境
4. **无路径别名**: import 使用相对路径 `../store`
5. **无 HTTPS 配置**: 仅开发环境 HTTP

---

*此部署文档应在基础设施或构建流程变更时更新。使用 `/asdm-context-update deployment` 保持文档最新。*
