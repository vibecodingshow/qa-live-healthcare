# My Toolset 安装

**工具集 ID:** `my-toolset`

## 概述
本文档提供安装和设置 My Toolset 工具集的说明。My Toolset 是一个专门用于从 Markdown 文档快速生成交互式演示站点的工具集，支持全屏播放和键盘导航。

## AI 引导安装
要使用 AI 引导安装此工具集，请将以下提示复制并粘贴到您的 AI 编码工具的聊天窗口中：

```shell
Follow instructions in .asdm/toolsets/my-toolset/INSTALL.md
```

## 安装步骤

### 1. 创建工作区目录

创建演示站点工作区目录：

```bash
mkdir -p .asdm/workspace/demo-sites
mkdir -p .asdm/workspace/demo-sites/templates
mkdir -p .asdm/workspace/demo-sites/builds
mkdir -p .asdm/workspace/demo-sites/configs
mkdir -p .asdm/workspace/demo-sites/examples
```

### 2. 检测当前的 `Agentic Engine` 提供者

检测当前的 AI 编码助手提供者（例如：Claude Code、GitHub Copilot、Tencent CodeBuddy）。使用以下指南检测提供者：

- 如果 `.claude` 目录存在，使用 `Claude Code`
- 如果 `.github` 目录存在，使用 `GitHub Copilot`
- 如果 `.codebuddy` 目录存在，使用 `Tencent CodeBuddy`
- 如果在当前工作区中没有找到这样的文件夹，请提示用户手动选择提供者

### 3. 为 My Toolset（工具集 ID：`my-toolset`）在提供者的入口点创建快捷命令

根据检测到的提供者在适当位置创建快捷命令。安装过程在所有提供者中都是一致的 - 我们使用 `cat` 将提供者特定的前端元数据与实际指令内容连接起来：

#### 对于 Claude Code（`.claude/commands/`）：
Claude Code 使用带有 Frontmatter 元数据的 Markdown 文件作为斜杠命令。通过将 Claude 特定的前端元数据与指令内容连接来创建命令：

```bash
mkdir -p .claude/commands/

# 构建演示站点命令
cat > .claude/commands/asdm-build-demo.md << 'EOF'
---
description: "基于 Markdown 文件构建交互式演示站点"
argument-hint: "[markdown-file-path]"
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-build-demo.md >> .claude/commands/asdm-build-demo.md

# 预览演示站点命令
cat > .claude/commands/asdm-preview-demo.md << 'EOF'
---
description: "预览已构建的演示站点"
argument-hint: ""
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-preview-demo.md >> .claude/commands/asdm-preview-demo.md

# 自定义演示站点命令
cat > .claude/commands/asdm-customize-demo.md << 'EOF'
---
description: "自定义演示站点样式和配置"
argument-hint: ""
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-customize-demo.md >> .claude/commands/asdm-customize-demo.md
```

#### 对于 GitHub Copilot（`.github/prompts/`）：
GitHub Copilot 使用带有 YAML 前端元数据的 `.prompt.md` 文件。通过将 GitHub 特定的前端元数据与指令内容连接来创建提示文件：

```bash
mkdir -p .github/prompts/

# 构建演示站点提示
cat > .github/prompts/asdm-build-demo.prompt.md << 'EOF'
---
agent: 'agent'
description: '基于 Markdown 文件构建交互式演示站点'
argument-hint: 'markdown-file-path'
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-build-demo.md >> .github/prompts/asdm-build-demo.prompt.md

# 预览演示站点提示
cat > .github/prompts/asdm-preview-demo.prompt.md << 'EOF'
---
agent: 'agent'
description: '预览已构建的演示站点'
argument-hint: ''
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-preview-demo.md >> .github/prompts/asdm-preview-demo.prompt.md

# 自定义演示站点提示
cat > .github/prompts/asdm-customize-demo.prompt.md << 'EOF'
---
agent: 'agent'
description: '自定义演示站点样式和配置'
argument-hint: ''
---

EOF
cat .asdm/toolsets/my-toolset/actions/asdm-customize-demo.md >> .github/prompts/asdm-customize-demo.prompt.md
```

#### 对于 Tencent CodeBuddy（`.codebuddy/commands/`）：
CodeBuddy 不支持前端元数据，因此直接按原样复制指令文件：

```bash
mkdir -p .codebuddy/commands/

# 直接复制指令文件（不需要前端元数据）
cp .asdm/toolsets/my-toolset/actions/asdm-build-demo.md .codebuddy/commands/
cp .asdm/toolsets/my-toolset/actions/asdm-preview-demo.md .codebuddy/commands/
cp .asdm/toolsets/my-toolset/actions/asdm-customize-demo.md .codebuddy/commands/
```

### 4. 其他提供者的手动使用

如果您的 AI 编码助手提供者未被自动检测逻辑检测到（Claude Code、GitHub Copilot 或 Tencent CodeBuddy），您仍然可以手动使用 My Toolset。请按照以下步骤操作：

#### 直接指令使用
您可以通过复制其相对路径并将其粘贴到 AI 编码助手的聊天窗口中来直接使用指令文件：

1. **导航到指令文件**：
   ```bash
   cd .asdm/toolsets/my-toolset/actions/
   ```

2. **右键单击所需的指令文件**并复制其相对路径：
   - 对于构建演示站点：`asdm-build-demo.md`
   - 对于预览演示站点：`asdm-preview-demo.md`
   - 对于自定义演示站点：`asdm-customize-demo.md`

3. **在 AI 编码助手**中输入提示：
   ```
   Follow the instructions in {relative path to instruction file}
   ```

## 初始化 My Toolset

### 构建演示站点
安装后，您可以通过运行第一个动作开始：

```shell
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-build-demo.md
```

这将：
- 解析 Markdown 文件结构
- 生成多页演示站点
- 配置导航和播放功能
- 应用样式和主题

### 预览演示站点
完成第一个动作后，您可以运行后续动作：

```shell
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-preview-demo.md
```

这将：
- 启动本地开发服务器
- 在浏览器中打开演示站点
- 提供实时预览功能
- 测试交互功能

### 自定义演示站点
完成基本构建后，您可以自定义演示站点：

```shell
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-customize-demo.md
```

这将：
- 允许修改主题颜色和字体
- 配置布局和播放行为
- 生成自定义主题包
- 提供实时预览效果

### 可用命令
安装后，您可以使用以下命令：

1. **`/asdm-build-demo`** - 基于 Markdown 文件构建演示站点
2. **`/asdm-preview-demo`** - 预览已构建的演示站点
3. **`/asdm-customize-demo`** - 自定义演示站点样式和配置

## 工具集结构
工具集将在 `.asdm/workspace/demo-sites/` 中创建以下结构：

```
.asdm/workspace/demo-sites/
├── templates/          # 演示站点模板
├── builds/             # 构建输出目录
├── configs/            # 配置文件和主题
└── examples/           # 示例 Markdown 文件
```

## 规格文档
工具集使用以下规格文档作为模板：

1. **`demo-site-spec`** - 模板用于生成演示站点结构
2. **`markdown-parser-spec`** - 模板用于定义 Markdown 解析规则
3. **`theme-templates`** - 模板用于定义主题自定义规范

## 验证

安装后，验证：

1. My Toolset（工具集 ID：`my-toolset`）的 `demo-sites` 目录存在
2. My Toolset（工具集 ID：`my-toolset`）的快捷命令已创建在适当的提供者目录中（如果使用 Claude Code、GitHub Copilot 或 Tencent CodeBuddy）
3. My Toolset 工具集文件位于 `.asdm/toolsets/my-toolset`（工具集 ID：`my-toolset`）

**对于其他提供者**：验证您可以访问以下位置的指令文件：
- `.asdm/toolsets/my-toolset/actions/asdm-build-demo.md`
- `.asdm/toolsets/my-toolset/actions/asdm-preview-demo.md`
- `.asdm/toolsets/my-toolset/actions/asdm-customize-demo.md`

## 使用示例

### 示例 1：构建产品演示
```shell
# 首先，使用 AI 引导安装工具集
Follow instructions in .asdm/toolsets/my-toolset/INSTALL.md

# 然后运行构建动作
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-build-demo.md

# 使用斜杠命令时的示例提示：
/asdm-build-demo ./product-demo.md
```

### 示例 2：预览和自定义演示
```shell
# 预览演示站点
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-preview-demo.md

# 自定义演示站点样式
Follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-customize-demo.md

# 使用斜杠命令时的示例提示：
/asdm-preview-demo
/asdm-customize-demo
```

## 使用

### 对于支持的提供者（Claude Code、GitHub Copilot、Tencent CodeBuddy）
安装后，您可以使用以下命令：

- `/asdm-build-demo`: 基于 Markdown 文件构建交互式演示站点
- `/asdm-preview-demo`: 预览已构建的演示站点
- `/asdm-customize-demo`: 自定义演示站点样式和配置

### 对于其他提供者（手动使用）
如果您的提供者未被自动检测到，您可以通过按照上面"其他提供者的手动使用"部分中的步骤手动使用指令。

## 注意事项

- 此安装过程假设您具有创建目录和文件的必要权限
- 命令的实际实现将由 AI 模型使用 My Toolset（工具集 ID：`my-toolset`）中提供的模板和指令处理
- 确保根据您实际的 AI 编码助手自定义提供者特定的设置
- 工具集 ID `my-toolset` 在命令和文档中引用 My Toolset 时应一致使用
- **对于不在检测逻辑中的提供者**：用户可以通过复制其相对路径并输入类似"follow the instructions in .asdm/toolsets/my-toolset/actions/asdm-build-demo.md"的提示来手动使用指令文件

## 与其他工具集集成
My Toolset 可以与其他 ASDM 工具集和上下文文件集成。可以引用来自 Context Builder 的上下文文件，将生成的文档与实际项目相关联。

### 获取帮助
有关 My Toolset 工具集的问题，请参考：
- [ASDM 文档](https://asdm.ai/docs)
- 工具集 README：`.asdm/toolsets/my-toolset/README.md`
- 规格文档：`.asdm/toolsets/my-toolset/spec/`

## 许可证
版权所有 (c) 2026 LeansoftX.com & iSoftStone。保留所有权利。

根据专有软件许可证授权。有关许可信息，请参阅项目根目录中的 [LICENSE](LICENSE)。

---

*此安装文档是 My Toolset 工具集的一部分。*