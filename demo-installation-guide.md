# ASDM Demo Builder 工具集安装指南

## 概述

ASDM Demo Builder 是一个专门用于将 Markdown 文件转换为交互式演示站点的工具集。它提供了以下核心功能：

- **自动页面生成**：每个 H1 标题成为一个独立的演示页面
- **交互式导航**：支持键盘左右键切换页面
- **全屏演示模式**：点击播放按钮进入全屏演示
- **响应式设计**：适配桌面和移动设备

## 安装步骤

### 1. 验证工具集结构

工具集已创建在以下位置：

```
.asdm/toolsets/demo-builder/
├── README.md                 # 工具集说明文档
├── INSTALL.md                # 安装指南
├── actions/
│   └── asdm-build-demo.md     # 构建指令
├── templates/
│   ├── demo-template.html     # 演示站点模板
│   ├── demo-styles.css        # 样式文件
│   └── demo-script.js         # 交互脚本
├── scripts/
│   ├── build-demo.js          # 构建脚本
│   └── asdm-build-demo.js     # 命令行接口
└── examples/
    └── sample-demo.md         # 示例文件
```

### 2. CodeBuddy 命令集成

已创建 CodeBuddy 命令文件：

```
.codebuddy/commands/asdm-build-demo.md
```

### 3. 测试安装

使用示例文件测试工具集：

```bash
node .asdm/toolsets/demo-builder/scripts/build-demo.js .asdm/toolsets/demo-builder/examples/sample-demo.md
```

## 使用方法

### 基本用法

```bash
# 使用 CodeBuddy 命令
/asdm-build-demo ./README.md

# 直接使用 Node.js 脚本
node .asdm/toolsets/demo-builder/scripts/build-demo.js presentation.md
```

### 高级选项

```bash
# 自定义输出目录和标题
/asdm-build-demo ./README.md -o my-demo -t "我的演示"

# 显示帮助信息
/asdm-build-demo --help
```

## 功能特性

### 1. Markdown 解析

- **H1 标题** (`# Title`) → 演示页面
- **H2 标题** (`## Section`) → 内容区域
- **H3 标题** (`### Subsection`) → 子区域
- **普通文本** → 段落内容

### 2. 交互功能

- **键盘导航**：
  - 左箭头 / PageUp：上一页
  - 右箭头 / PageDown / 空格键：下一页
  - Home：第一页
  - End：最后一页

- **全屏模式**：
  - F11 / Ctrl+F：切换全屏
  - ESC：退出全屏
  - 点击播放按钮进入演示模式

- **触摸支持**：移动设备支持滑动手势

### 3. 响应式设计

- 适配桌面、平板、手机等多种设备
- 自动调整字体大小和布局
- 优化触摸交互体验

## 输出结构

构建完成后，会在指定目录生成以下文件：

```
demo-output/
├── index.html          # 演示站点主文件
├── demo-styles.css     # 样式表
├── demo-script.js      # 交互脚本
└── README.md           # 使用说明
```

## 自定义配置

### 修改样式

编辑 `.asdm/toolsets/demo-builder/templates/demo-styles.css` 文件来自定义演示站点的外观。

### 修改模板

编辑 `.asdm/toolsets/demo-builder/templates/demo-template.html` 文件来自定义页面结构。

### 修改交互逻辑

编辑 `.asdm/toolsets/demo-builder/templates/demo-script.js` 文件来自定义交互行为。

## 故障排除

### 常见问题

1. **命令未找到**
   - 确保 `.codebuddy/commands/asdm-build-demo.md` 文件存在
   - 检查文件权限

2. **Markdown 文件解析失败**
   - 确保文件包含至少一个 H1 标题
   - 检查文件编码（推荐 UTF-8）

3. **输出目录权限问题**
   - 确保对输出目录有写入权限
   - 尝试使用不同的输出目录

### 调试模式

添加 `--verbose` 参数获取详细日志：

```bash
node .asdm/toolsets/demo-builder/scripts/build-demo.js file.md --verbose
```

## 示例演示

工具集包含一个完整的示例文件：

```bash
# 构建示例演示
node .asdm/toolsets/demo-builder/scripts/build-demo.js .asdm/toolsets/demo-builder/examples/sample-demo.md

# 在浏览器中打开演示
open demo-output/index.html
```

## 技术架构

### 构建流程

1. **解析阶段**：读取并解析 Markdown 文件结构
2. **模板渲染**：根据模板生成 HTML 页面
3. **资源复制**：复制 CSS 和 JavaScript 文件
4. **输出生成**：创建完整的演示站点

### 前端技术

- **HTML5**：语义化标记
- **CSS3**：现代样式和动画
- **JavaScript ES6+**：交互功能
- **响应式设计**：移动端适配

## 扩展开发

### 添加新功能

1. 修改对应的模板文件
2. 更新构建脚本以支持新功能
3. 测试确保兼容性

### 集成到工作流

可以将 Demo Builder 集成到：

- CI/CD 流水线
- 文档生成流程
- 自动化部署系统

## 支持与反馈

如遇到问题或需要新功能，请联系 ASDM 工具集维护团队。