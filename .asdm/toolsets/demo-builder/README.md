# 演示站点搭建工具集

## 概述

这是一个用于从Markdown文件自动生成交互式演示站点的工具集。用户可以通过简单的命令快速将README.md等Markdown文档转换为功能完整的演示网站。

## 主要特性

- 📁 **Markdown驱动** - 使用Markdown文件作为内容源
- 🎬 **全屏播放** - 支持全屏演示模式
- 📄 **智能分页** - 一级标题自动分页，二级/三级标题作为内容
- ⌨️ **键盘导航** - 左右键切换页面
- 🎨 **现代化界面** - 基于Vue 3和Tailwind CSS的现代设计
- ⚡ **快速构建** - 使用Vite构建，开发体验优秀

## 快速开始

```bash
# 构建演示站点
/asdm-build-demo ./README.md

# 启动开发服务器
cd demo-site
npm install
npm run dev
```

## 目录结构

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

## 使用示例

### 基本使用

1. 准备一个结构清晰的Markdown文件
2. 运行构建命令
3. 生成的演示站点将自动包含所有内容

### Markdown文件要求

```markdown
# 页面1标题
这是页面1的内容

## 页面1的子标题
这是页面1的子内容

### 页面1的小节
这是页面1的小节内容

# 页面2标题
这是页面2的内容

## 页面2的子标题
这是页面2的子内容
```

### 支持的Markdown元素

- 标题（#、##、###）
- 列表（有序、无序）
- 代码块（支持语法高亮）
- 表格
- 图片
- 链接
- 引用块
- 粗体、斜体等文本格式化

## 技术实现

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **Markdown解析**: marked.js
- **路由管理**: Vue Router
- **状态管理**: Pinia

## 许可证

MIT License