<template>
  <div class="my-appointments-page">
    <div class="appointments-container">
      <div v-if="!currentPatient" class="auth-section">
        <div class="auth-card">
          <h1>患者身份验证</h1>
          <p>请输入您的姓名和生日以查看预约记录</p>
          <a-form
            :model="authForm"
            :rules="authRules"
            @finish="verifyPatient"
            layout="vertical"
          >
            <a-form-item label="姓名" name="name">
              <a-input
                v-model:value="authForm.name"
                size="large"
                placeholder="请输入您的姓名"
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="生日" name="birthday">
              <a-date-picker
                v-model:value="authForm.birthday"
                size="large"
                format="YYYY-MM-DD"
                placeholder="请选择您的生日"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" size="large" block>
                验证身份
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>

      <div v-else class="patient-portal">
        <div class="portal-header">
          <div class="patient-info">
            <UserOutlined class="patient-icon-large" />
            <div>
              <h1>{{ currentPatient.name }} 的预约</h1>
              <p>共 {{ filteredAppointments.length }} 条预约记录</p>
            </div>
          </div>
          <div class="portal-actions">
            <a-button @click="logoutPatient">
              <LogoutOutlined />
              切换用户
            </a-button>
            <a-button type="primary" @click="goToAppointment">
              <PlusOutlined />
              新建预约
            </a-button>
          </div>
        </div>

        <div class="filter-section">
          <a-radio-group v-model:value="statusFilter" button-style="solid">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="pending">待确认</a-radio-button>
            <a-radio-button value="confirmed">已确认</a-radio-button>
            <a-radio-button value="completed">已完成</a-radio-button>
            <a-radio-button value="cancelled">已取消</a-radio-button>
          </a-radio-group>
        </div>

        <div class="appointments-content">
          <a-empty v-if="filteredAppointments.length === 0" description="暂无预约记录">
            <template #image>
              <CalendarOutlined style="font-size: 64px; color: #ccc;" />
            </template>
            <a-button type="primary" @click="goToAppointment">
              去预约
            </a-button>
          </a-empty>

          <div v-else class="appointments-list">
            <a-card
              v-for="appointment in filteredAppointments"
              :key="appointment.id"
              class="appointment-card"
            >
              <div class="appointment-header">
                <div class="doctor-info">
                  <img :src="getDoctorAvatar(appointment.doctorId)" :alt="appointment.doctorName" class="doctor-avatar" />
                  <div>
                    <h3>{{ appointment.doctorName }}</h3>
                    <p>{{ getDoctorTitle(appointment.doctorId) }} · {{ getDoctorDepartment(appointment.doctorId) }}</p>
                  </div>
                </div>
                <a-tag
                  :color="getStatusColor(appointment.status)"
                  class="status-tag"
                >
                  {{ getStatusText(appointment.status) }}
                </a-tag>
              </div>

              <a-divider />

              <div class="appointment-details">
                <div class="detail-item">
                  <CalendarOutlined class="detail-icon" />
                  <span>{{ appointment.appointmentDate }}</span>
                </div>
                <div class="detail-item">
                  <ClockCircleOutlined class="detail-icon" />
                  <span>{{ appointment.appointmentTime }}</span>
                </div>
              </div>

              <div class="symptoms-section">
                <div class="symptoms-label">症状描述</div>
                <p class="symptoms-text">{{ appointment.symptoms || '无' }}</p>
              </div>

              <div class="appointment-meta">
                <span>预约时间: {{ formatTime(appointment.createdAt) }}</span>
                <a-popconfirm
                  v-if="appointment.status === 'pending'"
                  title="确定要取消这个预约吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="cancelAppointment(appointment.id)"
                >
                  <a-button type="text" danger size="small">
                    取消预约
                  </a-button>
                </a-popconfirm>
                <span v-else-if="appointment.status === 'completed'" class="completed-text">
                  已完成就诊
                </span>
                <span v-else-if="appointment.status === 'cancelled'" class="cancelled-text">
                  已取消
                </span>
                <span v-else-if="appointment.status === 'confirmed'" class="confirmed-text">
                  请按时就诊
                </span>
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
import { store, AppointmentStatus } from '../store';

const router = useRouter();

const currentPatient = computed(() => store.state.currentPatient);

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const statusFilter = ref<string>('all');

const myAppointments = computed(() =>
  currentPatient.value
    ? store.getAppointmentsByPatient(currentPatient.value.id)
    : []
);

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') {
    return myAppointments.value.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return myAppointments.value
    .filter(a => a.status === statusFilter.value)
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
});

const verifyPatient = () => {
  const birthday = authForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }

  store.verifyPatient(authForm.name, birthday);

  const existingPatientCount = store.state.patients.filter(
    p => p.name === authForm.name && p.birthday === birthday
  ).length;

  if (existingPatientCount > 0) {
    message.success('验证成功,欢迎回来!');
  } else {
    message.success('首次登录,已为您创建账户!');
  }
};

const logoutPatient = () => {
  store.logoutPatient();
  message.success('已切换用户');
};

const goToAppointment = () => {
  router.push('/appointment');
};

const cancelAppointment = (appointmentId: string) => {
  store.cancelAppointment(appointmentId);
  message.success('预约已取消');
};

const getDoctorAvatar = (doctorId: string) => {
  const doctor = store.state.doctors.find(d => d.id === doctorId);
  return doctor?.avatar || '';
};

const getDoctorTitle = (doctorId: string) => {
  const doctor = store.state.doctors.find(d => d.id === doctorId);
  return doctor?.title || '';
};

const getDoctorDepartment = (doctorId: string) => {
  const doctor = store.state.doctors.find(d => d.id === doctorId);
  return doctor?.department || '';
};

const getStatusColor = (status: AppointmentStatus) => {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'orange',
    confirmed: 'blue',
    cancelled: 'default',
    completed: 'green',
  };
  return colors[status];
};

const getStatusText = (status: AppointmentStatus) => {
  const texts: Record<AppointmentStatus, string> = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消',
    completed: '已完成',
  };
  return texts[status];
};

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};
</script>

<style scoped>
.my-appointments-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.appointments-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.auth-section {
  min-height: calc(100vh - 112px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.auth-card h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.auth-card > p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
}

.patient-portal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.portal-header {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.patient-icon-large {
  font-size: 48px;
  color: #fff;
}

.patient-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.patient-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.portal-actions {
  display: flex;
  gap: 12px;
}

.filter-section {
  padding: 20px 24px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.appointments-content {
  padding: 24px;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointment-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.doctor-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #999;
}

.status-tag {
  font-size: 13px;
}

.appointment-details {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.detail-icon {
  color: #11998e;
}

.symptoms-section {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.symptoms-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.symptoms-text {
  margin: 0;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.appointment-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e8e8e8;
  font-size: 12px;
  color: #999;
}

.completed-text {
  color: #52c41a;
}

.cancelled-text {
  color: #999;
}

.confirmed-text {
  color: #1890ff;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 24px;
    padding: 32px 24px;
  }

  .portal-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .portal-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .appointment-details {
    flex-direction: column;
    gap: 12px;
  }

  .appointment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
