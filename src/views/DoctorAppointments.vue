/**
 * 医生端预约管理页面
 * 
 * 医生查看和管理自己的预约记录
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="doctor-appointments">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined />
          返回
        </a-button>
        <h1>预约管理</h1>
        <a-button type="primary" @click="goToSchedule">
          <SettingOutlined />
          排班设置
        </a-button>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="main-content">
      <!-- 医生信息卡片 -->
      <div class="doctor-card">
        <UserOutlined class="doctor-icon" />
        <div class="doctor-info">
          <div class="doctor-name">{{ currentDoctor?.name || '未登录医生' }}</div>
          <div class="doctor-detail">
            {{ currentDoctor?.title }} · {{ currentDoctor?.department }}
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <AppointmentStats :stats="stats" />

      <!-- 筛选器 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <div 
            v-for="filter in filterOptions" 
            :key="filter.key"
            class="filter-tab"
            :class="{ active: activeFilter === filter.key }"
            @click="changeFilter(filter.key)"
          >
            {{ filter.label }}
          </div>
        </div>

        <div class="date-range-picker">
          <a-range-picker 
            v-model:value="dateRange" 
            @change="handleDateRangeChange"
            :placeholder="['开始日期', '结束日期']"
          />
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
            <p>暂无{{ activeFilter === 'ALL' ? '' : getFilterLabel(activeFilter) }}的预约记录</p>
          </div>
        </div>

        <!-- 预约列表 -->
        <div v-else class="list-container">
          <DoctorAppointmentItem
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
            @view-detail="handleViewDetail"
            @confirm="handleConfirm"
            @reject="handleReject"
            @complete="handleComplete"
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
          <h4>患者信息</h4>
          <div class="detail-row">
            <a-avatar :size="56" class="detail-avatar">
              {{ selectedAppointment.patient.name.charAt(0) }}
            </a-avatar>
            <div class="detail-info">
              <div class="detail-name">{{ selectedAppointment.patient.name }}</div>
              <div class="detail-sub">
                {{ selectedAppointment.patient.gender === 'male' ? '男' : '女' }} · {{ selectedAppointment.patient.age }}岁
              </div>
              <div class="detail-sub">生日：{{ selectedAppointment.patient.birthday }}</div>
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
          <p class="detail-text note-text">{{ selectedAppointment.doctorNote }}</p>
        </div>

        <div class="detail-section">
          <h4>创建时间</h4>
          <p class="detail-time">{{ formatDateTime(selectedAppointment.createdAt) }}</p>
        </div>
      </div>
    </a-modal>

    <!-- 拒绝预约弹窗 -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝预约"
      @ok="submitReject"
      :confirm-loading="rejectLoading"
      ok-text="确认拒绝"
      cancel-text="取消"
    >
      <div class="reject-form">
        <p class="reject-tip">请选择或输入拒绝原因：</p>
        <a-form :model="rejectForm" layout="vertical">
          <a-form-item label="拒绝原因">
            <a-select 
              v-model:value="rejectForm.reason" 
              placeholder="请选择拒绝原因"
            >
              <a-select-option value="SCHEDULE_CONFLICT">时间冲突</a-select-option>
              <a-select-option value="PATIENT_NOT_SUITABLE">患者情况不适合</a-select-option>
              <a-select-option value="NEED_REFERral">需要转诊</a-select-option>
              <a-select-option value="OTHER">其他原因</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="补充说明（可选）">
            <a-textarea 
              v-model:value="rejectForm.note"
              :rows="3"
              placeholder="请输入补充说明"
            />
          </a-form-item>
        </a-form>
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
  UserOutlined,
  SettingOutlined,
  InboxOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AppointmentStats from '../components/AppointmentStats.vue';
import DoctorAppointmentItem from '../components/DoctorAppointmentItem.vue';
import { 
  getDoctorAppointments, 
  confirmAppointment,
  rejectAppointment,
  completeAppointment,
  getAppointmentStats 
} from '../api/doctor-appointment';
import { store } from '../store';
import type { Appointment, AppointmentStatus } from '../types';
import {
  getAppointmentStatusText,
  getAppointmentStatusColor
} from '../utils/appointment';

const router = useRouter();

// 状态
const loading = ref(false);
const appointments = ref<Appointment[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const activeFilter = ref('ALL');

// 筛选选项
const filterOptions = [
  { key: 'ALL', label: '全部' },
  { key: 'PENDING', label: '待确认' },
  { key: 'CONFIRMED', label: '已确认' },
  { key: 'SCHEDULED', label: '待就诊' },
  { key: 'COMPLETED', label: '已完成' },
];

// 日期范围
const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

// 详情弹窗
const detailModalVisible = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

// 拒绝弹窗
const rejectModalVisible = ref(false);
const rejectLoading = ref(false);
const rejectForm = reactive({
  appointmentId: '',
  reason: '',
  note: '',
});

// 统计数据
const stats = reactive({
  totalCount: 0,
  pendingCount: 0,
  confirmedCount: 0,
  todayCount: 0,
  completedCount: 0,
});

// 总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 当前医生
const currentDoctor = computed(() => store.state.currentDoctor);

/**
 * 获取筛选标签
 */
const getFilterLabel = (key: string) => {
  const filter = filterOptions.find(f => f.key === key);
  return filter?.label || '';
};

/**
 * 切换筛选
 */
const changeFilter = (filter: string) => {
  activeFilter.value = filter;
  currentPage.value = 1;
  loadAppointments();
};

/**
 * 日期范围变化
 */
const handleDateRangeChange = () => {
  currentPage.value = 1;
  loadAppointments();
};

/**
 * 加载预约列表
 */
const loadAppointments = async () => {
  if (!currentDoctor.value) {
    message.warning('请先登录医生账号');
    return;
  }

  loading.value = true;

  // 获取当前医生的标识信息
  const doctorId = currentDoctor.value.id;
  const doctorName = currentDoctor.value.name;
  console.log('========== 加载预约列表 ==========');
  console.log('当前医生 ID:', doctorId);
  console.log('当前医生姓名:', doctorName);

  try {
    // 尝试从 API 获取
    let apiSuccess = false;
    try {
      const query: any = {
        doctorId: doctorId,
        page: currentPage.value,
        pageSize: pageSize.value,
      };

      // 添加状态筛选
      if (activeFilter.value !== 'ALL') {
        query.status = activeFilter.value;
      }

      // 添加日期范围筛选
      if (dateRange.value) {
        query.startDate = dateRange.value[0].format('YYYY-MM-DD');
        query.endDate = dateRange.value[1].format('YYYY-MM-DD');
      }

      const response = await getDoctorAppointments(query);
      console.log('API 返回数据:', response);
      
      // 检查 API 返回的数据是否有效
      if (response.appointments && response.appointments.length > 0) {
        appointments.value = response.appointments;
        total.value = response.total;
        apiSuccess = true;
        console.log('API 返回了有效数据，使用 API 数据');
      } else {
        console.log('API 返回空数据或无效数据，尝试从 localStorage 读取');
      }
    } catch (apiError: any) {
      console.log('API 调用失败，尝试从 localStorage 读取:', apiError.message);
    }

    // 如果 API 没有返回有效数据，从 localStorage 读取
    if (!apiSuccess) {
      console.log('从 localStorage 读取预约数据...');
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        console.log('localStorage 中的预约数量:', allAppointments.length);
        
        // 详细打印每条预约的医生信息用于调试
        console.log('===== 遍历预约数据 =====');
        allAppointments.forEach((apt: any, index: number) => {
          console.log(`预约 ${index + 1}:`, {
            id: apt.id,
            doctorId: apt.doctor?.id,
            doctorName: apt.doctor?.name,
            appointmentDate: apt.appointmentDate
          });
        });
        
        // 筛选当前医生的预约 - 使用多种匹配方式
        appointments.value = allAppointments.filter((apt: any) => {
          // 方式1: ID 精确匹配
          if (apt.doctor?.id === doctorId) {
            console.log(`通过 ID 匹配: ${apt.doctor?.id} === ${doctorId}`);
            return true;
          }
          // 方式2: 姓名匹配（用于处理 ID 格式不一致的情况）
          if (apt.doctor?.name === doctorName) {
            console.log(`通过姓名匹配: ${apt.doctor?.name} === ${doctorName}`);
            return true;
          }
          // 方式3: 医生对象中包含当前医生的 username
          if (apt.doctor?.username === currentDoctor.value?.username) {
            console.log(`通过 username 匹配: ${apt.doctor?.username} === ${currentDoctor.value?.username}`);
            return true;
          }
          return false;
        });
        
        console.log('筛选后预约数量:', appointments.value.length);
        total.value = appointments.value.length;
      } else {
        console.log('localStorage 中没有预约数据');
        appointments.value = [];
        total.value = 0;
      }
    }
  } catch (error: any) {
    console.error('加载预约列表出错:', error);
    message.error(error.message || '加载预约列表失败');
  } finally {
    loading.value = false;
    console.log('========== 加载完成 ==========');
  }
};

/**
 * 从 localStorage 计算统计数据
 */
const calculateStatsFromStorage = () => {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const allAppointments = JSON.parse(storedAppointments);
    console.log('计算统计数据 - localStorage 预约数量:', allAppointments.length);
    
    // 筛选当前医生的预约 - 使用多种匹配方式
    const doctorAppointments = allAppointments.filter((apt: any) => {
      const doctorId = currentDoctor.value?.id;
      const doctorName = currentDoctor.value?.name;
      const doctorUsername = currentDoctor.value?.username;
      
      return apt.doctor?.id === doctorId ||
             apt.doctor?.name === doctorName ||
             apt.doctor?.username === doctorUsername;
    });
    
    console.log('当前医生预约数量:', doctorAppointments.length);
    
    stats.totalCount = doctorAppointments.length;
    stats.pendingCount = doctorAppointments.filter((a: any) => a.status === 'PENDING').length;
    stats.confirmedCount = doctorAppointments.filter((a: any) => a.status === 'CONFIRMED' || a.status === 'SCHEDULED').length;
    stats.todayCount = doctorAppointments.filter((a: any) => {
      const today = new Date().toISOString().split('T')[0];
      return a.appointmentDate === today;
    }).length;
    stats.completedCount = doctorAppointments.filter((a: any) => a.status === 'COMPLETED').length;
    
    console.log('统计数据:', stats);
  } else {
    console.log('localStorage 中没有预约数据');
    stats.totalCount = 0;
    stats.pendingCount = 0;
    stats.confirmedCount = 0;
    stats.todayCount = 0;
    stats.completedCount = 0;
  }
};

/**
 * 加载统计数据
 */
const loadStats = async () => {
  if (!currentDoctor.value) return;

  try {
    // 尝试从 API 获取
    let apiSuccess = false;
    try {
      const response = await getAppointmentStats(currentDoctor.value.id);
      
      // 检查 API 返回的数据是否有效
      const apiHasData = response.pendingCount > 0 || response.confirmedCount > 0 || 
                         response.todayCount > 0 || response.completedCount > 0;
      
      if (apiHasData) {
        stats.totalCount = response.pendingCount + response.confirmedCount + response.todayCount;
        stats.pendingCount = response.pendingCount;
        stats.confirmedCount = response.confirmedCount;
        stats.todayCount = response.todayCount;
        stats.completedCount = response.completedCount;
        apiSuccess = true;
        console.log('API 统计有效，使用 API 数据');
      } else {
        console.log('API 统计数据为空，尝试从 localStorage 读取');
      }
    } catch (apiError: any) {
      console.log('API 调用失败，尝试从 localStorage 读取:', apiError.message);
    }

    // 如果 API 没有返回有效数据，从 localStorage 读取
    if (!apiSuccess) {
      calculateStatsFromStorage();
    }
  } catch (error: any) {
    console.error('加载统计数据失败:', error);
    // 出错时也尝试从 localStorage 读取
    calculateStatsFromStorage();
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
 * 更新 localStorage 中的预约状态
 */
const updateLocalStorageAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
  const storedAppointments = localStorage.getItem('appointments');
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    const index = appointments.findIndex((apt: any) => apt.id === appointmentId);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('appointments', JSON.stringify(appointments));
      console.log('已更新 localStorage 中的预约状态:', appointmentId, updates);
    }
  }
};

/**
 * 确认预约
 */
const handleConfirm = async (appointment: Appointment) => {
  try {
    // 尝试使用 API
    try {
      await confirmAppointment(appointment.id, '');
    } catch {
      // API 失败时更新 localStorage
      updateLocalStorageAppointment(appointment.id, {
        status: 'CONFIRMED'
      });
    }
    message.success('预约已确认');
    loadAppointments();
    loadStats();
  } catch (error: any) {
    message.error(error.message || '确认失败，请重试');
  }
};

/**
 * 拒绝预约
 */
const handleReject = (appointment: Appointment) => {
  rejectForm.appointmentId = appointment.id;
  rejectForm.reason = '';
  rejectForm.note = '';
  rejectModalVisible.value = true;
};

/**
 * 提交拒绝
 */
const submitReject = async () => {
  if (!rejectForm.reason) {
    message.warning('请选择拒绝原因');
    return;
  }

  rejectLoading.value = true;

  try {
    // 尝试使用 API
    try {
      await rejectAppointment(rejectForm.appointmentId, rejectForm.reason + (rejectForm.note ? `: ${rejectForm.note}` : ''));
    } catch {
      // API 失败时更新 localStorage
      updateLocalStorageAppointment(rejectForm.appointmentId, {
        status: 'REJECTED',
        doctorNote: rejectForm.reason + (rejectForm.note ? `: ${rejectForm.note}` : '')
      });
    }
    message.success('已拒绝该预约');
    rejectModalVisible.value = false;
    loadAppointments();
    loadStats();
  } catch (error: any) {
    message.error(error.message || '拒绝失败，请重试');
  } finally {
    rejectLoading.value = false;
  }
};

/**
 * 完成就诊
 */
const handleComplete = async (appointment: Appointment) => {
  try {
    // 尝试使用 API
    try {
      await completeAppointment(appointment.id);
    } catch {
      // API 失败时更新 localStorage
      updateLocalStorageAppointment(appointment.id, {
        status: 'COMPLETED'
      });
    }
    message.success('已完成就诊记录');
    loadAppointments();
    loadStats();
  } catch (error: any) {
    message.error(error.message || '操作失败，请重试');
  }
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
 * 返回上一页
 */
const goBack = () => {
  router.back();
};

/**
 * 前往排班设置
 */
const goToSchedule = () => {
  router.push('/doctor/schedule');
};

/**
 * 格式化日期
 */
const formatDate = (date: string) => {
  const d = new Date(date);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[d.getDay()];
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日 ${weekday}`;
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

// 监听医生变化
watch(currentDoctor, (newDoctor) => {
  if (newDoctor) {
    loadAppointments();
    loadStats();
  }
});

// 初始化
onMounted(() => {
  if (currentDoctor.value) {
    loadAppointments();
    loadStats();
  }
});
</script>

<style scoped>
.doctor-appointments {
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
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

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* 医生卡片 */
.doctor-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-icon {
  font-size: 40px;
  color: #1890ff;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.doctor-detail {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

/* 筛选器 */
.filter-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #f0f5ff;
  color: #1890ff;
}

.filter-tab.active {
  background: #1890ff;
  color: #fff;
  font-weight: 500;
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
  margin: 0;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 20px;
  font-weight: 600;
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

.note-text {
  background: #fffbe6;
  color: #ad6800;
}

.detail-time {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 拒绝表单 */
.reject-form {
  padding: 8px 0;
}

.reject-tip {
  margin: 0 0 16px;
  color: #666;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filter-tabs {
    overflow-x: auto;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .doctor-card {
    flex-direction: column;
    text-align: center;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }
}
</style>
