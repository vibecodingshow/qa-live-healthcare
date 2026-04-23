# Markdown解析指令

## 指令名称
`/asdm-parse-markdown`

## 功能描述

解析Markdown文件并提取结构化数据，用于演示站点的内容组织。该指令专门处理Markdown文件的标题层级结构，为后续的演示站点生成提供数据基础。

## 语法格式

```bash
/asdm-parse-markdown <markdown文件路径> [选项]
```

## 参数说明

### 必需参数

- `<markdown文件路径>`: 要解析的Markdown文件路径

### 可选选项

- `--output <文件>`: 指定输出JSON文件路径
- `--format <格式>`: 输出格式，可选值：`json`（默认）、`yaml`、`xml`
- `--depth <层级>`: 解析的最大标题层级，默认为3
- `--include-content`: 包含段落内容（默认只包含标题结构）

## 使用示例

### 基本解析

```bash
# 解析Markdown文件并输出到控制台
/asdm-parse-markdown ./README.md
```

### 输出到文件

```bash
# 解析并保存为JSON文件
/asdm-parse-markdown ./presentation.md --output structure.json
```

### 包含详细内容

```bash
# 包含段落内容和代码块
/asdm-parse-markdown ./docs.md --include-content --depth 4
```

## 解析规则

### 标题层级处理

- **一级标题 (#)**: 作为页面分隔点，生成独立页面
- **二级标题 (##)**: 作为页面主标题
- **三级标题 (###)**: 作为内容小节
- **四级标题及以下**: 作为普通内容处理

### 内容提取

- **段落文本**: 提取为纯文本内容
- **代码块**: 保留原始格式和语言标识
- **列表**: 转换为结构化数据
- **表格**: 转换为二维数组结构
- **图片**: 提取URL和alt文本
- **链接**: 提取URL和链接文本

## 输出格式

### JSON格式示例

```json
{
  "metadata": {
    "title": "演示文档",
    "pageCount": 3,
    "parseTime": "2025-04-22T10:30:00Z"
  },
  "pages": [
    {
      "id": "page-1",
      "title": "介绍",
      "level": 1,
      "content": [
        {
          "type": "paragraph",
          "text": "欢迎使用演示站点搭建工具。"
        },
        {
          "type": "heading",
          "level": 2,
          "text": "功能特性",
          "children": [
            {
              "type": "list",
              "items": [
                "自动从Markdown生成演示站点",
                "支持全屏播放模式",
                "键盘导航支持"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 数据结构说明

#### 页面对象 (Page)

```typescript
interface Page {
  id: string;           // 页面唯一标识
  title: string;        // 页面标题
  level: number;        // 标题层级（1-6）
  lineNumber: number;   // 在原始文件中的行号
  content: Content[];   // 页面内容
}
```

#### 内容类型 (Content)

```typescript
type Content = 
  | ParagraphContent
  | HeadingContent
  | CodeContent
  | ListContent
  | TableContent
  | ImageContent
  | LinkContent;
```

## 高级功能

### 自定义解析器

支持通过插件扩展解析功能：

```javascript
// 自定义解析器示例
const customParser = {
  name: 'diagram-parser',
  pattern: /```mermaid\n([\s\S]*?)\n```/g,
  parse: (match) => {
    return {
      type: 'mermaid',
      code: match[1]
    };
  }
};
```

### 语法高亮

自动识别代码块语言并生成语法高亮信息：

```json
{
  "type": "code",
  "language": "typescript",
  "code": "console.log('Hello World');",
  "highlighted": "<span class=\"keyword\">console</span>.<span class=\"function\">log</span>..."
}
```

### 链接解析

智能处理相对路径和绝对路径：

- 相对路径转换为基于基础URL的绝对路径
- 外部链接添加target="_blank"属性
- 锚点链接生成对应的页面内导航

## 错误处理

### 常见解析错误

1. **标题层级错误**
   ```
   Warning: Skipping H3 without parent H2 at line 25
   ```

2. **编码错误**
   ```
   Error: Unable to decode file with current encoding
   ```

3. **语法错误**
   ```
   Warning: Unclosed code block at line 42
   ```

### 恢复策略

- 跳过无法解析的内容并继续处理
- 记录警告信息供用户参考
- 提供错误位置定位

## 性能优化

### 流式处理

对于大文件，使用流式处理避免内存溢出：

```javascript
const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
const parser = new MarkdownParser();

stream.pipe(parser).on('data', (chunk) => {
  // 处理解析出的数据块
});
```

### 缓存机制

- 缓存解析结果避免重复处理
- 支持增量更新
- 文件哈希校验

## 集成使用

### 与构建指令配合

```bash
# 先解析Markdown文件
/asdm-parse-markdown ./presentation.md --output structure.json

# 使用解析结果构建演示站点
/asdm-build-demo --input structure.json --output demo-site
```

### API调用

提供编程接口供其他工具调用：

```javascript
const { parseMarkdown } = require('@asdm/markdown-parser');

const result = await parseMarkdown('./docs.md', {
  depth: 3,
  includeContent: true
});
```

## 扩展支持

### 支持的Markdown扩展

- GitHub Flavored Markdown (GFM)
- 数学公式 (LaTeX)
- 脚注
- 任务列表
- 表情符号
- 自定义容器

### 插件系统

支持通过插件添加新功能：

- 图表渲染插件
- 视频嵌入插件
- 交互式组件插件
- 主题样式插件

## 版本历史

### v1.0.0 (2025-04-22)
- 基础Markdown解析功能
- 标题层级结构提取
- 多种输出格式支持
- 错误恢复机制