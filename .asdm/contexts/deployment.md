# 部署配置文档

## 项目概述

QA Live Healthcare 是一个基于 Vue 3 + TypeScript + Vite 的医疗健康前端应用，提供预约挂号、在线问诊和医生管理功能。

## 技术栈和构建工具

### 核心框架
- **前端框架**: Vue 3.5.10
- **开发语言**: TypeScript 5.5.3
- **构建工具**: Vite 5.4.8
- **UI组件库**: Ant Design Vue 4.2.6
- **日期处理**: dayjs 1.11.19

### 开发依赖
- **Vue插件**: @vitejs/plugin-vue 5.1.4
- **TypeScript检查**: vue-tsc 2.1.6
- **路由管理**: vue-router 4.6.3

## 构建配置

### Vite 配置 (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### TypeScript 配置

**主配置 (`tsconfig.json`)**: 项目引用配置

**应用配置 (`tsconfig.app.json`)**:
- 目标版本: ES2020
- 模块系统: ESNext
- 严格模式: 启用
- 包含文件: `src/**/*.ts`, `src/**/*.tsx`, `src/**/*.vue`

**Node配置 (`tsconfig.node.json`)**:
- 目标版本: ES2022
- 包含文件: `vite.config.ts`

## 构建脚本

### package.json 脚本
```json
{
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview"
}
```

### 构建流程
1. **类型检查**: `vue-tsc -b` - 执行 TypeScript 类型检查
2. **代码构建**: `vite build` - 使用 Vite 构建生产版本
3. **输出目录**: `dist/` - 构建产物输出目录

## 部署环境要求

### 运行时环境
- **Node.js**: 版本 16.0 或更高
- **包管理器**: npm 8.0 或更高
- **浏览器支持**: 现代浏览器 (Chrome 88+, Firefox 78+, Safari 14+)

### 服务器要求
- **静态文件服务**: 支持 HTTP/HTTPS 的 Web 服务器
- **路径重写**: SPA 路由支持 (所有路径重定向到 index.html)
- **Gzip 压缩**: 建议启用静态资源压缩
- **localStorage 支持**: 客户端需要支持 localStorage

## 部署步骤

### 开发环境部署

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
- 开发服务器地址: `http://localhost:5173`
- 支持热重载和实时预览

### 生产环境部署

1. **构建生产版本**
```bash
npm run build
```

2. **预览构建结果**
```bash
npm run preview
```

3. **部署到服务器**
- 将 `dist/` 目录内容上传到 Web 服务器
- 配置服务器路由重写规则

## 服务器配置示例

### Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA 路由重写
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Apache 配置 (`.htaccess`)
```apache
RewriteEngine On
RewriteBase /

# SPA 路由重写
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# 静态资源缓存
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## 环境变量配置

### 开发环境变量 (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=QA Live Healthcare - 开发环境
```

### 生产环境变量 (`.env.production`)
```env
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_APP_TITLE=QA Live Healthcare
```

## 功能模块部署

### 预约功能数据存储
预约功能使用 localStorage 进行数据持久化，部署时需要注意：

1. **数据存储 Key**:
   - `appointments` - 预约列表
   - `schedules` - 排班列表
   - `currentPatient` - 当前患者
   - `currentDoctor` - 当前医生

2. **存储限制**:
   - localStorage 限制约 5-10MB
   - 大量预约数据可能需要后端存储

3. **数据迁移**:
   - 如果需要从 localStorage 迁移到后端数据库
   - 需要编写数据迁移脚本

### 路由配置
```
/                          - 首页
/doctors                   - 医生列表
/appointment/doctors       - 预约医生列表
/appointment/confirm        - 预约确认
/appointment/detail/:id    - 预约详情
/my-appointments           - 我的预约
/consultation              - 在线问诊
/doctor/login              - 医生登录
/doctor/room/:username     - 医生诊室
/doctor/appointments       - 医生预约管理
/doctor/schedule           - 医生排班管理
```

## 性能优化建议

### 构建优化
1. **代码分割**: 利用 Vite 的自动代码分割功能
2. **Tree Shaking**: 移除未使用的代码
3. **压缩优化**: 启用所有资源的压缩

### 运行时优化
1. **CDN 加速**: 静态资源使用 CDN 分发
2. **缓存策略**: 配置合理的缓存头
3. **预加载**: 关键资源预加载

### 预约列表优化
- 大量预约数据时考虑分页加载
- 使用虚拟滚动优化长列表渲染

## 监控和日志

### 错误监控
- 集成 Sentry 或类似错误监控服务
- 前端错误收集和分析
- 预约操作错误追踪

### 性能监控
- 使用 Web Vitals 监控核心性能指标
- 真实用户性能数据收集
- 预约页面加载时间监控

## 安全考虑

### 内容安全策略 (CSP)
- 配置适当的内容安全策略头
- 限制外部资源加载

### HTTPS 强制
- 生产环境强制使用 HTTPS
- HSTS 头配置

### localStorage 安全
- 不存储敏感信息（如完整密码）
- 重要数据考虑加密存储
- 清理过期数据

## 备份和恢复

### 构建产物备份
- 定期备份构建产物
- 版本化部署，支持快速回滚

### 配置备份
- 备份所有环境配置文件
- 版本控制系统管理配置变更

### 数据备份
- 定期导出 localStorage 中的重要数据
- 预约数据建议定期同步到后端

## 故障排除

### 常见问题
1. **路由问题**: 确保服务器配置了 SPA 路由重写
2. **资源加载失败**: 检查静态资源路径配置
3. **API 连接问题**: 验证环境变量中的 API 地址
4. **预约数据丢失**: 检查 localStorage 可用空间和配额

### 调试工具
- 浏览器开发者工具 (Application -> Local Storage)
- Vite 开发服务器日志
- 网络请求监控

---

*最后更新: 2026-04-23*
*文档版本: 1.1*
