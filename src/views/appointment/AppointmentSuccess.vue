<template>
  <div class="appointment-success-page">
    <div class="page-container">
      <a-spin v-if="loading" size="large" tip="加载中..." />
      <a-result
        v-else-if="appointment"
        status="success"
        title="预约成功！"
        sub-title="您的预约信息已提交，请按时就诊"
      >
        <template #extra>
          <a-card class="result-card" :bordered="false">
            <div class="result-section">
              <div class="section-title">预约详情</div>
              <div class="result-row">
                <span class="label">预约编号：</span>
                <span class="value appointment-id">{{ appointment.id }}</span>
              </div>
              <div class="result-row">
                <span class="label">医生姓名：</span>
                <span class="value">{{ appointment.doctorName }}</span>
              </div>
              <div class="result-row">
                <span class="label">所属科室：</span>
                <span class="value">{{ appointment.department }}</span>
              </div>
            </div>

            <a-divider />

            <div class="result-section">
              <div class="section-title">就诊信息</div>
              <div class="result-row">
                <span class="label">就诊日期：</span>
                <span class="value highlight">{{ formatDate(appointment.appointmentDate) }}</span>
              </div>
              <div class="result-row">
                <span class="label">就诊时间：</span>
                <span class="value highlight">{{ appointment.appointmentTime }}</span>
              </div>
            </div>

            <a-divider />

            <div class="result-section">
              <div class="section-title">患者信息</div>
              <div class="result-row">
                <span class="label">患者姓名：</span>
                <span class="value">{{ appointment.patientName }}</span>
              </div>
              <div class="result-row">
                <span class="label">手机号码：</span>
                <span class="value">{{ appointment.patientPhone }}</span>
              </div>
            </div>

            <a-divider />

            <div class="notice-box">
              <div class="notice-title">
                <ExclamationCircleOutlined /> 就诊须知
              </div>
              <ul class="notice-list">
                <li>请提前10分钟到达医院签到</li>
                <li>就诊时请携带有效身份证件</li>
                <li>如需取消预约，请提前至少2小时操作</li>
                <li>系统已发送短信提醒至您手机</li>
              </ul>
            </div>
          </a-card>

          <div class="action-buttons">
            <a-button size="large" @click="goToMyAppointments">
              <CalendarOutlined /> 查看我的预约
            </a-button>
            <a-button type="primary" size="large" @click="goToHome">
              <HomeOutlined /> 返回首页
            </a-button>
          </div>
        </template>
      </a-result>
      <a-result
        v-else
        status="warning"
        title="预约信息未找到"
        sub-title="请检查您的预约记录"
      >
        <template #extra>
          <a-button type="primary" @click="goToHome">返回首页</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  CalendarOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { store, type Appointment } from '../../store';

const router = useRouter();

// 预约数据
const appointment = ref<Appointment | null>(null);
const loading = ref(true);

onMounted(() => {
  // 从 sessionStorage 获取预约ID
  const appointmentId = sessionStorage.getItem('appointmentId');

  if (appointmentId) {
    // 从 Store 获取预约记录
    const record = store.getAppointmentById(appointmentId);
    if (record) {
      appointment.value = record;
    }
  }

  // 如果没有找到记录，尝试从 sessionStorage 获取基本信息
  if (!appointment.value) {
    const doctorData = sessionStorage.getItem('appointmentDoctor');
    const slotData = sessionStorage.getItem('appointmentSlot');
    const patientData = sessionStorage.getItem('appointmentPatient');
    const idFromSession = sessionStorage.getItem('appointmentId');

    if (doctorData && slotData && patientData) {
      const doctor = JSON.parse(doctorData);
      const slot = JSON.parse(slotData);
      const patient = JSON.parse(patientData);

      appointment.value = {
        id: idFromSession || `AP${Date.now().toString().slice(-10)}`,
        patientId: '',
        patientName: patient.name,
        patientPhone: patient.phone,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        slotId: slot.id,
        appointmentDate: slot.date,
        appointmentTime: `${slot.timeSlot === 'morning' ? '上午' : '下午'} ${slot.startTime}-${slot.endTime}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // 清理 sessionStorage 中的临时数据
  setTimeout(() => {
    sessionStorage.removeItem('appointmentSlot');
    sessionStorage.removeItem('appointmentDoctor');
    sessionStorage.removeItem('appointmentPatient');
    sessionStorage.removeItem('appointmentId');
  }, 100);

  loading.value = false;
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
};

const goToMyAppointments = () => {
  router.push('/appointment/my');
};

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.appointment-success-page {
  min-height: 100vh;
  padding-top: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-container {
  width: 100%;
  max-width: 600px;
  padding: 24px;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-section {
  margin-bottom: 8px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.result-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.result-row .label {
  color: #666;
  width: 80px;
}

.result-row .value {
  color: #333;
}

.result-row .value.appointment-id {
  color: #1890ff;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 1px;
}

.result-row .value.highlight {
  color: #1890ff;
  font-weight: 600;
  font-size: 16px;
}

.notice-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.notice-title {
  font-size: 14px;
  font-weight: 600;
  color: #faad14;
  margin-bottom: 12px;
}

.notice-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #8c6d1f;
}

.notice-list li {
  margin-bottom: 6px;
}

.notice-list li:last-child {
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .result-card {
    padding: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .ant-btn {
    width: 100%;
  }
}
</style>
