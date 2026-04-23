/**
 * 项目初始化脚本
 * 用于快速创建演示站点的基础结构
 */

const fs = require('fs');
const path = require('path');

// 项目配置
const PROJECT_CONFIG = {
  name: 'demo-site',
  description: '基于Markdown的交互式演示站点',
  author: 'ASDM',
  version: '1.0.0',
  license: 'MIT'
};

// 目录结构模板
const DIRECTORY_STRUCTURE = [
  'public',
  'public/images',
  'src',
  'src/assets',
  'src/assets/images',
  'src/assets/styles',
  'src/assets/fonts',
  'src/components',
  'src/components/common',
  'src/components/layout',
  'src/components/demo',
  'src/composables',
  'src/router',
  'src/router/routes',
  'src/router/guards',
  'src/stores',
  'src/types',
  'src/utils',
  'src/views',
  'tests',
  'tests/unit',
  'tests/unit/components',
  'tests/unit/composables',
  'tests/unit/utils',
  'tests/e2e',
  'tests/e2e/specs',
  'docs',
  'docs/api',
  'docs/guide',
  'scripts'
];

// 核心文件模板
const FILE_TEMPLATES = {
  'package.json': JSON.stringify({
    name: PROJECT_CONFIG.name,
    version: PROJECT_CONFIG.version,
    description: PROJECT_CONFIG.description,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc && vite build',
      preview: 'vite preview',
      test: 'vitest',
      'test:unit': 'vitest run',
      'test:e2e': 'playwright test',
      lint: 'eslint . --ext .vue,.js,.jsx,.ts,.tsx --fix',
      'type-check': 'vue-tsc --noEmit'
    },
    dependencies: {
      vue: '^3.3.0',
      'vue-router': '^4.2.0',
      pinia: '^2.1.0',
      marked: '^9.0.0',
      'highlight.js': '^11.8.0'
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^4.2.0',
      '@vue/tsconfig': '^0.4.0',
      typescript: '^5.0.0',
      vite: '^4.4.0',
      vitest: '^0.34.0',
      '@vue/test-utils': '^2.4.0',
      '@types/node': '^20.0.0',
      autoprefixer: '^10.4.0',
      postcss: '^8.4.0',
      tailwindcss: '^3.3.0',
      eslint: '^8.45.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      'eslint-plugin-vue': '^9.15.0',
      prettier: '^3.0.0'
    },
    engines: {
      node: '>=16.0.0',
      npm: '>=7.0.0'
    }
  }, null, 2),

  'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          markdown: ['marked', 'highlight.js']
        }
      }
    }
  }
})
`,

  'tsconfig.json': JSON.stringify({
    extends: '@vue/tsconfig/tsconfig.dom.json',
    include: ['env.d.ts', 'src/**/*', 'src/**/*.vue'],
    compilerOptions: {
      composite: true,
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*']
      },
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true
    }
  }, null, 2),

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      }
    }
  },
  plugins: []
}
`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
`,

  'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="交互式演示站点" />
    <title>演示站点</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,

  'src/main.ts': `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
`,

  'src/App.vue': `<template>
  <div id="app" :class="themeClass">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()

const themeClass = computed(() => ({
  'theme-light': themeStore.isLight,
  'theme-dark': themeStore.isDark
}))
</script>

<style>
#app {
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

.theme-dark {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
</style>
`,

  'src/assets/styles/base.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}
`,

  'src/router/index.ts': `import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
`,

  'src/stores/demo.store.ts': `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Page {
  id: string
  title: string
  level: number
  content: any[]
}

export const useDemoStore = defineStore('demo', () => {
  const currentPageIndex = ref(0)
  const pages = ref<Page[]>([])
  const isPlaying = ref(false)
  const isFullscreen = ref(false)

  const totalPages = computed(() => pages.value.length)
  const currentPage = computed(() => pages.value[currentPageIndex.value])

  function nextPage() {
    if (currentPageIndex.value < totalPages.value - 1) {
      currentPageIndex.value++
    }
  }

  function prevPage() {
    if (currentPageIndex.value > 0) {
      currentPageIndex.value--
    }
  }

  function goToPage(index: number) {
    if (index >= 0 && index < totalPages.value) {
      currentPageIndex.value = index
    }
  }

  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  return {
    currentPageIndex,
    pages,
    isPlaying,
    isFullscreen,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    toggleFullscreen,
    togglePlay
  }
})
`,

  'src/stores/theme.store.ts': `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')

  const isLight = computed(() => theme.value === 'light')
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  }

  return {
    theme,
    isLight,
    isDark,
    toggleTheme,
    initTheme
  }
})
`,

  'src/utils/markdownParser.ts': `import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置marked
marked.setOptions({
  gfm: true,
  breaks: true
})

export interface ParseResult {
  metadata: {
    title: string
    pageCount: number
    parseTime: string
  }
  pages: Page[]
}

export interface Page {
  id: string
  title: string
  level: number
  lineNumber: number
  content: string
}

export function parseMarkdown(content: string): ParseResult {
  const lines = content.split('\\n')
  const pages: Page[] = []
  let currentPage: Partial<Page> | null = null
  let currentContent: string[] = []
  let lineNumber = 0

  for (const line of lines) {
    lineNumber++
    
    // 检测一级标题（页面分隔）
    const h1Match = line.match(/^#\\s+(.+)$/)
    if (h1Match) {
      // 保存之前的页面
      if (currentPage.title) {
        pages.push({
          ...currentPage as Page,
          content: currentContent.join('\\n')
        })
      }
      
      // 开始新页面
      currentPage = {
        id: \`page-\${pages.length + 1}\`,
        title: h1Match[1],
        level: 1,
        lineNumber
      }
      currentContent = []
      continue
    }

    // 检测二级标题
    const h2Match = line.match(/^##\\s+(.+)$/)
    if (h2Match) {
      currentContent.push(line)
      continue
    }

    // 检测三级标题
    const h3Match = line.match(/^###\\s+(.+)$/)
    if (h3Match) {
      currentContent.push(line)
      continue
    }

    currentContent.push(line)
  }

  // 保存最后一页
  if (currentPage.title) {
    pages.push({
      ...currentPage as Page,
      content: currentContent.join('\\n')
    })
  }

  return {
    metadata: {
      title: pages[0]?.title || '未命名演示',
      pageCount: pages.length,
      parseTime: new Date().toISOString()
    },
    pages
  }
}

export function renderMarkdown(content: string): string {
  return marked(content)
}
`,

  'src/views/Home.vue': `<template>
  <div class="home">
    <header class="home-header">
      <h1>{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </header>

    <main class="home-main">
      <div class="start-section">
        <button @click="startDemo" class="start-button">
          开始演示
        </button>
        <p class="hint">点击开始或按空格键</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('演示站点')
const subtitle = ref('基于Markdown的交互式演示工具')

function startDemo() {
  router.push('/page/page-1')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
}

.home-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #64748b;
}

.start-section {
  text-align: center;
}

.start-button {
  padding: 1rem 3rem;
  font-size: 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.start-button:hover {
  background: #2563eb;
}

.hint {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #94a3b8;
}
</style>
`,

  'src/views/DemoPage.vue': `<template>
  <div class="demo-page">
    <div class="demo-header">
      <button @click="goHome" class="back-button">返回</button>
      <div class="page-info">
        <span>{{ currentPageIndex + 1 }} / {{ totalPages }}</span>
      </div>
      <button @click="toggleFullscreen" class="fullscreen-button">
        {{ isFullscreen ? '退出全屏' : '全屏' }}
      </button>
    </div>

    <div class="demo-content" v-if="currentPage">
      <h1>{{ currentPage.title }}</h1>
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>

    <div class="demo-controls">
      <button @click="prevPage" :disabled="currentPageIndex === 0" class="nav-button">
        ← 上一页
      </button>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth }"></div>
      </div>
      <button @click="nextPage" :disabled="currentPageIndex >= totalPages - 1" class="nav-button">
        下一页 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore } from '@/stores/demo.store'
import { renderMarkdown } from '@/utils/markdownParser'

const props = defineProps<{
  pageId: string
}>()

const router = useRouter()
const demoStore = useDemoStore()

const currentPageIndex = computed(() => demoStore.currentPageIndex)
const totalPages = computed(() => demoStore.totalPages)
const currentPage = computed(() => demoStore.currentPage)
const isFullscreen = computed(() => demoStore.isFullscreen)

const progressWidth = computed(() => {
  if (totalPages.value === 0) return '0%'
  return \`\${((currentPageIndex.value + 1) / totalPages.value) * 100}%\`
})

const renderedContent = computed(() => {
  if (!currentPage.value) return ''
  return renderMarkdown(currentPage.value.content)
})

function goHome() {
  router.push('/')
}

function prevPage() {
  demoStore.prevPage()
}

function nextPage() {
  demoStore.nextPage()
}

function toggleFullscreen() {
  demoStore.toggleFullscreen()
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.demo-content {
  flex: 1;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
`
};

/**
 * 创建目录结构
 */
function createDirectories(basePath) {
  console.log('创建目录结构...');
  
  for (const dir of DIRECTORY_STRUCTURE) {
    const fullPath = path.join(basePath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log('  ✓ ' + dir);
    }
  }
}

/**
 * 创建文件
 */
function createFiles(basePath) {
  console.log('\\n创建核心文件...');
  
  for (const [filePath, content] of Object.entries(FILE_TEMPLATES)) {
    const fullPath = path.join(basePath, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log('  ✓ ' + filePath);
  }
}

/**
 * 创建.gitignore
 */
function createGitignore(basePath) {
  const content = `# 依赖
node_modules/
.pnp
.pnp.js

# 构建输出
dist/
build/

# 环境变量
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db

# 测试
coverage/
*.log

# 其他
*.local
`;
  
  fs.writeFileSync(path.join(basePath, '.gitignore'), content, 'utf-8');
  console.log('  ✓ .gitignore');
}

/**
 * 主函数
 */
function main() {
  const projectName = process.argv[2] || PROJECT_CONFIG.name;
  const basePath = path.join(process.cwd(), projectName);
  
  console.log('\\n演示站点初始化工具\\n');
  console.log('创建项目: ' + projectName);
  console.log('目标路径: ' + basePath + '\\n');
  
  try {
    // 检查目录是否已存在
    if (fs.existsSync(basePath)) {
      console.log('错误: 目录 ' + basePath + ' 已存在');
      process.exit(1);
    }
    
    // 创建目录
    fs.mkdirSync(basePath, { recursive: true });
    
    // 创建项目结构
    createDirectories(basePath);
    createFiles(basePath);
    createGitignore(basePath);
    
    console.log('\\n✓ 项目初始化完成!');
    console.log('\\n下一步:');
    console.log('  cd ' + projectName);
    console.log('  npm install');
    console.log('  npm run dev');
    console.log('');
    
  } catch (error) {
    console.error('\\n初始化失败:', error.message);
    process.exit(1);
  }
}

main();
