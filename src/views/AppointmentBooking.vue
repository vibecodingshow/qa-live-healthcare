<template>
  <div class="appointment-booking">
    <div class="booking-container">
      <!-- 返回按钮 -->
      <div class="back-section">
        <a-button @click="goBack">
          <LeftOutlined /> 返回医生列表
        </a-button>
      </div>

      <!-- 预约成功结果 -->
      <a-result
        v-if="bookingSuccess"
        status="success"
        title="预约成功！"
        sub-title="请按时前往医院就诊"
      >
        <template #extra>
          <a-card class="success-card">
            <div class="success-info">
              <div class="info-row">
                <span class="label">挂号单号：</span>
                <span class="value">{{ appointmentId }}</span>
              </div>
              <div class="info-row">
                <span class="label">就诊医生：</span>
                <span class="value">{{ doctor?.name }}</span>
              </div>
              <div class="info-row">
                <span class="label">就诊日期：</span>
                <span class="value">{{ formState.selectedDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">就诊时段：</span>
                <span class="value">{{ getTimeSlotLabel(formState.selectedSlot) }}</span>
              </div>
              <div class="info-row">
                <span class="label">就诊人：</span>
                <span class="value">{{ formState.patientName }}</span>
              </div>
            </div>
          </a-card>
          <a-button type="primary" @click="goToMyAppointments">
            查看我的预约
          </a-button>
          <a-button @click="resetBooking">
            再预约一个
          </a-button>
        </template>
      </a-result>

      <!-- 预约表单 -->
      <template v-else>
        <!-- 医生信息卡片 -->
        <a-card class="doctor-card" :bordered="false">
          <div class="doctor-info">
            <a-avatar :size="80" :src="doctor?.avatar" />
            <div class="doctor-details">
              <h2>{{ doctor?.name }}</h2>
              <p class="doctor-title">{{ doctor?.title }}</p>
              <p class="doctor-department">{{ doctor?.department }}</p>
              <div class="doctor-specialties">
                <a-tag v-for="s in doctor?.specialties" :key="s" color="blue">
                  {{ s }}
                </a-tag>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 预约表单 -->
        <a-card class="booking-form-card" :bordered="false">
          <a-form
            :model="formState"
            :rules="rules"
            @finish="handleSubmit"
            layout="vertical"
          >
            <!-- 日期选择 -->
            <a-form-item label="选择就诊日期" name="selectedDate">
              <a-date-picker
                v-model:value="formState.selectedDate"
                :disabled-date="disabledDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择就诊日期"
                style="width: 100%"
                size="large"
                @change="onDateChange"
              />
            </a-form-item>

            <!-- 时段选择 -->
            <a-form-item label="选择就诊时段" name="selectedSlot">
              <TimeSlotPicker
                v-if="formState.selectedDate && doctor"
                :doctor-id="doctor.id"
                :selected-date="formState.selectedDate"
                :schedules="schedules"
                v-model="formState.selectedSlot"
                @select="onSlotSelect"
              />
              <div v-else class="slot-placeholder">
                <CalendarOutlined class="placeholder-icon" />
                <span>请先选择就诊日期</span>
              </div>
            </a-form-item>

            <!-- 就诊人信息 -->
            <div class="patient-section">
              <h3>就诊人信息</h3>
              
              <a-form-item label="姓名" name="patientName">
                <a-input
                  v-model:value="formState.patientName"
                  size="large"
                  placeholder="请输入就诊人姓名"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="手机号" name="patientPhone">
                <a-input
                  v-model:value="formState.patientPhone"
                  size="large"
                  placeholder="请输入手机号码"
                >
                  <template #prefix>
                    <PhoneOutlined />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="病情描述" name="symptom">
                <a-textarea
                  v-model:value="formState.symptom"
                  :rows="4"
                  :maxlength="500"
                  show-count
                  placeholder="请描述您的症状（选填）"
                />
              </a-form-item>
            </div>

            <!-- 提交按钮 -->
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="submitting"
                :disabled="!canSubmit"
              >
                确认预约
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { LeftOutlined, CalendarOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import dayjs, { Dayjs } from 'dayjs';
import { store, Doctor } from '../store';
import { 
  TimeSlot, 
  type TimeSlotType, 
  type Schedule,
  getSchedules, 
  createAppointment,
  canBookAppointment 
} from '@/data/appointment';
import TimeSlotPicker from '@/components/TimeSlotPicker.vue';

const router = useRouter();
const route = useRoute();

const submitting = ref(false);
const bookingSuccess = ref(false);
const appointmentId = ref('');

// 获取医生ID
const doctorId = computed(() => route.params.doctorId as string);

// 获取医生信息
const doctor = computed(() => {
  return store.state.doctors.find(d => d.id === doctorId.value);
});

// 表单状态
const formState = reactive({
  selectedDate: '' as string,
  selectedSlot: null as TimeSlotType | null,
  patientName: '',
  patientPhone: '',
  symptom: ''
});

// 获取当前患者
const currentPatient = computed(() => store.state.currentPatient);

// 预填充患者信息
onMounted(() => {
  if (currentPatient.value) {
    formState.patientName = currentPatient.value.name;
    formState.patientPhone = currentPatient.value.phone || '';
  }
});

// 排班数据
const schedules = ref<Schedule[]>([]);

// 禁用过去日期
const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// 日期变化时加载排班
const onDateChange = () => {
  formState.selectedSlot = null;
  if (formState.selectedDate && doctorId.value) {
    schedules.value = getSchedules(doctorId.value, formState.selectedDate);
  }
};

// 时段选择
const onSlotSelect = (slot: TimeSlotType) => {
  formState.selectedSlot = slot;
};

// 获取时段标签
const getTimeSlotLabel = (slot: TimeSlotType | null) => {
  if (!slot) return '';
  const labels: Record<TimeSlotType, string> = {
    [TimeSlot.MORNING]: '上午 (08:00-12:00)',
    [TimeSlot.AFTERNOON]: '下午 (14:00-18:00)',
    [TimeSlot.EVENING]: '晚上 (18:00-21:00)'
  };
  return labels[slot];
};

// 表单验证规则
const rules = {
  selectedDate: [{ required: true, message: '请选择就诊日期' }],
  selectedSlot: [{ required: true, message: '请选择就诊时段' }],
  patientName: [{ required: true, message: '请输入就诊人姓名' }],
  patientPhone: [
    { required: true, message: '请输入手机号码' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ]
};

// 是否可以提交
const canSubmit = computed(() => {
  return formState.selectedDate 
    && formState.selectedSlot 
    && formState.patientName 
    && formState.patientPhone;
});

// 获取选中的排班
const selectedSchedule = computed(() => {
  if (!formState.selectedDate || !formState.selectedSlot) return null;
  return schedules.value.find(
    s => s.date === formState.selectedDate && s.timeSlot === formState.selectedSlot
  );
});

// 提交预约
const handleSubmit = async () => {
  if (!doctor.value || !formState.selectedSlot || !selectedSchedule.value) {
    message.error('预约信息不完整');
    return;
  }

  // 检查号源
  if (selectedSchedule.value.bookedSlots >= selectedSchedule.value.totalSlots) {
    message.error('该时段号源已满，请选择其他时段');
    return;
  }

  // 检查是否可预约
  const patientId = store.getPatientId();
  if (!canBookAppointment(patientId, doctor.value.id, selectedSchedule.value.id)) {
    message.error('您已预约过该时段，请勿重复预约');
    return;
  }

  Modal.confirm({
    title: '确认预约',
    content: `即将预约 ${doctor.value.name} 医生的 ${formState.selectedDate} ${getTimeSlotLabel(formState.selectedSlot)}，确认预约吗？`,
    okText: '确认预约',
    cancelText: '取消',
    onOk: async () => {
      await doSubmit();
    }
  });
};

const doSubmit = async () => {
  if (!doctor.value || !formState.selectedSlot || !selectedSchedule.value) return;

  submitting.value = true;

  try {
    const patientId = store.getPatientId();

    const appointment = createAppointment({
      patientId,
      doctorId: doctor.value.id,
      scheduleId: selectedSchedule.value.id,
      appointmentDate: formState.selectedDate,
      timeSlot: formState.selectedSlot!,
      status: 'PENDING',
      patientName: formState.patientName,
      patientPhone: formState.patientPhone,
      symptom: formState.symptom
    });

    appointmentId.value = appointment.id;
    bookingSuccess.value = true;
    message.success('预约成功！');
  } catch (error) {
    message.error('预约失败，请重试');
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 查看我的预约
const goToMyAppointments = () => {
  router.push('/my-appointments');
};

// 重置预约
const resetBooking = () => {
  bookingSuccess.value = false;
  appointmentId.value = '';
  formState.selectedDate = '';
  formState.selectedSlot = null;
  formState.patientName = currentPatient.value?.name || '';
  formState.patientPhone = currentPatient.value?.phone || '';
  formState.symptom = '';
  schedules.value = [];
};

// 监听患者信息变化
watch(currentPatient, (patient) => {
  if (patient) {
    formState.patientName = patient.name;
    formState.patientPhone = patient.phone || '';
  }
});
</script>

<style scoped>
.appointment-booking {
  min-height: calc(100vh - 64px);
  padding: 24px;
  padding-top: 88px;
  background: #f5f5f5;
}

.booking-container {
  max-width: 800px;
  margin: 0 auto;
}

.back-section {
  margin-bottom: 24px;
}

.doctor-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.doctor-info {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.doctor-details h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.doctor-title {
  font-size: 16px;
  color: #1890ff;
  margin-bottom: 4px;
}

.doctor-department {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.booking-form-card {
  border-radius: 12px;
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fafafa;
  border-radius: 8px;
  color: #999;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.patient-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.patient-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.success-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.success-info {
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #666;
}

.info-row .value {
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .appointment-booking {
    padding: 16px;
    padding-top: 80px;
  }

  .doctor-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .doctor-specialties {
    justify-content: center;
  }
}
</style>
