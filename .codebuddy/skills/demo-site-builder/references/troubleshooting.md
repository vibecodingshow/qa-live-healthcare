# 故障排除指南

## 概述

本文档提供演示站点搭建工具的常见问题诊断和解决方案。

## 目录

- [安装问题](#安装问题)
- [构建问题](#构建问题)
- [运行时问题](#运行时问题)
- [部署问题](#部署问题)
- [性能问题](#性能问题)

---

## 安装问题

### Node.js版本不兼容

**症状:** 安装依赖时出现版本错误

```
Error: Unsupported engine
npm ERR! code EBADENGINE
npm ERR! notsup Required: {"node":">=16.0.0"}
```

**解决方案:**

```bash
# 检查当前Node.js版本
node --version

# 使用nvm升级Node.js（推荐）
nvm install 18
nvm use 18

# 或使用nvm-windows
nvm install 18.0.0
nvm use 18.0.0
```

---

### npm安装失败

**症状:** `npm install` 执行失败

**解决方案:**

1. 清理npm缓存
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. 使用淘宝镜像（如果网络问题）
```bash
npm config set registry https://registry.npmmirror.com/
npm install
```

3. 检查网络连接
```bash
ping registry.npmjs.org
```

---

### 权限错误

**症状:** 无法创建文件或目录

```
Error: EACCES: permission denied
```

**解决方案:**

```bash
# Linux/Mac
sudo npm install -g <package>

# 或修复npm权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 构建问题

### TypeScript编译错误

**症状:** 构建时TypeScript报错

**常见错误及解决方案:**

1. **找不到模块**
```
Module not found: @/components/...
```

**解决方案:** 检查`tsconfig.json`中的路径别名配置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **类型定义缺失**
```
Could not find a declaration file for module 'xxx'
```

**解决方案:** 安装类型定义包
```bash
npm install --save-dev @types/xxx
```

---

### Vite构建失败

**症状:** `npm run build` 失败

**解决方案:**

1. 检查环境变量
```bash
# 创建.env.production
VITE_APP_TITLE=我的演示站点
```

2. 清理缓存
```bash
rm -rf node_modules/.vite
npm run build
```

3. 更新依赖
```bash
npm update
npm run build
```

---

## 运行时问题

### 页面空白

**症状:** 访问页面时显示空白

**排查步骤:**

1. 检查浏览器控制台错误
2. 检查网络请求
3. 验证HTML是否正确加载

**解决方案:**

1. 检查JavaScript是否加载
```html
<!-- 确保有正确的script标签 -->
<script type="module" src="/src/main.ts"></script>
```

2. 检查路由配置
```typescript
// vite.config.ts
export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}
```

---

### 全屏功能不工作

**症状:** 全屏按钮点击无反应

**解决方案:**

1. 检查浏览器支持
```javascript
if (document.fullscreenEnabled) {
  // 支持全屏
} else {
  console.warn('浏览器不支持全屏API')
}
```

2. 用户手势要求
```javascript
// 必须在用户交互中调用
button.addEventListener('click', () => {
  document.documentElement.requestFullscreen()
})
```

---

### Markdown解析错误

**症状:** Markdown内容显示不正确

**排查步骤:**

1. 检查Markdown语法
```markdown
<!-- 正确 -->
# 标题

<!-- 错误：缺少空行 -->
# 标题
内容
```

2. 检查代码块闭合
```markdown
<!-- 正确 -->
```javascript
const x = 1
` ` `

<!-- 错误：未闭合 -->
```javascript
const x = 1
```

3. 检查特殊字符转义
```markdown
<!-- 需要转义的字符 -->
\* 星号
\# 井号
```

---

## 部署问题

### 静态资源404

**症状:** 部署后图片、样式等资源加载失败

**解决方案:**

1. 检查资源路径
```javascript
// vite.config.ts
export default {
  base: './', // 使用相对路径
  build: {
    assetsDir: 'assets'
  }
}
```

2. 检查public目录
```
public/
├── favicon.ico
└── images/
    └── logo.png
```

3. 配置正确的public路径
```javascript
// 在代码中使用
const logoUrl = new URL('/images/logo.png', import.meta.url)
```

---

### 路由模式问题

**症状:** 刷新页面404

**解决方案:**

1. 使用hash模式（适用于静态托管）
```typescript
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

2. 或配置服务器重定向（适用于SSR）

**Nginx配置:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Netlify配置:**
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 性能问题

### 首屏加载慢

**症状:** 首次访问加载时间过长

**解决方案:**

1. 启用代码分割
```javascript
// 路由懒加载
const DemoPage = () => import('@/views/DemoPage.vue')
```

2. 压缩资源
```javascript
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    cssMinify: true
  }
}
```

3. 使用CDN
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      external: ['vue', 'vue-router']
    }
  }
}
```

---

### 内存占用高

**症状:** 大文档导致内存占用过高

**解决方案:**

1. 分页加载
```typescript
const PAGE_SIZE = 10
function loadPages(markdown, page) {
  const lines = markdown.split('\n')
  const start = page * PAGE_SIZE
  return lines.slice(start, start + PAGE_SIZE).join('\n')
}
```

2. 使用Web Worker解析
```javascript
// parser.worker.js
self.onmessage = ({ data }) => {
  const result = parseMarkdown(data)
  self.postMessage(result)
}
```

---

### 动画卡顿

**症状:** 页面切换动画不流畅

**解决方案:**

1. 使用CSS硬件加速
```css
.page-transition {
  will-change: transform;
  transform: translateZ(0);
}
```

2. 减少DOM操作
```typescript
// 批量更新
const fragment = document.createDocumentFragment()
items.forEach(item => fragment.appendChild(item))
container.appendChild(fragment)
```

3. 使用requestAnimationFrame
```typescript
function animate(callback) {
  requestAnimationFrame(() => {
    callback()
    animate(callback)
  })
}
```

---

## 获取帮助

如果以上方案无法解决您的问题，请通过以下方式获取帮助：

1. 查看[GitHub Issues](https://github.com/example/demo-site/issues)
2. 查看[讨论区](https://github.com/example/demo-site/discussions)
3. 提交新的Issue，请包含：
   - 错误日志
   - 复现步骤
   - 环境信息（Node版本、操作系统等）

---

## 更新日志

### v1.1.0 (2025-04-22)
- 新增常见问题解答
- 优化性能问题解决方案

### v1.0.0 (2025-04-20)
- 初始版本发布