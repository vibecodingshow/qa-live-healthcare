---
name: 演示站点搭建工具
description: 此技能用于从Markdown文件自动创建演示站点，支持全屏播放、页面切换和标题结构展示。
---

# 演示站点搭建工具

此技能应该用于当用户需要从Markdown文件创建交互式演示站点时。

## 功能特性

- 从README.md文件自动生成演示站点
- 支持全屏播放模式
- 一级标题作为独立页面，二级/三级标题作为页面内容
- 键盘左右键切换页面
- 现代化的技术栈实现

## 使用方式

当用户需要创建演示站点时，使用以下命令格式：

```bash
/asdm-build-demo <markdown文件路径>
```

示例：
```bash
/asdm-build-demo ./README.md
```

## 技术栈建议

建议使用以下技术栈：
- **前端框架**: Vue 3 + TypeScript + Vite
- **样式框架**: Tailwind CSS
- **Markdown解析**: marked.js 或 unified
- **路由管理**: Vue Router
- **状态管理**: Pinia
- **构建工具**: Vite

## 项目结构

生成的演示站点应包含：

```
demo-site/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── DemoPlayer.vue      # 全屏播放组件
│   │   ├── PageViewer.vue      # 页面展示组件
│   │   └── Navigation.vue      # 导航组件
│   ├── services/
│   │   └── markdownParser.ts   # Markdown解析服务
│   ├── stores/
│   │   └── demoStore.ts        # 状态管理
│   ├── views/
│   │   ├── Home.vue            # 首页
│   │   └── DemoPage.vue        # 演示页面
│   ├── App.vue
│   ├── main.ts
│   └── router/
│       └── index.ts
├── package.json
├── vite.config.ts
└── README.md
```

## 核心功能实现

### Markdown解析

使用markdown解析器将README.md文件解析为结构化数据：
- 一级标题（#）作为页面分隔点
- 二级标题（##）作为页面主标题
- 三级标题（###）作为内容小节
- 其他Markdown元素（列表、代码块、图片等）保持原样展示

### 全屏播放功能

实现全屏播放模式：
- 点击播放按钮进入全屏模式
- 支持键盘导航（左右键切换页面）
- 显示当前页码和总页数
- 提供退出全屏功能

### 页面导航

- 左侧显示页面目录导航
- 右侧显示当前页面内容
- 支持键盘快捷键操作

## 工具集目录结构

按照需求创建对应的toolset目录结构：

```
.asdm/toolsets/demo-builder/
├── README.md                    # 工具集说明文档
├── INSTALL.md                   # 安装指南
├── actions/                     # 动作指令目录
│   ├── build-demo.md           # 构建演示站点指令
│   ├── parse-markdown.md       # Markdown解析指令
│   └── deploy-demo.md          # 部署演示站点指令
└── spec/                        # 规范模板目录
    ├── demo-site-spec.md       # 演示站点规范模板
    └── project-structure.md    # 项目结构模板
```

## 实现步骤

1. **解析Markdown文件** - 提取标题结构和内容
2. **生成项目结构** - 创建Vue项目基础文件
3. **实现核心组件** - 开发演示播放器、页面展示等组件
4. **集成路由系统** - 配置页面路由和导航
5. **添加交互功能** - 实现全屏、键盘快捷键等
6. **优化样式和体验** - 使用Tailwind CSS美化界面

## 注意事项

- 确保Markdown文件格式正确，标题层级清晰
- 处理特殊Markdown元素（代码块、表格、图片等）
- 提供错误处理和加载状态
- 支持响应式设计，适配不同屏幕尺寸
- 考虑SEO友好性和页面访问性能