<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Department } from '@/services/schedule/types'

const props = defineProps<{
  modelValue: {
    department?: string
    startDate?: string
    endDate?: string
    keyword?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

const departments = ref<Department[]>([])
const selectedDepartment = ref(props.modelValue.department || '')
const dateRange = ref<[string, string] | null>(null)
const keyword = ref(props.modelValue.keyword || '')

onMounted(async () => {
  // 模拟获取科室列表
  departments.value = [
    { id: 'dept001', name: '内科' },
    { id: 'dept002', name: '外科' },
    { id: 'dept003', name: '儿科' },
    { id: 'dept004', name: '妇产科' },
    { id: 'dept005', name: '骨科' },
    { id: 'dept006', name: '皮肤科' },
  ]
})

function updateFilter() {
  emit('update:modelValue', {
    department: selectedDepartment.value || undefined,
    startDate: dateRange.value?.[0] || undefined,
    endDate: dateRange.value?.[1] || undefined,
    keyword: keyword.value || undefined,
  })
}

function handleSearch() {
  updateFilter()
  emit('search')
}

function handleReset() {
  selectedDepartment.value = ''
  dateRange.value = null
  keyword.value = ''
  updateFilter()
  emit('reset')
}

function handleKeywordChange() {
  // 防抖处理
  setTimeout(() => {
    updateFilter()
  }, 300)
}
</script>

<template>
  <div class="schedule-filter">
    <!-- 搜索框 -->
    <div class="filter-row">
      <a-input-search
        v-model:value="keyword"
        placeholder="搜索医生姓名、科室"
        style="width: 240px"
        @search="handleSearch"
        @change="handleKeywordChange"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input-search>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-row">
      <!-- 科室筛选 -->
      <a-select
        v-model:value="selectedDepartment"
        placeholder="选择科室"
        style="width: 160px"
        allow-clear
        @change="handleSearch"
      >
        <a-select-option
          v-for="dept in departments"
          :key="dept.id"
          :value="dept.name"
        >
          {{ dept.name }}
        </a-select-option>
      </a-select>

      <!-- 日期范围 -->
      <a-range-picker
        v-model:value="dateRange"
        style="width: 260px"
        @change="handleSearch"
      />

      <!-- 操作按钮 -->
      <a-space>
        <a-button @click="handleReset">
          <ReloadOutlined />
          重置
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.schedule-filter {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-row > * {
    width: 100% !important;
  }
}
</style>
