<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
      
      <div class="actions">
        <button @click="startDemo" class="btn btn-primary btn-lg">
          开始演示
        </button>
        <button @click="toggleTheme" class="btn btn-secondary">
          {{ themeStore.isDark ? '☀️ 浅色' : '🌙 深色' }}
        </button>
      </div>
      
      <p class="hint">
        按 <kbd>Space</kbd> 或点击按钮开始
      </p>
    </div>
    
    <div class="features">
      <div class="feature-item">
        <span class="feature-icon">📝</span>
        <h3>Markdown驱动</h3>
        <p>使用熟悉的Markdown语法编写内容</p>
      </div>
      <div class="feature-item">
        <span class="feature-icon">🎬</span>
        <h3>全屏播放</h3>
        <p>支持全屏演示模式</p>
      </div>
      <div class="feature-item">
        <span class="feature-icon">⌨️</span>
        <h3>键盘导航</h3>
        <p>左右键轻松切换页面</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'
import { useDemoStore } from '@/stores/demo.store'

const router = useRouter()
const themeStore = useThemeStore()
const demoStore = useDemoStore()

const title = ref('演示站点')
const subtitle = ref('基于Markdown的交互式演示工具')

function startDemo() {
  router.push('/page/page-1')
}

function toggleTheme() {
  themeStore.toggleTheme()
}

// 键盘事件处理
function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault()
    startDemo()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
  text-align: center;
  color: white;
  margin-bottom: 4rem;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hint {
  font-size: 0.875rem;
  opacity: 0.7;
}

.hint kbd {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 900px;
}

.feature-item {
  background: white;
  color: #1f2937;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.feature-item p {
  font-size: 0.875rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
