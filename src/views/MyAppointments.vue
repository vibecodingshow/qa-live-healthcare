<template>
  <div class="my-appointments-page">
    <div class="page-header">
      <h1>我的预约</h1>
      <p>查看和管理您的预约记录</p>
    </div>

    <a-tabs v-model:activeKey="activeTab" class="appointments-tabs">
      <a-tab-pane key="pending" tab="待就诊">
        <div class="appointments-list" v-if="pendingAppointments.length > 0">
          <a-card
            v-for="appointment in pendingAppointments"
            :key="appointment.id"
            class="appointment-card"
            hoverable
            @click="showDetail(appointment)"
          >
            <div class="appointment-header">
              <a-tag color="processing">待就诊</a-tag>
              <span class="appointment-id">#{{ appointment.id.slice(0, 8).toUpperCase() }}</span>
            </div>
            <div class="appointment-body">
              <div class="doctor-info">
                <UserOutlined class="icon" />
                <span>{{ getDoctorName(appointment.doctorId) }}</span>
              </div>
              <div class="date-info">
                <CalendarOutlined class="icon" />
                <span>{{ formatDate(appointment.appointmentDate) }}</span>
              </div>
              <div class="time-info">
                <ClockCircleOutlined class="icon" />
                <span>{{ formatTimeSlot(appointment.timeSlot) }}</span>
              </div>
            </div>
            <div class="appointment-footer">
              <a-button size="small" danger @click.stop="confirmCancel(appointment)">
                取消预约
              </a-button>
            </div>
          </a-card>
        </div>
        <a-empty v-else description="暂无待就诊预约" />
      </a-tab-pane>

      <a-tab-pane key="history" tab="历史记录">
        <div class="appointments-list" v-if="historyAppointments.length > 0">
          <a-card
            v-for="appointment in historyAppointments"
            :key="appointment.id"
            class="appointment-card"
            hoverable
            @click="showDetail(appointment)"
          >
            <div class="appointment-header">
              <a-tag :color="appointment.status === 'CANCELLED' ? 'default' : 'success'">
                {{ formatStatus(appointment.status) }}
              </a-tag>
              <span class="appointment-id">#{{ appointment.id.slice(0, 8).toUpperCase() }}</span>
            </div>
            <div class="appointment-body">
              <div class="doctor-info">
                <UserOutlined class="icon" />
                <span>{{ getDoctorName(appointment.doctorId) }}</span>
              </div>
              <div class="date-info">
                <CalendarOutlined class="icon" />
                <span>{{ formatDate(appointment.appointmentDate) }}</span>
              </div>
              <div class="time-info">
                <ClockCircleOutlined class="icon" />
                <span>{{ formatTimeSlot(appointment.timeSlot) }}</span>
              </div>
            </div>
          </a-card>
        </div>
        <a-empty v-else description="暂无历史预约" />
      </a-tab-pane>
    </a-tabs>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      title="预约详情"
      :footer="null"
      width="400px"
    >
      <div class="detail-content" v-if="selectedAppointment">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="挂号单号">
            #{{ selectedAppointment.id.slice(0, 8).toUpperCase() }}
          </a-descriptions-item>
          <a-descriptions-item label="医生">
            {{ getDoctorName(selectedAppointment.doctorId) }}
          </a-descriptions-item>
          <a-descriptions-item label="科室">
            {{ getDoctorDepartment(selectedAppointment.doctorId) }}
          </a-descriptions-item>
          <a-descriptions-item label="预约日期">
            {{ formatDate(selectedAppointment.appointmentDate) }}
          </a-descriptions-item>
          <a-descriptions-item label="预约时段">
            {{ formatTimeSlot(selectedAppointment.timeSlot) }}
          </a-descriptions-item>
          <a-descriptions-item label="就诊人">
            {{ selectedAppointment.patientName }}
          </a-descriptions-item>
          <a-descriptions-item label="联系电话">
            {{ selectedAppointment.patientPhone }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="getStatusColor(selectedAppointment.status)">
              {{ formatStatus(selectedAppointment.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="病情描述" v-if="selectedAppointment.symptom">
            {{ selectedAppointment.symptom }}
          </a-descriptions-item>
          <a-descriptions-item label="预约时间">
            {{ formatDateTime(selectedAppointment.createdAt) }}
          </a-descriptions-item>
        </a-descriptions>
        <div class="detail-actions" v-if="selectedAppointment.status === 'PENDING'">
          <a-space style="margin-top: 16px;">
            <a-button type="primary" danger @click="confirmCancel(selectedAppointment)">
              取消预约
            </a-button>
            <a-button @click="detailVisible = false">关闭</a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 取消确认弹窗 -->
    <a-modal
      v-model:open="cancelVisible"
      title="确认取消预约"
      @ok="handleCancel"
      :confirmLoading="cancelling"
    >
      <p>确定要取消该预约吗？取消后无法恢复。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
import { store, Doctor } from '../store';
import {
  Appointment,
  AppointmentStatus,
  getAppointments,
  cancelAppointment
} from '../data/appointment';

const activeTab = ref('pending');
const appointments = ref<Appointment[]>([]);
const detailVisible = ref(false);
const cancelVisible = ref(false);
const selectedAppointment = ref<Appointment | null>(null);
const cancelling = ref(false);

// 获取当前患者ID
const currentPatientId = computed(() => {
  return store.getPatientId();
});

// 待就诊预约
const pendingAppointments = computed(() => {
  return appointments.value.filter(a => a.status === AppointmentStatus.PENDING);
});

// 历史预约
const historyAppointments = computed(() => {
  return appointments.value.filter(a => a.status !== AppointmentStatus.PENDING);
});

// 加载预约数据
const loadAppointments = () => {
  const data = getAppointments(currentPatientId.value);
  // 按时间倒序排列
  appointments.value = data.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 获取医生信息
const getDoctorById = (doctorId: string): Doctor | undefined => {
  return store.state.doctors.find(d => d.id === doctorId);
};

const getDoctorName = (doctorId: string): string => {
  const doctor = getDoctorById(doctorId);
  return doctor?.name || '未知医生';
};

const getDoctorDepartment = (doctorId: string): string => {
  const doctor = getDoctorById(doctorId);
  return doctor?.department || '未知科室';
};

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleDateString('zh-CN', { weekday: 'short' })}`;
};

// 格式化时段
const formatTimeSlot = (slot: string): string => {
  const map: Record<string, string> = {
    'MORNING': '上午 (08:00-12:00)',
    'AFTERNOON': '下午 (14:00-18:00)',
    'EVENING': '晚上 (18:00-21:00)'
  };
  return map[slot] || slot;
};

// 格式化状态
const formatStatus = (status: string): string => {
  const map: Record<string, string> = {
    'PENDING': '待就诊',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return map[status] || status;
};

// 获取状态颜色
const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    'PENDING': 'processing',
    'COMPLETED': 'success',
    'CANCELLED': 'default'
  };
  return map[status] || 'default';
};

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN');
};

// 显示详情
const showDetail = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  detailVisible.value = true;
};

// 确认取消
const confirmCancel = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  cancelVisible.value = true;
  detailVisible.value = false;
};

// 处理取消
const handleCancel = async () => {
  if (!selectedAppointment.value) return;

  cancelling.value = true;
  try {
    const result = cancelAppointment(selectedAppointment.value.id);
    if (result) {
      message.success('预约已取消');
      cancelVisible.value = false;
      loadAppointments();
    } else {
      message.error('取消失败');
    }
  } finally {
    cancelling.value = false;
  }
};

onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
.my-appointments-page {
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: #f5f5f5;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

.appointments-tabs {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.appointments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.appointment-card {
  cursor: pointer;
  transition: all 0.3s;
}

.appointment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.appointment-id {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.appointment-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.appointment-body > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.appointment-body .icon {
  color: #1890ff;
  font-size: 16px;
}

.appointment-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 8px 0;
}

.detail-actions {
  display: flex;
  justify-content: center;
}
</style>
