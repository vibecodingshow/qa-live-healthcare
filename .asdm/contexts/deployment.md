# 在线医疗咨询平台 - 部署配置文档

## 概述

本文档描述了在线医疗咨询平台（qa-live-healthcare）的部署配置、流程和环境设置。

## 部署架构

### 部署模式

```
┌─────────────────────────────────────────────────────────────┐
│                      静态SPA部署                             │
└─────────────────────────────────────────────────────────────┘

源代码 ──[构建]──► dist/ ──[部署]──► Web服务器 ──[访问]──► 用户浏览器
                                                   │
                                                   ▼
                                           ┌───────────────┐
                                           │   CDN加速     │
                                           │  (可选)       │
                                           └───────────────┘
```

### 技术栈依赖

| 组件 | 版本 | 说明 |
|------|------|------|
| Node.js | ≥16.0.0 | 构建时运行 |
| npm | ≥8.0.0 | 包管理 |
| Vue | 3.5.10 | 前端框架 |
| Vite | 5.4.8 | 构建工具 |
| Ant Design Vue | 4.2.6 | UI组件库 |

## 环境配置

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 配置说明
# - 访问地址: http://localhost:5173
# - 热模块替换: 默认启用
# - 代理配置: vite.config.ts 中配置
```

### 生产环境构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 构建输出目录: dist/
```

## 构建配置

### Vite 构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',  // 部署基础路径
  
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 资产目录
    assetsDir: 'assets',
    
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'antdv-vendor': ['ant-design-vue'],
        }
      }
    },
    
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除console.log
        drop_debugger: true   // 移除debugger
      }
    },
    
    // 资源内联阈值 (bytes)
    assetsInlineLimit: 4096
  },
  
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

### TypeScript 配置

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

## 部署流程

### 本地部署

```bash
# 1. 安装依赖
npm install

# 2. 类型检查
npm run build

# 3. 构建生产版本
npm run build

# 4. 本地预览
npm run preview
```

### 服务器部署

#### 方式一：Nginx 部署

```nginx
# /etc/nginx/conf.d/qa-live-healthcare.conf

server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/qa-live-healthcare/dist;
    index index.html;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CORS配置 (如果需要API)
    location /api/ {
        proxy_pass http://backend-server:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 方式二：Apache 部署

```apache
# .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 缓存配置
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 环境变量

### 创建环境文件

```bash
# .env.development - 开发环境
VITE_APP_TITLE=在线医疗咨询平台(开发)
VITE_API_BASE_URL=http://localhost:3000

# .env.production - 生产环境
VITE_APP_TITLE=在线医疗咨询平台
VITE_API_BASE_URL=https://api.your-domain.com
```

### 使用环境变量

```typescript
// 在代码中使用
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
```

## Docker 部署

### Dockerfile

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # 后端服务 (未来扩展)
  # api:
  #   image: node:20-alpine
  #   command: npm start
  #   ports:
  #     - "3000:3000"
```

### 构建和运行

```bash
# 构建镜像
docker build -t qa-live-healthcare:latest .

# 运行容器
docker run -d -p 80:80 --name qa-live-healthcare qa-live-healthcare:latest

# 使用Docker Compose
docker-compose up -d
```

## CDN 部署

### 阿里云 OSS 部署

```bash
# 1. 安装 ossutil
# 2. 配置凭证
ossutil config

# 3. 上传构建文件
ossutil cp -r dist/ oss://your-bucket/ --force

# 4. 配置静态网站托管
ossutil static-website --bucket your-bucket --index index.html
```

### 腾讯云 COS 部署

```bash
# 使用 coscmd
coscmd config -a AKIDxxxx -s xxxxx -b your-bucket-1250000000 -r ap-guangzhou

# 上传文件
coscmd upload -r dist/ /
```

## 持续集成/持续部署

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
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
        
      - name: Deploy to Nginx
        uses: peaceiris/actions-ngrok@v3
        with:
          ngrok_auth_token: ${{ secrets.NGROK_TOKEN }}
          inline_img: true
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - apt-get update && apt-get install -y ssh-client
    - scp -r dist/* user@server:/var/www/qa-live-healthcare/
  only:
    - main
```

## 性能优化配置

### 资源压缩

```typescript
// vite.config.ts
build: {
  // CSS代码分割
  cssCodeSplit: true,
  
  // 压缩
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log']
    }
  }
}
```

### 资源优化

| 优化项 | 配置 | 效果 |
|--------|------|------|
| 代码分割 | manualChunks | 减少首屏加载 |
| Gzip压缩 | nginx gzip | 减少传输体积 |
| 资源内联 | assetsInlineLimit | 减少HTTP请求 |
| 图片压缩 | vite-plugin-imagemin | 减小图片大小 |
| CDN加速 | 静态资源CDN | 加速访问 |

## 监控配置

### 错误监控

```typescript
// src/error-handler.ts
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  // 可发送到错误监控服务
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### 性能监控

```typescript
// src/performance.ts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.value}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

## 安全配置

### CSP 内容安全策略

```nginx
# Nginx配置
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.your-domain.com;
" always;
```

### 安全检查清单

- [ ] HTTPS 配置
- [ ] HSTS 头配置
- [ ] CSP 内容安全策略
- [ ] X-Frame-Options 防护
- [ ] 敏感信息不提交到仓库
- [ ] API 接口鉴权
- [ ] 定期更新依赖版本

## 备份策略

### 数据备份

```bash
#!/bin/bash
# backup.sh

# 备份配置文件
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env.production \
  nginx.conf \
  docker-compose.yml

# 上传到远程存储
ossutil cp backup-*.tar.gz oss://your-bucket/backups/
```

### 备份频率

| 数据类型 | 备份频率 | 保留时间 |
|----------|----------|----------|
| 配置文件 | 每次部署前 | 30天 |
| 用户上传 | 每日 | 90天 |
| 日志文件 | 每周 | 30天 |
| 数据库 | 每日 | 90天 |

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 页面空白 | 路由配置错误 | 检查 base 和 try_files |
| 静态资源404 | 路径配置错误 | 检查 assetsDir 配置 |
| 构建失败 | 依赖问题 | 删除 node_modules 后重试 |
| HTTPS不安全 | 证书过期 | 更新SSL证书 |

### 健康检查

```bash
# 检查Nginx配置
nginx -t

# 检查服务状态
systemctl status nginx
docker ps

# 检查端口占用
netstat -tlnp | grep 80
```

## 部署检查清单

### 部署前

- [ ] 代码审查通过
- [ ] 测试环境验证通过
- [ ] 依赖版本确认
- [ ] 备份当前版本
- [ ] 通知相关人员

### 部署中

- [ ] 执行构建命令
- [ ] 验证构建产物
- [ ] 上传到服务器
- [ ] 重启服务
- [ ] 验证服务运行

### 部署后

- [ ] 功能测试验证
- [ ] 性能监控检查
- [ ] 错误日志检查
- [ ] 回滚准备（如有问题）

---

**最后更新**: 2026-04-21
**文档版本**: 1.0.0
