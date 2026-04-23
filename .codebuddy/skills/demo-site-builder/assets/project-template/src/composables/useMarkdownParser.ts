/**
 * Markdown解析组合式函数
 * 提供Markdown解析功能的Composable
 */

import { ref, computed } from 'vue'
import { marked } from 'marked'
import type { PageConfig, ParseResult, ParseOptions } from '@/types'

// 配置marked选项
marked.setOptions({
  gfm: true,
  breaks: true
})

/**
 * Markdown解析状态管理
 */
export function useMarkdownParser(initialContent?: string) {
  const content = ref(initialContent || '')
  const pages = ref<PageConfig[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * 解析Markdown内容
   */
  function parseMarkdown(markdown: string, options?: ParseOptions): ParseResult {
    const lines = markdown.split('\n')
    const parsedPages: PageConfig[] = []
    let currentPage: Partial<PageConfig> | null = null
    let currentContent: string[] = []
    let lineNumber = 0
    const maxLevel = options?.maxHeadingLevel || 3

    for (const line of lines) {
      lineNumber++

      // 检测标题（根据最大层级）
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const title = headingMatch[2]

        // 只处理一级标题作为页面分隔
        if (level === 1) {
          // 保存之前的页面
          if (currentPage && currentPage.title) {
            parsedPages.push({
              ...currentPage as PageConfig,
              content: currentContent.join('\n').trim()
            })
          }

          // 开始新页面
          currentPage = {
            id: `page-${parsedPages.length + 1}`,
            title,
            level,
            lineNumber
          }
          currentContent = []
        } else if (level <= maxLevel && currentPage) {
          // 其他层级标题作为内容
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
      parsedPages.push({
        ...currentPage as PageConfig,
        content: currentContent.join('\n').trim()
      })
    }

    // 生成解析结果
    const result: ParseResult = {
      metadata: {
        title: parsedPages[0]?.title || '未命名演示',
        pageCount: parsedPages.length,
        parseTime: new Date().toISOString(),
        version: '1.0.0'
      },
      pages: parsedPages
    }

    return result
  }

  /**
   * 将Markdown转换为HTML
   */
  function renderToHtml(markdown: string): string {
    try {
      return marked.parse(markdown) as string
    } catch (err) {
      console.error('Markdown渲染失败:', err)
      return markdown
    }
  }

  /**
   * 解析内容
   */
  function parse(options?: ParseOptions): ParseResult {
    isLoading.value = true
    error.value = null

    try {
      const result = parseMarkdown(content.value, options)
      pages.value = result.pages
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置内容
   */
  function setContent(newContent: string): void {
    content.value = newContent
  }

  /**
   * 获取指定页面的HTML
   */
  function getPageHtml(pageId: string): string {
    const page = pages.value.find(p => p.id === pageId)
    if (!page) return ''
    return renderToHtml(page.content)
  }

  /**
   * 总页数
   */
  const totalPages = computed(() => pages.value.length)

  /**
   * 是否为空
   */
  const isEmpty = computed(() => pages.value.length === 0)

  return {
    content,
    pages,
    isLoading,
    error,
    totalPages,
    isEmpty,
    parse,
    parseMarkdown,
    renderToHtml,
    setContent,
    getPageHtml
  }
}
