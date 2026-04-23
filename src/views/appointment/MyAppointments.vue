<template>
  <div class="my-appointments-page">
    <div class="page-container">
      <!-- 顶部导航 -->
      <div class="page-header">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined /> 返回
        </a-button>
        <h1>我的预约</h1>
      </div>

      <!-- Tab 切换 -->
      <div class="tab-section">
        <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
          <a-tab-pane key="all" tab="全部预约" />
          <a-tab-pane key="pending" tab="待就诊" />
          <a-tab-pane key="completed" tab="已完成" />
          <a-tab-pane key="cancelled" tab="已取消" />
        </a-tabs>
      </div>

      <!-- 搜索/筛选 -->
      <div class="filter-section">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索医生姓名或预约号"
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @change="handleSearchChange"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <a-spin size="large" tip="加载中..." />
      </div>

      <!-- 预约列表 -->
      <div v-else-if="filteredAppointments.length > 0" class="appointments-list">
        <AppointmentCard
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          :appointment="appointment"
          @cancel="handleAppointmentCancel"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <a-result
          status="info"
          title="暂无预约记录"
          sub-title="您还没有预约记录，点击下方按钮去预约"
        >
          <template #extra>
            <a-button type="primary" @click="goToAppointment">
              <CalendarOutlined /> 去预约
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  LeftOutlined,
  CalendarOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { store, type Appointment } from '../../store';
import AppointmentCard from '../../components/appointment/AppointmentCard.vue';

const router = useRouter();

// 状态
const loading = ref(true);
const appointments = ref<Appointment[]>([]);
const activeTab = ref('all');
const searchKeyword = ref('');
const patientPhone = ref('');

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  let result = appointments.value;

  // 按状态筛选
  if (activeTab.value !== 'all') {
    result = result.filter(a => a.status === activeTab.value);
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(a =>
      a.doctorName.toLowerCase().includes(keyword) ||
      a.id.toLowerCase().includes(keyword) ||
      a.department.toLowerCase().includes(keyword)
    );
  }

  return result;
});

// 加载预约数据
const loadAppointments = () => {
  loading.value = true;

  // 获取患者手机号
  const lastPatientInfo = store.getLastPatientInfo();
  if (lastPatientInfo) {
    patientPhone.value = lastPatientInfo.phone;
    appointments.value = store.getAppointmentsByPatient(lastPatientInfo.phone);
  } else {
    appointments.value = [];
  }

  loading.value = false;
};

// 监听手机号变化
watch(patientPhone, () => {
  loadAppointments();
});

onMounted(() => {
  loadAppointments();
});

const handleTabChange = (key: string) => {
  activeTab.value = key;
};

const handleSearch = (value: string) => {
  searchKeyword.value = value;
};

const handleSearchChange = () => {
  // 实时搜索
};

const handleAppointmentCancel = (_id: string) => {
  // 取消后刷新列表
  loadAppointments();
};

const goBack = () => {
  router.back();
};

const goToAppointment = () => {
  router.push('/appointment');
};
</script>

<style scoped>
.my-appointments-page {
  min-height: 100vh;
  padding-top: 64px;
  padding-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tab-section {
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 16px 24px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-section {
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-state {
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointments-list {
  background: #f5f5f5;
  border-radius: 0 0 12px 12px;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 200px;
}

.empty-state {
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .filter-section :deep(.ant-input-search) {
    width: 100% !important;
  }

  .appointments-list,
  .empty-state {
    padding: 16px;
  }
}
</style>
