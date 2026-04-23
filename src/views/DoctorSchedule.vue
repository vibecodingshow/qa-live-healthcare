<template>
  <div class="doctor-schedule">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button @click="goBack" class="back-btn">
          <template #icon><LeftOutlined /></template>
          返回
        </a-button>
        <h1>排班设置</h1>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><PlusOutlined /></template>
          添加排班
        </a-button>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="main-content">
      <!-- 医生信息卡片 -->
      <div class="doctor-card">
        <div class="doctor-info">
          <UserOutlined class="doctor-icon" />
          <div class="doctor-details">
            <div class="doctor-name">{{ currentDoctor?.name || '未登录医生' }}</div>
            <div class="doctor-title">
              {{ currentDoctor?.title }} · {{ currentDoctor?.department }}
            </div>
          </div>
        </div>
        <div class="schedule-stats">
          <div class="stat-item">
            <span class="stat-value">{{ schedules.length }}</span>
            <span class="stat-label">总排班</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ activeSchedules }}</span>
            <span class="stat-label">可用</span>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-range-picker
          v-model:value="dateRange"
          @change="handleDateRangeChange"
          :placeholder="['开始日期', '结束日期']"
        />
        <a-button @click="resetFilter">重置筛选</a-button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" />
        <span>加载排班数据...</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="schedules.length === 0" class="empty-container">
        <InboxOutlined class="empty-icon" />
        <div class="empty-text">
          <p>暂无排班记录</p>
          <p class="sub-text">点击"添加排班"按钮创建您的第一个排班</p>
        </div>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><PlusOutlined /></template>
          添加排班
        </a-button>
      </div>

      <!-- 排班列表 -->
      <div v-else class="schedule-list">
        <ScheduleCard
          v-for="schedule in schedules"
          :key="schedule.id"
          :schedule="schedule"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- 创建/编辑排班弹窗 -->
    <a-modal
      v-model:open="formModalVisible"
      :title="isEditing ? '编辑排班' : '添加排班'"
      width="700px"
      @ok="handleSubmit"
      @cancel="handleModalCancel"
      :confirm-loading="submitLoading"
      :ok-text="isEditing ? '保存' : '创建'"
      :cancel-text="'取消'"
    >
      <ScheduleForm ref="scheduleFormRef" :schedule="editingSchedule" />
    </a-modal>

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:open="deleteModalVisible"
      title="删除排班"
      @ok="confirmDelete"
      :confirm-loading="deleteLoading"
      ok-text="确认删除"
      cancel-text="取消"
      ok-button-props="{ danger: true }"
    >
      <div class="delete-confirm-content">
        <ExclamationCircleOutlined class="warning-icon" />
        <div class="confirm-text">
          <p>确定要删除该排班吗？</p>
          <p class="sub-text">
            删除后将无法恢复{{ hasBooked ? '，但该排班下有已预约的患者记录，请谨慎操作。' : '。' }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  LeftOutlined,
  PlusOutlined,
  UserOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { Dayjs } from 'dayjs';
import ScheduleCard from '../components/ScheduleCard.vue';
import ScheduleForm from '../components/ScheduleForm.vue';
import { 
  getDoctorSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../api/doctor-appointment';
import { store } from '../store';
import type { DoctorSchedule } from '../types/appointment';

const router = useRouter();

// 状态
const loading = ref(false);
const schedules = ref<DoctorSchedule[]>([]);
const dateRange = ref<[Dayjs, Dayjs] | null>(null);

// 弹窗状态
const formModalVisible = ref(false);
const deleteModalVisible = ref(false);
const submitLoading = ref(false);
const deleteLoading = ref(false);
const isEditing = ref(false);
const editingSchedule = ref<DoctorSchedule | undefined>(undefined);
const deletingSchedule = ref<DoctorSchedule | null>(null);

// 表单引用
const scheduleFormRef = ref<InstanceType<typeof ScheduleForm>>();

// 当前医生
const currentDoctor = computed(() => store.state.currentDoctor);

// 可用排班数
const activeSchedules = computed(() => {
  return schedules.value.filter(s => s.isAvailable).length;
});

// 是否有已预约记录
const hasBooked = computed(() => {
  if (!deletingSchedule.value) return false;
  return deletingSchedule.value.timeSlots.some(slot => slot.bookedAppointments > 0);
});

// 加载排班列表
const loadSchedules = async () => {
  if (!currentDoctor.value) {
    message.warning('请先登录医生账号');
    return;
  }

  loading.value = true;

  try {
    const query: any = {
      doctorId: currentDoctor.value.id,
    };

    if (dateRange.value) {
      query.startDate = dateRange.value[0].format('YYYY-MM-DD');
      query.endDate = dateRange.value[1].format('YYYY-MM-DD');
    }

    const response = await getDoctorSchedule(query);
    schedules.value = response.schedules.sort(
      (a, b) => new Date(b.scheduleDate).getTime() - new Date(a.scheduleDate).getTime()
    );
  } catch (error: any) {
    message.error(error.message || '加载排班列表失败');
  } finally {
    loading.value = false;
  }
};

// 日期范围变化
const handleDateRangeChange = () => {
  loadSchedules();
};

// 重置筛选
const resetFilter = () => {
  dateRange.value = null;
  loadSchedules();
};

// 显示创建弹窗
const showCreateModal = () => {
  isEditing.value = false;
  editingSchedule.value = undefined;
  formModalVisible.value = true;
};

// 处理编辑
const handleEdit = (schedule: DoctorSchedule) => {
  isEditing.value = true;
  editingSchedule.value = schedule;
  formModalVisible.value = true;
};

// 处理删除
const handleDelete = (schedule: DoctorSchedule) => {
  deletingSchedule.value = schedule;
  deleteModalVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (!deletingSchedule.value) return;

  deleteLoading.value = true;

  try {
    await deleteSchedule(deletingSchedule.value.id);
    message.success('排班已删除');
    deleteModalVisible.value = false;
    loadSchedules();
  } catch (error: any) {
    message.error(error.message || '删除失败');
  } finally {
    deleteLoading.value = false;
    deletingSchedule.value = null;
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!scheduleFormRef.value) return;

  try {
    await scheduleFormRef.value.validate();
    submitLoading.value = true;

    const formData = scheduleFormRef.value.getFormData();

    if (isEditing.value && editingSchedule.value) {
      // 更新排班
      await updateSchedule(editingSchedule.value.id, {
        scheduleId: editingSchedule.value.id,
        isAvailable: formData.isAvailable,
        timeSlots: formData.timeSlots,
      });
      message.success('排班已更新');
    } else {
      // 创建排班
      await createSchedule({
        scheduleDate: formData.scheduleDate,
        timeSlots: formData.timeSlots,
      });
      message.success('排班已创建');
    }

    formModalVisible.value = false;
    loadSchedules();
  } catch (error: any) {
    if (error.message) {
      message.error(error.message);
    }
  } finally {
    submitLoading.value = false;
  }
};

// 弹窗取消
const handleModalCancel = () => {
  scheduleFormRef.value?.resetForm();
};

// 返回上一页
const goBack = () => {
  router.push('/doctor/appointments');
};

// 监听医生变化
watch(currentDoctor, (newDoctor) => {
  if (newDoctor) {
    loadSchedules();
  }
});

// 初始化
onMounted(() => {
  if (currentDoctor.value) {
    loadSchedules();
  }
});
</script>

<style scoped>
.doctor-schedule {
  min-height: 100vh;
  background: #f0f2f5;
  padding-bottom: 40px;
}

.page-header {
  background: linear-gradient(135deg, #52c41a 0%, #237804 100%);
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

/* 医生信息卡片 */
.doctor-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-icon {
  font-size: 40px;
  color: #52c41a;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.doctor-title {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.schedule-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #52c41a;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 筛选区域 */
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

/* 加载和空状态 */
.loading-container,
.empty-container {
  background: #fff;
  border-radius: 12px;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

.empty-text .sub-text {
  font-size: 12px;
  color: #bfbfbf;
  margin-top: 8px;
}

/* 排班列表 */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 删除确认 */
.delete-confirm-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
}

.warning-icon {
  font-size: 24px;
  color: #faad14;
}

.confirm-text p {
  margin: 0 0 8px;
  color: #333;
}

.confirm-text .sub-text {
  font-size: 12px;
  color: #999;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .doctor-card {
    flex-direction: column;
    gap: 16px;
  }

  .schedule-stats {
    width: 100%;
    justify-content: center;
  }

  .filter-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>