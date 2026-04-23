<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面未找到</p>
      <button @click="goHome" class="btn btn-primary">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color, #ffffff);
}

.content {
  text-align: center;
}

h1 {
  font-size: 8rem;
  font-weight: 700;
  color: var(--primary-color, #3b82f6);
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color, #3b82f6);
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
