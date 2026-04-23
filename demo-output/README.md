# ASDM Demo Builder 演示站点

这是一个基于 `demo-installation-guide.md` 文件自动生成的交互式演示站点。

## 🚀 快速开始

### 在浏览器中打开演示

直接在浏览器中打开 `index.html` 文件：

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 使用本地服务器（推荐）

```bash
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8080
```

然后在浏览器中访问：`http://localhost:8080`

## 📖 使用指南

### 键盘快捷键

- **← / →** 或 **PageUp / PageDown**：切换页面
- **空格键**：下一页
- **Home**：第一页
- **End**：最后一页
- **ESC**：退出全屏模式

### 触摸手势（移动设备）

- **左滑**：下一页
- **右滑**：上一页
- **点击**：进入全屏演示

### 鼠标操作

- **点击播放按钮**：进入全屏演示模式
- **点击页面卡片**：直接跳转到对应页面
- **使用导航按钮**：切换上一页/下一页

## 🎨 功能特性

✅ **Markdown 转演示站点** - 自动将 Markdown 文档转换为交互式演示
✅ **全屏演示模式** - 支持全屏播放，适合演讲和展示
✅ **键盘导航** - 使用键盘快捷键快速切换页面
✅ **触摸支持** - 移动设备支持滑动手势
✅ **响应式设计** - 适配桌面、平板和手机等不同设备
✅ **进度指示** - 实时显示当前页面和总页面数
✅ **页面预览** - 首页提供所有页面的概览卡片

## 📁 文件结构

```
demo-output/
├── index.html              # 演示站点首页
├── config.json             # 站点配置文件
├── README.md               # 使用说明（本文件）
├── assets/                 # 资源目录
│   ├── css/
│   │   └── styles.css      # 样式表
│   └── js/
│       ├── main.js         # 主逻辑
│       └── navigation.js   # 导航功能
└── pages/                  # 演示页面
    ├── page1.html         # 第1页：概述
    ├── page2.html         # 第2页：安装步骤
    ├── page3.html         # 第3页：使用方法
    ├── page4.html         # 第4页：功能特性
    ├── page5.html         # 第5页：输出结构
    ├── page6.html         # 第6页：自定义配置
    ├── page7.html         # 第7页：故障排除
    ├── page8.html         # 第8页：示例演示
    ├── page9.html         # 第9页：技术架构
    └── page10.html        # 第10页：扩展开发
```

## ⚙️ 自定义配置

编辑 `config.json` 文件来自定义演示站点：

```json
{
  "title": "自定义标题",
  "theme": {
    "primaryColor": "#your-color"
  }
}
```

## 🔧 故障排除

### 页面内容无法加载

确保所有文件都正确放置，包括 `pages/` 目录下的所有 HTML 文件。

### 全屏模式不工作

某些浏览器可能不支持全屏 API，尝试使用不同的浏览器（如 Chrome、Firefox）。

### 键盘导航不响应

确保焦点在演示区域，尝试点击页面后再次使用键盘导航。

## 📝 技术信息

- **构建工具**：ASDM Demo Builder
- **前端框架**：原生 HTML/CSS/JavaScript
- **支持浏览器**：Chrome, Firefox, Safari, Edge
- **响应式断点**：桌面（>768px）、平板（>480px）、手机（≤480px）

## 📄 许可证

本演示站点由 ASDM Demo Builder 自动生成。

## 🤝 支持与反馈

如遇到问题或需要帮助，请联系 ASDM 工具集维护团队。

---

**构建时间**：2026-04-23  
**ASDM Demo Builder 版本**：1.0.0