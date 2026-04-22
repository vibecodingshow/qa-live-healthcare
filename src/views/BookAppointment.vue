<template>
  <div class="book-appointment-page">
    <div class="page-container">
      <a-page-header
        title="预约挂号"
        sub-title="选择医生和时间"
        @back="() => $router.back()"
      />

      <!-- 医生信息卡片 -->
      <a-card v-if="doctor" class="doctor-card">
        <div class="doctor-info">
          <img :src="doctor.avatar" :alt="doctor.name" class="doctor-avatar" />
          <div class="doctor-details">
            <h2>{{ doctor.name }}</h2>
            <p class="doctor-title">{{ doctor.title }} · {{ doctor.department }}</p>
            <p class="doctor-experience">{{ doctor.experience }}</p>
            <div class="doctor-specialties">
              <a-tag v-for="specialty in doctor.specialties" :key="specialty" color="blue">
                {{ specialty }}
              </a-tag>
            </div>
            <p class="doctor-location" v-if="doctor.clinicSchedule">
              <EnvironmentOutlined /> {{ doctor.clinicSchedule.clinicLocation }}
            </p>
          </div>
        </div>
      </a-card>

      <!-- 找不到医生 -->
      <a-result v-if="!doctor" status="warning" title="未找到医生">
        <template #subTitle>
          医生信息不存在或已下架
        </template>
        <template #extra>
          <a-button type="primary" @click="goToDoctors">返回医生列表</a-button>
        </template>
      </a-result>

      <!-- 预约表单 -->
      <a-card v-if="doctor" class="form-card">
        <a-form
          :model="form"
          :rules="rules"
          @finish="handleSubmit"
          layout="vertical"
        >
          <!-- 患者身份验证 -->
          <div v-if="!currentPatient" class="auth-section">
            <a-divider>患者身份验证</a-divider>
            <a-alert
              message="请先验证身份才能预约"
              type="info"
              show-icon
              style="margin-bottom: 16px;"
            />
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="姓名" name="patientName">
                  <a-input v-model:value="authForm.name" placeholder="请输入您的姓名" size="large">
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生日" name="birthday">
                  <a-date-picker
                    v-model:value="authForm.birthday"
                    format="YYYY-MM-DD"
                    placeholder="请选择生日"
                    style="width: 100%"
                    size="large"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- 预约信息 -->
          <a-divider>选择预约时间</a-divider>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="预约日期" name="appointmentDate">
                <a-date-picker
                  v-model:value="form.appointmentDate"
                  :disabled-date="disabledDate"
                  format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  style="width: 100%"
                  size="large"
                  @change="handleDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="预约时段" name="timeSlot">
                <a-select
                  v-model:value="form.timeSlot"
                  placeholder="请先选择日期"
                  :disabled="!form.appointmentDate"
                  size="large"
                >
                  <a-select-option
                    v-for="slot in availableSlots"
                    :key="slot.timeSlot"
                    :value="slot.timeSlot"
                    :disabled="slot.remainingCapacity <= 0"
                  >
                    <div class="slot-option">
                      <span>{{ slot.timeSlot }}</span>
                      <a-tag :color="slot.remainingCapacity > 0 ? 'green' : 'red'" size="small">
                        {{ slot.remainingCapacity > 0 ? `剩余 ${slot.remainingCapacity}` : '已满' }}
                      </a-tag>
                    </div>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 时段说明 -->
          <a-alert
            v-if="form.appointmentDate && availableSlots.length === 0"
            message="当日无可预约时段"
            description="该日期医生未安排门诊或所有时段已满，请选择其他日期。"
            type="warning"
            show-icon
            style="margin-bottom: 16px;"
          />

          <!-- 就诊信息 -->
          <a-divider>填写就诊信息</a-divider>

          <a-form-item label="联系电话" name="patientPhone">
            <a-input
              v-model:value="form.patientPhone"
              placeholder="请输入联系电话（选填）"
              size="large"
            >
              <template #prefix>
                <PhoneOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="就诊原因" name="reason">
            <a-textarea
              v-model:value="form.reason"
              placeholder="请简要描述您的症状或就诊原因（至少5个字符）"
              :rows="4"
              show-count
              :maxlength="500"
            />
          </a-form-item>

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
              提交预约
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons-vue';
import { store, Doctor, AvailableSlot } from '../store';

const route = useRoute();
const router = useRouter();

const doctorId = computed(() => route.params.doctorId as string);

const doctor = computed(() => {
  return store.state.doctors.find(d => d.id === doctorId.value) || null;
});

const currentPatient = computed(() => store.state.currentPatient);
const submitting = ref(false);

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const form = reactive({
  appointmentDate: null as Dayjs | null,
  timeSlot: '',
  patientPhone: '',
  reason: '',
});

const availableSlots = ref<AvailableSlot[]>([]);

// 监听日期变化，获取可用时段
watch(
  () => form.appointmentDate,
  async (newDate) => {
    form.timeSlot = ''; // 重置时段选择
    if (newDate && doctor.value) {
      const dateStr = newDate.format('YYYY-MM-DD');
      availableSlots.value = store.getAvailableSlots(doctor.value.id, dateStr);
    } else {
      availableSlots.value = [];
    }
  }
);

// 计算是否可提交
const canSubmit = computed(() => {
  return (
    (currentPatient.value || (authForm.name && authForm.birthday)) &&
    form.appointmentDate &&
    form.timeSlot &&
    form.reason.trim().length >= 5
  );
});

// 验证规则
const rules = {
  appointmentDate: [{ required: true, message: '请选择预约日期' }],
  timeSlot: [{ required: true, message: '请选择预约时段' }],
  reason: [
    { required: true, message: '请输入就诊原因' },
    { min: 5, message: '就诊原因至少5个字符' },
  ],
};

// 禁用不可预约的日期
const disabledDate = (current: Dayjs): boolean => {
  // 禁用过去的日期
  if (current && current < dayjs().startOf('day')) {
    return true;
  }

  // 禁用超过30天后的日期
  if (current && current > dayjs().add(30, 'day')) {
    return true;
  }

  // 如果没有医生排班信息，暂时不禁用
  if (!doctor.value?.clinicSchedule) {
    return false;
  }

  // 根据医生排班禁用无门诊的日期
  const dayOfWeek = current.day();
  const dayMap: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  const dayKey = dayMap[dayOfWeek];
  const dayConfig = doctor.value.clinicSchedule.weeklySchedule[dayKey];

  // 如果该天不启用门诊，禁用该日期
  return !dayConfig.enabled;
};

const handleDateChange = () => {
  form.timeSlot = '';
};

const verifyPatient = () => {
  if (!authForm.name || !authForm.birthday) {
    message.warning('请填写姓名和生日');
    return false;
  }
  store.verifyPatient(authForm.name, authForm.birthday.format('YYYY-MM-DD'));
  message.success('身份验证成功');
  return true;
};

const handleSubmit = async () => {
  if (!doctor.value || !currentPatient.value) {
    message.error('请先验证身份');
    return;
  }

  if (!form.appointmentDate || !form.timeSlot) {
    message.error('请选择预约日期和时段');
    return;
  }

  if (form.reason.trim().length < 5) {
    message.error('就诊原因至少5个字符');
    return;
  }

  submitting.value = true;

  try {
    const appointment = store.addAppointment({
      patientId: currentPatient.value.id,
      patientName: currentPatient.value.name,
      patientPhone: form.patientPhone || currentPatient.value.phone,
      doctorId: doctor.value.id,
      doctorName: doctor.value.name,
      doctorTitle: doctor.value.title,
      doctorDepartment: doctor.value.department,
      appointmentDate: form.appointmentDate.format('YYYY-MM-DD'),
      timeSlot: form.timeSlot,
      location: doctor.value.clinicSchedule?.clinicLocation || '门诊部',
      reason: form.reason.trim(),
    });

    message.success('预约提交成功！');
    router.push(`/appointments/${appointment.id}`);
  } catch (error) {
    message.error('预约提交失败，请重试');
  } finally {
    submitting.value = false;
  }
};

const goToDoctors = () => {
  router.push('/doctors');
};
</script>

<style scoped>
.book-appointment-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.doctor-card {
  margin-bottom: 24px;
}

.doctor-info {
  display: flex;
  gap: 24px;
}

.doctor-avatar {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.doctor-details {
  flex: 1;
}

.doctor-details h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.doctor-title {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin: 0 0 4px;
}

.doctor-experience {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.doctor-location {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.doctor-location .anticon-environment {
  margin-right: 4px;
  color: #1890ff;
}

.form-card {
  margin-bottom: 24px;
}

.auth-section {
  margin-bottom: 16px;
}

.slot-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .doctor-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .doctor-avatar {
    width: 100px;
    height: 100px;
  }

  .doctor-specialties {
    justify-content: center;
  }
}
</style>
