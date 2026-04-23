# 演示站点

基于Markdown的交互式演示工具

## 功能特性

- 📝 Markdown驱动 - 使用熟悉的Markdown语法编写内容
- 🎬 全屏播放 - 支持全屏演示模式
- ⌨️ 键盘导航 - 左右键轻松切换页面
- 🎨 主题切换 - 支持浅色和深色主题
- 📱 响应式设计 - 完美适配各种屏幕尺寸

## 快速开始

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

访问 http://localhost:3000 查看演示站点。

### 构建

```bash
npm run build
```

构建后的文件将输出到 `dist` 目录。

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/       # Vue组件
│   ├── demo/        # 演示相关组件
│   └── common/       # 通用组件
├── composables/      # 组合式函数
├── router/           # 路由配置
├── stores/           # 状态管理
├── types/            # 类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
```

## 使用方法

### 1. 准备Markdown文件

```markdown
# 第一页
这是第一页的内容

## 子标题
这是子标题下的内容

# 第二页
这是第二页的内容
```

### 2. 解析Markdown

使用 `scripts/markdownParser.js` 解析：

```bash
npm run parse -- ./content.md -o structure.json
```

### 3. 启动演示

访问首页，点击"开始演示"进入全屏播放模式。

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| ← / → | 切换页面 |
| Space | 播放/暂停 |
| F | 全屏切换 |
| ESC | 退出全屏 |
| Home | 第一页 |
| End | 最后一页 |

## 配置

在 `src/demo.config.ts` 中修改站点配置：

```typescript
export default {
  title: '我的演示站点',
  theme: {
    mode: 'light',
    primaryColor: '#3b82f6'
  },
  navigation: {
    keyboard: true,
    autoPlay: false
  }
}
```

## 开发

### 代码规范

```bash
# 检查代码规范
npm run lint

# 自动修复
npm run lint -- --fix
```

### 类型检查

```bash
npm run type-check
```

### 测试

```bash
# 运行单元测试
npm run test

# 运行E2E测试
npm run test:e2e
```

## 部署

### 静态部署

将 `dist` 目录下的文件上传到静态服务器即可。

### Netlify

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod
```

### Vercel

```bash
# 安装Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

## License

MIT
