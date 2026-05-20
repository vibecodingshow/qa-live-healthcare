# 部署配置

## 概述

本文档描述了在线医疗问诊平台的部署架构、配置和流程。本项目为前端应用，使用 Vite 构建，可部署到多种静态托管服务。

## 部署架构

```mermaid
graph TB
    subgraph "用户访问"
        USER[用户浏览器]
    end
    
    subgraph "CDN"
        CDN[CDN 加速]
    end
    
    subgraph "静态资源"
        HTML[HTML 文件]
        JS[JavaScript bundles]
        CSS[CSS 文件]
        ASSETS[静态资源]
    end
    
    USER -->|HTTPS| CDN
    CDN -->|静态文件| HTML
    CDN -->|JS/CSS| JS
    CDN -->|资源| ASSETS
```

## 环境配置

### 开发环境

```yaml
# 开发配置
environment: development
api_base_url: http://localhost:5173
debug: true
log_level: debug
```

### 生产环境

```yaml
# 生产配置
environment: production
api_base_url: https://your-domain.com
debug: false
log_level: warn
```

## 构建配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/',  // 部署路径
  
  build: {
    outDir: 'dist',           // 输出目录
    sourcemap: false,         // 生产环境禁用 sourcemap
    minify: 'terser',         // 压缩工具
    chunkSizeWarningLimit: 1500,  // chunk 大小警告阈值
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'ant-design-vue'],
        },
      },
    },
  },
  
  server: {
    port: 5173,
    open: true,
  },
});
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 部署流程

### 本地构建

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 自动化构建脚本

```bash
#!/bin/bash
# scripts/build.sh

# 设置环境
export NODE_ENV=production

# 安装依赖
npm ci

# 类型检查
npm run type-check 2>/dev/null || true

# 构建
npm run build

# 输出
echo "构建完成，输出目录: dist/"
```

## 部署选项

### 1. 静态托管服务

| 服务 | 说明 | 配置 |
|------|------|------|
| **Vercel** | 零配置部署 | `vercel.json` |
| **Netlify** | 静态网站托管 | `netlify.toml` |
| **Cloudflare Pages** | 全球 CDN | `Pages` 控制台 |
| **GitHub Pages** | 免费静态托管 | `deploy.yml` |

### Vercel 配置

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Netlify 配置

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### GitHub Actions 部署

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 腾讯云部署

```yaml
# 腾讯云 COS + CDN 配置
# cos.config.yml
cos:
  bucket: your-bucket-name
  region: ap-guangzhou
  basePath: /qa-live-healthcare

cdn:
  domain: your-cdn-domain.com
  https: true
```

## 域名配置

### DNS 设置

```dns
# A 记录
@   IN  A   123.45.67.89

# CNAME 记录
www IN  CNAME  your-domain.com

# 静态资源 CDN
static IN  CNAME  static.your-cdn.com
```

### SSL 证书

大多数托管服务自动提供免费 SSL 证书：
- Vercel: 自动
- Netlify: 自动
- Cloudflare: 自动
- GitHub Pages: 自动（需要自定义域名）

## 性能优化

### 构建优化

```typescript
// vite.config.ts 优化配置
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'antd': ['ant-design-vue'],
        },
      },
    },
    
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  // 依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'ant-design-vue'],
  },
});
```

### 静态资源优化

```typescript
// vite.config.ts
export default defineConfig({
  assetsInclude: ['**/*.svg'],
  build: {
    assetsInlineLimit: 4096,  // < 4kb 的资源内联
    chunkSizeLimit: 1500000,   // chunk 大小限制
  },
});
```

## 监控配置

### 性能监控

```typescript
// src/utils/monitor.ts
export const reportPerformance = () => {
  const timing = performance.timing;
  const metrics = {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.requestStart,
    dom: timing.domContentLoadedEventEnd - timing.navigationStart,
    load: timing.loadEventEnd - timing.navigationStart,
  };
  
  console.log('Performance Metrics:', metrics);
  // 上报至监控服务
};
```

## 部署检查清单

### 部署前

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 构建无错误
- [ ] 依赖版本锁定
- [ ] 环境变量配置正确

### 部署中

- [ ] 选择正确的环境
- [ ] 运行冒烟测试
- [ ] 监控构建输出
- [ ] 验证功能正常

### 部署后

- [ ] 监控错误率
- [ ] 检查性能指标
- [ ] 验证静态资源加载
- [ ] 测试关键业务流程

## 故障排查

### 常见问题

#### 构建失败

```bash
# 清除缓存重新构建
rm -rf node_modules
npm install
npm run build
```

#### 资源加载 404

```javascript
// 检查 vite.config.ts 的 base 配置
export default defineConfig({
  base: '/',  // 确保与实际部署路径一致
});
```

#### 路由模式问题

```javascript
// 路由使用 history 模式时，需要服务端配置
// 确保所有路由都指向 index.html
```

## 相关文档

- [项目结构](./standard-project-structure.md)
- [架构设计](./architecture.md)

---

*本部署配置文档应随基础设施或部署流程变化进行更新。*
