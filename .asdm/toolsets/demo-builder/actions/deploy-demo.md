# 部署演示站点指令

## 指令名称
`/asdm-deploy-demo`

## 功能描述

将生成的演示站点部署到指定的服务器或云平台。支持多种部署方式，包括本地服务器、静态文件服务器和云平台部署。

## 语法格式

```bash
/asdm-deploy-demo <演示站点目录> [选项]
```

## 参数说明

### 必需参数

- `<演示站点目录>`: 要部署的演示站点目录路径

### 部署目标选项

- `--target <目标>`: 部署目标，可选值：`local`（默认）、`static`、`netlify`、`vercel`、`github-pages`
- `--domain <域名>`: 自定义域名（仅适用于云平台部署）
- `--env <环境>`: 部署环境，可选值：`production`（默认）、`staging`、`development`

### 构建选项

- `--build`: 在部署前先构建项目
- `--minify`: 启用代码压缩优化
- `--analyze`: 生成构建分析报告

### 认证选项

- `--token <令牌>`: 部署平台的身份验证令牌
- `--config <配置文件>`: 使用配置文件进行部署配置

## 使用示例

### 本地部署

```bash
# 部署到本地服务器
/asdm-deploy-demo ./demo-site --target local --port 3000
```

### 静态文件部署

```bash
# 构建并部署到静态文件服务器
/asdm-deploy-demo ./demo-site --target static --build --minify
```

### 云平台部署

```bash
# 部署到Netlify
/asdm-deploy-demo ./demo-site --target netlify --token $NETLIFY_TOKEN

# 部署到Vercel
/asdm-deploy-demo ./demo-site --target vercel --domain my-demo.example.com

# 部署到GitHub Pages
/asdm-deploy-demo ./demo-site --target github-pages --token $GITHUB_TOKEN
```

## 部署流程

### 1. 环境检查
- 验证演示站点目录结构
- 检查必要的配置文件
- 验证部署目标的可访问性

### 2. 构建优化（可选）
- 执行 `npm run build`
- 压缩静态资源
- 生成资源哈希值
- 优化图片和字体文件

### 3. 部署执行
- 根据目标平台执行相应部署命令
- 上传构建产物
- 配置域名和SSL证书
- 设置环境变量

### 4. 验证测试
- 检查部署状态
- 测试网站可访问性
- 验证功能完整性
- 性能基准测试

## 部署目标详情

### 本地部署 (local)

**特点**: 快速测试，无需网络
**适用场景**: 开发测试、内部演示

```bash
# 启动本地开发服务器
cd demo-site && npm run dev

# 或使用静态文件服务器
npx serve dist -p 3000
```

### 静态文件部署 (static)

**特点**: 简单高效，成本低
**适用场景**: 小型项目、文档站点

支持平台：
- Nginx/Apache
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage

### Netlify部署

**特点**: 自动化部署，全球CDN
**适用场景**: 前端项目、Jamstack应用

配置示例：
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel部署

**特点**: 极速部署，边缘计算
**适用场景**: 现代Web应用、API服务

配置示例：
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### GitHub Pages部署

**特点**: 免费托管，Git集成
**适用场景**: 开源项目、个人博客

配置示例：
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 配置文件支持

### 部署配置文件格式

支持JSON、YAML格式的配置文件：

```yaml
# deploy.config.yml
target: netlify
domain: demo.example.com
build:
  command: npm run build
  output: dist
environment:
  NODE_ENV: production
  API_URL: https://api.example.com
redirects:
  - from: /old-path
    to: /new-path
    status: 301
```

### 环境变量配置

支持通过环境变量配置敏感信息：

```bash
# 设置环境变量
export NETLIFY_TOKEN="your-token-here"
export DOMAIN="demo.example.com"

# 使用环境变量部署
/asdm-deploy-demo ./demo-site --target netlify
```

## 错误处理

### 常见部署错误

1. **构建失败**
   ```
   Error: Build failed with exit code 1
   ```
   **解决方案**: 检查项目依赖和构建脚本

2. **认证失败**
   ```
   Error: Authentication failed for deployment target
   ```
   **解决方案**: 验证API令牌和权限

3. **网络错误**
   ```
   Error: Network connection timeout
   ```
   **解决方案**: 检查网络连接和防火墙设置

4. **资源限制**
   ```
   Error: Deployment quota exceeded
   ```
   **解决方案**: 升级服务计划或清理旧部署

### 恢复策略

- 自动重试机制（最多3次）
- 增量部署避免全量上传
- 备份旧版本支持快速回滚
- 详细日志记录便于问题排查

## 监控和日志

### 部署状态监控

```bash
# 查看部署状态
/asdm-deploy-demo --status <deployment-id>

# 查看部署日志
/asdm-deploy-demo --logs <deployment-id>
```

### 性能监控集成

- 页面加载时间监控
- 错误率统计
- 用户行为分析
- 资源使用情况

## 安全考虑

### 敏感信息保护

- 自动检测并屏蔽敏感信息
- 支持密钥管理服务集成
- 部署前安全扫描
- 权限最小化原则

### 访问控制

- 支持密码保护部署
- IP白名单限制
- 基于角色的访问控制
- 审计日志记录

## 扩展功能

### 自定义部署脚本

支持自定义部署脚本扩展功能：

```javascript
// deploy-script.js
module.exports = {
  name: 'custom-deploy',
  async deploy(siteDir, config) {
    // 自定义部署逻辑
    await uploadToCustomPlatform(siteDir, config);
  }
};
```

### 多环境部署

支持同时部署到多个环境：

```bash
# 部署到开发和生成环境
/asdm-deploy-demo ./demo-site --env development,staging,production
```

### 回滚功能

支持快速回滚到之前的版本：

```bash
# 回滚到指定版本
/asdm-deploy-demo --rollback v1.2.3

# 查看可回滚的版本列表
/asdm-deploy-demo --versions
```

## 最佳实践

### 部署前检查清单

1. ✅ 代码已通过所有测试
2. ✅ 构建产物无错误
3. ✅ 环境变量配置正确
4. ✅ 数据库迁移已完成（如适用）
5. ✅ 备份当前版本

### 部署后验证

1. ✅ 网站可正常访问
2. ✅ 所有功能正常工作
3. ✅ 性能指标符合预期
4. ✅ 错误监控已启用
5. ✅ 回滚计划已准备

## 相关指令

- `/asdm-build-demo`: 构建演示站点
- `/asdm-parse-markdown`: 解析Markdown文件
- `/asdm-monitor-deploy`: 监控部署状态