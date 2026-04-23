import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DemoState, Presentation, Slide } from '../types'
import { parseMarkdown } from '../utils/markdownParser'

const demoContent = `# 项目介绍

这是一个基于 AI Coding 的医疗面试系统演示项目。

### 技术栈
- **前端**: Vue 3 + TypeScript + Vite
- **后端**: Spring Boot + MySQL
- **部署**: Docker 容器化

### 项目特点
- 现代化技术架构
- 响应式设计
- 多语言支持
- RESTful API 设计

# 功能演示

## 医生管理模块

### 医生列表展示
支持分页、搜索、筛选等功能

### 医生详情查看
展示医生的个人信息、擅长领域、出诊时间

### 排班管理
可视化的排班日历，支持拖拽操作

## 预约挂号系统

### 选择医生和时间
直观的界面让您快速找到合适的医生

### 填写预约信息
支持添加就诊人、管理就诊人信息

### 确认预约
详细的预约信息确认界面

# 技术架构

## 前端架构

### Vue 3 组合式 API
使用最新的 Composition API 组织代码

### 状态管理
采用 Pinia 进行状态管理

### 路由管理
使用 Vue Router 实现 SPA 路由

## 后端架构

### Spring Boot
成熟的微服务框架

### MySQL 数据库
可靠的关系型数据库

### RESTful API
标准的 REST 接口设计

# 部署方案

## 开发环境

### 本地开发
- Node.js 18+
- Java 17+
- MySQL 8.0

### Docker 环境
使用 Docker Compose 快速启动

## 生产部署

### 容器化部署
Docker 镜像构建和部署

### 云平台支持
支持主流云平台部署

### 监控和日志
完善的监控和日志系统

# 使用指南

## 键盘快捷键

### 页面导航
- ← 左箭头：上一页
- → 右箭头：下一页
- ESC：退出全屏
- F：切换全屏模式

### 其他操作
- Home：返回首页
- End：跳到最后一页

## 演示功能

### 全屏播放
点击播放按钮进入全屏演示模式

### 进度指示
页面底部显示当前进度

### 快速跳转
点击进度点快速跳转到指定页面

感谢观看！希望这个演示对您有所帮助。`

export const useDemoStore = defineStore('demo', () => {
  const presentation = ref<Presentation | null>(null)
  const isFullscreen = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const isLoading = ref(false)

  const currentSlide = computed(() => {
    return presentation.value?.currentSlide || 0
  })

  const totalSlides = computed(() => {
    return presentation.value?.totalSlides || 0
  })

  const loadPresentation = async () => {
    isLoading.value = true
    try {
      const parsed = parseMarkdown(demoContent)
      presentation.value = {
        title: parsed.title || '医疗面试系统演示',
        slides: parsed.slides,
        currentSlide: 0,
        totalSlides: parsed.slides.length
      }
    } catch (error) {
      console.error('加载演示内容失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const nextSlide = () => {
    if (presentation.value && currentSlide.value < totalSlides.value - 1) {
      presentation.value.currentSlide++
    }
  }

  const prevSlide = () => {
    if (presentation.value && currentSlide.value > 0) {
      presentation.value.currentSlide--
    }
  }

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    presentation,
    isFullscreen,
    theme,
    isLoading,
    currentSlide,
    totalSlides,
    loadPresentation,
    nextSlide,
    prevSlide,
    toggleFullscreen,
    toggleTheme
  }
})