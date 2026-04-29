# 部署配置文档

> **生成时间**: 2026-04-29
> **项目**: qa-live-healthcare（QA Live Healthcare 在线问诊平台）
> **部署类型**: 纯静态站点 (SPA)

---

## 目录

1. [部署概述](#1-部署概述)
2. [环境要求](#2-环境要求)
3. [本地开发环境搭建](#3-本地开发环境搭建)
4. [构建流程](#4-构建流程)
5. [静态托管部署方案](#5-静态托管部署方案)
6. [Nginx 配置](#6-nginx-配置)
7. [Docker 部署](#7-docker-部署)
8. [CI/CD 配置示例](#8-cicd-配置示例)
9. [预检查清单](#9-预检查清单)
10. [故障排查](#10-故障排查)

---

## 1. 部署概述

### 1.1 项目特性

| 特性 | 说明 |
|------|------|
| **应用类型** | 单页应用 (SPA) - 纯前端静态站 |
| **构建产物** | HTML + CSS + JS（静态文件） |
| **运行时依赖** | 无需 Node.js / 数据库 / 后端服务 |
| **数据存储** | 内存中（JSON 初始化），无持久化 |
| **路由模式** | HTML5 History API (`createWebHistory`) |

### 1.2 部署架构

```
┌─────────────────────────────────────────────────────┐
│                   浏览器 (Client)                     │
│                                                       │
│  ┌───────────┐   ┌───────────┐   ┌───────────────┐  │
│  │ index.html│   │  assets/  │   │  static data  │  │
│  │           │   │ *.js      │   │  (内嵌于 JS)   │  │
│  │           │   │ *.css     │   │               │  │
│  └───────────┘   └───────────┘   └───────────────┘  │
│         ▲              ▲                              │
│         └──────────────┘                              │
│                    │                                  │
│          ┌─────────▼──────────┐                      │
│          │   静态文件服务器       │                      │
│          │  (Nginx / CDN / ...) │                      │
│          └────────────────────┘                       │
└─────────────────────────────────────────────────────┘
```

**核心要点**: 本项目是一个**纯静态 SPA**，部署只需将 `dist/` 目录中的文件上传到任何支持静态文件托管的 Web 服务器即可。

---

## 2. 环境要求

### 2.1 开发环境

| 工具 | 最低版本 | 推荐版本 | 用途 |
|------|----------|----------|------|
| Node.js | >= 18.x | >= 20 LTS | 运行时 & 包管理 |
| npm | >= 9.x | >= 10.x | 依赖管理 |
| pnpm | >= 8.x | >= 9.x | 可选，更快的包管理器 |
| 操作系统 | macOS / Linux / Windows (WSL2) | — | 开发平台 |

### 2.2 生产环境

| 组件 | 要求 | 说明 |
|------|------|------|
| Web 服务器 | 支持静态文件服务 | Nginx、Caddy、Apache 等 |
| HTTPS | 推荐 | 生产环境建议启用 SSL/TLS |
| SPA Fallback | **必须** | 所有路由回退至 `index.html`（History 模式需求） |
| Gzip/Brotli | 推荐 | 可减少约 60-70% 传输体积 |

### 2.3 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | >= 90 | ES2020 支持 |
| Firefox | >= 88 | ES2020 支持 |
| Safari | >= 14 | ES2020 支持 |
| Edge | >= 90 | Chromium 内核 |

> 基于 TypeScript target: ES2020 和 Vite 默认浏览器兼容性设置。

---

## 3. 本地开发环境搭建

### 3.1 快速启动（首次）

```bash
# 1. 克隆或进入项目目录
cd qa-live-healthcare

# 2. 安装依赖
npm install
# 或使用 pnpm: pnpm install

# 3. 启动开发服务器
npm run dev
```

### 3.2 开发服务器默认配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 端口 | 5173 | Vite 默认端口 |
| 地址 | http://localhost:5173 | 本地访问地址 |
| HMR | ✅ 启用 | 热模块替换，修改代码即时生效 |
| HTTPS | ❌ 关闭 | 本地无需 |

### 3.3 验证开发环境

```bash
# 访问以下端点确认功能正常：
http://localhost:5177/                  # 首页
http://localhost:5177/doctors          # 医生列表
http://localhost:5177/consultation     # 患者问诊入口
http://localhost:5177/doctor/login     # 医生登录
http://localhost:5177/about            # 关于页面
```

### 3.4 常见开发问题

| 问题 | 解决方法 |
|------|----------|
| 端口 5173 被占用 | Vite 自动递增到 5174, 5175... |
| 安装依赖失败 | 清除缓存: `rm -rf node_modules package-lock.json && npm install` |
| HMR 不生效 | 检查是否使用了非 ESM 模块或文件监听限制 |

---

## 4. 构建流程

### 4.1 构建命令

```bash
# 生产构建（含类型检查）
npm run build

# 仅构建（跳过类型检查，更快）
npx vite build

# 本地预览构建结果
npm run preview
```

### 4.2 构建步骤详解

`npm run build` 实际执行两个阶段：

```
阶段 1: 类型检查 (vue-tsc -b)
  ├── 解析所有 .vue / .ts 文件的类型
  ├── 使用 tsconfig.app.json 的严格模式校验
  └── 类型错误则终止构建（exit code ≠ 0）

阶段 2: Vite 打包 (vite build)
  ├── @vitejs/plugin-vue 编译 .vue → .js
  ├── esbuild 转译 TypeScript → JavaScript
  ├── Rollup 打包 & Tree-shaking
  ├── 输出资源哈希命名（缓存优化）
  └── 生成 dist/ 目录
```

### 4.3 构建产物结构

构建完成后生成的 `dist/` 目录结构：

```
dist/
├── index.html                  # 入口 HTML（自动注入资源引用）
├── vite.svg                    # favicon
├── assets/
│   ├── index-[hash].js         # 主 JS Bundle (~200-300KB)
│   ├── index-[hash].css        # 提取的 CSS (~50-100KB)
│   └── [其他动态导入的资源]       # 图片等（如有）
└── [无子目录]                   # 扁平结构，便于直接部署
```

### 4.4 构建产物大小参考

| 资源 | 估算大小 (未压缩) | gzipped | Brotli |
|------|-------------------|---------|--------|
| `index-[hash].js` | ~800 KB - 1.2 MB | ~250-350 KB | ~200-280 KB |
| `index-[hash].css` | ~150-200 KB | ~30-40 KB | ~25-35 KB |
| `index.html` | ~0.5 KB | < 1 KB | < 1 KB |
| **总计** | **~1 - 1.4 MB** | **~280-390 KB** | **~225-315 KB** |

> 实际大小取决于 Ant Design Vue 的 tree-shaking 效果。当前全量引入模式下 bundle 较大。

---

## 5. 静态托管部署方案

### 5.1 方案对比

| 平台 | 免费额度 | 自定义域名 | HTTPS | SPA 支持 | 推荐度 |
|------|----------|-----------|-------|----------|--------|
| **Vercel** | 100GB/月 | ✅ | ✅ | ✅ 内置 | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB/月 | ✅ | ✅ | ✅ 内置 | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | Unlimited (公开) | ✅ | ✅ | ⚠️ 需配置 | ⭐⭐⭐⭐ |
| **CloudBase (Tencent)** | 10GB 存储 | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **EdgeOne Pages** | 按量计费 | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **自建 Nginx** | 取决于服务器 | ✅ | 手动配置 | ⚠️ 需配置 | ⭐⭐⭐ |
| **Docker** | 取决于容器服务 | ✅ | 手动配置 | ⚠️ 需配置 | ⭐⭐⭐ |

### 5.2 Vercel 部署（推荐）

#### 方式一：Git 集成（推荐）

1. 将代码推送到 GitHub/GitLab
2. 登录 [vercel.com](https://vercel.com)
3. 导入仓库 → Vercel 自动检测 Vite 项目 → Deploy

**Vercel 自动配置**：
- Framework Preset: Vite
- Build Command: `vite build`（自动调整）
- Output Directory: `dist`
- SPA Rewrite: 自动处理 History 模式

#### 方式二：CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录执行
vercel

# 生产环境部署
vercel --prod
```

#### `vercel.json` 配置（可选）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5.3 Netlify 部署

#### 方式一：Git 集成

1. 连接 Git 仓库到 Netlify
2. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

3. Netlify 会自动创建 `_redirects` 文件处理 SPA 路由

#### 方式二：手动拖拽

```bash
# 1. 构建项目
npm run build

# 2. 访问 https://app.netlify.com/drop
# 3. 将 dist/ 文件夹拖拽到上传区域
```

#### `netlify.toml` 配置

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

### 5.4 GitHub Pages 部署

由于本项目使用 **HTML5 History 模式**，GitHub Pages 需要 `404.html` 技巧：

**步骤**:

1. 创建 `.github/workflows/deploy.yml`（见第 8 节 CI/CD 示例）
2. 或手动操作：

```bash
# 构建并复制 404.html
npm run build
cp dist/index.html dist/404.html

# 将 dist/ 内容推送到 gh-pages 分支
```

> 注意：GitHub Pages 的 404 方案对 SEO 有一定影响，生产环境推荐 Vercel/Netlify。

### 5.5 CloudBase / EdgeOne Pages 部署

通过 CodeBuddy 的集成能力可以一键部署：

1. 在项目中打开 CloudBase 或 EdgeOne Pages 集成
2. 选择静态网站部署
3. 设置构建命令为 `npm run build`
4. 设置输出目录为 `dist`
5. 配置 SPA 回退路由规则

---

## 6. Nginx 配置

### 6.1 最小化 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/qalive/dist;
    index index.html;

    # SPA History 模式关键配置：所有路径回退到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 256;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

### 6.2 带 HTTPS 的完整配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/qalive/dist;
    index index.html;

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长期缓存（利用 Vite 生成的 content hash）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # HTML 不缓存（确保用户获取最新版本）
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Gzip
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 512;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 6.3 部署脚本

```bash
#!/bin/bash
# deploy.sh - 一键部署到 Nginx

set -e

DIST_DIR="dist"
REMOTE_HOST="your-server-ip"
REMOTE_PATH="/var/www/qalive"

echo "=== 步骤 1: 安装依赖 ==="
npm ci

echo "=== 步骤 2: 类型检查 ==="
npx vue-tsc --noEmit || { echo "❌ 类型检查失败"; exit 1; }

echo "=== 步骤 3: 构建 ==="
npm run build || { echo "❌ 构建失败"; exit 1; }

echo "=== 步骤 4: 上传 ==="
rsync -avz --delete "$DIST_DIR/" "$REMOTE_HOST:$REMOTE_PATH/"

echo "=== 步骤 5: 重载 Nginx ==="
ssh "$REMOTE_HOST" "sudo nginx -s reload"

echo "✅ 部署完成！访问 https://your-domain.com"
```

---

## 7. Docker 部署

### 7.1 Dockerfile

```dockerfile
# ===== 构建阶段 =====
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖定义文件（利用 Docker 缓存层）
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# ===== 运行阶段 =====
FROM nginx:alpine

# 移除默认 Nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 Nginx 配置文件（用于 Docker）

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### 7.3 Docker Compose

```yaml
version: '3.8'

services:
  qalive-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 7.4 Docker 部署命令

```bash
# 构建镜像
docker build -t qalive-healthcare .

# 运行容器
docker run -d -p 8080:80 --name qalive qalive-healthcare

# 或使用 docker compose up
docker compose up -d

# 验证
curl http://localhost:8080/
```

---

## 8. CI/CD 配置示例

### 8.1 GitHub Actions（推送到 GitHub Pages）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 8.2 GitHub Actions（部署到 Vercel）

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 8.3 GitLab CI（部署到 Nginx）

```yaml
stages:
  - build
  - deploy

variables:
  DIST_DIR: "dist"
  REMOTE_USER: "deploy"
  REMOTE_HOST: "your-server-ip"
  REMOTE_PATH: "/var/www/qalive"

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy_production:
  stage: deploy
  image: alpine:latest
  only:
    - main
  before_script:
    - apk add --no-cache rsync openssh-client
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan $REMOTE_HOST >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete dist/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
    - ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl reload nginx"
```

---

## 9. 预检查清单

### 9.1 部署前检查

在执行生产部署之前，请逐项确认：

#### 代码质量

- [ ] `npm run build` 通过，无编译错误
- [ ] `vue-tsc` 类型检查通过，无类型错误
- [ ] 无 `console.log` / `console.error` 残留（生产代码）
- [ ] `index.html` 的 `<title>` 已更新为实际产品名称
- [ ] Favicon 已替换为实际品牌图标

#### 配置确认

- [ ] Vite base 路径正确（如部署在子目录需设置 `base: '/subpath/'`）
- [ ] API 地址（如有）已切换为生产环境地址
- [ ] 环境变量已正确配置
- [ ] 路由模式与服务器配置匹配

#### 功能验证

- [ ] 首页正常加载和渲染
- [ ] 导航栏菜单点击正常跳转
- [ ] 医生列表页面显示正常
- [ ] 患者身份验证流程正常（注册+登录）
- [ ] 问题提交功能正常
- [ ] 医生登录流程正常
- [ ] 医生回复问题功能正常
- [ ] 页面刷新后路由不丢失（SPA fallback 正确）
- [ ] 移动端响应式布局正常

#### 性能确认

- [ ] 首屏加载时间 < 3s（3G 网络）
- [ ] 静态资源启用了 Gzip/Brotli 压缩
- [ ] JS/CSS 资源设置了合理的缓存策略
- [ ] 无明显的内存泄漏

### 9.2 环境变量规范

当前项目未使用环境变量文件。如需扩展，可按以下方式添加：

**`.env.production`**（提交至 Git）:
```
VITE_APP_TITLE=QA Live Healthcare
VITE_API_BASE_URL=https://api.example.com
```

**`.env.local`**（不提交至 Git）:
```
# 本地覆盖值
```

**Vite 环境变量使用方式**:
```typescript
// 在代码中使用
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appTitle = import.meta.env.VITE_APP_TITLE || 'QA Live Healthcare';
```

> Vite 环境变量必须以 `VITE_` 前缀才能暴露给客户端代码。

---

## 10. 故障排查

### 10.1 常见问题速查表

| 症状 | 可能原因 | 解决方法 |
|------|----------|----------|
| **白屏 (Blank Page)** | JS 加载失败/执行错误 | 打开 DevTools Console 查看报错；检查 `<base href>` 是否正确 |
| **刷新 404** | 服务器未配置 SPA fallback | 配置 `try_files $uri $uri/ /index.html`（Nginx）或 `_redirects`（Netlify） |
| **样式丢失/错乱** | CSS 路径不正确 | 确保 Vite `base` 配置与实际部署路径匹配 |
| **图标/图片不显示** | 静态资源路径错误 | 检查 `public/` 目录中的资源引用方式（绝对路径 `/xxx`） |
| **路由跳转后白屏** | History 模式 + 未配置 fallback | 同「刷新 404」解决方案 |
| **旧版本被缓存** | 浏览器/CDN 缓存了旧的 index.html | 对 index.html 设置 `no-cache` 或添加版本号查询参数 |
| **构建时报 TS 错误** | 类型定义缺失或不匹配 | 运行 `vue-tsc --noEmit` 定位具体错误位置 |
| **Ant Design 样式异常** | 未引入 reset.css 或样式冲突 | 确认 `import 'ant-design-vue/dist/reset.css'` 存在 |

### 10.2 Debug 工具

```bash
# 1. 本地模拟生产环境构建
npm run build && npm run preview

# 2. 分析打包产物大小
npx vite-bundle-visualizer

# 3. 检查构建产物的内容
ls -la dist/assets/

# 4. 验证 dist/index.html 引用路径正确
cat dist/index.html

# 5. 检查 Nginx 配置语法
sudo nginx -t

# 6. 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 7. 使用 curl 模拟请求测试 SPA fallback
curl -I https://your-domain.com/consultation
# 应返回 200 且 body 为 index.html 内容
```

### 10.3 性能优化建议

| 优化项 | 当前状态 | 改进方案 | 预期收益 |
|--------|----------|----------|----------|
| **按需引入 Antd** | 全量引入 | 使用 `unplugin-vue-components` + `unplugin-auto-import` | Bundle 减小约 60% |
| **代码分割** | 单个 JS chunk | 使用动态 `import()` 拆分路由级 chunk | 首屏加载加快 |
| **图片优化** | 外链 Pexels 图片 | 压缩 / 转换 WebP / 懒加载 | 加载速度提升 |
| **CSS 优化** | 单个 CSS 文件 | 关键 CSS 内联 + 其余异步加载 | FCP 提升 |
| **字体优化** | 系统字体栈 | 已是最佳实践 ✅ | — |
| **启用 Brotli** | 取决于服务器配置 | Nginx 配置 `brotli on` | 比 Gzip 再减小 15-25% |

---

## 附录 A: 部署命令速查卡

```bash
# === 本地开发 ===
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)

# === 构建 ===
npm run build        # 类型检查 + 构建
npx vite build       # 仅构建（跳过类型检查）
npm run preview      # 预览构建结果

# === Vercel ===
npm i -g vercel      # 安装 CLI
vercel               # 部署预览
vercel --prod        # 部署生产

# === Netlify ===
netlify deploy --prod --dir=dist   # CLI 部署

# === Docker ===
docker build -t qalive .            # 构建镜像
docker run -d -p 8080:80 qalive      # 运行容器

# === Nginx ===
sudo nginx -t                         # 测试配置
sudo nginx -s reload                 # 重载配置
sudo systemctl status nginx          # 查看状态
```

## 附录 B: 当前 `index.html` 待更新项

当前 `index.html` 中有以下占位符内容，部署到生产环境前应更新：

| 行 | 当前值 | 建议更新为 |
|----|--------|------------|
| 第 2 行 | `<html lang="en">` | `<html lang="zh-CN">` |
| 第 7 行 | `<title>Vite + Vue + TS</title>` | `<title>QA Live Healthcare</title>` |

## 附录 C: 目录权限（Linux/Nginx）

```bash
# 设置正确的文件权限
sudo chown -R www-data:www-data /var/www/qalive
sudo chmod -R 755 /var/www/qalive
sudo chmod 644 /var/www/qalive/index.html
sudo find /var/www/qalive/assets -type f -exec chmod 644 {} \;
```
