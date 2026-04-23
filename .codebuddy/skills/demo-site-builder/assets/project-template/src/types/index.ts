/**
 * 类型定义
 */

// 页面配置
export interface Page {
  id: string
  title: string
  level: number
  content: string
  lineNumber: number
  children?: Page[]
  metadata?: Record<string, any>
}

// 演示配置
export interface DemoConfig {
  title: string
  description?: string
  author?: string
  version?: string
  theme?: ThemeConfig
  navigation?: NavigationConfig
  player?: PlayerConfig
}

// 主题配置
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  textColor?: string
}

// 导航配置
export interface NavigationConfig {
  keyboard: boolean
  autoPlay: boolean
  autoPlayInterval?: number
  loop: boolean
  showPageNumber: boolean
  showProgressBar: boolean
}

// 播放器配置
export interface PlayerConfig {
  fullscreen: boolean
  fullscreenMode: 'browser' | 'window'
  showControls: boolean
  showNavigationButtons: boolean
  showKeyboardHints: boolean
}

// 解析选项
export interface ParseOptions {
  maxHeadingLevel?: number
  includeRawContent?: boolean
  parseHtml?: boolean
  codeHighlight?: CodeHighlightConfig
}

// 代码高亮配置
export interface CodeHighlightConfig {
  enabled: boolean
  theme?: string
  languages?: string[]
}

// 解析结果
export interface ParseResult {
  metadata: {
    title: string
    pageCount: number
    parseTime: string
    version: string
    [key: string]: any
  }
  pages: Page[]
  tableOfContents?: TOCItem[]
}

// 目录项
export interface TOCItem {
  id: string
  title: string
  level: number
  index: number
  children?: TOCItem[]
}

// 播放器状态
export interface PlayerState {
  currentPageIndex: number
  totalPages: number
  isFullscreen: boolean
  isPlaying: boolean
  isPaused: boolean
  progress: number
}

// 导航事件
export interface NavigationEvent {
  type: 'next' | 'prev' | 'goto' | 'first' | 'last'
  targetIndex?: number
  originalEvent?: Event
}

// 键盘快捷键
export interface KeyboardShortcut {
  key: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  description: string
  handler: () => void
}

// 组件Props
export interface DemoPlayerProps {
  pages: Page[]
  initialIndex?: number
  config?: Partial<DemoConfig>
  showControls?: boolean
  showKeyboardHints?: boolean
}

export interface PageViewerProps {
  page: Page
  isFullscreen?: boolean
}

export interface NavigationProps {
  currentIndex: number
  totalPages: number
  isFullscreen?: boolean
  onPrev?: () => void
  onNext?: () => void
  onGoTo?: (index: number) => void
}

// 组件事件
export interface DemoPlayerEvents {
  (e: 'page-change', index: number, page: Page): void
  (e: 'fullscreen-change', isFullscreen: boolean): void
  (e: 'play-state-change', isPlaying: boolean): void
  (e: 'demo-end'): void
}

// 导出选项
export interface ExportOptions {
  format: 'html' | 'pdf' | 'json' | 'markdown'
  outputPath: string
  minify?: boolean
  includeAssets?: boolean
  template?: string
}

// 部署配置
export interface DeployConfig {
  target: 'local' | 'static' | 'netlify' | 'vercel' | 'github-pages'
  domain?: string
  env?: 'production' | 'staging' | 'development'
  build?: BuildConfig
  auth?: AuthConfig
}

// 构建配置
export interface BuildConfig {
  buildBeforeDeploy: boolean
  buildCommand: string
  outputDir: string
  minify: boolean
}

// 认证配置
export interface AuthConfig {
  token?: string
  secret?: string
}
