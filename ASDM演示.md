# ASDM 产品介绍

ASDM（Advanced Software Development Manager）是一款面向开发团队的智能开发工具集平台，旨在通过工具化、自动化的方式提升开发效率，标准化团队协作流程。

## 核心功能

### 1. 智能代码助手
- 基于 AI 的代码补全与生成
- 多语言支持（JavaScript、TypeScript、Vue、Python 等）
- 实时代码分析与优化建议

### 2. 工具集生态系统
- 可扩展的工具集架构
- 丰富的预设工具集（presentation-builder、prd-builder 等）
- 自定义工具集开发支持

### 3. 自动化工作流
- 标准化开发流程模板
- 自动化任务执行
- 持续集成支持

---

# 工具集架构

## 目录结构

```
.asdm/
├── toolsets/              # 工具集目录
│   ├── presentation-builder/   # 演示构建工具集
│   │   ├── actions/             # 操作指令
│   │   ├── specs/               # 规格说明
│   │   └── templates/           # 模板文件
│   └── prd-builder/             # PRD 文档工具集
└── workspace/             # 工作空间配置
```

## 核心组件

| 组件 | 功能 | 说明 |
|------|------|------|
| `actions/` | 指令定义 | 存放工具集的操作命令 |
| `specs/` | 规格说明 | 定义工具集的使用规范 |
| `templates/` | 模板库 | 预置的代码和文档模板 |
| `toolsets.json` | 配置 | 工具集的元数据配置 |

---

# 使用流程

## 1. 安装工具集

```bash
/asdm toolset install <toolset-name>
```

## 2. 启用工具集

```bash
/asdm toolset enable <toolset-name>
```

## 3. 使用指令

```bash
/asdm-build-demo README.md
```

## 4. 查看帮助

```bash
/asdm help
```

---

# 演示总结

## 本次演示内容

1. **工具集安装与启用**
   - `presentation-builder` 工具集
   - 命令注册流程

2. **演示站点生成**
   - Markdown 转全屏演示
   - 左右键翻页
   - 全屏播放模式

3. **模板系统**
   - HTML 模板
   - CSS 样式
   - JavaScript 逻辑

## 技术亮点

- 纯前端实现，无需后端依赖
- 响应式设计，支持多端访问
- Markdown 实时解析
- 全屏沉浸式体验

## 下一步

- 体验更多工具集
- 自定义工具集开发
- 集成到现有项目工作流

---

**感谢观看！**
