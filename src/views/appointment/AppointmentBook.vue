<template>
  <div class="appointment-book-page">
    <div class="page-container">
      <!-- 顶部导航 -->
      <div class="page-header">
        <a-button @click="goBack" class="back-btn">
          <LeftOutlined /> 返回
        </a-button>
        <h1>{{ stepTitles[currentStep] }}</h1>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <a-spin size="large" tip="加载中..." />
      </div>

      <!-- 医生信息 -->
      <div v-else-if="doctor" class="doctor-section">
        <a-card class="doctor-info-card" :bordered="false">
          <div class="doctor-info">
            <img :src="doctor.avatar" :alt="doctor.name" class="doctor-avatar" />
            <div class="doctor-details">
              <h2 class="doctor-name">{{ doctor.name }}</h2>
              <p class="doctor-title">{{ doctor.title }}</p>
              <p class="doctor-department">
                <MedicineBoxOutlined /> {{ doctor.department }}
              </p>
            </div>
          </div>
        </a-card>

        <!-- 预约步骤 -->
        <div class="booking-steps">
          <a-steps :current="currentStep" size="small" :status="stepStatus">
            <a-step title="选择日期" />
            <a-step title="选择时段" />
            <a-step title="填写信息" />
            <a-step title="确认预约" />
          </a-steps>
        </div>

        <!-- 步骤1: 日期选择 -->
        <a-card v-show="currentStep === 0" class="calendar-section" :bordered="false">
          <template #title>
            <span class="section-title">
              <CalendarOutlined /> 选择出诊日期
            </span>
          </template>
          <div class="calendar-tip">
            <InfoCircleOutlined /> 请选择医生出诊的日期，周一至周五高亮显示
          </div>
          <SlotCalendar
            v-model="selectedDate"
            :available-dates="availableDates"
            @select="handleDateSelect"
          />
        </a-card>

        <!-- 步骤2: 时段选择 -->
        <a-card v-show="currentStep === 1" class="timeslot-section" :bordered="false">
          <template #title>
            <span class="section-title">
              <ClockCircleOutlined /> 选择就诊时段
            </span>
          </template>
          <div class="selected-date-display">
            已选择日期：<span class="date-value">{{ selectedDate?.format('YYYY年MM月DD日') }}</span>
            <span class="weekday">({{ selectedDate?.format('dddd') }})</span>
          </div>
          <TimeSlotPicker
            v-model="selectedSlot"
            :slots="availableSlots"
            @select="handleSlotSelect"
          />
        </a-card>

        <!-- 步骤3: 患者信息填写 -->
        <a-card v-show="currentStep === 2" class="patient-form-section" :bordered="false">
          <template #title>
            <span class="section-title">
              <UserOutlined /> 填写患者信息
            </span>
          </template>

          <!-- 预约信息摘要 -->
          <div class="appointment-summary">
            <div class="summary-title">预约信息</div>
            <div class="summary-content">
              <div class="summary-item">
                <CalendarOutlined class="summary-icon" />
                <span>{{ selectedDate?.format('YYYY年MM月DD日') }} ({{ selectedDate?.format('dddd') }})</span>
              </div>
              <div class="summary-item">
                <ClockCircleOutlined class="summary-icon" />
                <span>{{ selectedSlot?.timeSlot === 'morning' ? '上午' : '下午' }} {{ selectedSlot?.startTime }}-{{ selectedSlot?.endTime }}</span>
              </div>
              <div class="summary-item">
                <TeamOutlined class="summary-icon" />
                <span>{{ doctor?.name }} ({{ doctor?.title }})</span>
              </div>
            </div>
          </div>

          <!-- 患者信息表单 -->
          <a-form
            ref="formRef"
            :model="formState"
            :rules="formRules"
            layout="vertical"
            class="patient-form"
          >
            <a-form-item label="患者姓名" name="patientName">
              <a-input
                v-model:value="formState.patientName"
                placeholder="请输入患者真实姓名"
                size="large"
                :maxlength="20"
                show-count
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="手机号码" name="patientPhone">
              <a-input
                v-model:value="formState.patientPhone"
                placeholder="请输入患者手机号"
                size="large"
                :maxlength="11"
              >
                <template #prefix>
                  <PhoneOutlined />
                </template>
              </a-input>
              <template #extra>
                <div class="form-tip">手机号用于接收预约通知，请确保填写正确</div>
              </template>
            </a-form-item>

            <!-- 历史患者提示 -->
            <div v-if="matchedPatient" class="history-tip">
              <a-alert
                type="info"
                show-icon
                :message="`检测到历史患者 ${matchedPatient.name}，信息已自动填充`"
              />
            </div>
          </a-form>
        </a-card>

        <!-- 步骤4: 预约确认 -->
        <a-card v-show="currentStep === 3" class="confirm-section" :bordered="false">
          <template #title>
            <span class="section-title">
              <CheckCircleOutlined /> 确认预约信息
            </span>
          </template>

          <div class="confirm-card">
            <div class="confirm-section-title">医生信息</div>
            <div class="confirm-row">
              <span class="label">医生姓名：</span>
              <span class="value">{{ doctor?.name }}</span>
            </div>
            <div class="confirm-row">
              <span class="label">医生职称：</span>
              <span class="value">{{ doctor?.title }}</span>
            </div>
            <div class="confirm-row">
              <span class="label">所属科室：</span>
              <span class="value">{{ doctor?.department }}</span>
            </div>

            <a-divider />

            <div class="confirm-section-title">预约信息</div>
            <div class="confirm-row">
              <span class="label">预约日期：</span>
              <span class="value highlight">{{ selectedDate?.format('YYYY年MM月DD日') }}</span>
            </div>
            <div class="confirm-row">
              <span class="label">预约时段：</span>
              <span class="value highlight">
                {{ selectedSlot?.timeSlot === 'morning' ? '上午' : '下午' }}
                {{ selectedSlot?.startTime }}-{{ selectedSlot?.endTime }}
              </span>
            </div>

            <a-divider />

            <div class="confirm-section-title">患者信息</div>
            <div class="confirm-row">
              <span class="label">患者姓名：</span>
              <span class="value">{{ formState.patientName }}</span>
            </div>
            <div class="confirm-row">
              <span class="label">手机号码：</span>
              <span class="value">{{ formState.patientPhone }}</span>
            </div>

            <a-divider />

            <div class="notice-section">
              <div class="notice-title">
                <ExclamationCircleOutlined /> 预约须知
              </div>
              <ul class="notice-list">
                <li>请按预约时间准时到医院就诊</li>
                <li>如需取消预约，请提前至少2小时操作</li>
                <li>预约成功后，系统将发送短信提醒</li>
                <li>就诊时请携带有效身份证件</li>
              </ul>
            </div>
          </div>
        </a-card>

        <!-- 底部操作栏 -->
        <div class="bottom-action-bar">
          <div class="selected-summary" v-if="selectedSlot && currentStep < 3">
            <div class="summary-item">
              <CalendarOutlined />
              <span>{{ selectedDate?.format('MM/DD') }}</span>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <span>{{ selectedSlot.timeSlot === 'morning' ? '上午' : '下午' }}</span>
              <span class="time-detail">{{ selectedSlot.startTime }}-{{ selectedSlot.endTime }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <a-button v-if="currentStep > 0" @click="handlePrev" size="large">
              <LeftOutlined /> 上一步
            </a-button>
            <a-button
              v-if="currentStep < 3"
              type="primary"
              size="large"
              :disabled="!canProceedToNext"
              @click="handleNext"
              class="next-btn"
            >
              {{ nextButtonText }}
              <RightOutlined />
            </a-button>
            <a-button
              v-if="currentStep === 3"
              type="primary"
              size="large"
              :loading="submitting"
              :disabled="submitting"
              @click="handleSubmit"
              class="submit-btn"
            >
              {{ submitting ? '提交中...' : '确认提交预约' }}
            </a-button>
          </div>
        </div>
      </div>

      <!-- 医生未找到 -->
      <div v-else class="error-state">
        <a-result
          status="404"
          title="医生未找到"
          sub-title="抱歉，您访问的医生信息不存在"
        >
          <template #extra>
            <a-button type="primary" @click="goToAppointment">返回预约首页</a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { store, type Doctor, type AppointmentSlot, type Patient } from '../../store';
import SlotCalendar from '../../components/appointment/SlotCalendar.vue';
import TimeSlotPicker from '../../components/appointment/TimeSlotPicker.vue';
import { notifyService } from '../../services/notifyService';
import { handleAppointmentError } from '../../utils/errorHandler';

const router = useRouter();
const route = useRoute();

// 状态
const loading = ref(true);
const doctor = ref<Doctor | null>(null);
const selectedDate = ref<Dayjs | null>(null);
const selectedSlot = ref<AppointmentSlot | null>(null);
const availableDates = ref<string[]>([]);
const availableSlots = ref<AppointmentSlot[]>([]);
const currentStep = ref(0);
const submitting = ref(false);
const formRef = ref();
const matchedPatient = ref<Patient | null>(null);

// 步骤标题
const stepTitles = ['选择出诊日期', '选择就诊时段', '填写患者信息', '确认预约信息'];

// 步骤状态
const stepStatus = computed(() => {
  if (currentStep.value === 2 && !canProceedToNext.value) {
    return 'error';
  }
  return 'process';
});

// 表单状态
const formState = reactive({
  patientName: '',
  patientPhone: '',
});

// 表单验证规则
const formRules = {
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
  ],
  patientPhone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

// 是否可以进入下一步
const canProceedToNext = computed(() => {
  if (currentStep.value === 0) {
    return selectedDate.value !== null;
  } else if (currentStep.value === 1) {
    return selectedSlot.value !== null;
  } else if (currentStep.value === 2) {
    return formState.patientName.length >= 2 && /^1[3-9]\d{9}$/.test(formState.patientPhone);
  }
  return true;
});

// 下一步按钮文本
const nextButtonText = computed(() => {
  if (currentStep.value === 0) {
    return selectedDate.value ? '下一步：选择时段' : '请先选择日期';
  } else if (currentStep.value === 1) {
    return selectedSlot.value ? '下一步：填写信息' : '请先选择时段';
  }
  return '下一步';
});

// 监听手机号变化，自动填充历史患者信息
watch(() => formState.patientPhone, (newPhone) => {
  if (newPhone.length === 11 && /^1[3-9]\d{9}$/.test(newPhone)) {
    const patient = store.verifyPatientByPhone(newPhone);
    if (patient) {
      matchedPatient.value = patient;
      formState.patientName = patient.name;
    } else {
      matchedPatient.value = null;
    }
  }
});

// 监听表单数据变化，保存到 localStorage
watch(formState, (newVal) => {
  if (currentStep.value === 2) {
    localStorage.setItem('appointmentFormData', JSON.stringify(newVal));
  }
}, { deep: true });

onMounted(() => {
  const doctorId = route.params.doctorId as string;
  loadDoctorInfo(doctorId);
  restoreFormData();
});

// 恢复表单数据
const restoreFormData = () => {
  const savedData = localStorage.getItem('appointmentFormData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      formState.patientName = data.patientName || '';
      formState.patientPhone = data.patientPhone || '';
    } catch {
      // ignore
    }
  }
};

const loadDoctorInfo = (doctorId: string) => {
  loading.value = true;

  // 模拟异步加载
  setTimeout(() => {
    const foundDoctor = store.getDoctorById(doctorId);
    if (foundDoctor) {
      doctor.value = foundDoctor;
      // 加载可用日期
      availableDates.value = store.getAvailableDates(doctorId);
    }
    loading.value = false;
  }, 300);
};

const handleDateSelect = (date: Dayjs) => {
  selectedDate.value = date;
  selectedSlot.value = null;
  currentStep.value = 1;

  // 加载该日期的可用时段
  if (doctor.value) {
    availableSlots.value = store.getAvailableSlots(doctor.value.id, date.format('YYYY-MM-DD'));
  }
};

const handleSlotSelect = (slot: AppointmentSlot) => {
  selectedSlot.value = slot;
};

const handleNext = async () => {
  if (currentStep.value === 2) {
    // 验证表单
    try {
      await formRef.value.validate();
    } catch {
      message.error('请完善患者信息');
      return;
    }
  }

  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (submitting.value) {
    message.warning('请勿重复提交');
    return;
  }

  submitting.value = true;

  try {
    // 验证表单
    await formRef.value.validate();

    if (!selectedSlot.value) {
      message.error('请选择就诊时段');
      submitting.value = false;
      return;
    }

    // 调用 Store 提交预约（包含冲突检测）
    const result = store.addAppointment(selectedSlot.value.id, {
      name: formState.patientName,
      phone: formState.patientPhone,
    });

    if (!result.success || !result.appointment) {
      // 统一使用异常处理
      handleAppointmentError(new Error(result.error || '预约提交失败'));
      // 如果是时段已满，返回选择时段步骤
      if (result.error?.includes('约满')) {
        currentStep.value = 1;
        // 刷新时段数据
        if (doctor.value && selectedDate.value) {
          availableSlots.value = store.getAvailableSlots(
            doctor.value.id,
            selectedDate.value.format('YYYY-MM-DD')
          );
        }
        selectedSlot.value = null;
        notifyService.slotFull();
      }
      submitting.value = false;
      return;
    }

    // 显示预约成功通知，弹窗关闭后跳转到预约成功页
    const appointmentData = result.appointment!;
    notifyService.appointmentSuccess(appointmentData, () => {
      // 保存患者信息
      store.savePatientInfo({
        name: formState.patientName,
        phone: formState.patientPhone,
      });

      // 存储预约数据到 sessionStorage
      sessionStorage.setItem('appointmentSlot', JSON.stringify(selectedSlot.value));
      sessionStorage.setItem('appointmentDoctor', JSON.stringify(doctor.value));
      sessionStorage.setItem('appointmentPatient', JSON.stringify({
        name: formState.patientName,
        phone: formState.patientPhone,
      }));
      sessionStorage.setItem('appointmentId', appointmentData.id);

      // 清理表单数据
      localStorage.removeItem('appointmentFormData');

      // 跳转到预约成功页
      router.push('/appointment/success');
    });
  } catch (error) {
    // 表单验证错误
    handleAppointmentError(error);
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  if (currentStep.value > 0) {
    handlePrev();
  } else {
    // 优先返回预约列表页面，而不是使用 browser history
    router.push('/appointment');
  }
};

const goToAppointment = () => {
  router.push('/appointment');
};
</script>

<style scoped>
.appointment-book-page {
  min-height: 100vh;
  padding-top: 64px;
  padding-bottom: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.loading-state {
  background: #fff;
  border-radius: 12px;
  padding: 80px;
  text-align: center;
}

.doctor-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doctor-info-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doctor-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #e6f7ff;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.doctor-title {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin: 0 0 6px 0;
}

.doctor-department {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.booking-steps {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-section,
.timeslot-section,
.patient-form-section,
.confirm-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-tip {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.selected-date-display {
  font-size: 15px;
  color: #333;
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 8px;
}

.date-value {
  font-weight: 600;
  color: #1890ff;
}

.weekday {
  color: #666;
  margin-left: 8px;
}

/* 患者信息表单样式 */
.appointment-summary {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
  margin-bottom: 12px;
}

.summary-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}

.summary-icon {
  color: #52c41a;
}

.patient-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.history-tip {
  margin-top: 16px;
}

/* 确认信息样式 */
.confirm-card {
  padding: 8px;
}

.confirm-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.confirm-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.confirm-row .label {
  color: #666;
  width: 80px;
}

.confirm-row .value {
  color: #333;
}

.confirm-row .value.highlight {
  color: #1890ff;
  font-weight: 600;
}

.notice-section {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
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

/* 底部操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 100;
}

.selected-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.summary-item .time-detail {
  color: #1890ff;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.next-btn,
.submit-btn {
  min-width: 180px;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

.error-state {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
    padding-bottom: 120px;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .doctor-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .doctor-avatar {
    width: 80px;
    height: 80px;
  }

  .summary-content {
    flex-direction: column;
    gap: 8px;
  }

  .bottom-action-bar {
    flex-direction: column;
    padding: 12px 16px;
  }

  .selected-summary {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .next-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>
