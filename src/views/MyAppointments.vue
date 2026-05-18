/**
 * 我的预约页面
 * 
 * 患者查看和管理自己的预约记录
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="my-appointments">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined />
          返回
        </a-button>
        <h1>我的预约</h1>
        <a-button type="primary" @click="goToAppointment">
          <PlusOutlined />
          新建预约
        </a-button>
      </div>
    </div>

    <!-- 患者未登录提示 -->
    <div v-if="!currentPatient" class="login-prompt">
      <a-result
        status="warning"
        title="请先验证身份"
        sub-title="查看预约记录需要先验证您的患者身份"
      >
        <template #extra>
          <a-button type="primary" @click="goToConsultation">
            验证身份
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 主内容 -->
    <div v-else class="main-content">
      <!-- 患者信息卡片 -->
      <div class="patient-card">
        <UserOutlined class="patient-icon" />
        <div class="patient-info">
          <div class="patient-name">{{ currentPatient.name }}</div>
          <div class="patient-detail">
            生日：{{ currentPatient.birthday }}
          </div>
        </div>
        <div class="patient-actions">
          <a-button type="text" @click="switchPatient">
            切换用户
          </a-button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card" :class="{ active: activeTab === 'ALL' }" @click="changeTab('ALL')">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">全部预约</div>
        </div>
        <div class="stat-card" :class="{ active: activeTab === 'PENDING' }" @click="changeTab('PENDING')">
          <div class="stat-value pending">{{ stats.pending }}</div>
          <div class="stat-label">待确认</div>
        </div>
        <div class="stat-card" :class="{ active: activeTab === 'CONFIRMED' }" @click="changeTab('CONFIRMED')">
          <div class="stat-value confirmed">{{ stats.confirmed }}</div>
          <div class="stat-label">已确认</div>
        </div>
        <div class="stat-card" :class="{ active: activeTab === 'SCHEDULED' }" @click="changeTab('SCHEDULED')">
          <div class="stat-value scheduled">{{ stats.scheduled }}</div>
          <div class="stat-label">待就诊</div>
        </div>
        <div class="stat-card" :class="{ active: activeTab === 'COMPLETED' }" @click="changeTab('COMPLETED')">
          <div class="stat-value completed">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <!-- 状态 Tab -->
      <div class="status-tabs">
        <div 
          v-for="tab in statusTabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="changeTab(tab.key)"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </div>
      </div>

      <!-- 预约列表 -->
      <div class="appointment-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <a-spin size="large" />
          <span>加载预约记录...</span>
        </div>

        <!-- 空状态 -->
        <div v-else-if="appointments.length === 0" class="empty-container">
          <InboxOutlined class="empty-icon" />
          <div class="empty-text">
            <p>暂无{{ activeTab === 'ALL' ? '' : getTabLabel(activeTab) }}的预约记录</p>
            <a-button type="primary" @click="goToAppointment">
              立即预约
            </a-button>
          </div>
        </div>

        <!-- 预约列表 -->
        <div v-else class="list-container">
          <AppointmentItem
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            @cancel="handleCancelAppointment"
            @view-detail="handleViewDetail"
          />
          
          <!-- 分页 -->
          <div v-if="totalPages > 1" class="pagination">
            <a-pagination
              v-model:current="currentPage"
              :total="total"
              :page-size="pageSize"
              :show-quick-jumper="true"
              show-size-changer
              :page-size-options="['5', '10', '20']"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 预约详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="预约详情"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedAppointment" class="detail-content">
        <div class="detail-section">
          <h4>医生信息</h4>
          <div class="detail-row">
            <img :src="selectedAppointment.doctor.avatar" :alt="selectedAppointment.doctor.name" class="detail-avatar" />
            <div class="detail-info">
              <div class="detail-name">{{ selectedAppointment.doctor.name }}</div>
              <div class="detail-sub">{{ selectedAppointment.doctor.title }}</div>
              <div class="detail-sub">{{ selectedAppointment.doctor.department }}</div>
            </div>
          </div>
        </div>

        <a-divider />

        <div class="detail-section">
          <h4>预约信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">预约编号</span>
              <span class="detail-value">{{ selectedAppointment.appointmentNo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">预约状态</span>
              <a-tag :color="getStatusColor(selectedAppointment.status)">
                {{ getStatusText(selectedAppointment.status) }}
              </a-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">预约日期</span>
              <span class="detail-value">{{ formatDate(selectedAppointment.appointmentDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">预约时间</span>
              <span class="detail-value">{{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</span>
            </div>
          </div>
        </div>

        <a-divider />

        <div class="detail-section">
          <h4>就诊原因</h4>
          <p class="detail-text">{{ selectedAppointment.reason || '未填写' }}</p>
        </div>

        <div v-if="selectedAppointment.doctorNote" class="detail-section">
          <h4>医生备注</h4>
          <p class="detail-text">{{ selectedAppointment.doctorNote }}</p>
        </div>

        <div v-if="selectedAppointment.cancelReason" class="detail-section">
          <h4>取消信息</h4>
          <p class="detail-text cancel-text">
            取消原因：{{ getCancelReasonText(selectedAppointment.cancelReason) }}
            <span v-if="selectedAppointment.cancelNote"> - {{ selectedAppointment.cancelNote }}</span>
          </p>
        </div>

        <div class="detail-section">
          <h4>创建时间</h4>
          <p class="detail-time">{{ formatDateTime(selectedAppointment.createdAt) }}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  LeftOutlined,
  PlusOutlined,
  UserOutlined,
  InboxOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AppointmentItem from '../components/AppointmentItem.vue';
import { getMyAppointments, cancelAppointment } from '../api/appointment';
import { store } from '../store';
import type { Appointment, AppointmentStatus, CancelReason } from '../types';
import {
  getAppointmentStatusText,
  getAppointmentStatusColor,
  getCancelReasonText,
  formatAppointmentDate
} from '../utils/appointment';

const router = useRouter();

// 状态
const loading = ref(false);
const appointments = ref<Appointment[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const activeTab = ref<string>('ALL');

// 详情弹窗
const detailModalVisible = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

// 状态 Tab 配置
const statusTabs = computed(() => [
  { key: 'ALL', label: '全部', count: stats.total },
  { key: 'PENDING', label: '待确认', count: stats.pending },
  { key: 'CONFIRMED', label: '已确认', count: stats.confirmed },
  { key: 'SCHEDULED', label: '待就诊', count: stats.scheduled },
  { key: 'COMPLETED', label: '已完成', count: stats.completed },
  { key: 'CANCELLED', label: '已取消', count: stats.cancelled },
]);

// 统计数据
const stats = reactive({
  total: 0,
  pending: 0,
  confirmed: 0,
  scheduled: 0,
  completed: 0,
  cancelled: 0,
});

// 总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 当前患者
const currentPatient = computed(() => store.state.currentPatient);

/**
 * 获取 Tab 标签
 */
const getTabLabel = (key: string) => {
  const tab = statusTabs.value.find(t => t.key === key);
  return tab?.label || '';
};

/**
 * 计算统计数据
 */
const calculateStats = () => {
  // 这里可以从原始数据计算，或者由后端返回
  stats.total = total.value;
};

/**
 * 加载预约列表
 */
const loadAppointments = async () => {
  if (!currentPatient.value) return;

  loading.value = true;

  try {
    // 尝试从 API 获取
    try {
      const query: any = {
        patientId: currentPatient.value.id,
        page: currentPage.value,
        pageSize: pageSize.value,
      };

      // 添加状态筛选
      if (activeTab.value !== 'ALL') {
        query.status = activeTab.value;
      }

      const response = await getMyAppointments(query);
      appointments.value = response.appointments;
      total.value = response.total;
    } catch {
      // API 失败时从 localStorage 读取
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        appointments.value = allAppointments.filter(
          (apt: Appointment) => apt.patient.id === currentPatient.value?.id
        );
        total.value = appointments.value.length;
      }
    }
    
    calculateStats();
  } catch (error: any) {
    message.error(error.message || '加载预约列表失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 切换 Tab
 */
const changeTab = (tab: string) => {
  activeTab.value = tab;
  currentPage.value = 1;
  loadAppointments();
};

/**
 * 处理分页变化
 */
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page;
  pageSize.value = size;
  loadAppointments();
};

/**
 * 处理每页数量变化
 */
const handleSizeChange = (_current: number, size: number) => {
  currentPage.value = 1;
  pageSize.value = size;
  loadAppointments();
};

  /**
   * 取消预约
   */
  const handleCancelAppointment = async (
    appointment: Appointment,
    reason: { cancelReason: CancelReason; cancelNote?: string },
    callback?: (error?: any) => void
  ) => {
    try {
      await cancelAppointment(appointment.id, reason);
      message.success('预约已取消');
      loadAppointments();
      callback?.();
    } catch (error: any) {
      message.error(error.message || '取消失败，请重试');
      callback?.(error);
      throw error;
    }
  };

/**
 * 查看详情
 */
const handleViewDetail = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  detailModalVisible.value = true;
};

/**
 * 返回上一页
 */
const goBack = () => {
  router.back();
};

/**
 * 前往预约页面
 */
const goToAppointment = () => {
  router.push('/appointment');
};

/**
 * 前往问诊页面（验证身份）
 */
const goToConsultation = () => {
  router.push('/consultation');
};

/**
 * 切换用户
 */
const switchPatient = () => {
  store.logoutPatient();
  router.push('/consultation');
};

/**
 * 格式化日期
 */
const formatDate = (date: string) => {
  return formatAppointmentDate(date, 'YYYY年MM月DD日');
};

/**
 * 格式化日期时间
 */
const formatDateTime = (datetime: string) => {
  return dayjs(datetime).format('YYYY-MM-DD HH:mm');
};

/**
 * 获取状态文本
 */
const getStatusText = (status: AppointmentStatus) => {
  return getAppointmentStatusText(status);
};

/**
 * 获取状态颜色
 */
const getStatusColor = (status: AppointmentStatus) => {
  return getAppointmentStatusColor(status);
};

// 监听患者变化
watch(currentPatient, (newPatient) => {
  if (newPatient) {
    loadAppointments();
  }
});

// 初始化
onMounted(() => {
  // 尝试从 localStorage 恢复患者登录状态
  const storedPatient = localStorage.getItem('currentPatient');
  if (storedPatient && !currentPatient.value) {
    try {
      const patient = JSON.parse(storedPatient);
      store.verifyPatient(patient.name, patient.birthday);
    } catch {
      // 忽略解析错误
    }
  }
  
  if (currentPatient.value) {
    loadAppointments();
  }
});
</script>

<style scoped>
.my-appointments {
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px 24px;
  color: #fff;
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-content h1 {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.back-btn {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
  background: transparent;
}

.back-btn:hover {
  border-color: #fff;
  color: #fff;
}

.login-prompt {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 24px;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* 患者卡片 */
.patient-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.patient-icon {
  font-size: 40px;
  color: #667eea;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.patient-detail {
  font-size: 14px;
  color: #999;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-card.active .stat-value {
  color: #fff;
}

.stat-value.pending { color: #faad14; }
.stat-value.confirmed { color: #1890ff; }
.stat-value.scheduled { color: #13c2c2; }
.stat-value.completed { color: #52c41a; }

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.stat-card.active .stat-label {
  color: rgba(255, 255, 255, 0.8);
}

/* 状态 Tab */
.status-tabs {
  background: #fff;
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-item:hover {
  background: #f0f5ff;
  color: #1890ff;
}

.tab-item.active {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.tab-count {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.tab-item.active .tab-count {
  background: #1890ff;
  color: #fff;
}

/* 预约列表 */
.appointment-list {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 300px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
}

.empty-text {
  text-align: center;
}

.empty-text p {
  margin: 0 0 16px;
  color: #999;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

/* 详情弹窗 */
.detail-content {
  padding: 8px 0;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h4 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.detail-sub {
  font-size: 14px;
  color: #999;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 13px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.detail-text {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.cancel-text {
  color: #ff4d4f;
  background: #fff2f0;
}

.detail-time {
  margin: 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .status-tabs {
    padding: 8px;
  }

  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .patient-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
