<template>
  <div class="appointment-page">
    <div class="page-header">
      <h1>预约挂号</h1>
      <p>选择医生，快速预约线下门诊</p>
    </div>

    <div class="appointment-container">
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <a-space wrap :size="16">
          <a-select
            v-model:value="selectedDepartment"
            placeholder="选择科室"
            style="width: 160px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="">全部科室</a-select-option>
            <a-select-option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </a-select-option>
          </a-select>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索医生姓名"
            style="width: 240px"
            allow-clear
            @search="handleFilterChange"
            @change="handleFilterChange"
          />
        </a-space>
        <div class="doctor-count">
          共找到 <span class="count">{{ filteredDoctors.length }}</span> 位医生
        </div>
      </div>

      <!-- 医生列表 -->
      <div v-if="filteredDoctors.length > 0" class="doctors-grid">
        <DoctorCard
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          :doctor="doctor"
        />
      </div>

      <!-- 空状态 -->
      <a-empty
        v-else
        :description="emptyDescription"
        class="empty-state"
      >
        <template #image>
          <SearchOutlined style="font-size: 64px; color: #ccc" />
        </template>
      </a-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { store, type Doctor } from '../../store';
import DoctorCard from '../../components/appointment/DoctorCard.vue';

const selectedDepartment = ref<string>('');
const searchKeyword = ref<string>('');

// 动态获取科室列表（去重）
const departments = computed(() => {
  const depts = new Set<string>();
  store.state.doctors.forEach(d => {
    if (d.department) {
      depts.add(d.department);
    }
  });
  return Array.from(depts).sort();
});

const filteredDoctors = computed(() => {
  let result = store.getActiveDoctors();

  // 按科室筛选
  if (selectedDepartment.value) {
    result = result.filter((d: Doctor) => d.department === selectedDepartment.value);
  }

  // 按关键字搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    result = result.filter((d: Doctor) =>
      d.name.toLowerCase().includes(keyword) ||
      d.title.toLowerCase().includes(keyword) ||
      (d.specialties && d.specialties.some((s: string) => s.toLowerCase().includes(keyword)))
    );
  }

  return result;
});

const emptyDescription = computed(() => {
  if (searchKeyword.value || selectedDepartment.value) {
    return '未找到相关医生，请尝试其他搜索条件';
  }
  return '暂无可预约的医生';
});

const handleFilterChange = () => {
  // 筛选是响应式的，computed 会自动更新
};

onMounted(() => {
  // 页面加载时自动获取医生列表
  console.log('预约首页加载，可预约医生数量:', store.getActiveDoctors().length);
});
</script>

<style scoped>
.appointment-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  padding: 60px 24px 40px;
  text-align: center;
  color: #fff;
}

.page-header h1 {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.page-header p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.appointment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.doctor-count {
  font-size: 14px;
  color: #666;
}

.doctor-count .count {
  font-weight: 600;
  color: #1890ff;
  font-size: 16px;
}

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.empty-state {
  background: #fff;
  padding: 80px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 16px;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .doctors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
