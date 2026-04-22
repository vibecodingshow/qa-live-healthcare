<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DoctorSchedule, ScheduleFilterParams } from '@/services/schedule/types'
import { getScheduleList } from '@/services/schedule'
import DoctorCard from '@/components/DoctorCard.vue'
import ScheduleFilter from '@/components/ScheduleFilter.vue'

// 状态
const loading = ref(false)
const scheduleList = ref<DoctorSchedule[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const error = ref<string | null>(null)

// 筛选参数
const filterParams = ref<ScheduleFilterParams>({
  department: undefined,
  startDate: undefined,
  endDate: undefined,
  keyword: undefined,
  page: 1,
  pageSize: 10,
})

// 加载数据
async function fetchScheduleList() {
  loading.value = true
  error.value = null

  try {
    const params: ScheduleFilterParams = {
      ...filterParams.value,
      page: page.value,
      pageSize: pageSize.value,
    }

    const response = await getScheduleList(params)
    scheduleList.value = response.list
    total.value = response.total
  } catch (err) {
    console.error('获取排班列表失败:', err)
    error.value = '获取排班列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 筛选变化
function handleFilterChange(value: ScheduleFilterParams) {
  filterParams.value = {
    ...filterParams.value,
    ...value,
  }
  page.value = 1 // 重置页码
}

// 搜索
function handleSearch() {
  page.value = 1
  fetchScheduleList()
}

// 重置
function handleReset() {
  filterParams.value = {
    department: undefined,
    startDate: undefined,
    endDate: undefined,
    keyword: undefined,
    page: 1,
    pageSize: 10,
  }
  page.value = 1
  fetchScheduleList()
}

// 分页变化
function handlePageChange(newPage: number, newPageSize: number) {
  page.value = newPage
  pageSize.value = newPageSize
  fetchScheduleList()
}

// 重试
function handleRetry() {
  fetchScheduleList()
}

onMounted(() => {
  fetchScheduleList()
})
</script>

<template>
  <div class="schedule-list-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>医生排班</h1>
      <p>选择合适的医生和时间进行预约</p>
    </div>

    <!-- 筛选组件 -->
    <ScheduleFilter
      :model-value="filterParams"
      @update:model-value="handleFilterChange"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <a-result
        status="error"
        title="加载失败"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="handleRetry">
            重新加载
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 空数据状态 -->
    <div v-else-if="scheduleList.length === 0" class="empty-container">
      <a-result
        status="info"
        title="暂无排班信息"
        sub-title="请尝试调整筛选条件"
      >
        <template #extra>
          <a-button @click="handleReset">
            重置筛选
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 排班列表 -->
    <div v-else class="schedule-list">
      <DoctorCard
        v-for="schedule in scheduleList"
        :key="schedule.id"
        :schedule="schedule"
      />

      <!-- 分页 -->
      <div class="pagination">
        <a-pagination
          v-model:current="page"
          v-model:pageSize="pageSize"
          :total="total"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :show-total="(total: number) => `共 ${total} 条`"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #666;
}

.loading-container,
.error-container,
.empty-container {
  padding: 60px 0;
  text-align: center;
  background: #fff;
  border-radius: 8px;
}

.schedule-list {
  background: transparent;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  background: #fff;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .schedule-list-page {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 20px;
  }
}
</style>
