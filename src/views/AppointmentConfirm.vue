/**
 * 预约确认页面
 * 
 * 显示预约摘要，确认并提交预约
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="appointment-confirm">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined />
          返回
        </a-button>
        <h1>确认预约</h1>
      </div>
    </div>

    <!-- 确认内容 -->
    <div class="confirm-container">
      <a-spin v-if="loading" size="large" />

      <div v-else-if="!isValidData" class="error-state">
        <a-result
          status="warning"
          title="预约信息不完整"
          sub-title="请从预约页面重新选择"
        >
          <template #extra>
            <a-button type="primary" @click="goToAppointment">
              返回预约
            </a-button>
          </template>
        </a-result>
      </div>

      <div v-else class="confirm-content">
        <!-- 预约卡片 -->
        <div class="confirm-card">
          <div class="card-header">
            <CheckCircleOutlined class="header-icon" />
            <h2>预约信息确认</h2>
          </div>

          <!-- 医生信息 -->
          <div class="info-section">
            <h3>医生信息</h3>
            <div class="doctor-info-row">
              <img :src="doctor.avatar" :alt="doctor.name" class="doctor-avatar" />
              <div class="doctor-details">
                <div class="doctor-name">{{ doctor.name }}</div>
                <div class="doctor-title">{{ doctor.title }}</div>
                <div class="doctor-department">{{ doctor.department }}</div>
              </div>
            </div>
          </div>

          <a-divider />

          <!-- 预约信息 -->
          <div class="info-section">
            <h3>预约信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <CalendarOutlined class="info-icon" />
                <div class="info-content">
                  <div class="info-label">预约日期</div>
                  <div class="info-value">{{ appointmentDate }}</div>
                </div>
              </div>
              <div class="info-item">
                <ClockCircleOutlined class="info-icon" />
                <div class="info-content">
                  <div class="info-label">预约时段</div>
                  <div class="info-value">{{ startTime }} - {{ endTime }}</div>
                </div>
              </div>
            </div>
          </div>

          <a-divider />

          <!-- 就诊原因 -->
          <div class="info-section">
            <h3>就诊原因</h3>
            <div class="reason-text">
              {{ reason || '未填写' }}
            </div>
          </div>

          <a-divider />

          <!-- 预约须知 -->
          <div class="notice-section">
            <h3><ExclamationCircleOutlined /> 预约须知</h3>
            <ul>
              <li>请按预约时间准时到达医院</li>
              <li>如需取消预约，请提前一天操作</li>
              <li>预约成功后，医生会在24小时内确认</li>
              <li>就诊时请携带有效身份证件</li>
            </ul>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <a-button size="large" @click="goBack">
            返回修改
          </a-button>
          <a-button 
            type="primary" 
            size="large"
            :loading="submitting"
            :disabled="submitting"
            @click="handleConfirm"
          >
            确认预约
          </a-button>
        </div>
      </div>
    </div>
  </div>

  <!-- 患者登录弹窗 -->
  <a-modal
    v-model:open="loginModalVisible"
    title="验证患者身份"
    :footer="null"
    width="400px"
    :maskClosable="false"
  >
    <a-form
      :model="patientForm"
      :rules="patientRules"
      @finish="handlePatientLogin"
      layout="vertical"
    >
      <a-form-item label="姓名" name="name">
        <a-input
          v-model:value="patientForm.name"
          placeholder="请输入您的姓名"
          size="large"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="出生日期" name="birthday">
        <a-date-picker
          v-model:value="patientForm.birthday"
          placeholder="请选择您的出生日期"
          size="large"
          style="width: 100%"
          format="YYYY-MM-DD"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" block :loading="loginLoading">
          验证并预约
        </a-button>
      </a-form-item>
    </a-form>

    <div class="login-tip">
      <InfoCircleOutlined /> 验证后将自动完成预约
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import { 
  LeftOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';
import { getDoctorDetail, createAppointment } from '../api/appointment';
import { store } from '../store';
import type { Doctor } from '../types';

const router = useRouter();

// 状态
const loading = ref(true);
const submitting = ref(false);
const isValidData = ref(true);

// 患者登录弹窗状态
const loginModalVisible = ref(false);
const loginLoading = ref(false);

// 患者登录表单
const patientForm = reactive({
  name: '',
  birthday: null as Dayjs | null
});

// 患者登录验证规则
const patientRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择出生日期' }]
};

// 数据
const doctor = ref<Doctor>({
  id: '',
  username: '',
  name: '',
  title: '',
  department: '',
  expertise: [],
  bio: '',
  avatar: '',
  isActive: false,
  password: '',
  experience: '',
  specialties: []
});

const appointmentDate = ref('');
const startTime = ref('');
const endTime = ref('');
const timeSlotId = ref('');
const reason = ref('');

/**
 * 确认预约
 */
const handleConfirm = () => {
  // 检查患者是否已登录
  if (!store.state.currentPatient) {
    // 弹出登录框
    loginModalVisible.value = true;
    return;
  }

  // 执行真正的预约提交
  doSubmitAppointment();
};

/**
 * 执行预约提交
 */
const doSubmitAppointment = async () => {
  const currentPatient = store.state.currentPatient;
  if (!currentPatient) return;

  submitting.value = true;

  // 确保 doctor 对象有正确的 id
  const doctorForSave = doctor.value;

  try {
    // 调用 API 创建预约（API 内部已同步到 localStorage）
    await createAppointment({
      doctorId: doctorForSave.id,
      doctorName: doctorForSave.name,
      doctorAvatar: doctorForSave.avatar,
      doctorTitle: doctorForSave.title,
      doctorDepartment: doctorForSave.department,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientBirthday: currentPatient.birthday,
      appointmentDate: appointmentDate.value,
      startTime: startTime.value,
      endTime: endTime.value,
      timeSlotId: timeSlotId.value,
      reason: reason.value.trim()
    });

    message.success('预约提交成功！');
    
    // 清除 sessionStorage
    sessionStorage.removeItem('appointment_form');
    
    // 显示成功弹窗
    Modal.success({
      title: '预约成功',
      content: '您的预约已提交，医生确认后会通知您。',
      okText: '查看我的预约',
      onOk: () => {
        router.push('/appointment/my');
      }
    });
  } catch (err: any) {
    message.error(err.message || '预约提交失败，请重试');
  } finally {
    submitting.value = false;
  }
};

/**
 * 处理患者登录
 */
const handlePatientLogin = async () => {
  if (!patientForm.name || !patientForm.birthday) {
    message.warning('请填写完整信息');
    return;
  }

  loginLoading.value = true;

  try {
    // 调用 store 的 verifyPatient 方法
    const patient = store.verifyPatient(
      patientForm.name,
      patientForm.birthday.format('YYYY-MM-DD')
    );

    message.success(`欢迎 ${patient.name}！正在提交预约...`);
    
    // 关闭登录弹窗
    loginModalVisible.value = false;
    
    // 重置表单
    patientForm.name = '';
    patientForm.birthday = null;
    
    // 保存患者信息到 localStorage
    localStorage.setItem('currentPatient', JSON.stringify(patient));
    
    // 执行预约提交
    await doSubmitAppointment();
  } catch (err: any) {
    message.error(err.message || '验证失败，请重试');
  } finally {
    loginLoading.value = false;
  }
};

/**
 * 返回修改
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
 * 加载预约数据
 */
const loadAppointmentData = async () => {
  loading.value = true;
  isValidData.value = true;

  try {
    // 从 sessionStorage 读取预约数据
    const savedData = sessionStorage.getItem('appointment_form');
    
    if (!savedData) {
      isValidData.value = false;
      return;
    }

    const formData = JSON.parse(savedData);
    
    if (!formData.doctorId || !formData.appointmentDate || !formData.timeSlotId) {
      isValidData.value = false;
      return;
    }

    // 加载医生详情
    const doctorData = await getDoctorDetail(formData.doctorId);
    doctor.value = doctorData;

    // 填充数据
    appointmentDate.value = formData.appointmentDate;
    timeSlotId.value = formData.timeSlotId;
    reason.value = formData.reason || '';

    // 从排班数据获取时段信息
    if (formData.timeSlot) {
      startTime.value = formData.timeSlot.startTime;
      endTime.value = formData.timeSlot.endTime;
    } else {
      // 如果没有时段信息，设置默认值
      startTime.value = '09:00';
      endTime.value = '09:30';
    }
  } catch (err: any) {
    message.error('加载预约信息失败');
    isValidData.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAppointmentData();
});
</script>

<style scoped>
.appointment-confirm {
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
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-content h1 {
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

.confirm-container {
  max-width: 800px;
  margin: 24px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-state {
  width: 100%;
}

.confirm-content {
  width: 100%;
}

.confirm-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 32px;
  color: #52c41a;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.info-section {
  margin-bottom: 16px;
}

.info-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.doctor-info-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.doctor-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
}

.doctor-department {
  font-size: 13px;
  color: #999;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  font-size: 24px;
  color: #1890ff;
  margin-top: 2px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.reason-text {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  line-height: 1.6;
  color: #666;
  min-height: 80px;
}

.notice-section {
  background: #fffbe6;
  border-radius: 12px;
  padding: 20px;
}

.notice-section h3 {
  margin: 0 0 12px;
  color: #ad6800;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-section ul {
  margin: 0;
  padding-left: 20px;
}

.notice-section li {
  line-height: 1.8;
  color: #ad6800;
  font-size: 14px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.action-section button {
  min-width: 140px;
}

@media (max-width: 600px) {
  .confirm-card {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .doctor-info-row {
    flex-direction: column;
    text-align: center;
  }

  .action-section {
    flex-direction: column;
  }

  .action-section button {
    width: 100%;
  }
}

/* 登录弹窗样式 */
.login-tip {
  margin-top: 16px;
  padding: 12px;
  background: #f0f5ff;
  border-radius: 8px;
  color: #1890ff;
  font-size: 13px;
  text-align: center;
}

.login-tip :deep(.anticon) {
  margin-right: 6px;
}
</style>
