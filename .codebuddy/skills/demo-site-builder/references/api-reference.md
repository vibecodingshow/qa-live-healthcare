# API参考文档

## 概述

本文档提供演示站点搭建工具的完整API参考，包括JavaScript API、命令行接口和配置选项。

## 目录

- [JavaScript API](#javascript-api)
- [命令行接口](#命令行接口)
- [配置选项](#配置选项)
- [类型定义](#类型定义)

---

## JavaScript API

### parseMarkdown

解析Markdown文件并生成结构化数据。

```typescript
import { parseMarkdown } from '@demo-site/markdown-parser'

const result = await parseMarkdown(markdownContent, options)
```

**参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `markdownContent` | `string` | 是 | Markdown文件内容 |
| `options` | `ParseOptions` | 否 | 解析选项 |

**返回:** `Promise<ParseResult>`

**示例:**

```typescript
const markdown = `
# 第一页
这是第一页的内容

## 子标题
这是子标题下的内容
`

const result = await parseMarkdown(markdown, {
  maxHeadingLevel: 3,
  includeRawContent: true
})

console.log(result.metadata.pageCount) // 1
console.log(result.pages[0].title) // "第一页"
```

---

### renderMarkdown

将Markdown内容渲染为HTML。

```typescript
import { renderMarkdown } from '@demo-site/markdown-parser'

const html = renderMarkdown(markdownContent, options)
```

**参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `markdownContent` | `string` | 是 | Markdown内容 |
| `options` | `RenderOptions` | 否 | 渲染选项 |

**返回:** `string`

**示例:**

```typescript
const html = renderMarkdown('# 标题\\n这是一段文本', {
  gfm: true,
  breaks: true
})
```

---

### createDemoSite

创建演示站点项目。

```typescript
import { createDemoSite } from '@demo-site/cli'

await createDemoSite({
  input: './README.md',
  output: './demo-site',
  config: {
    title: '我的演示',
    theme: 'dark'
  }
})
```

**参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options` | `CreateOptions` | 是 | 创建选项 |

**返回:** `Promise<void>`

---

## 命令行接口

### asdm-build-demo

构建演示站点。

```bash
asdm-build-demo <input-file> [options]
```

**参数:**

| 参数 | 说明 |
|------|------|
| `input-file` | 输入的Markdown文件路径 |

**选项:**

| 选项 | 说明 |
|------|------|
| `-o, --output <directory>` | 输出目录 |
| `-t, --title <title>` | 站点标题 |
| `-p, --port <port>` | 开发服务器端口 |
| `--theme <theme>` | 主题模式 (light/dark/auto) |
| `--no-install` | 跳过依赖安装 |
| `-h, --help` | 显示帮助信息 |

**示例:**

```bash
# 基本使用
asdm-build-demo ./README.md

# 自定义输出和标题
asdm-build-demo ./README.md -o my-demo -t "我的演示"

# 使用深色主题
asdm-build-demo ./README.md --theme dark

# 指定端口
asdm-build-demo ./README.md -p 8080
```

---

### asdm-parse-markdown

解析Markdown文件。

```bash
asdm-parse-markdown <input-file> [options]
```

**参数:**

| 参数 | 说明 |
|------|------|
| `input-file` | 输入的Markdown文件路径 |

**选项:**

| 选项 | 说明 |
|------|------|
| `-o, --output <file>` | 输出文件路径 |
| `-f, --format <format>` | 输出格式 (json/yaml/xml) |
| `-d, --depth <level>` | 最大标题层级 |
| `--include-content` | 包含详细内容 |
| `-h, --help` | 显示帮助信息 |

**示例:**

```bash
# 输出到控制台
asdm-parse-markdown ./README.md

# 保存为JSON
asdm-parse-markdown ./README.md -o structure.json

# 包含详细内容
asdm-parse-markdown ./README.md --include-content -d 4
```

---

### asdm-deploy-demo

部署演示站点。

```bash
asdm-deploy-demo <site-directory> [options]
```

**参数:**

| 参数 | 说明 |
|------|------|
| `site-directory` | 演示站点目录 |

**选项:**

| 选项 | 说明 |
|------|------|
| `-t, --target <target>` | 部署目标 |
| `-d, --domain <domain>` | 自定义域名 |
| `-e, --env <env>` | 部署环境 |
| `--build` | 部署前构建 |
| `--minify` | 压缩代码 |
| `-h, --help` | 显示帮助信息 |

**示例:**

```bash
# 本地部署
asdm-deploy-demo ./demo-site -t local

# 部署到Netlify
asdm-deploy-demo ./demo-site -t netlify --domain demo.example.com

# 构建后部署
asdm-deploy-demo ./demo-site --build --minify
```

---

## 配置选项

### 项目配置 (demo.config.js)

```javascript
export default {
  // 站点标题
  title: '我的演示站点',
  
  // 站点描述
  description: '基于Markdown的交互式演示',
  
  // 作者
  author: '张三',
  
  // 版本
  version: '1.0.0',
  
  // 主题配置
  theme: {
    // 主题模式
    mode: 'light', // light | dark | auto
    
    // 主色调
    primaryColor: '#3b82f6',
    
    // 次要色调
    secondaryColor: '#64748b',
    
    // 背景色
    backgroundColor: '#ffffff',
    
    // 文字色
    textColor: '#1f2937'
  },
  
  // 导航配置
  navigation: {
    // 启用键盘导航
    keyboard: true,
    
    // 启用自动播放
    autoPlay: false,
    
    // 自动播放间隔（毫秒）
    autoPlayInterval: 5000,
    
    // 循环播放
    loop: false,
    
    // 显示页码
    showPageNumber: true,
    
    // 显示进度条
    showProgressBar: true
  },
  
  // 播放器配置
  player: {
    // 支持全屏
    fullscreen: true,
    
    // 全屏模式
    fullscreenMode: 'browser',
    
    // 显示控制栏
    showControls: true,
    
    // 显示导航按钮
    showNavigationButtons: true,
    
    // 显示快捷键提示
    showKeyboardHints: true
  },
  
  // 构建选项
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 是否压缩
    minify: true,
    
    // 是否生成sourcemap
    sourcemap: false
  }
}
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | 演示站点 |
| `VITE_API_BASE_URL` | API基础URL | /api |
| `VITE_ANALYTICS_ID` | 分析ID | - |
| `VITE_DEBUG` | 调试模式 | false |

---

## 类型定义

### PageConfig

页面配置接口。

```typescript
interface PageConfig {
  id: string
  title: string
  level: number
  content: string
  html?: string
  lineNumber: number
  children?: PageConfig[]
  metadata?: Record<string, any>
}
```

### DemoConfig

演示配置接口。

```typescript
interface DemoConfig {
  title: string
  description?: string
  author?: string
  version?: string
  theme?: ThemeConfig
  navigation?: NavigationConfig
  player?: PlayerConfig
}
```

### ParseOptions

解析选项接口。

```typescript
interface ParseOptions {
  maxHeadingLevel?: number
  includeRawContent?: boolean
  parseHtml?: boolean
  codeHighlight?: CodeHighlightConfig
}
```

### NavigationEvent

导航事件接口。

```typescript
interface NavigationEvent {
  type: 'next' | 'prev' | 'goto' | 'first' | 'last'
  targetIndex?: number
  originalEvent?: Event
}
```

---

## 错误处理

### 常见错误

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| `E001` | 文件不存在 | 检查输入文件路径 |
| `E002` | 解析失败 | 检查Markdown格式 |
| `E003` | 构建失败 | 查看构建日志 |
| `E004` | 部署失败 | 检查网络连接 |
| `E005` | 权限不足 | 检查文件权限 |

### 错误处理示例

```typescript
import { parseMarkdown } from '@demo-site/markdown-parser'

try {
  const result = await parseMarkdown(content)
} catch (error) {
  if (error.code === 'E002') {
    console.error('Markdown格式错误:', error.message)
  } else {
    throw error
  }
}
```

---

## 最佳实践

### 性能优化

1. **代码分割**: 使用动态导入减少初始加载时间
2. **资源压缩**: 启用代码压缩和图片优化
3. **缓存策略**: 合理设置缓存头

### 安全建议

1. **输入验证**: 始终验证用户输入
2. **XSS防护**: 渲染用户内容时使用转义
3. **敏感信息**: 不在前端存储敏感数据

---

## 更新日志

### v1.1.0 (2025-04-22)

- 新增主题配置API
- 优化Markdown解析性能
- 修复已知问题

### v1.0.0 (2025-04-20)

- 初始版本发布
- 支持基本的解析和渲染功能
- 支持全屏播放
