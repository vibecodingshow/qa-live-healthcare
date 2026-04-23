# 医疗面试系统演示站点

这是一个基于Vue 3 + TypeScript + Vite构建的交互式演示站点，支持全屏播放和键盘导航。

## 🚀 快速启动

### 1. 安装依赖

```bash
cd demo-site
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:5173 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## ✨ 功能特性

- 🎬 **全屏播放模式**: 点击播放按钮进入全屏演示
- ⌨️ **键盘导航**: 使用左右箭头键切换页面
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎨 **现代化UI**: 使用Tailwind CSS构建美观的界面
- 📝 **Markdown支持**: 支持Markdown格式的内容渲染

## 📁 项目结构

```
demo-site/
├── index.html          # HTML入口文件
├── package.json        # 项目配置和依赖
├── vite.config.ts      # Vite配置
├── tailwind.config.js  # Tailwind配置
├── tsconfig.json       # TypeScript配置
└── src/
    ├── main.ts         # 应用入口
    ├── App.vue         # 根组件
    ├── style.css       # 全局样式
    ├── components/     # Vue组件
    │   ├── PageViewer.vue   # 页面查看器
    │   └── DemoPlayer.vue   # 演示播放器
    ├── views/          # 页面视图
    │   └── Home.vue    # 首页
    ├── stores/         # 状态管理
    │   └── demo.store.ts
    ├── utils/          # 工具函数
    │   └── markdownParser.ts
    ├── router/         # 路由配置
    │   └── index.ts
    └── types/          # TypeScript类型定义
        └── index.ts
```

## 🎯 使用方法

1. **启动站点**: 运行 `npm run dev`
2. **查看演示**: 在首页点击任意演示卡片
3. **全屏播放**: 点击播放按钮进入全屏模式
4. **页面切换**: 使用左右箭头键或点击按钮切换页面
5. **退出全屏**: 按ESC键或点击"退出演示"按钮

## 🛠️ 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **Markdown解析**: marked

## 📦 部署

### 构建静态文件

```bash
npm run build
```

构建完成后，静态文件将生成在 `dist` 目录中。

### 部署到静态服务器

可以将 `dist` 目录中的文件部署到任何静态服务器，如：
- Nginx
- Apache
- Vercel
- Netlify
- GitHub Pages

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
