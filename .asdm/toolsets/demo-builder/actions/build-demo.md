# 构建演示站点指令

## 指令名称
`/asdm-build-demo`

## 功能描述

从Markdown文件自动生成交互式演示站点。该指令会解析Markdown文件的结构，将一级标题作为独立页面，二级/三级标题作为页面内容，并生成完整的Vue 3项目。

## 语法格式

```bash
/asdm-build-demo <markdown文件路径> [选项]
```

## 参数说明

### 必需参数

- `<markdown文件路径>`: 要转换为演示站点的Markdown文件路径，支持相对路径和绝对路径

### 可选选项

- `--output <目录>`: 指定输出目录，默认为 `demo-site`
- `--title <标题>`: 设置演示站点的标题，默认为Markdown文件的第一个一级标题
- `--port <端口号>`: 设置开发服务器端口，默认为3000
- `--theme <主题>`: 设置主题样式，可选值：`light`（默认）、`dark`、`auto`

## 使用示例

### 基本使用

```bash
# 使用默认设置构建演示站点
/asdm-build-demo ./README.md
```

### 自定义输出目录

```bash
# 指定输出目录为 my-presentation
/asdm-build-demo ./README.md --output my-presentation
```

### 自定义标题和端口

```bash
# 设置标题和端口
/asdm-build-demo ./docs/presentation.md --title "产品演示" --port 8080
```

## 处理流程

### 1. 文件验证
- 检查Markdown文件是否存在
- 验证文件格式和编码
- 检查文件大小（限制为10MB以内）

### 2. Markdown解析
- 解析Markdown文件结构
- 提取一级标题作为页面分隔点
- 解析二级/三级标题作为页面内容
- 处理代码块、表格、图片等元素

### 3. 项目生成
- 创建Vue 3项目基础结构
- 生成路由配置文件
- 创建页面组件
- 配置构建工具（Vite）

### 4. 功能集成
- 集成全屏播放组件
- 添加键盘导航功能
- 配置响应式样式
- 优化页面加载性能

## 生成的文件结构

```
<output-directory>/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── DemoPlayer.vue
│   │   ├── PageViewer.vue
│   │   └── Navigation.vue
│   ├── services/
│   │   └── markdownParser.ts
│   ├── stores/
│   │   └── demoStore.ts
│   ├── views/
│   │   ├── Home.vue
│   │   └── DemoPage.vue
│   ├── App.vue
│   ├── main.ts
│   └── router/
│       └── index.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 错误处理

### 常见错误及解决方案

1. **文件不存在错误**
   ```
   Error: Markdown file not found: ./nonexistent.md
   ```
   **解决方案**: 检查文件路径是否正确

2. **文件格式错误**
   ```
   Error: Invalid Markdown format
   ```
   **解决方案**: 确保文件是有效的Markdown格式

3. **权限错误**
   ```
   Error: Permission denied while creating directory
   ```
   **解决方案**: 检查输出目录的写入权限

4. **内存不足错误**
   ```
   Error: Memory allocation failed
   ```
   **解决方案**: 减少Markdown文件大小或增加系统内存

## 性能优化

- 使用流式解析处理大文件
- 缓存解析结果避免重复处理
- 异步生成文件提高响应速度
- 压缩静态资源减少加载时间

## 注意事项

1. **Markdown格式要求**
   - 使用标准的Markdown语法
   - 标题层级要清晰有序
   - 避免使用过于复杂的嵌套结构

2. **文件大小限制**
   - 建议Markdown文件小于5MB
   - 超大文件可能影响构建性能

3. **特殊字符处理**
   - 会自动转义HTML特殊字符
   - 支持Unicode字符
   - 处理中英文混排

## 扩展功能

### 插件系统
支持通过插件扩展功能：
- 自定义主题插件
- 动画效果插件
- 导出格式插件

### API集成
提供REST API用于自动化构建：
- 文件上传接口
- 构建状态查询
- 结果下载接口

## 版本兼容性

- Node.js: >= 16.0.0
- npm: >= 7.0.0
- 浏览器: Chrome >= 88, Firefox >= 78, Safari >= 14

## 相关指令

- `/asdm-parse-markdown`: 单独解析Markdown文件
- `/asdm-deploy-demo`: 部署演示站点到服务器