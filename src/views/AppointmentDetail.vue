/**
 * 预约医生详情页面
 * 
 * 显示医生详细信息、预约日期和时段选择、就诊原因填写
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="appointment-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined />
          返回
        </a-button>
        <h1>预约挂号</h1>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
      <span>加载医生信息...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <a-result
        status="error"
        title="加载失败"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="loadDoctorDetail">
            重试
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 主内容 -->
    <div v-else class="main-content">
      <!-- 左侧：医生信息 -->
      <div class="left-section">
        <!-- 医生卡片 -->
        <div class="doctor-card">
          <div class="doctor-avatar">
            <img :src="doctor.avatar" :alt="doctor.name" />
          </div>
          <div class="doctor-info">
            <h2 class="doctor-name">{{ doctor.name }}</h2>
            <div class="doctor-title">{{ doctor.title }}</div>
            <div class="doctor-department">{{ doctor.department }}</div>
            <div class="doctor-tags">
              <a-tag v-for="tag in doctor.expertise" :key="tag" color="blue">
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </div>

        <!-- 医生简介 -->
        <div class="doctor-intro card">
          <h3>医生简介</h3>
          <p>{{ doctor.bio || '暂无简介' }}</p>
        </div>

        <!-- 擅长领域 -->
        <div class="doctor-expertise card">
          <h3>擅长领域</h3>
          <ul>
            <li v-for="(item, index) in doctor.expertise" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧：预约流程 -->
      <div class="right-section">
        <!-- 步骤条 -->
        <a-steps :current="currentStep" class="appointment-steps">
          <a-step title="选择时段" />
          <a-step title="填写信息" />
          <a-step title="确认预约" />
        </a-steps>

        <!-- 步骤1：选择日期和时段 -->
        <div v-if="currentStep === 0" class="step-content">
          <DatePicker 
            v-model="formData.appointmentDate"
            :schedule-dates="scheduleDates"
            @update:modelValue="onDateChange"
          />
          
          <div v-if="formData.appointmentDate" class="time-slot-section">
            <TimeSlotPicker
              v-model="formData.timeSlotId"
              :time-slots="currentTimeSlots"
              :loading="loadingSlots"
              @update:modelValue="onSlotChange"
            />
          </div>

          <div class="step-actions">
            <a-button 
              type="primary" 
              size="large" 
              :disabled="!canProceedToStep2"
              @click="goToStep2"
            >
              下一步
              <RightOutlined />
            </a-button>
          </div>
        </div>

        <!-- 步骤2：填写就诊原因 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="info-summary card">
            <h3>预约信息</h3>
            <div class="summary-item">
              <CalendarOutlined />
              <span>{{ formData.appointmentDate }}</span>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <span>{{ selectedTimeSlot?.startTime }} - {{ selectedTimeSlot?.endTime }}</span>
            </div>
          </div>

          <div class="reason-form card">
            <h3>就诊原因</h3>
            <a-form layout="vertical">
              <a-form-item 
                label="请描述您的症状或就诊原因" 
                :required="true"
                :validate-status="reasonError ? 'error' : ''"
                :help="reasonError"
              >
                <a-textarea
                  v-model:value="formData.reason"
                  :rows="5"
                  :maxlength="500"
                  show-count
                  placeholder="请详细描述您的症状、持续时间、既往病史等信息，以便医生更好地了解您的病情..."
                />
              </a-form-item>
            </a-form>
          </div>

          <div class="step-actions">
            <a-button size="large" @click="goBackToStep1">
              <LeftOutlined />
              上一步
            </a-button>
            <a-button 
              type="primary" 
              size="large" 
              :disabled="!canProceedToStep3"
              @click="goToStep3"
            >
              下一步
              <RightOutlined />
            </a-button>
          </div>
        </div>

        <!-- 步骤3：确认预约 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="confirm-card card">
            <h3>确认预约信息</h3>
            
            <div class="confirm-section">
              <h4>医生信息</h4>
              <div class="confirm-row">
                <span class="label">医生：</span>
                <span class="value">{{ doctor.name }} {{ doctor.title }}</span>
              </div>
              <div class="confirm-row">
                <span class="label">科室：</span>
                <span class="value">{{ doctor.department }}</span>
              </div>
            </div>

            <a-divider />

            <div class="confirm-section">
              <h4>预约信息</h4>
              <div class="confirm-row">
                <span class="label">预约日期：</span>
                <span class="value">{{ formData.appointmentDate }}</span>
              </div>
              <div class="confirm-row">
                <span class="label">预约时段：</span>
                <span class="value">{{ selectedTimeSlot?.startTime }} - {{ selectedTimeSlot?.endTime }}</span>
              </div>
            </div>

            <a-divider />

            <div class="confirm-section">
              <h4>就诊原因</h4>
              <p class="reason-text">{{ formData.reason || '未填写' }}</p>
            </div>

            <a-divider />

            <div class="notice-section">
              <h4><ExclamationCircleOutlined /> 预约须知</h4>
              <ul>
                <li>请准时到达医院，如需取消请提前一天操作</li>
                <li>预约成功后，医生会在24小时内确认</li>
                <li>就诊时请携带有效身份证件</li>
                <li>取消预约需填写取消原因</li>
              </ul>
            </div>
          </div>

          <div class="step-actions">
            <a-button size="large" @click="goBackToStep2">
              <LeftOutlined />
              返回修改
            </a-button>
            <a-button 
              type="primary" 
              size="large" 
              :loading="submitting"
              :disabled="submitting"
              @click="submitAppointment"
            >
              确认预约
            </a-button>
          </div>
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
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import { 
  LeftOutlined, 
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';
import DatePicker from '../components/DatePicker.vue';
import TimeSlotPicker from '../components/TimeSlotPicker.vue';
import { getDoctorDetail, getDoctorSchedule, createAppointment } from '../api/appointment';
import { store } from '../store';
import type { Doctor } from '../store';

const route = useRoute();
const router = useRouter();

// 状态
const loading = ref(true);
const error = ref('');
const loadingSlots = ref(false);
const submitting = ref(false);
const currentStep = ref(0);

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

// 医生信息
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

// 排班信息
const schedules = ref<any[]>([]);

// 表单数据
const formData = reactive({
  appointmentDate: '',
  timeSlotId: '',
  reason: ''
});

// 验证状态
const reasonError = computed(() => {
  if (formData.reason.length > 0 && formData.reason.trim().length === 0) {
    return '就诊原因不能只包含空格';
  }
  return '';
});

/**
 * 获取某医生在某日期的已确认预约时段
 */
const getBookedSlots = (doctorId: string, date: string): Set<string> => {
  const bookedSlots = new Set<string>();
  const storedAppointments = localStorage.getItem('appointments');
  
  if (storedAppointments) {
    const appointments = JSON.parse(storedAppointments);
    appointments.forEach((apt: any) => {
      // 只统计该医生的已确认预约
      if (apt.doctor?.id === doctorId && 
          apt.appointmentDate === date &&
          (apt.status === 'CONFIRMED' || apt.status === 'PENDING')) {
        // 使用时间段作为标识
        bookedSlots.add(`${apt.startTime}-${apt.endTime}`);
      }
    });
  }
  
  return bookedSlots;
};

/**
 * 更新排班时段的可预约数量
 */
const updateSlotAvailability = () => {
  const doctorId = route.params.id as string;
  
  schedules.value.forEach(schedule => {
    const bookedSlots = getBookedSlots(doctorId, schedule.scheduleDate);
    
    schedule.timeSlots.forEach((slot: any) => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      const bookedCount = bookedSlots.has(slotKey) ? 1 : 0;
      slot.bookedAppointments = bookedCount;
      slot.remainingSlots = slot.maxAppointments - bookedCount;
    });
  });
  
  console.log('已更新时段可预约数量');
};

/**
 * 可预约日期列表
 */
const scheduleDates = computed(() => {
  return schedules.value
    .filter(s => s.isAvailable)
    .map(s => s.scheduleDate);
});

/**
 * 当前选中日期的时段
 */
const currentTimeSlots = computed(() => {
  const schedule = schedules.value.find(
    s => s.scheduleDate === formData.appointmentDate
  );
  return schedule?.timeSlots || [];
});

/**
 * 选中的时段信息
 */
const selectedTimeSlot = computed(() => {
  if (!formData.timeSlotId) return null;
  return currentTimeSlots.value.find((s: any) => s.id === formData.timeSlotId);
});

/**
 * 能否进入步骤2
 */
const canProceedToStep2 = computed(() => {
  return formData.appointmentDate && formData.timeSlotId;
});

/**
 * 能否进入步骤3
 */
const canProceedToStep3 = computed(() => {
  return formData.reason.trim().length > 0;
});

/**
 * 加载医生详情
 */
const loadDoctorDetail = async () => {
  loading.value = true;
  error.value = '';

  try {
    const doctorId = route.params.id as string;
    
    // 尝试从 API 获取医生详情
    try {
      const [doctorData, scheduleData] = await Promise.all([
        getDoctorDetail(doctorId),
        getDoctorSchedule(doctorId)
      ]);
      doctor.value = doctorData;
      schedules.value = scheduleData.schedules;
    } catch {
      // API 失败时使用 store 中的数据
      const storeDoctor = store.state.doctors.find(d => d.id === doctorId);
      if (storeDoctor) {
        doctor.value = storeDoctor;
        // 生成模拟排班数据
        schedules.value = generateMockSchedules(storeDoctor);
      } else {
        throw new Error('医生不存在');
      }
    }
    
    // 更新时段的可预约数量（根据已确认的预约）
    updateSlotAvailability();
  } catch (err: any) {
    error.value = err.message || '加载医生信息失败';
    message.error(error.value);
  } finally {
    loading.value = false;
  }
};

/**
 * 生成模拟排班数据
 */
const generateMockSchedules = (doctorData: Doctor) => {
  const schedules: any[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    schedules.push({
      id: `schedule-${i}`,
      doctor: doctorData,
      scheduleDate: dateStr,
      isAvailable: true,
      timeSlots: [
        { id: `slot-${i}-1`, date: dateStr, startTime: '09:00', endTime: '09:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-2`, date: dateStr, startTime: '09:30', endTime: '10:00', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-3`, date: dateStr, startTime: '10:00', endTime: '10:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-4`, date: dateStr, startTime: '10:30', endTime: '11:00', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-5`, date: dateStr, startTime: '11:00', endTime: '11:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-6`, date: dateStr, startTime: '14:00', endTime: '14:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-7`, date: dateStr, startTime: '14:30', endTime: '15:00', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-8`, date: dateStr, startTime: '15:00', endTime: '15:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-9`, date: dateStr, startTime: '15:30', endTime: '16:00', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
        { id: `slot-${i}-10`, date: dateStr, startTime: '16:00', endTime: '16:30', maxAppointments: 5, bookedAppointments: 0, remainingSlots: 5 },
      ]
    });
  }
  
  return schedules;
};

/**
 * 日期变更
 */
const onDateChange = (_date: string) => {
  formData.timeSlotId = '';
  // 重新更新时段可预约数量（因为时段可能因日期不同而有不同的已预约情况）
  updateSlotAvailability();
};

/**
 * 时段变更
 */
const onSlotChange = (_slotId: string) => {
  // 可以在这里添加号源检查逻辑
};

/**
 * 进入步骤2
 */
const goToStep2 = () => {
  if (!formData.appointmentDate) {
    message.warning('请选择预约日期');
    return;
  }
  if (!formData.timeSlotId) {
    message.warning('请选择预约时段');
    return;
  }
  
  // 保存到 sessionStorage
  sessionStorage.setItem('appointment_form', JSON.stringify(formData));
  currentStep.value = 1;
};

/**
 * 返回步骤1
 */
const goBackToStep1 = () => {
  // 设置恢复标记，以便返回时恢复数据
  sessionStorage.setItem('appointment_restored', 'true');
  currentStep.value = 0;
};

/**
 * 进入步骤3
 */
const goToStep3 = () => {
  if (!formData.reason.trim()) {
    message.warning('请填写就诊原因');
    return;
  }
  currentStep.value = 2;
};

/**
 * 返回步骤2
 */
const goBackToStep2 = () => {
  // 设置恢复标记，以便返回时恢复数据
  sessionStorage.setItem('appointment_restored', 'true');
  currentStep.value = 1;
};

/**
 * 提交预约
 */
const submitAppointment = async () => {
  // 检查患者是否已登录
  if (!store.state.currentPatient) {
    // 弹出登录框
    loginModalVisible.value = true;
    return;
  }

  // 执行真正的预约提交
  await doSubmitAppointment();
};

/**
 * 执行预约提交（实际提交逻辑）
 */
const doSubmitAppointment = async () => {
  const currentPatient = store.state.currentPatient;
  if (!currentPatient) return;

  submitting.value = true;

  try {
    // 确保 doctor 对象有正确的 id
    const doctorForSave = doctor.value;

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
      appointmentDate: formData.appointmentDate,
      startTime: selectedTimeSlot.value?.startTime || '',
      endTime: selectedTimeSlot.value?.endTime || '',
      timeSlotId: formData.timeSlotId,
      reason: formData.reason.trim()
    });

    message.success('预约提交成功！');
    
    // 清除 sessionStorage
    sessionStorage.removeItem('appointment_form');
    
    // 跳转到我的预约页面
    setTimeout(() => {
      router.push('/appointment/my');
    }, 1500);
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
 * 返回上一页
 */
const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else {
    router.back();
  }
};

// 初始化
onMounted(() => {
  loadDoctorDetail();

  // 只在用户从当前页面的步骤返回时恢复数据
  // 通过检查是否有特定的恢复标记
  const restoredFromBack = sessionStorage.getItem('appointment_restored');
  if (restoredFromBack === 'true') {
    sessionStorage.removeItem('appointment_restored');
    const savedForm = sessionStorage.getItem('appointment_form');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        Object.assign(formData, parsed);
        currentStep.value = 1;
      } catch (e) {
        // 忽略解析错误
      }
    }
  }
});
</script>

<style scoped>
.appointment-detail {
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
  max-width: 1200px;
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

.loading-container,
.error-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #999;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 左侧医生信息 */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doctor-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.doctor-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  border: 4px solid #f0f0f0;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-name {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.doctor-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
}

.doctor-department {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
}

.doctor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.doctor-intro p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

.doctor-expertise ul {
  margin: 0;
  padding-left: 20px;
}

.doctor-expertise li {
  line-height: 1.8;
  color: #666;
}

/* 右侧预约流程 */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.appointment-steps {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-slot-section {
  margin-top: 16px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

/* 步骤2 */
.info-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

/* 确认页面 */
.confirm-card {
  padding: 24px;
}

.confirm-section {
  margin-bottom: 16px;
}

.confirm-section h4 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.confirm-row {
  display: flex;
  padding: 8px 0;
}

.confirm-row .label {
  color: #999;
  width: 80px;
}

.confirm-row .value {
  color: #333;
  font-weight: 500;
}

.reason-text {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  line-height: 1.6;
  color: #666;
}

.notice-section {
  background: #fffbe6;
  border-radius: 8px;
  padding: 16px;
}

.notice-section h4 {
  margin: 0 0 12px;
  color: #ad6800;
}

.notice-section ul {
  margin: 0;
  padding-left: 20px;
}

.notice-section li {
  line-height: 1.8;
  color: #ad6800;
  font-size: 13px;
}

@media (max-width: 968px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .left-section {
    order: 2;
  }

  .right-section {
    order: 1;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px 16px;
  }

  .main-content {
    padding: 16px;
  }

  .doctor-card {
    padding: 20px;
  }

  .doctor-avatar {
    width: 100px;
    height: 100px;
  }

  .step-actions {
    flex-direction: column;
  }

  .step-actions button {
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
