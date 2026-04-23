import { marked } from 'marked'
import type { Slide } from '../types'

export function parseMarkdown(content: string): { title: string; slides: Slide[] } {
  const tokens = marked.lexer(content)
  console.log('Parsed tokens:', tokens.length)
  
  const slides: Slide[] = []
  let currentSlide: Slide | null = null
  let title = '演示站点'
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    
    if (token.type === 'heading') {
      if (token.depth === 1) {
        // 一级标题作为新幻灯片
        if (currentSlide) {
          slides.push(currentSlide)
          console.log(`Added slide: ${currentSlide.title} with ${currentSlide.children.length} children`)
        }
        
        currentSlide = {
          id: `slide-${slides.length + 1}`,
          title: token.text,
          level: token.depth,
          content: '',
          children: []
        }
        
        // 第一个一级标题作为演示标题
        if (slides.length === 0) {
          title = token.text
        }
      } else if (currentSlide) {
        // 二级及以下标题作为子内容
        const childSlide: Slide = {
          id: `slide-${slides.length + 1}-child-${currentSlide.children.length + 1}`,
          title: token.text,
          level: token.depth,
          content: '',
          children: []
        }
        currentSlide.children.push(childSlide)
        console.log(`Added child to ${currentSlide.title}: ${childSlide.title}`)
      }
    } else if (currentSlide && token.type === 'paragraph') {
      // 段落内容添加到当前幻灯片或子幻灯片
      if (currentSlide.children.length > 0) {
        const lastChild = currentSlide.children[currentSlide.children.length - 1]
        lastChild.content += token.text + '\n'
      } else {
        currentSlide.content += token.text + '\n'
      }
    } else if (currentSlide && token.type === 'list') {
      // 列表内容
      const listContent = token.items.map(item => `• ${item.text}`).join('\n')
      if (currentSlide.children.length > 0) {
        const lastChild = currentSlide.children[currentSlide.children.length - 1]
        lastChild.content += listContent + '\n'
      } else {
        currentSlide.content += listContent + '\n'
      }
    }
  }
  
  // 添加最后一个幻灯片
  if (currentSlide) {
    slides.push(currentSlide)
    console.log(`Added final slide: ${currentSlide.title} with ${currentSlide.children.length} children`)
  }
  
  console.log(`Total slides: ${slides.length}`)
  return { title, slides }
}
