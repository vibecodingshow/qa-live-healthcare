/**
 * Markdown解析工具
 */

import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置marked选项
marked.setOptions({
  gfm: true,
  breaks: true
})

// 配置代码高亮
marked.use({
  renderer: {
    code(code: string, language?: string): string {
      if (language && hljs.getLanguage(language)) {
        try {
          const highlighted = hljs.highlight(code, { language }).value
          return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
        } catch (err) {
          console.error('代码高亮失败:', err)
        }
      }
      return `<pre><code>${code}</code></pre>`
    }
  }
})

export interface ParseResult {
  metadata: {
    title: string
    pageCount: number
    parseTime: string
    version: string
  }
  pages: Page[]
  tableOfContents?: TOCItem[]
}

export interface Page {
  id: string
  title: string
  level: number
  content: string
  lineNumber: number
}

export interface TOCItem {
  id: string
  title: string
  level: number
  index: number
}

/**
 * 解析Markdown内容
 */
export function parseMarkdown(content: string, maxLevel = 3): ParseResult {
  const lines = content.split('\n')
  const pages: Page[] = []
  let currentPage: Partial<Page> | null = null
  let currentContent: string[] = []
  let lineNumber = 0

  for (const line of lines) {
    lineNumber++

    // 检测一级标题（页面分隔）
    const h1Match = line.match(/^#\s+(.+)$/)
    if (h1Match) {
      // 保存之前的页面
      if (currentPage && currentPage.title) {
        pages.push({
          ...currentPage as Page,
          content: currentContent.join('\n').trim()
        })
      }

      // 开始新页面
      currentPage = {
        id: `page-${pages.length + 1}`,
        title: h1Match[1],
        level: 1,
        lineNumber
      }
      currentContent = []
      continue
    }

    // 检测二级/三级标题
    const headingMatch = line.match(/^(#{2,6})\s+(.+)$/)
    if (headingMatch && currentPage) {
      const level = headingMatch[1].length
      if (level <= maxLevel) {
        currentContent.push(line)
      }
      continue
    }

    // 其他内容
    if (currentPage) {
      currentContent.push(line)
    }
  }

  // 保存最后一页
  if (currentPage && currentPage.title) {
    pages.push({
      ...currentPage as Page,
      content: currentContent.join('\n').trim()
    })
  }

  // 生成目录
  const tableOfContents: TOCItem[] = pages.map((page, index) => ({
    id: page.id,
    title: page.title,
    level: page.level,
    index
  }))

  return {
    metadata: {
      title: pages[0]?.title || '未命名演示',
      pageCount: pages.length,
      parseTime: new Date().toISOString(),
      version: '1.0.0'
    },
    pages,
    tableOfContents
  }
}

/**
 * 将Markdown转换为HTML
 */
export function renderMarkdown(content: string): string {
  try {
    return marked.parse(content) as string
  } catch (err) {
    console.error('Markdown渲染失败:', err)
    return content
  }
}

/**
 * 清理HTML内容
 */
export function sanitizeHtml(html: string): string {
  // 移除危险的标签和属性
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}

/**
 * 提取纯文本
 */
export function extractText(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
}
