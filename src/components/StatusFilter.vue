<template>
  <div class="status-filter">
    <!-- 状态筛选 -->
    <div class="filter-group">
      <label class="filter-label">状态筛选：</label>
      <el-radio-group v-model="localFilters.status" @change="handleFilterChange" size="small">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="pending">待确认</el-radio-button>
        <el-radio-button value="confirmed">已确认</el-radio-button>
        <el-radio-button value="completed">已完成</el-radio-button>
        <el-radio-button value="cancelled">已取消</el-radio-button>
        <el-radio-button value="no_show">未就诊</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 日期范围筛选 -->
    <div class="filter-group">
      <label class="filter-label">日期范围：</label>
      <el-date-picker
        v-model="localFilters.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleFilterChange"
        size="small"
        :disabled="readonly"
      />
    </div>

    <!-- 医生筛选 -->
    <div class="filter-group" v-if="!readonly && doctors.length > 0">
      <label class="filter-label">医生筛选：</label>
      <el-select
        v-model="localFilters.doctorId"
        placeholder="选择医生"
        clearable
        @change="handleFilterChange"
        size="small"
      >
        <el-option
          v-for="doctor in doctors"
          :key="doctor.id"
          :label="doctor.name"
          :value="doctor.id"
        />
      </el-select>
    </div>

    <!-- 高级筛选按钮 -->
    <div class="filter-group" v-if="!readonly">
      <el-button 
        type="primary" 
        text 
        size="small" 
        @click="showAdvancedFilter = !showAdvancedFilter"
        class="advanced-filter-btn"
      >
        <el-icon><Filter /></el-icon>
        高级筛选
      </el-button>
    </div>

    <!-- 高级筛选面板 -->
    <div v-if="showAdvancedFilter" class="advanced-filter-panel">
      <div class="advanced-filter-content">
        <!-- 预约时长筛选 -->
        <div class="advanced-filter-group">
          <label class="advanced-filter-label">预约时长：</label>
          <el-select
            v-model="localFilters.duration"
            placeholder="选择预约时长"
            clearable
            @change="handleFilterChange"
            size="small"
          >
            <el-option label="30分钟" value="30" />
            <el-option label="60分钟" value="60" />
            <el-option label="90分钟" value="90" />
            <el-option label="120分钟" value="120" />
          </el-select>
        </div>

        <!-- 科室筛选 -->
        <div class="advanced-filter-group">
          <label class="advanced-filter-label">科室：</label>
          <el-select
            v-model="localFilters.department"
            placeholder="选择科室"
            clearable
            @change="handleFilterChange"
            size="small"
          >
            <el-option
              v-for="dept in departments"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </div>

        <!-- 时间段筛选 -->
        <div class="advanced-filter-group">
          <label class="advanced-filter-label">时间段：</label>
          <el-time-picker
            v-model="localFilters.timeRange"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            @change="handleFilterChange"
            size="small"
          />
        </div>

        <!-- 排序方式 -->
        <div class="advanced-filter-group">
          <label class="advanced-filter-label">排序方式：</label>
          <el-select
            v-model="localFilters.sortBy"
            placeholder="选择排序方式"
            @change="handleFilterChange"
            size="small"
          >
            <el-option label="创建时间（最新）" value="createdAt_desc" />
            <el-option label="创建时间（最早）" value="createdAt_asc" />
            <el-option label="预约时间（最近）" value="appointmentDate_desc" />
            <el-option label="预约时间（最远）" value="appointmentDate_asc" />
            <el-option label="医生姓名（A-Z）" value="doctorName_asc" />
            <el-option label="医生姓名（Z-A）" value="doctorName_desc" />
          </el-select>
        </div>

        <!-- 重置按钮 -->
        <div class="advanced-filter-actions">
          <el-button 
            type="default" 
            size="small" 
            @click="handleReset"
            class="reset-btn"
          >
            重置筛选
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Filter } from '@element-plus/icons-vue'

// 属性定义
interface Props {
  filters: any
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// 事件定义
const emit = defineEmits<{
  'filter-change': [filters: any]
}>()

// 响应式数据
const showAdvancedFilter = ref(false)
const localFilters = ref({ ...props.filters })

// 模拟数据
const doctors = ref([
  { id: '1', name: '张医生' },
  { id: '2', name: '李医生' },
  { id: '3', name: '王医生' },
  { id: '4', name: '刘医生' }
])

const departments = ref([
  '内科', '外科', '儿科', '妇产科', '眼科', '耳鼻喉科',
  '口腔科', '皮肤科', '中医科', '康复科', '急诊科'
])

// 方法
const handleFilterChange = () => {
  emit('filter-change', { ...localFilters.value })
}

const handleReset = () => {
  localFilters.value = {
    status: 'all',
    dateRange: [],
    doctorId: '',
    duration: '',
    department: '',
    timeRange: [],
    sortBy: 'createdAt_desc'
  }
  emit('filter-change', { ...localFilters.value })
}

// 监听属性变化
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.status-filter {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.advanced-filter-btn {
  margin-left: auto;
}

.advanced-filter-panel {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.advanced-filter-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.advanced-filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advanced-filter-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.advanced-filter-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.reset-btn {
  min-width: 100px;
}

@media (max-width: 768px) {
  .status-filter {
    padding: 12px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .filter-label {
    min-width: auto;
  }
  
  .advanced-filter-content {
    grid-template-columns: 1fr;
  }
  
  .advanced-filter-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .filter-group :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .filter-group :deep(.el-radio-button) {
    flex: 1;
    min-width: 60px;
  }
  
  .filter-group :deep(.el-radio-button__inner) {
    width: 100%;
    text-align: center;
  }
}
</style>