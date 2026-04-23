# 演示站点规范模板

## 概述

本文档定义了演示站点的技术规范和实现要求，确保生成的演示站点具有一致的用户体验和代码质量。

## 技术架构

### 前端框架
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **包管理器**: npm 或 yarn
- **语言**: TypeScript 4.5+

### 核心依赖

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "marked": "^9.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@types/marked": "^4.0.0"
  }
}
```

## 项目结构规范

### 目录结构

```
demo-site/
├── public/                 # 静态资源
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/            # 资源文件
│   │   ├── images/
│   │   └── styles/
│   ├── components/        # 可复用组件
│   │   ├── common/        # 通用组件
│   │   ├── layout/        # 布局组件
│   │   └── demo/          # 演示专用组件
│   ├── composables/       # 组合式函数
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue
│   └── main.ts
├── tests/                 # 测试文件
├── docs/                  # 项目文档
├── .env.example          # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 文件命名规范

- **组件文件**: PascalCase，如 `DemoPlayer.vue`
- **工具函数**: camelCase，如 `markdownParser.ts`
- **类型定义**: PascalCase，如 `AppointmentTypes.ts`
- **配置文件**: kebab-case，如 `vite.config.ts`

## 功能规范

### 1. Markdown解析

#### 标题解析规则

```typescript
interface Heading {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id: string;
  lineNumber: number;
  children: Content[];
}
```

#### 内容类型支持

- [x] 段落文本
- [x] 标题（H1-H6）
- [x] 代码块（支持语法高亮）
- [x] 列表（有序、无序）
- [x] 表格
- [x] 图片
- [x] 链接
- [x] 引用块
- [x] 分割线
- [ ] 数学公式（扩展功能）
- [ ] 图表（扩展功能）

### 2. 页面路由

#### 路由配置

```typescript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/page/:pageId',
    name: 'DemoPage',
    component: () => import('@/views/DemoPage.vue'),
    props: true
  }
];
```

#### 导航功能

- 支持URL直接访问特定页面
- 浏览器前进/后退导航
- 页面间平滑过渡动画
- 当前页面高亮显示

### 3. 全屏播放模式

#### 功能要求

- 一键进入/退出全屏模式
- 键盘快捷键支持（ESC退出，左右键切换）
- 显示当前页码和进度条
- 自动播放模式（可选）
- 演讲者视图（扩展功能）

#### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 播放/暂停 |
| `→` | 下一页 |
| `←` | 上一页 |
| `ESC` | 退出全屏 |
| `F11` | 切换全屏 |
| `F` | 进入全屏模式 |

### 4. 响应式设计

#### 断点设置

```css
/* Tailwind CSS断点 */
@screen sm { /* 640px */ }
@screen md { /* 768px */ }
@screen lg { /* 1024px */ }
@screen xl { /* 1280px */ }
@screen 2xl { /* 1536px */ }
```

#### 适配要求

- 移动端：320px - 768px
- 平板端：768px - 1024px
- 桌面端：1024px+
- 大屏显示：1536px+

## 代码规范

### TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### Vue组件规范

#### 组件结构

```vue
<template>
  <div class="demo-player">
    <!-- 组件模板 -->
  </div>
</template>

<script setup lang="ts">
// 组合式API
import { ref, computed } from 'vue'

// Props定义
interface Props {
  title: string
  pages: Page[]
}

const props = defineProps<Props>()

// 响应式数据
const currentPage = ref(0)

// 计算属性
const totalPages = computed(() => props.pages.length)

// 方法
function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}
</script>

<style scoped>
.demo-player {
  /* 组件样式 */
}
</style>
```

### 样式规范

#### CSS命名规范

- 使用BEM命名方法论
- 类名使用kebab-case
- 避免使用ID选择器
- 优先使用Tailwind CSS工具类

#### 主题系统

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1f2937;
}

.dark {
  --background-color: #1f2937;
  --text-color: #f9fafb;
}
```

## 性能规范

### 加载性能要求

- 首屏加载时间：< 3秒
- 首次内容绘制（FCP）：< 1.5秒
- 最大内容绘制（LCP）：< 2.5秒
- 累积布局偏移（CLS）：< 0.1

### 优化措施

#### 代码分割

```javascript
// 动态导入实现代码分割
const DemoPage = () => import('@/views/DemoPage.vue')
```

#### 资源优化

- 图片懒加载
- 字体文件子集化
- CSS/JS压缩和合并
- 使用CDN加速静态资源

#### 缓存策略

- 静态资源长期缓存
- API响应合理缓存
- Service Worker离线支持（扩展功能）

## 可访问性规范

### WCAG 2.1 AA级合规

#### 键盘导航

- 所有功能可通过键盘访问
- 清晰的焦点指示器
- 合理的Tab顺序

#### 屏幕阅读器支持

- 语义化HTML结构
- 适当的ARIA属性
- 有意义的链接文本

#### 颜色对比度

- 文本与背景对比度至少4.5:1
- 大文本对比度至少3:1
- 非文本元素对比度至少3:1

## 测试规范

### 单元测试

```typescript
// 示例测试用例
describe('MarkdownParser', () => {
  it('应该正确解析一级标题', () => {
    const markdown = '# 标题'
    const result = parseMarkdown(markdown)
    expect(result.pages).toHaveLength(1)
    expect(result.pages[0].title).toBe('标题')
  })
})
```

### 端到端测试

```typescript
describe('演示站点功能', () => {
  it('应该能够切换页面', async () => {
    await page.goto('/')
    await page.click('[data-testid="next-page"]')
    await expect(page).toHaveURL(/\/page\/1/)
  })
})
```

## 部署规范

### 构建配置

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
```

### 环境变量

```bash
# .env.production
VITE_APP_TITLE=演示站点
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXXXXXX-X
```

## 扩展性规范

### 插件系统架构

```typescript
interface DemoPlugin {
  name: string;
  version: string;
  install: (app: App) => void;
  routes?: RouteRecordRaw[];
  components?: Record<string, Component>;
}
```

### 主题定制

支持通过CSS变量和配置文件定制主题：

```javascript
// theme.config.js
export default {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b'
  },
  fonts: {
    body: 'Inter, system-ui, sans-serif'
  }
}
```

## 版本管理

### 语义化版本

- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 变更日志格式

```markdown
# 变更日志

## [1.1.0] - 2025-04-22
### 新增
- 支持数学公式渲染
- 添加黑暗模式切换

### 修复
- 修复移动端导航问题
- 优化代码块滚动性能
```

## 合规性检查清单

- [ ] 代码质量检查通过
- [ ] 单元测试覆盖率 > 80%
- [ ] 性能指标达标
- [ ] 可访问性测试通过
- [ ] 安全扫描无漏洞
- [ ] 浏览器兼容性验证
- [ ] 移动端适配测试
- [ ] 文档完整性检查

---

*最后更新: 2025-04-22*  
*版本: 1.0.0*