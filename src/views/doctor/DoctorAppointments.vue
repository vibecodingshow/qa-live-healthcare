<template>
  <div class="doctor-appointments-page">
    <div class="page-container">
      <!-- 顶部导航 -->
      <div class="page-header">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined /> 返回
        </a-button>
        <h1>预约管理</h1>
      </div>

      <!-- 医生信息 -->
      <div class="doctor-info-card" v-if="currentDoctor">
        <a-avatar :size="64" class="doctor-avatar">
          {{ currentDoctor.name?.charAt(0) || '?' }}
        </a-avatar>
        <div class="doctor-details">
          <div class="doctor-name">
            {{ currentDoctor.name }}
            <a-tag :color="currentDoctor.isActive ? 'green' : 'default'" class="status-tag">
              {{ currentDoctor.isActive ? '在职' : '休息' }}
            </a-tag>
          </div>
          <div class="doctor-title">{{ currentDoctor.title }}</div>
          <div class="doctor-department">{{ currentDoctor.department }}</div>
        </div>
      </div>

      <!-- 统计数据 -->
      <AppointmentStats :stats="statistics" />

      <!-- 日期选择 -->
      <div class="date-selector">
        <a-date-picker
          v-model:value="selectedDate"
          :disabled-date="disabledDate"
          format="YYYY-MM-DD"
          :allowClear="false"
          @change="handleDateChange"
        />
      </div>

      <!-- Tab 切换 -->
      <div class="tab-section">
        <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
          <a-tab-pane key="all" tab="全部" />
          <a-tab-pane key="pending" tab="待到诊" />
          <a-tab-pane key="completed" tab="已到诊" />
        </a-tabs>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <a-spin size="large" tip="加载中..." />
      </div>

      <!-- 患者列表 -->
      <div v-else-if="filteredAppointments.length > 0" class="patients-list">
        <PatientCard
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          :appointment="appointment"
          @mark-arrived="handleMarkArrived"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <a-result
          status="info"
          title="暂无预约"
          :sub-title="selectedDateText + ' 没有患者预约'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { LeftOutlined } from '@ant-design/icons-vue';
import { store, type Appointment } from '../../store';
import AppointmentStats from '../../components/appointment/AppointmentStats.vue';
import PatientCard from '../../components/appointment/PatientCard.vue';

const router = useRouter();

// 状态
const loading = ref(true);
const currentDoctor = ref(store.state.currentDoctor);
const appointments = ref<Appointment[]>([]);
const activeTab = ref('all');
const selectedDate = ref<Dayjs>(dayjs());
const statistics = ref({
  totalToday: 0,
  arrivedToday: 0,
  pendingToday: 0,
});

// 格式化日期文本
const selectedDateText = computed(() => {
  return selectedDate.value.format('YYYY年MM月DD日');
});

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  const dateStr = selectedDate.value.format('YYYY-MM-DD');
  let result = appointments.value.filter(a => a.appointmentDate === dateStr);

  // 按状态筛选
  if (activeTab.value !== 'all') {
    result = result.filter(a => a.status === activeTab.value);
  }

  // 按时间排序
  return result.sort((a, b) => {
    return a.appointmentTime.localeCompare(b.appointmentTime);
  });
});

// 禁用今天之前的日期
const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// 加载预约数据
const loadAppointments = () => {
  if (!currentDoctor.value) {
    loading.value = false;
    return;
  }

  loading.value = true;

  // 获取该医生的所有预约
  appointments.value = store.getAppointmentsByDoctor(currentDoctor.value.id);

  // 获取统计数据
  statistics.value = store.getDoctorStatistics(currentDoctor.value.id);

  loading.value = false;
};

// 处理日期变更
const handleDateChange = () => {
  loadAppointments();
};

// 处理 Tab 切换
const handleTabChange = (key: string) => {
  activeTab.value = key;
};

// 标记到诊
const handleMarkArrived = (appointmentId: string) => {
  store.markAppointmentCompleted(appointmentId);
  message.success('已标记患者到诊');
  loadAppointments();
};

// 返回上一页
const goBack = () => {
  router.back();
};

onMounted(() => {
  // 检查是否已登录
  if (!currentDoctor.value) {
    message.warning('请先登录医生账号');
    router.push('/doctor/login');
    return;
  }

  loadAppointments();
});

// 监听医生变化
watch(
  () => store.state.currentDoctor,
  (newDoctor) => {
    currentDoctor.value = newDoctor;
    if (newDoctor) {
      loadAppointments();
    }
  }
);
</script>

<style scoped>
.doctor-appointments-page {
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

.doctor-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 28px;
  font-weight: 600;
  flex-shrink: 0;
}

.doctor-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doctor-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  font-size: 12px;
}

.doctor-title {
  font-size: 14px;
  color: #666;
}

.doctor-department {
  font-size: 14px;
  color: #1890ff;
}

.date-selector {
  margin-bottom: 16px;
}

.date-selector :deep(.ant-picker) {
  width: 100%;
  border-radius: 8px;
}

.date-selector :deep(.ant-picker-input > input) {
  font-size: 16px;
}

.tab-section {
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 16px 24px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-state {
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 80px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patients-list {
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

  .doctor-info-card {
    padding: 16px;
    gap: 16px;
  }

  .doctor-avatar {
    width: 48px !important;
    height: 48px !important;
    line-height: 48px !important;
  }

  .doctor-name {
    font-size: 18px;
  }

  .patients-list,
  .empty-state {
    padding: 16px;
  }
}
</style>
