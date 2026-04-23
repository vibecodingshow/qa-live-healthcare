<template>
  <div class="appointment-doctors-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>预约挂号</h1>
      <p>选择医生和时间，轻松预约门诊服务</p>
    </div>

    <!-- 我的预约区域 -->
    <div class="my-appointments-section">
      <!-- 未登录状态 -->
      <div v-if="!currentPatient" class="login-prompt-card">
        <CalendarOutlined class="prompt-icon" />
        <div class="prompt-text">登录后可查看和管理您的预约记录</div>
        <a-button type="primary" @click="showLoginModal">
          <UserOutlined />
          验证身份
        </a-button>
      </div>
      
      <!-- 已登录状态 -->
      <div v-else class="appointments-content">
        <div class="patient-info-bar">
          <UserOutlined />
          <span class="patient-name">{{ currentPatient.name }}</span>
          <a-divider type="vertical" />
          <span class="patient-birthday">生日：{{ currentPatient.birthday }}</span>
          <a-button type="link" size="small" @click="switchPatient">切换用户</a-button>
        </div>
        
        <div class="appointments-row">
          <!-- 统计卡片 -->
          <div class="mini-stats">
            <div class="mini-stat pending" @click="goToMyAppointments('PENDING')">
              <span class="stat-count">{{ appointmentStats.pending }}</span>
              <span class="stat-label">待确认</span>
            </div>
            <div class="mini-stat confirmed" @click="goToMyAppointments('CONFIRMED')">
              <span class="stat-count">{{ appointmentStats.confirmed }}</span>
              <span class="stat-label">已确认</span>
            </div>
            <div class="mini-stat completed" @click="goToMyAppointments('COMPLETED')">
              <span class="stat-count">{{ appointmentStats.completed }}</span>
              <span class="stat-label">已完成</span>
            </div>
          </div>
          
          <!-- 最近预约 -->
          <div class="recent-appointments">
            <div v-if="recentAppointments.length === 0" class="no-appointments">
              <InboxOutlined />
              <span>暂无预约记录</span>
            </div>
            <div v-else class="appointments-list">
              <div 
                v-for="apt in recentAppointments" 
                :key="apt.id" 
                class="appointment-preview-card"
                @click="goToMyAppointments()"
              >
                <div class="apt-doctor">
                  <img :src="apt.doctor?.avatar" :alt="apt.doctor?.name" class="apt-avatar" />
                  <div class="apt-info">
                    <div class="apt-doctor-name">{{ apt.doctor?.name }}</div>
                    <div class="apt-dept">{{ apt.doctor?.department }}</div>
                  </div>
                </div>
                <div class="apt-time">
                  <div class="apt-date">{{ formatDate(apt.appointmentDate) }}</div>
                  <div class="apt-slot">{{ apt.startTime }} - {{ apt.endTime }}</div>
                </div>
                <div class="apt-status">
                  <a-tag :color="getStatusColor(apt.status)">
                    {{ getStatusText(apt.status) }}
                  </a-tag>
                </div>
              </div>
              
              <a-button type="link" size="small" @click.stop="goToMyAppointments()">
                查看全部
                <RightOutlined />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-container">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索医生姓名"
          style="width: 300px"
          @search="handleSearch"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>

        <a-select
          v-model:value="selectedDepartment"
          placeholder="选择科室"
          style="width: 180px"
          allow-clear
          @change="handleDepartmentChange"
        >
          <a-select-option value="">全部科室</a-select-option>
          <a-select-option v-for="dept in departments" :key="dept" :value="dept">
            {{ dept }}
          </a-select-option>
        </a-select>

        <a-button @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
      </div>

      <div class="results-info">
        共找到 <span class="highlight">{{ filteredDoctors.length }}</span> 位医生
      </div>
    </div>

    <!-- 医生列表 -->
    <div class="doctors-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" tip="加载中..." />
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredDoctors.length === 0" class="empty-container">
        <Empty description="暂无符合条件的医生" />
      </div>

      <!-- 医生卡片列表 -->
      <div v-else class="doctors-grid">
        <a-card
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="doctor-card"
          hoverable
          @click="goToDoctorDetail(doctor)"
        >
          <div class="card-header">
            <a-avatar :size="72" :src="doctor.avatar">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="doctor-info">
              <h3 class="doctor-name">{{ doctor.name }}</h3>
              <p class="doctor-title">{{ doctor.title }}</p>
              <a-tag :color="getDepartmentColor(doctor.department)">
                {{ doctor.department }}
              </a-tag>
            </div>
          </div>

          <a-divider />

          <div class="card-body">
            <div class="info-row">
              <span class="label">擅长领域：</span>
              <span class="value">{{ doctor.specialties?.join('、') || '全科' }}</span>
            </div>
            <div class="info-row">
              <span class="label">坐诊时间：</span>
              <span class="value">{{ doctor.weeklySchedule || '详见排班' }}</span>
            </div>
          </div>

          <div class="card-footer">
            <a-button type="primary" block size="large">
              查看详情并预约
              <template #icon><RightOutlined /></template>
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
    
    <!-- 患者登录弹窗 -->
    <a-modal
      v-model:open="loginModalVisible"
      title="验证身份"
      :footer="null"
      @cancel="loginModalVisible = false"
    >
      <div class="login-form">
        <a-form layout="vertical">
          <a-form-item label="姓名">
            <a-input v-model:value="loginForm.name" placeholder="请输入您的姓名" />
          </a-form-item>
          <a-form-item label="生日">
            <a-date-picker 
              v-model:value="loginForm.birthday" 
              placeholder="请选择您的生日"
              format="YYYY-MM-DD"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block :loading="loginLoading" @click="handleLogin">
              确认身份
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  SearchOutlined,
  ReloadOutlined,
  RightOutlined,
  UserOutlined,
  CalendarOutlined,
  InboxOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Doctor } from '../store';
import { store } from '../store';
import { getDoctors } from '../api/appointment';

const router = useRouter();

// 状态
const loading = ref(false);
const doctors = ref<Doctor[]>([]);
const searchKeyword = ref('');
const selectedDepartment = ref<string | undefined>(undefined);

// 当前患者
const currentPatient = computed(() => store.state.currentPatient);

// 登录弹窗
const loginModalVisible = ref(false);
const loginLoading = ref(false);
const loginForm = ref({
  name: '',
  birthday: null as any
});

// 预约统计数据
const appointmentStats = computed(() => {
  const appointments = getPatientAppointments();
  return {
    pending: appointments.filter((a: any) => a.status === 'PENDING').length,
    confirmed: appointments.filter((a: any) => a.status === 'CONFIRMED' || a.status === 'SCHEDULED').length,
    completed: appointments.filter((a: any) => a.status === 'COMPLETED' || a.status === 'REJECTED' || a.status === 'CANCELLED').length
  };
});

// 获取当前患者的预约
const getPatientAppointments = () => {
  if (!currentPatient.value) return [];
  
  const storedAppointments = localStorage.getItem('appointments');
  if (!storedAppointments) return [];
  
  const allAppointments = JSON.parse(storedAppointments);
  return allAppointments.filter((apt: any) => apt.patient?.id === currentPatient.value?.id);
};

// 最近预约（最多显示2条）
const recentAppointments = computed(() => {
  const appointments = getPatientAppointments();
  return appointments.slice(0, 2);
});

// 科室列表
const departments = [
  '内科',
  '外科',
  '儿科',
  '妇产科',
  '骨科',
  '眼科',
  '耳鼻喉科',
  '皮肤科',
  '口腔科',
  '中医科',
];

// 筛选后的医生列表
const filteredDoctors = computed(() => {
  let result = doctors.value;

  // 按姓名搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(keyword) ||
        doctor.specialties?.some((s) => s.toLowerCase().includes(keyword))
    );
  }

  // 按科室筛选
  if (selectedDepartment.value) {
    result = result.filter((doctor) => doctor.department === selectedDepartment.value);
  }

  return result;
});

// 获取科室对应的颜色
const getDepartmentColor = (department: string): string => {
  const colorMap: Record<string, string> = {
    内科: 'blue',
    外科: 'green',
    儿科: 'orange',
    妇产科: 'pink',
    骨科: 'cyan',
    眼科: 'purple',
    耳鼻喉科: 'red',
    皮肤科: 'magenta',
    口腔科: 'geekblue',
    中医科: 'gold',
  };
  return colorMap[department] || 'blue';
};

// 加载医生列表
const loadDoctors = async () => {
  loading.value = true;
  try {
    // 优先使用 API 获取，否则使用 store 中的数据
    try {
      const result = await getDoctors();
      doctors.value = result;
    } catch {
      // API 失败时使用 store 数据
      doctors.value = store.state.doctors;
    }
  } catch (error) {
    console.error('加载医生列表失败:', error);
    message.error('加载医生列表失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  // 搜索已通过 computed 自动处理
};

// 科室筛选处理
const handleDepartmentChange = () => {
  // 筛选已通过 computed 自动处理
};

// 重置筛选
const handleReset = () => {
  searchKeyword.value = '';
  selectedDepartment.value = undefined;
};

// 跳转到医生详情页
const goToDoctorDetail = (doctor: Doctor) => {
  router.push(`/appointment/doctor/${doctor.id}`);
};

// 显示登录弹窗
const showLoginModal = () => {
  loginForm.value = { name: '', birthday: null };
  loginModalVisible.value = true;
};

// 处理登录
const handleLogin = () => {
  if (!loginForm.value.name || !loginForm.value.birthday) {
    message.warning('请填写完整信息');
    return;
  }
  
  loginLoading.value = true;
  
  try {
    const patient = store.verifyPatient(
      loginForm.value.name,
      loginForm.value.birthday.format('YYYY-MM-DD')
    );
    
    message.success(`欢迎 ${patient.name}！`);
    loginModalVisible.value = false;
  } catch (err: any) {
    message.error(err.message || '验证失败');
  } finally {
    loginLoading.value = false;
  }
};

// 切换用户
const switchPatient = () => {
  store.logoutPatient();
  showLoginModal();
};

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'orange',
    'CONFIRMED': 'green',
    'SCHEDULED': 'blue',
    'COMPLETED': 'gray',
    'REJECTED': 'red',
    'CANCELLED': 'red'
  };
  return colors[status] || 'default';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'SCHEDULED': '待就诊',
    'COMPLETED': '已完成',
    'REJECTED': '已拒绝',
    'CANCELLED': '已取消'
  };
  return texts[status] || status;
};

// 跳转到我的预约
const goToMyAppointments = (status?: string) => {
  if (status) {
    router.push({ path: '/appointment/my', query: { status } });
  } else {
    router.push('/appointment/my');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadDoctors();
  
  // 检查是否有已保存的患者信息
  const savedPatient = localStorage.getItem('currentPatient');
  if (savedPatient) {
    try {
      const patient = JSON.parse(savedPatient);
      store.verifyPatient(patient.name, patient.birthday);
    } catch (e) {
      // 忽略解析错误
    }
  }
});
</script>

<style scoped>
.appointment-doctors-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-header {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  padding: 60px 24px;
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

.search-section {
  max-width: 1200px;
  margin: -30px auto 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-container {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.results-info {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.results-info .highlight {
  color: #1890ff;
  font-weight: 600;
}

.doctors-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.doctor-card {
  cursor: pointer;
  transition: all 0.3s;
}

.doctor-card:hover {
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.2);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.doctor-title {
  font-size: 14px;
  color: #1890ff;
  margin: 0 0 8px;
}

.card-body {
  padding: 8px 0;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  color: #999;
  flex-shrink: 0;
}

.info-row .value {
  color: #333;
}

.card-footer {
  margin-top: 16px;
}

/* 我的预约区域样式 */
.my-appointments-section {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.login-prompt-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
}

.prompt-icon {
  font-size: 32px;
  color: #1890ff;
}

.prompt-text {
  font-size: 16px;
  color: #666;
}

.appointments-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.patient-info-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.patient-name {
  font-weight: 600;
  color: #1890ff;
}

.patient-birthday {
  color: #666;
  font-size: 14px;
}

.appointments-row {
  display: flex;
  gap: 24px;
}

.mini-stats {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
}

.mini-stat:hover {
  background: #e6f7ff;
  transform: translateY(-2px);
}

.mini-stat.pending {
  border-left: 3px solid #faad14;
}

.mini-stat.confirmed {
  border-left: 3px solid #52c41a;
}

.mini-stat.completed {
  border-left: 3px solid #8c8c8c;
}

.stat-count {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.mini-stat.pending .stat-count {
  color: #faad14;
}

.mini-stat.confirmed .stat-count {
  color: #52c41a;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.recent-appointments {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.no-appointments {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: #999;
  font-size: 14px;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.appointment-preview-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.appointment-preview-card:hover {
  background: #e6f7ff;
}

.apt-doctor {
  display: flex;
  align-items: center;
  gap: 8px;
}

.apt-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.apt-info {
  display: flex;
  flex-direction: column;
}

.apt-doctor-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.apt-dept {
  font-size: 12px;
  color: #999;
}

.apt-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.apt-date {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.apt-slot {
  font-size: 12px;
  color: #666;
}

.apt-status {
  margin-left: auto;
}

.login-form {
  padding: 16px 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .login-prompt-card {
    flex-direction: column;
    text-align: center;
  }

  .appointments-row {
    flex-direction: column;
  }

  .mini-stats {
    width: 100%;
    justify-content: space-between;
  }

  .appointment-preview-card {
    flex-wrap: wrap;
  }

  .apt-time {
    align-items: flex-start;
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container :deep(.ant-input-search),
  .search-container :deep(.ant-select) {
    width: 100% !important;
  }

  .doctors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
