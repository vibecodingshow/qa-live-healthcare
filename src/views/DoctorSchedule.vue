<template>
  <div class="doctor-schedule">
    <div class="schedule-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>排班管理</h1>
        <p>设置您的出诊时间和可预约号源</p>
      </div>

      <!-- 医生信息卡片 -->
      <a-card class="doctor-info-card" :bordered="false">
        <div class="doctor-info">
          <a-avatar :size="64" :src="currentDoctor?.avatar" />
          <div class="doctor-details">
            <h2>{{ currentDoctor?.name }}</h2>
            <p>{{ currentDoctor?.title }} · {{ currentDoctor?.department }}</p>
          </div>
        </div>
      </a-card>

      <!-- 排班配置表单 -->
      <a-card class="schedule-form-card" :bordered="false">
        <a-form :model="formState" layout="vertical">
          <!-- 日期选择 -->
          <a-form-item label="选择出诊日期">
            <a-date-picker
              v-model:value="formState.selectedDate"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              style="width: 100%"
              size="large"
              @change="onDateChange"
            />
          </a-form-item>

          <!-- 时段配置 -->
          <div class="time-slots-config">
            <h3>时段配置</h3>
            
            <!-- 上午时段 -->
            <a-card class="slot-card" size="small">
              <div class="slot-header">
                <ClockCircleOutlined class="slot-icon morning" />
                <span class="slot-title">上午</span>
                <span class="slot-time">08:00 - 12:00</span>
              </div>
              <div class="slot-controls">
                <a-form-item label="是否出诊">
                  <a-switch v-model:checked="formState.morning.isOpen" />
                </a-form-item>
                <a-form-item label="可预约号源">
                  <a-input-number
                    v-model:value="formState.morning.totalSlots"
                    :min="0"
                    :max="50"
                    :disabled="!formState.morning.isOpen"
                    style="width: 120px"
                  />
                </a-form-item>
              </div>
            </a-card>

            <!-- 下午时段 -->
            <a-card class="slot-card" size="small">
              <div class="slot-header">
                <CalendarOutlined class="slot-icon afternoon" />
                <span class="slot-title">下午</span>
                <span class="slot-time">14:00 - 18:00</span>
              </div>
              <div class="slot-controls">
                <a-form-item label="是否出诊">
                  <a-switch v-model:checked="formState.afternoon.isOpen" />
                </a-form-item>
                <a-form-item label="可预约号源">
                  <a-input-number
                    v-model:value="formState.afternoon.totalSlots"
                    :min="0"
                    :max="50"
                    :disabled="!formState.afternoon.isOpen"
                    style="width: 120px"
                  />
                </a-form-item>
              </div>
            </a-card>

            <!-- 晚上时段 -->
            <a-card class="slot-card" size="small">
              <div class="slot-header">
                <FieldTimeOutlined class="slot-icon evening" />
                <span class="slot-title">晚上</span>
                <span class="slot-time">18:00 - 21:00</span>
              </div>
              <div class="slot-controls">
                <a-form-item label="是否出诊">
                  <a-switch v-model:checked="formState.evening.isOpen" />
                </a-form-item>
                <a-form-item label="可预约号源">
                  <a-input-number
                    v-model:value="formState.evening.totalSlots"
                    :min="0"
                    :max="50"
                    :disabled="!formState.evening.isOpen"
                    style="width: 120px"
                  />
                </a-form-item>
              </div>
            </a-card>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <a-button @click="resetForm">重置</a-button>
            <a-button type="primary" :loading="saving" @click="saveSchedule">
              保存排班
            </a-button>
          </div>
        </a-form>
      </a-card>

      <!-- 当前排班预览 -->
      <a-card class="schedule-preview-card" :bordered="false" v-if="formState.selectedDate">
        <template #title>
          <CalendarOutlined /> 当前排班预览
        </template>
        <a-table
          :columns="columns"
          :data-source="schedulePreview"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.isOpen ? 'green' : 'default'">
                {{ record.isOpen ? '可预约' : '休息' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'remaining'">
              <span :class="{ 'text-danger': record.remaining === 0 }">
                {{ record.remaining }} / {{ record.totalSlots }}
              </span>
            </template>
            <template v-else-if="column.key === 'timeSlot'">
              <span>{{ getTimeSlotLabel(record.timeSlot) }}</span>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- 全部待就诊预约 -->
      <a-card class="patient-list-card all-pending-card" :bordered="false">
        <template #title>
          <TeamOutlined /> 全部待就诊预约
        </template>
        <template #extra>
          <a-tag color="red">共 {{ pendingPatientList.length }} 人</a-tag>
        </template>
        <a-table
          v-if="pendingPatientList.length > 0"
          :columns="pendingPatientColumns"
          :data-source="pendingPatientList"
          :pagination="{ pageSize: 10 }"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
        <a-empty v-else description="暂无待就诊患者" />
      </a-card>

      <!-- 当日预约患者列表 -->
      <a-card class="patient-list-card" :bordered="false" v-if="formState.selectedDate">
        <template #title>
          <TeamOutlined /> 当日预约患者 ({{ formState.selectedDate }})
        </template>
        <template #extra>
          <a-tag color="blue">共 {{ patientList.length }} 人</a-tag>
        </template>
        <a-table
          v-if="patientList.length > 0"
          :columns="patientColumns"
          :data-source="patientList"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
        <a-empty v-else description="当日暂无预约患者" />
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined, TeamOutlined } from '@ant-design/icons-vue';
import dayjs, { Dayjs } from 'dayjs';
import { store } from '../store';
import { 
  TimeSlot, 
  type TimeSlotType,
  AppointmentStatus,
  type AppointmentStatusType,
  getDoctorSchedules, 
  getDoctorAppointments,
  getDoctorAppointmentsByDate,
  saveSchedule as saveScheduleToStorage,
  updateSchedule,
  type Schedule,
  type Appointment 
} from '@/data/appointment';

const router = useRouter();
const saving = ref(false);
const todayAppointments = ref<Appointment[]>([]);

// 当前登录医生
const currentDoctor = computed(() => store.state.currentDoctor);

// 检查登录状态并默认加载今天的数据
onMounted(() => {
  if (!currentDoctor.value) {
    message.warning('请先登录');
    router.push('/doctor/login');
    return;
  }
  // 默认选中今天并加载数据
  formState.selectedDate = dayjs().format('YYYY-MM-DD');
  onDateChange();
  refreshPendingAppointments();
});

// 表单状态
const formState = reactive({
  selectedDate: '' as string,
  morning: {
    isOpen: false,
    totalSlots: 10
  },
  afternoon: {
    isOpen: false,
    totalSlots: 8
  },
  evening: {
    isOpen: false,
    totalSlots: 5
  }
});

// 禁用过去日期
const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// 日期变化时加载已有排班和预约列表
const onDateChange = () => {
  if (!formState.selectedDate || !currentDoctor.value) return;
  
  const schedules = getDoctorSchedules(currentDoctor.value.id)
    .filter(s => s.date === formState.selectedDate);
  
  // 重置表单
  formState.morning = { isOpen: false, totalSlots: 10 };
  formState.afternoon = { isOpen: false, totalSlots: 8 };
  formState.evening = { isOpen: false, totalSlots: 5 };
  
  // 填充已有排班
  for (const schedule of schedules) {
    if (schedule.timeSlot === TimeSlot.MORNING) {
      formState.morning.isOpen = schedule.isOpen;
      formState.morning.totalSlots = schedule.totalSlots;
    } else if (schedule.timeSlot === TimeSlot.AFTERNOON) {
      formState.afternoon.isOpen = schedule.isOpen;
      formState.afternoon.totalSlots = schedule.totalSlots;
    } else if (schedule.timeSlot === TimeSlot.EVENING) {
      formState.evening.isOpen = schedule.isOpen;
      formState.evening.totalSlots = schedule.totalSlots;
    }
  }
  
  // 加载当日预约列表
  todayAppointments.value = getDoctorAppointmentsByDate(
    currentDoctor.value.id, 
    formState.selectedDate
  );
  
  // 同时刷新全部待就诊列表
  refreshPendingAppointments();
};

// 排班预览数据
const schedulePreview = computed(() => {
  if (!formState.selectedDate || !currentDoctor.value) return [];
  
  // 获取当前存储中的排班数据（含实际 bookedSlots）
  const storedSchedules = getDoctorSchedules(currentDoctor.value.id)
    .filter(s => s.date === formState.selectedDate);
  
  const getBookedSlots = (timeSlot: TimeSlotType): number => {
    const stored = storedSchedules.find(s => s.timeSlot === timeSlot);
    return stored?.bookedSlots || 0;
  };
  
  const slots = [
    {
      key: 'morning',
      timeSlot: TimeSlot.MORNING,
      isOpen: formState.morning.isOpen,
      totalSlots: formState.morning.isOpen ? formState.morning.totalSlots : 0,
      remaining: formState.morning.isOpen ? formState.morning.totalSlots - getBookedSlots(TimeSlot.MORNING) : 0
    },
    {
      key: 'afternoon',
      timeSlot: TimeSlot.AFTERNOON,
      isOpen: formState.afternoon.isOpen,
      totalSlots: formState.afternoon.isOpen ? formState.afternoon.totalSlots : 0,
      remaining: formState.afternoon.isOpen ? formState.afternoon.totalSlots - getBookedSlots(TimeSlot.AFTERNOON) : 0
    },
    {
      key: 'evening',
      timeSlot: TimeSlot.EVENING,
      isOpen: formState.evening.isOpen,
      totalSlots: formState.evening.isOpen ? formState.evening.totalSlots : 0,
      remaining: formState.evening.isOpen ? formState.evening.totalSlots - getBookedSlots(TimeSlot.EVENING) : 0
    }
  ];
  
  return slots;
});

// 表格列定义
const columns = [
  {
    title: '时段',
    dataIndex: 'timeSlot',
    key: 'timeSlot'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '号源 (剩余/总数)',
    dataIndex: 'remaining',
    key: 'remaining'
  }
];

// 患者列表表格列定义
const patientColumns = [
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    key: 'patientName'
  },
  {
    title: '联系方式',
    dataIndex: 'patientPhone',
    key: 'patientPhone'
  },
  {
    title: '就诊时段',
    dataIndex: 'timeSlot',
    key: 'timeSlot'
  },
  {
    title: '预约状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '病情描述',
    dataIndex: 'symptom',
    key: 'symptom',
    ellipsis: true
  }
];

// 当日患者列表数据（按预约时间排序）
const patientList = computed(() => {
  return todayAppointments.value.map(a => ({
    key: a.id,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    timeSlot: getTimeSlotLabel(a.timeSlot),
    timeSlotRaw: a.timeSlot,
    status: a.status,
    symptom: a.symptom || '-'
  }));
});

// 全部待就诊患者（不限日期）
const allPendingAppointments = ref<Appointment[]>([]);

const refreshPendingAppointments = () => {
  if (!currentDoctor.value) return;
  allPendingAppointments.value = getDoctorAppointments(currentDoctor.value.id)
    .filter(a => a.status === AppointmentStatus.PENDING);
};

const pendingPatientColumns = [
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    key: 'patientName'
  },
  {
    title: '联系方式',
    dataIndex: 'patientPhone',
    key: 'patientPhone'
  },
  {
    title: '预约日期',
    dataIndex: 'appointmentDate',
    key: 'appointmentDate'
  },
  {
    title: '就诊时段',
    dataIndex: 'timeSlot',
    key: 'timeSlot'
  },
  {
    title: '病情描述',
    dataIndex: 'symptom',
    key: 'symptom',
    ellipsis: true
  }
];

const pendingPatientList = computed(() => {
  return allPendingAppointments.value.map(a => ({
    key: a.id,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    appointmentDate: a.appointmentDate,
    timeSlot: getTimeSlotLabel(a.timeSlot),
    status: a.status,
    symptom: a.symptom || '-'
  }));
});

// 获取时段标签
const getTimeSlotLabel = (slot: TimeSlotType) => {
  const labels = {
    [TimeSlot.MORNING]: '上午',
    [TimeSlot.AFTERNOON]: '下午',
    [TimeSlot.EVENING]: '晚上'
  };
  return labels[slot] || slot;
};

// 获取预约状态标签
const getStatusLabel = (status: AppointmentStatusType) => {
  const labels: Record<AppointmentStatusType, string> = {
    [AppointmentStatus.PENDING]: '待就诊',
    [AppointmentStatus.COMPLETED]: '已就诊',
    [AppointmentStatus.CANCELLED]: '已取消'
  };
  return labels[status] || status;
};

// 获取预约状态颜色
const getStatusColor = (status: AppointmentStatusType) => {
  const colors: Record<AppointmentStatusType, string> = {
    [AppointmentStatus.PENDING]: 'processing',
    [AppointmentStatus.COMPLETED]: 'success',
    [AppointmentStatus.CANCELLED]: 'default'
  };
  return colors[status] || 'default';
};

// 保存排班
const saveSchedule = async () => {
  if (!formState.selectedDate) {
    message.warning('请选择出诊日期');
    return;
  }
  
  if (!currentDoctor.value) {
    message.error('医生未登录');
    return;
  }
  
  saving.value = true;
  
  try {
    const slots = [
      { timeSlot: TimeSlot.MORNING, config: formState.morning },
      { timeSlot: TimeSlot.AFTERNOON, config: formState.afternoon },
      { timeSlot: TimeSlot.EVENING, config: formState.evening }
    ];
    
    for (const slot of slots) {
      // 获取现有排班
      const existingSchedules = getDoctorSchedules(currentDoctor.value.id)
        .filter(s => s.date === formState.selectedDate && s.timeSlot === slot.timeSlot);
      
      if (existingSchedules.length > 0) {
        // 更新现有排班
        const existing = existingSchedules[0];
        updateSchedule(existing.id, {
          isOpen: slot.config.isOpen,
          totalSlots: slot.config.totalSlots
        });
      } else {
        // 创建新排班
        saveScheduleToStorage({
          doctorId: currentDoctor.value.id,
          date: formState.selectedDate,
          timeSlot: slot.timeSlot,
          totalSlots: slot.config.totalSlots,
          bookedSlots: 0,
          isOpen: slot.config.isOpen
        });
      }
    }
    
    message.success('排班保存成功');
    // 刷新视图
    onDateChange();
    refreshPendingAppointments();
  } catch (error) {
    message.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formState.morning = { isOpen: false, totalSlots: 10 };
  formState.afternoon = { isOpen: false, totalSlots: 8 };
  formState.evening = { isOpen: false, totalSlots: 5 };
  formState.selectedDate = '';
};
</script>

<style scoped>
.doctor-schedule {
  min-height: calc(100vh - 64px);
  padding: 24px;
  padding-top: 88px;
  background: #f5f5f5;
}

.schedule-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.doctor-info-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-details h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.doctor-details p {
  color: #666;
  font-size: 14px;
}

.schedule-form-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.time-slots-config {
  margin-top: 24px;
}

.time-slots-config h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.slot-card {
  margin-bottom: 16px;
  border-radius: 8px;
  background: #fafafa;
}

.slot-card :deep(.ant-card-body) {
  padding: 16px;
}

.slot-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.slot-icon {
  font-size: 24px;
}

.slot-icon.morning {
  color: #faad14;
}

.slot-icon.afternoon {
  color: #1890ff;
}

.slot-icon.evening {
  color: #722ed1;
}

.slot-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.slot-time {
  font-size: 14px;
  color: #999;
  margin-left: auto;
}

.slot-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.slot-controls :deep(.ant-form-item) {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.schedule-preview-card {
  border-radius: 12px;
}

.patient-list-card {
  margin-top: 24px;
  border-radius: 12px;
}

.all-pending-card {
  margin-top: 0;
  margin-bottom: 24px;
}

.text-danger {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .doctor-schedule {
    padding: 16px;
    padding-top: 80px;
  }

  .slot-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
