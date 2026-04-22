<template>
  <div class="doctor-schedule-page">
    <div class="page-container">
      <a-page-header
        title="门诊管理"
        sub-title="管理出诊时间和预约"
        @back="() => $router.back()"
      />

      <!-- 未登录提示 -->
      <a-result v-if="!currentDoctor" status="warning" title="请先登录">
        <template #subTitle>
          只有登录的医生才能管理门诊时间
        </template>
        <template #extra>
          <a-button type="primary" @click="goToLogin">前往登录</a-button>
        </template>
      </a-result>

      <!-- 门诊管理内容 -->
      <div v-if="currentDoctor">
        <!-- 标签页 -->
        <a-tabs v-model:activeKey="activeTab" class="management-tabs">
          <!-- 出诊时间设置 -->
          <a-tab-pane key="schedule" tab="出诊时间">
            <a-card title="门诊时间设置" class="schedule-card">
              <a-form :model="form" layout="vertical" @finish="handleSave">
                <!-- 门诊地点 -->
                <a-form-item label="门诊地点" name="clinicLocation">
                  <a-input
                    v-model:value="form.clinicLocation"
                    placeholder="如：市第一医院 门诊楼 3楼 心内科诊室"
                    size="large"
                  >
                    <template #prefix>
                      <EnvironmentOutlined />
                    </template>
                  </a-input>
                </a-form-item>

                <!-- 每时段最大人数 -->
                <a-form-item label="每时段最大预约人数" name="maxPatientsPerSlot">
                  <a-input-number
                    v-model:value="form.maxPatientsPerSlot"
                    :min="1"
                    :max="20"
                    size="large"
                    style="width: 200px"
                  />
                  <span class="input-tip">人/时段</span>
                </a-form-item>

                <!-- 每周排班 -->
                <a-divider>每周出诊安排</a-divider>

                <div class="schedule-grid">
                  <div
                    v-for="day in weekDays"
                    :key="day.key"
                    class="schedule-item"
                    :class="{ enabled: form.weeklySchedule[day.key].enabled }"
                  >
                    <div class="day-header">
                      <a-switch
                        v-model:checked="form.weeklySchedule[day.key].enabled"
                        size="small"
                      />
                      <span class="day-name">{{ day.label }}</span>
                    </div>

                    <div v-if="form.weeklySchedule[day.key].enabled" class="day-settings">
                      <div class="time-row">
                        <span>出诊时间</span>
                        <a-time-picker
                          v-model:value="form.weeklySchedule[day.key].startTime"
                          format="HH:mm"
                          placeholder="开始"
                          size="small"
                          style="width: 100px"
                        />
                        <span class="time-separator">至</span>
                        <a-time-picker
                          v-model:value="form.weeklySchedule[day.key].endTime"
                          format="HH:mm"
                          placeholder="结束"
                          size="small"
                          style="width: 100px"
                        />
                      </div>
                      <div class="capacity-row">
                        <span>每时段人数</span>
                        <a-input-number
                          v-model:value="form.weeklySchedule[day.key].maxPatientsPerSlot"
                          :min="1"
                          :max="20"
                          size="small"
                          style="width: 80px"
                        />
                      </div>
                    </div>

                    <div v-else class="day-disabled">
                      休息日
                    </div>
                  </div>
                </div>

                <!-- 保存按钮 -->
                <a-form-item class="submit-item">
                  <a-button type="primary" html-type="submit" size="large" :loading="saving">
                    保存设置
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </a-tab-pane>

          <!-- 预约管理 -->
          <a-tab-pane key="appointments" tab="预约管理">
            <!-- 预约统计 -->
            <a-card class="stats-card">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-statistic title="总预约数" :value="stats.totalAppointments" />
                </a-col>
                <a-col :span="6">
                  <a-statistic title="待确认" :value="stats.pendingCount" :value-style="{ color: '#fa8c16' }" />
                </a-col>
                <a-col :span="6">
                  <a-statistic title="已确认" :value="stats.confirmedCount" :value-style="{ color: '#52c41a' }" />
                </a-col>
                <a-col :span="6">
                  <a-statistic title="已完成" :value="stats.completedCount" :value-style="{ color: '#1890ff' }" />
                </a-col>
              </a-row>
            </a-card>

            <!-- 状态筛选 -->
            <div class="status-tabs">
              <a-radio-group v-model:value="filterStatus" button-style="solid">
                <a-radio-button value="all">全部</a-radio-button>
                <a-radio-button value="pending">待确认</a-radio-button>
                <a-radio-button value="confirmed">已确认</a-radio-button>
                <a-radio-button value="completed">已完成</a-radio-button>
                <a-radio-button value="cancelled">已取消</a-radio-button>
              </a-radio-group>
            </div>

            <!-- 预约列表 -->
            <a-spin v-if="loadingAppointments" class="loading">
              <a-spin size="large" />
            </a-spin>

            <a-empty v-else-if="filteredAppointments.length === 0" description="暂无预约记录" />

            <div v-else class="appointment-list">
              <a-card
                v-for="appointment in filteredAppointments"
                :key="appointment.id"
                class="appointment-card"
                :class="getStatusClass(appointment.status)"
              >
                <div class="appointment-header">
                  <div class="patient-info">
                    <UserOutlined class="patient-icon" />
                    <div>
                      <h4>{{ appointment.patientName }}</h4>
                      <p class="patient-phone" v-if="appointment.patientPhone">
                        <PhoneOutlined /> {{ appointment.patientPhone }}
                      </p>
                    </div>
                  </div>
                  <a-tag :color="getStatusColor(appointment.status)">
                    {{ getStatusText(appointment.status) }}
                  </a-tag>
                </div>

                <div class="appointment-body">
                  <div class="info-row">
                    <CalendarOutlined class="icon" />
                    <span>{{ appointment.appointmentDate }} {{ appointment.timeSlot }}</span>
                  </div>
                  <div class="info-row">
                    <EnvironmentOutlined class="icon" />
                    <span>{{ appointment.location }}</span>
                  </div>
                  <div class="info-row">
                    <FileTextOutlined class="icon" />
                    <span>{{ appointment.reason }}</span>
                  </div>
                </div>

                <div class="appointment-footer">
                  <!-- 待确认状态：显示确认和拒绝按钮 -->
                  <template v-if="appointment.status === 'pending'">
                    <a-button type="primary" @click="handleConfirm(appointment)">
                      确认预约
                    </a-button>
                    <a-button danger @click="handleReject(appointment)">
                      拒绝
                    </a-button>
                  </template>

                  <!-- 已确认状态：显示取消按钮 -->
                  <template v-else-if="appointment.status === 'confirmed'">
                    <a-button danger @click="handleCancel(appointment)">
                      取消预约
                    </a-button>
                    <a-button type="primary" @click="handleComplete(appointment)">
                      完成就诊
                    </a-button>
                  </template>
                </div>
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 拒绝原因输入弹窗 -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝预约"
      @ok="confirmReject"
      @cancel="cancelReject"
      :confirmLoading="actionLoading"
    >
      <a-form layout="vertical">
        <a-form-item label="拒绝原因" required>
          <a-textarea
            v-model:value="rejectReason"
            :rows="3"
            placeholder="请输入拒绝原因"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined as EnvIcon,
  FileTextOutlined,
} from '@ant-design/icons-vue';
import { store, DayScheduleConfig, WeeklySchedule, Appointment, AppointmentStatus } from '../store';

const router = useRouter();

const currentDoctor = computed(() => store.state.currentDoctor);
const saving = ref(false);
const activeTab = ref('schedule');
const loadingAppointments = ref(false);
const actionLoading = ref(false);

// 预约相关
const filterStatus = ref('all');
const appointments = ref<Appointment[]>([]);
const rejectModalVisible = ref(false);
const rejectReason = ref('');
const currentAppointment = ref<Appointment | null>(null);

interface DayScheduleForm {
  enabled: boolean;
  startTime: any;
  endTime: any;
  slotDuration: number;
  maxPatientsPerSlot: number;
}

interface WeeklyScheduleForm {
  monday: DayScheduleForm;
  tuesday: DayScheduleForm;
  wednesday: DayScheduleForm;
  thursday: DayScheduleForm;
  friday: DayScheduleForm;
  saturday: DayScheduleForm;
  sunday: DayScheduleForm;
}

const weekDays = [
  { key: 'monday' as const, label: '周一' },
  { key: 'tuesday' as const, label: '周二' },
  { key: 'wednesday' as const, label: '周三' },
  { key: 'thursday' as const, label: '周四' },
  { key: 'friday' as const, label: '周五' },
  { key: 'saturday' as const, label: '周六' },
  { key: 'sunday' as const, label: '周日' },
];

const form = reactive<{
  clinicLocation: string;
  maxPatientsPerSlot: number;
  weeklySchedule: WeeklyScheduleForm;
}>({
  clinicLocation: '',
  maxPatientsPerSlot: 2,
  weeklySchedule: {
    monday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    tuesday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    wednesday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    thursday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    friday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    saturday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
    sunday: { enabled: false, startTime: null, endTime: null, slotDuration: 30, maxPatientsPerSlot: 2 },
  },
});

const stats = computed(() => {
  if (!currentDoctor.value) {
    return { totalAppointments: 0, pendingCount: 0, confirmedCount: 0, completedCount: 0 };
  }
  const list = store.getAppointmentsByDoctor(currentDoctor.value.id);
  return {
    totalAppointments: list.length,
    pendingCount: list.filter(a => a.status === 'pending').length,
    confirmedCount: list.filter(a => a.status === 'confirmed').length,
    completedCount: list.filter(a => a.status === 'completed').length,
  };
});

const filteredAppointments = computed(() => {
  if (filterStatus.value === 'all') {
    return appointments.value;
  }
  return appointments.value.filter(a => a.status === filterStatus.value);
});

onMounted(() => {
  loadSchedule();
  loadAppointments();
});

const loadSchedule = () => {
  if (!currentDoctor.value) return;

  const doctor = currentDoctor.value;
  if (doctor.clinicSchedule) {
    form.clinicLocation = doctor.clinicSchedule.clinicLocation;
    form.maxPatientsPerSlot = doctor.clinicSchedule.maxPatientsPerSlot;

    const weeklySchedule = doctor.clinicSchedule.weeklySchedule;
    for (const day of weekDays) {
      const config = weeklySchedule[day.key];
      if (config) {
        form.weeklySchedule[day.key] = {
          enabled: config.enabled,
          startTime: config.startTime ? dayjs(config.startTime, 'HH:mm') : null,
          endTime: config.endTime ? dayjs(config.endTime, 'HH:mm') : null,
          slotDuration: config.slotDuration,
          maxPatientsPerSlot: config.maxPatientsPerSlot,
        };
      }
    }
  } else {
    form.clinicLocation = `市第一医院 门诊楼 ${currentDoctor.value.department}诊室`;
    form.maxPatientsPerSlot = 2;
  }
};

const loadAppointments = () => {
  if (!currentDoctor.value) return;
  loadingAppointments.value = true;
  appointments.value = store.getAppointmentsByDoctor(currentDoctor.value.id);
  loadingAppointments.value = false;
};

const handleSave = () => {
  if (!currentDoctor.value) {
    message.error('请先登录');
    return;
  }

  saving.value = true;

  try {
    const weeklySchedule: WeeklySchedule = {
      monday: convertDayConfig(form.weeklySchedule.monday),
      tuesday: convertDayConfig(form.weeklySchedule.tuesday),
      wednesday: convertDayConfig(form.weeklySchedule.wednesday),
      thursday: convertDayConfig(form.weeklySchedule.thursday),
      friday: convertDayConfig(form.weeklySchedule.friday),
      saturday: convertDayConfig(form.weeklySchedule.saturday),
      sunday: convertDayConfig(form.weeklySchedule.sunday),
    };

    currentDoctor.value.clinicSchedule = {
      doctorId: currentDoctor.value.id,
      weeklySchedule,
      clinicLocation: form.clinicLocation,
      maxPatientsPerSlot: form.maxPatientsPerSlot,
      effectiveFrom: dayjs().format('YYYY-MM-DD'),
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    const doctorIndex = store.state.doctors.findIndex(d => d.id === currentDoctor.value!.id);
    if (doctorIndex !== -1) {
      store.state.doctors[doctorIndex] = { ...currentDoctor.value };
    }

    message.success('门诊设置已保存');
  } catch (error) {
    message.error('保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

const convertDayConfig = (dayForm: DayScheduleForm): DayScheduleConfig => {
  return {
    enabled: dayForm.enabled,
    startTime: dayForm.startTime ? dayForm.startTime.format('HH:mm') : '09:00',
    endTime: dayForm.endTime ? dayForm.endTime.format('HH:mm') : '17:00',
    slotDuration: dayForm.slotDuration,
    maxPatientsPerSlot: dayForm.maxPatientsPerSlot,
  };
};

const getStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'orange',
    [AppointmentStatus.CONFIRMED]: 'green',
    [AppointmentStatus.COMPLETED]: 'blue',
    [AppointmentStatus.CANCELLED]: 'default',
    [AppointmentStatus.REJECTED]: 'red',
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: AppointmentStatus): string => {
  const textMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: '待确认',
    [AppointmentStatus.CONFIRMED]: '已确认',
    [AppointmentStatus.COMPLETED]: '已完成',
    [AppointmentStatus.CANCELLED]: '已取消',
    [AppointmentStatus.REJECTED]: '已拒绝',
  };
  return textMap[status] || status;
};

const getStatusClass = (status: AppointmentStatus): string => {
  return `status-${status}`;
};

// 确认预约
const handleConfirm = (appointment: Appointment) => {
  Modal.confirm({
    title: '确认预约',
    content: `确定要确认 ${appointment.patientName} 的预约吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      const result = store.confirmAppointment(appointment.id);
      if (result) {
        message.success('预约已确认');
        loadAppointments();
      } else {
        message.error('操作失败');
      }
    },
  });
};

// 拒绝预约
const handleReject = (appointment: Appointment) => {
  currentAppointment.value = appointment;
  rejectReason.value = '';
  rejectModalVisible.value = true;
};

const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    message.warning('请输入拒绝原因');
    return;
  }

  if (!currentAppointment.value) return;

  actionLoading.value = true;
  const result = store.rejectAppointment(currentAppointment.value.id, rejectReason.value);
  actionLoading.value = false;

  if (result) {
    message.success('已拒绝预约');
    rejectModalVisible.value = false;
    loadAppointments();
  } else {
    message.error('操作失败');
  }
};

const cancelReject = () => {
  rejectModalVisible.value = false;
  rejectReason.value = '';
  currentAppointment.value = null;
};

// 取消预约
const handleCancel = (appointment: Appointment) => {
  Modal.confirm({
    title: '取消预约',
    content: `确定要取消 ${appointment.patientName} 的预约吗？`,
    okText: '确认取消',
    okType: 'danger',
    cancelText: '返回',
    onOk() {
      const result = store.cancelAppointment(appointment.id, '医生取消');
      if (result) {
        message.success('预约已取消');
        loadAppointments();
      } else {
        message.error('操作失败');
      }
    },
  });
};

// 完成就诊
const handleComplete = (appointment: Appointment) => {
  Modal.confirm({
    title: '完成就诊',
    content: `确定 ${appointment.patientName} 已完成就诊吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      const result = store.completeAppointment(appointment.id);
      if (result) {
        message.success('已标记为完成');
        loadAppointments();
      } else {
        message.error('操作失败');
      }
    },
  });
};

const goToLogin = () => {
  router.push('/doctor/login');
};
</script>

<style scoped>
.doctor-schedule-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.management-tabs {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.schedule-card {
  margin-top: 16px;
}

.stats-card {
  margin-bottom: 24px;
}

.input-tip {
  margin-left: 8px;
  color: #666;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.schedule-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
}

.schedule-item.enabled {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.day-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.day-settings {
  padding-left: 32px;
}

.time-row,
.capacity-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.time-separator {
  color: #999;
}

.day-disabled {
  padding-left: 32px;
  color: #999;
  font-size: 14px;
}

.submit-item {
  margin-top: 24px;
  text-align: center;
}

.status-tabs {
  margin-bottom: 24px;
  text-align: center;
}

.loading {
  padding: 60px 0;
  text-align: center;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointment-card.status-cancelled,
.appointment-card.status-rejected {
  opacity: 0.7;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-icon {
  font-size: 32px;
  color: #1890ff;
}

.patient-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.patient-phone {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
}

.appointment-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.info-row .icon {
  margin-right: 8px;
  color: #1890ff;
  min-width: 20px;
}

.appointment-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .management-tabs {
    padding: 16px;
  }

  .schedule-grid {
    grid-template-columns: 1fr;
  }

  .day-settings {
    padding-left: 0;
  }

  .day-disabled {
    padding-left: 0;
  }

  .appointment-footer {
    flex-direction: column;
  }

  .appointment-footer :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
