<template>
  <div class="appointment-history">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">我的预约记录</h1>
      <p class="page-description">查看和管理您的所有预约记录</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <StatusFilter
        :filters="activeFilters"
        @filter-change="handleFilterChange"
        :readonly="true"
      />
      
      <!-- 搜索框 -->
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索医生姓名、科室、症状..."
          clearable
          @input="handleSearch"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 预约列表 -->
    <div class="appointment-list-section">
      <AppointmentList
        :appointments="filteredAppointments"
        :pagination="pagination"
        :readonly="true"
        @appointment-select="handleAppointmentSelect"
        @page-change="handlePageChange"
      />
      
      <!-- 空状态 -->
      <div v-if="filteredAppointments.length === 0" class="empty-state">
        <el-empty description="暂无预约记录" :image-size="200">
          <template #description>
            <p>您还没有预约记录</p>
            <p class="empty-subtitle">去预约页面创建您的第一个预约吧</p>
          </template>
          <el-button type="primary" @click="goToAppointment">
            立即预约
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 预约详情弹窗 -->
    <AppointmentDetail
      v-if="selectedAppointment"
      :appointment="selectedAppointment"
      :readonly="true"
      @close="handleDetailClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Appointment, AppointmentQueryParams } from '../types'
import StatusFilter from './StatusFilter.vue'
import AppointmentList from './AppointmentList.vue'
import AppointmentDetail from './AppointmentDetail.vue'
import { appointmentManager } from '../utils/appointment-manager'

// 响应式数据
const searchKeyword = ref('')
const activeFilters = ref({
  status: 'all',
  dateRange: [] as string[],
  doctorId: ''
})

const appointments = ref<Appointment[]>([])
const selectedAppointment = ref<Appointment | null>(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 计算属性
const filteredAppointments = computed(() => {
  let result = appointments.value

  // 状态筛选
  if (activeFilters.value.status !== 'all') {
    result = result.filter(appointment => 
      appointment.status === activeFilters.value.status
    )
  }

  // 日期范围筛选
  if (activeFilters.value.dateRange.length === 2) {
    const [startDate, endDate] = activeFilters.value.dateRange
    result = result.filter(appointment => 
      appointment.appointmentDate >= startDate && 
      appointment.appointmentDate <= endDate
    )
  }

  // 医生筛选
  if (activeFilters.value.doctorId) {
    result = result.filter(appointment => 
      appointment.doctorId === activeFilters.value.doctorId
    )
  }

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(appointment => 
      appointment.doctorName.toLowerCase().includes(keyword) ||
      appointment.department.toLowerCase().includes(keyword) ||
      appointment.symptoms.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 方法
const handleFilterChange = (filters: any) => {
  activeFilters.value = { ...filters }
  pagination.value.currentPage = 1
  loadAppointments()
}

const handleSearch = () => {
  pagination.value.currentPage = 1
  loadAppointments()
}

const handleAppointmentSelect = (appointment: Appointment) => {
  selectedAppointment.value = appointment
}

const handleDetailClose = () => {
  selectedAppointment.value = null
}

const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  loadAppointments()
}

const goToAppointment = () => {
  // 跳转到预约页面
  ElMessage.info('即将跳转到预约页面')
}

const loadAppointments = async () => {
  try {
    const queryParams: AppointmentQueryParams = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      status: activeFilters.value.status !== 'all' ? activeFilters.value.status : undefined,
      searchKeyword: searchKeyword.value.trim() || undefined,
      startDate: activeFilters.value.dateRange[0],
      endDate: activeFilters.value.dateRange[1]
    }

    const response = await appointmentManager.getPatientAppointments(queryParams)
    appointments.value = response.data
    pagination.value.total = response.total
  } catch (error) {
    ElMessage.error('加载预约记录失败')
    console.error('加载预约记录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.appointment-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-description {
  font-size: 14px;
  color: #909399;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-section {
  flex: 0 0 300px;
}

.search-input {
  width: 100%;
}

.appointment-list-section {
  min-height: 400px;
}

.empty-state {
  margin-top: 60px;
}

.empty-subtitle {
  margin-top: 8px;
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .appointment-history {
    padding: 15px;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-section {
    flex: none;
  }
}
</style>