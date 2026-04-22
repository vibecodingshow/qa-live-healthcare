# 部署配置文档

## 项目部署配置指南

> 本文档详细说明了 qa-live-healthcare 项目的构建、测试和部署流程，为开发团队提供标准化的部署规范。

---

## 项目技术栈概览

### 核心依赖版本
| 组件 | 版本 | 类型 |
|------|------|------|
| Vue | ^3.5.10 | 运行时依赖 |
| TypeScript | ^5.5.3 | 开发依赖 |
| Vite | ^5.4.8 | 构建工具 |
| Ant Design Vue | ^4.2.6 | UI框架 |
| Vue Router | ^4.6.3 | 路由管理 |

### 构建工具链
- **Vite**: 现代化前端构建工具，提供快速开发体验
- **vue-tsc**: Vue + TypeScript 类型检查工具
- **Ant Design Vue**: 企业级UI组件库

---

## 构建配置

### TypeScript 配置

#### 应用层配置 (tsconfig.app.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

#### 构建层配置 (tsconfig.node.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### Vite 构建配置
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

---

## 构建脚本

### 开发环境
```bash
# 启动开发服务器
npm run dev
```

**开发服务器特性**:
- 热重载（HMR）
- 快速启动
- 实时类型检查

### 生产构建
```bash
# 构建生产版本
npm run build
```

**构建流程**:
1. **类型检查**: `vue-tsc -b` - 确保TypeScript类型安全
2. **代码打包**: `vite build` - 优化和压缩代码
3. **输出目录**: `dist/` - 生产就绪的静态文件

### 预览构建结果
```bash
# 预览生产构建
npm run preview
```

---

## 部署环境要求

### 服务器环境
| 组件 | 最低版本 | 推荐版本 |
|------|----------|----------|
| Node.js | 16.0.0 | 18.0.0+ |
| npm | 7.0.0 | 8.0.0+ |
| 浏览器 | Chrome 90+ | Chrome 100+ |

### 网络环境
- **协议支持**: HTTPS (生产环境推荐)
- **端口**: 默认3000 (开发), 80/443 (生产)
- **CDN**: 可选，用于静态资源加速

---

## 部署策略

### 静态资源部署

#### 1. 传统Web服务器
```bash
# 构建生产版本
npm run build

# 部署到服务器
cp -r dist/* /var/www/html/
```

**支持的Web服务器**:
- Nginx
- Apache
- IIS
- Caddy

#### 2. CDN部署
```yaml
# CDN配置示例
cache-control: max-age=31536000
content-type: application/javascript
```

### 容器化部署 (可选)

#### Dockerfile
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  qa-live-healthcare:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

---

## 环境配置

### 开发环境配置
```bash
# 环境变量示例
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE="QA Live Healthcare (Dev)"
```

### 生产环境配置
```bash
# 环境变量示例
VITE_API_BASE_URL=https://api.qa-live-healthcare.com
VITE_APP_TITLE="QA Live Healthcare"
```

### 环境变量文件
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production  
VITE_API_BASE_URL=https://api.qa-live-healthcare.com
```

---

## 性能优化配置

### 构建优化
```typescript
// vite.config.ts 扩展配置
export default defineConfig({
  plugins: [vue()],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['ant-design-vue']
        }
      }
    },
    // 压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### 资源优化
- **图片压缩**: SVG图标优化
- **CSS压缩**: 自动提取和压缩
- **Tree Shaking**: 未使用代码自动移除

---

## 监控和日志

### 构建监控
```bash
# 构建大小分析
npm run build -- --report
```

### 性能监控
- **Lighthouse**: 性能评分
- **Web Vitals**: 核心性能指标
- **Bundle Analyzer**: 包大小分析

---

## 安全配置

### 内容安全策略 (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### HTTPS配置
```nginx
# Nginx配置
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    # ...其他配置
}
```

---

## 故障排除

### 常见构建问题

#### 1. 类型检查失败
```bash
# 修复TypeScript错误
npm run build -- --noEmitOnError false
```

#### 2. 依赖版本冲突
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. 内存不足
```bash
# 增加Node.js内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 部署问题

#### 1. 路由404问题
```nginx
# Nginx配置解决SPA路由问题
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 2. 静态资源404
- 检查构建输出路径
- 验证服务器静态文件配置
- 确认CDN缓存策略

---

## 自动化部署

### CI/CD 配置示例

#### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npm run test
    - uses: easingthemes/ssh-deploy@main
      with:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        SOURCE: "dist/"
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: ${{ secrets.REMOTE_TARGET }}
```

#### GitLab CI
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - rsync -avz dist/ user@server:/var/www/html/
```

---

## 部署检查清单

### 构建前检查
- [ ] 所有TypeScript错误已修复
- [ ] 单元测试通过
- [ ] 依赖版本锁定
- [ ] 环境变量配置正确

### 部署后验证
- [ ] 应用正常加载
- [ ] 路由功能正常
- [ ] API调用正常
- [ ] 静态资源加载正常
- [ ] 性能指标达标

### 监控设置
- [ ] 错误监控配置
- [ ] 性能监控配置
- [ ] 用户行为分析配置

---

## 总结

### 部署架构优势
- ✅ **现代化构建工具**: Vite提供快速构建体验
- ✅ **类型安全**: TypeScript确保代码质量
- ✅ **模块化部署**: 支持多种部署方案
- ✅ **性能优化**: 自动化的构建优化

### 扩展建议
1. **后端集成**: 配置API代理和CORS设置
2. **缓存策略**: 配置CDN和浏览器缓存
3. **监控系统**: 集成应用性能监控
4. **安全加固**: 配置WAF和DDoS防护

**部署配置文档为项目提供了完整的构建、测试和部署指南，确保团队能够高效、安全地部署应用！**