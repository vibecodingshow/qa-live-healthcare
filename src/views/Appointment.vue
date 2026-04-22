<template>
  <div class="appointment-page">
    <div class="appointment-container">
      <div v-if="!currentPatient" class="auth-section">
        <div class="auth-card">
          <h1>患者身份验证</h1>
          <p>请输入您的姓名和生日以验证身份</p>
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

          <a-alert
            message="提示"
            description="输入任意姓名和生日即可使用。首次输入会自动创建账户,再次输入相同信息即可登录。"
            type="info"
            show-icon
          />
        </div>
      </div>

      <div v-else class="patient-portal">
        <div class="portal-header">
          <div class="patient-info">
            <UserOutlined class="patient-icon-large" />
            <div>
              <h1>{{ currentPatient.name }} 的预约挂号</h1>
              <p>选择医生和时段进行预约</p>
            </div>
          </div>
          <div class="portal-actions">
            <a-button @click="logoutPatient">
              <LogoutOutlined />
              切换用户
            </a-button>
          </div>
        </div>

        <div class="appointment-form-section">
          <div class="form-card">
            <h2>填写预约信息</h2>

            <a-form layout="vertical" :model="appointmentForm">
              <a-row :gutter="24">
                <a-col :span="24" :md="12">
                  <a-form-item label="选择医生" required>
                    <a-select
                      v-model:value="appointmentForm.doctorId"
                      size="large"
                      placeholder="请选择要预约的医生"
                      :disabled="!!selectedDoctor"
                      @change="onDoctorChange"
                    >
                      <a-select-option
                        v-for="doctor in availableDoctors"
                        :key="doctor.id"
                        :value="doctor.id"
                      >
                        <div class="doctor-option">
                          <img :src="doctor.avatar" :alt="doctor.name" class="doctor-option-avatar" />
                          <div>
                            <div>{{ doctor.name }}</div>
                            <div style="font-size: 12px; color: #999;">
                              {{ doctor.title }} · {{ doctor.department }}
                            </div>
                          </div>
                        </div>
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="24" :md="12">
                  <a-form-item label="预约日期" required>
                    <a-date-picker
                      v-model:value="appointmentForm.date"
                      size="large"
                      format="YYYY-MM-DD"
                      placeholder="请选择预约日期"
                      :disabled-date="disabledDate"
                      style="width: 100%"
                      @change="onDateChange"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="选择时段" required>
                <div v-if="!appointmentForm.doctorId || !appointmentForm.date" class="time-slots-placeholder">
                  请先选择医生和日期
                </div>
                <div v-else-if="loadingSlots" class="time-slots-placeholder">
                  加载时段中...
                </div>
                <div v-else-if="availableSlots.length === 0" class="time-slots-placeholder">
                  暂无可用时段
                </div>
                <div v-else class="time-slots">
                  <div
                    v-for="slot in availableSlots"
                    :key="slot.time"
                    class="time-slot"
                    :class="{
                      'time-slot-selected': appointmentForm.time === slot.time,
                      'time-slot-disabled': !slot.available
                    }"
                    :style="{ opacity: slot.available ? 1 : 0.5 }"
                    @click="slot.available && selectTimeSlot(slot.time)"
                  >
                    <span>{{ slot.time }}</span>
                    <span v-if="!slot.available" class="slot-status">已满</span>
                  </div>
                </div>
              </a-form-item>

              <a-form-item label="症状描述" required>
                <a-textarea
                  v-model:value="appointmentForm.symptoms"
                  :rows="4"
                  placeholder="请描述您的症状或不适..."
                  :maxlength="500"
                  show-count
                />
              </a-form-item>

              <a-form-item>
                <a-button
                  type="primary"
                  size="large"
                  block
                  :loading="submitting"
                  :disabled="!canSubmit"
                  @click="submitAppointment"
                >
                  提交预约
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="successModalVisible"
      title="预约成功"
      :footer="null"
      width="450px"
    >
      <div class="success-content">
        <a-result
          status="success"
          title="预约提交成功"
          sub-title="请按时前往医院就诊"
        >
          <template #extra>
            <div class="appointment-summary">
              <p><strong>医生:</strong> {{ successData.doctorName }}</p>
              <p><strong>日期:</strong> {{ successData.date }}</p>
              <p><strong>时段:</strong> {{ successData.time }}</p>
            </div>
            <a-space>
              <a-button type="primary" @click="goToMyAppointments">
                查看我的预约
              </a-button>
              <a-button @click="successModalVisible = false">
                继续预约
              </a-button>
            </a-space>
          </template>
        </a-result>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';
import { store, Doctor, TimeSlot } from '../store';

const route = useRoute();
const router = useRouter();

const currentPatient = computed(() => store.state.currentPatient);

const selectedDoctor = ref<Doctor | null>(null);
const loadingSlots = ref(false);
const submitting = ref(false);

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const appointmentForm = reactive({
  doctorId: '',
  date: null as Dayjs | null,
  time: '',
  symptoms: '',
});

const availableSlots = ref<TimeSlot[]>([]);
const successModalVisible = ref(false);
const successData = reactive({
  doctorName: '',
  date: '',
  time: '',
});

const availableDoctors = computed(() => {
  return selectedDoctor.value
    ? [selectedDoctor.value]
    : store.getActiveDoctors();
});

const canSubmit = computed(() => {
  return (
    appointmentForm.doctorId &&
    appointmentForm.date &&
    appointmentForm.time &&
    appointmentForm.symptoms.trim()
  );
});

watch(
  () => route.params.doctorUsername,
  (doctorUsername) => {
    if (doctorUsername) {
      const doctor = store.getDoctorByUsername(doctorUsername as string);
      if (doctor && doctor.isActive) {
        selectedDoctor.value = doctor;
        appointmentForm.doctorId = doctor.id;
      }
    }
  },
  { immediate: true }
);

const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

const onDoctorChange = () => {
  appointmentForm.time = '';
  loadAvailableSlots();
};

const onDateChange = () => {
  appointmentForm.time = '';
  loadAvailableSlots();
};

const loadAvailableSlots = () => {
  if (!appointmentForm.doctorId || !appointmentForm.date) {
    availableSlots.value = [];
    return;
  }

  loadingSlots.value = true;
  const dateStr = appointmentForm.date!.format('YYYY-MM-DD');
  availableSlots.value = store.getAvailableSlots(appointmentForm.doctorId, dateStr);
  loadingSlots.value = false;
};

const selectTimeSlot = (time: string) => {
  appointmentForm.time = time;
};

const verifyPatient = () => {
  const birthday = authForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }

  const existingPatientCount = store.state.patients.filter(
    p => p.name === authForm.name && p.birthday === birthday
  ).length;

  store.verifyPatient(authForm.name, birthday);

  if (existingPatientCount > 0) {
    message.success('验证成功,欢迎回来!');
  } else {
    message.success('首次登录,已为您创建账户!');
  }
};

const logoutPatient = () => {
  store.logoutPatient();
  selectedDoctor.value = null;
  appointmentForm.doctorId = '';
  appointmentForm.date = null;
  appointmentForm.time = '';
  appointmentForm.symptoms = '';
  availableSlots.value = [];
  message.success('已切换用户');
};

const submitAppointment = () => {
  if (!canSubmit.value) {
    message.error('请填写完整的预约信息');
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    const doctor = store.state.doctors.find(d => d.id === appointmentForm.doctorId);
    if (doctor && currentPatient.value) {
      store.addAppointment({
        patientId: currentPatient.value.id,
        patientName: currentPatient.value.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        appointmentDate: appointmentForm.date!.format('YYYY-MM-DD'),
        appointmentTime: appointmentForm.time,
        symptoms: appointmentForm.symptoms,
      });

      successData.doctorName = doctor.name;
      successData.date = appointmentForm.date!.format('YYYY-MM-DD');
      successData.time = appointmentForm.time;

      successModalVisible.value = true;

      appointmentForm.time = '';
      appointmentForm.symptoms = '';
      loadAvailableSlots();
    }

    submitting.value = false;
  }, 500);
};

const goToMyAppointments = () => {
  successModalVisible.value = false;
  router.push('/my-appointments');
};
</script>

<style scoped>
.appointment-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.appointment-container {
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

.appointment-form-section {
  padding: 32px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.form-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.time-slots-placeholder {
  padding: 24px;
  text-align: center;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.time-slot {
  padding: 16px;
  text-align: center;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.time-slot:hover:not(.time-slot-disabled) {
  background: #e6f7ff;
  border-color: #1890ff;
}

.time-slot-selected {
  background: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff;
}

.time-slot-disabled {
  cursor: not-allowed;
}

.slot-status {
  font-size: 12px;
  color: #999;
}

.time-slot-selected .slot-status {
  color: rgba(255, 255, 255, 0.8);
}

.doctor-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-option-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.success-content {
  padding: 16px 0;
}

.appointment-summary {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.appointment-summary p {
  margin: 8px 0;
  color: #52c41a;
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
  }

  .appointment-form-section {
    padding: 24px 16px;
  }

  .time-slots {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
