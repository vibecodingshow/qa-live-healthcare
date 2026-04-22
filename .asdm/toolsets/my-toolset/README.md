# ASDM Toolset - My Toolset

toolset-id: my-toolset
toolset-name: My Toolset
version: 0.0.1
updated-date: 2026-04-22
toolset-description: 用户可以使用一个 markdown文件作为输入完成此演示站点的搭建，站点本身可以使用任何技术栈

## 概述

[开发者完成此部分 - 2-3 段描述工具集的功能、目标用户和解决的问题]

My Toolset 是一个专门用于从 Markdown 文档快速生成交互式演示站点的工具集。它允许用户通过简单的 Markdown 文件创建专业的演示页面，支持全屏播放、页面导航和响应式设计。

## 功能

### 通用功能

- **一键构建**: 通过简单命令快速生成演示站点
- **响应式设计**: 适配不同屏幕尺寸的设备
- **全屏播放**: 支持全屏演示模式
- **键盘导航**: 使用左右键进行页面切换
- **实时预览**: 支持热重载的本地预览
- **主题定制**: 可自定义样式和配置

### 功能 1: Markdown 到演示站点转换

**输入**: Markdown 文件路径
**输出**: 完整的演示站点文件结构
**使用场景**: 需要将文档快速转换为交互式演示

用户可以使用一个 markdown 文件作为输入完成此演示站点的搭建。README.md 中的每一个一级标题将成为一个独立的演示页面，每个二级/三级标题成为页面的展示内容。

### 功能 2: 全屏播放功能

**输入**: 已构建的演示站点
**输出**: 全屏演示模式
**使用场景**: 需要进行正式的演示或展示

用户可以在站点首页上点击播放按钮，站点可以进入全屏播放状态。全屏模式下隐藏导航栏，显示当前页面进度。

### 功能 3: 键盘导航

**输入**: 键盘事件
**输出**: 页面切换响应
**使用场景**: 需要快速切换演示页面

用户可以使用左右键完成页面切换。左箭头键切换到上一页，右箭头键切换到下一页。

## 工具集安装流程

`INSTALL.md` 将按照以下步骤设置工具集：

[开发者简要描述安装过程 - 详细内容请参考 INSTALL.md]

## 工具集工作流

一旦 My Toolset 安装完成，用户可以使用以下命令：

[开发者列出可用的命令/工作流]

- `/asdm-build-demo <markdown-file>` - 基于 Markdown 文件构建演示站点
- `/asdm-preview-demo` - 预览演示站点
- `/asdm-customize-demo` - 自定义演示站点样式

## 工具集结构

My Toolset 工具集具有以下结构：

```
.asdm/
└── toolsets/
    └── my-toolset/
        ├── INSTALL.md
        ├── README.md
        ├── actions/
        │   ├── asdm-build-demo.md
        │   ├── asdm-preview-demo.md
        │   └── asdm-customize-demo.md
        └── spec/
            ├── demo-site-spec.md
            ├── markdown-parser-spec.md
            └── theme-templates.md
```

### 规格文档

工具集使用以下规格文档作为模板：

- **demo-site-spec**: 模板用于生成演示站点结构
- **markdown-parser-spec**: 模板用于定义 Markdown 解析规则
- **theme-templates**: 模板用于定义主题自定义规范

## 工具集工作区

My Toolset 工具集具有以下工作区结构：

```
.asdm/workspace/demo-sites/
├── templates/          # 演示站点模板
├── builds/             # 构建输出目录
├── configs/            # 配置文件和主题
└── examples/           # 示例 Markdown 文件
```

## 版权与许可

版权所有 (c) 2026 LeansoftX.com & iSoftStone。保留所有权利。

根据专有软件许可证授权。有关许可信息，请参阅项目根目录中的 [LICENSE](LICENSE)。