# 演示站点示例

欢迎使用演示站点搭建工具！这是一个基于Markdown的交互式演示系统。

## 功能特点

- 📝 **Markdown驱动** - 使用熟悉的Markdown语法编写内容
- 🎬 **全屏播放** - 支持全屏演示模式，身临其境的展示体验
- ⌨️ **键盘导航** - 左右键轻松切换页面
- 🎨 **主题切换** - 支持浅色和深色主题
- 📱 **响应式设计** - 完美适配各种屏幕尺寸

## 快速开始

### 安装步骤

1. 克隆项目到本地
2. 安装依赖包
3. 启动开发服务器

```bash
git clone <repository-url>
cd demo-site
npm install
npm run dev
```

### 基本使用

1. 准备Markdown文件
2. 解析生成页面结构
3. 启动演示

## 核心组件

### DemoPlayer组件

演示播放器核心组件，支持：

- 全屏模式切换
- 页面导航控制
- 播放进度显示
- 键盘快捷键支持

### PageViewer组件

页面内容渲染组件，提供：

- Markdown内容解析
- 代码语法高亮
- 图片自适应显示
- 响应式布局

### Navigation组件

导航控制组件，包含：

- 页码显示
- 进度条
- 快捷键提示
- 全屏按钮

## 技术栈

本项目采用以下技术栈：

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | 3.3+ | 渐进式JavaScript框架 |
| TypeScript | 5.0+ | 类型安全的JavaScript超集 |
| Vite | 4.4+ | 下一代前端构建工具 |
| Tailwind CSS | 3.3+ | 实用优先的CSS框架 |
| Pinia | 2.1+ | Vue状态管理库 |
| Vue Router | 4.2+ | Vue官方路由管理器 |

## 项目结构

```
demo-site/
├── public/              # 静态资源目录
├── src/                 # 源代码目录
│   ├── components/      # Vue组件
│   ├── composables/     # 组合式函数
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   └── views/           # 页面组件
├── tests/               # 测试文件
└── package.json         # 项目配置
```

## 配置选项

### 主题配置

```javascript
{
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b'
  },
  darkMode: 'class'
}
```

### 导航配置

```javascript
{
  keyboard: true,
  autoPlay: false,
  loop: false
}
```

## 示例代码

### 创建新页面

```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewPage',
  setup() {
    // 组件逻辑
    return {}
  }
})
```

### 使用Markdown解析

```typescript
import { parseMarkdown } from '@/utils/markdownParser'

const content = `
# 标题
这是内容
`

const result = parseMarkdown(content)
console.log(result.pages)
```

## 最佳实践

1. **内容组织** - 使用清晰的一级标题分隔页面
2. **代码规范** - 遵循项目的代码风格指南
3. **性能优化** - 注意组件的懒加载和代码分割
4. **可访问性** - 确保所有功能可通过键盘操作

## 常见问题

### 如何添加新页面？

只需在Markdown文件中添加新的一级标题（`#`）即可自动创建新页面。

### 如何自定义主题？

在 `tailwind.config.js` 中修改主题配置，或在CSS中覆盖CSS变量。

### 如何部署？

支持多种部署方式：

- 静态文件部署
- Netlify/Vercel云平台
- GitHub Pages

## 扩展功能

### 插件系统

支持通过插件扩展功能：

```javascript
const plugin = {
  name: 'example-plugin',
  install(app) {
    // 安装插件逻辑
  }
}
```

### 自定义组件

可以注册自定义组件供Markdown使用：

```vue
<template>
  <CustomComponent />
</template>
```

## 更新日志

### v1.1.0 (2025-04-22)

- ✨ 新增主题切换功能
- ✨ 优化全屏播放体验
- 🐛 修复已知问题

### v1.0.0 (2025-04-20)

- 🎉 初始版本发布
- ✨ 支持基本的Markdown解析
- ✨ 实现全屏播放功能
- ✨ 添加键盘导航支持

## 贡献指南

欢迎贡献代码！请阅读贡献指南了解如何参与项目。

## 许可证

MIT License - 详见 LICENSE 文件