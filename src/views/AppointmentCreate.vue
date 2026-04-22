<template>
  <div class="appointment-create">
    <div class="create-container">
      <!-- 医生选择 -->
      <div class="section">
        <h2>选择医生</h2>
        <div class="doctor-selector">
          <a-select
            v-model:value="selectedDoctorId"
            placeholder="请选择医生"
            style="width: 300px"
            @change="handleDoctorChange"
          >
            <a-select-option 
              v-for="doctor in availableDoctors" 
              :key="doctor.id"
              :value="doctor.id"
            >
              {{ doctor.name }} - {{ doctor.department }} ({{ doctor.title }})
            </a-select-option>
          </a-select>
          
          <div v-if="selectedDoctor" class="doctor-card">
            <a-card :bordered="false">
              <div class="doctor-info">
                <img :src="selectedDoctor.avatar" :alt="selectedDoctor.name" class="avatar" />
                <div class="info">
                  <h3>{{ selectedDoctor.name }}</h3>
                  <p>{{ selectedDoctor.department }} - {{ selectedDoctor.title }}</p>
                  <p>{{ selectedDoctor.experience }}</p>
                  <p>擅长：{{ selectedDoctor.specialties.join('、') }}</p>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </div>

      <!-- 日期选择 -->
      <div class="section" v-if="selectedDoctor">
        <h2>选择预约日期</h2>
        <a-date-picker
          v-model:value="selectedDateValue"
          placeholder="请选择日期"
          :disabled-date="disabledDate"
          @change="handleDateChange"
          style="width: 200px"
        />
      </div>

      <!-- 时间段选择 -->
      <div class="section" v-if="selectedDate">
        <h2>选择时间段</h2>
        <TimeSlotPicker
          v-if="selectedDoctorId"
          :doctor-id="selectedDoctorId"
          :date="selectedDate"
          :interval-minutes="30"
          @select="handleTimeSlotSelect"
        />
        <a-empty v-else description="请先选择医生" />
      </div>

      <!-- 预约信息 -->
      <div class="section" v-if="selectedTimeSlot">
        <h2>填写预约信息</h2>
        <a-form
          :model="appointmentForm"
          :rules="formRules"
          ref="formRef"
          layout="vertical"
        >
          <a-form-item label="患者姓名" name="patientName">
            <a-input v-model:value="appointmentForm.patientName" placeholder="请输入患者姓名" />
          </a-form-item>
          
          <a-form-item label="联系电话" name="patientPhone">
            <a-input v-model:value="appointmentForm.patientPhone" placeholder="请输入联系电话" />
          </a-form-item>
          
          <a-form-item label="预约备注" name="notes">
            <a-textarea
              v-model:value="appointmentForm.notes"
              placeholder="请输入预约备注（可选）"
              :rows="3"
            />
          </a-form-item>
        </a-form>

        <!-- 预约确认信息 -->
        <div class="appointment-summary" v-if="selectedDoctor && selectedDate && selectedTimeSlot">
          <h3>预约信息确认</h3>
          <div class="summary-content">
            <p><strong>医生：</strong>{{ selectedDoctor.name }}</p>
            <p><strong>科室：</strong>{{ selectedDoctor.department }}</p>
            <p><strong>日期：</strong>{{ selectedDate }}</p>
            <p><strong>时间段：</strong>{{ selectedTimeSlot.startTime }} - {{ selectedTimeSlot.endTime }}</p>
            <p><strong>患者：</strong>{{ appointmentForm.patientName || '未填写' }}</p>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <a-button
            type="primary"
            size="large"
            :loading="submitting"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            提交预约
          </a-button>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <a-modal
      v-model:visible="successModalVisible"
      title="预约成功"
      :footer="null"
    >
      <div class="success-content">
        <a-result status="success" title="预约提交成功！">
          <template #extra>
            <a-button type="primary" @click="handleSuccessConfirm">确定</a-button>
          </template>
        </a-result>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { store } from '@/store';
import type { Doctor } from '@/types/appointment';
import TimeSlotPicker from '@/components/TimeSlotPicker.vue';
import type { TimeSlotDisplay } from '@/utils/timeSlot';

const route = useRoute();
const router = useRouter();

// 响应式数据
const selectedDoctorId = ref<string>('');
const selectedDoctor = ref<Doctor | null>(null);
const selectedDate = ref<string>('');
const selectedDateValue = ref<Dayjs | null>(null);
const selectedTimeSlot = ref<TimeSlotDisplay | null>(null);
const submitting = ref(false);
const successModalVisible = ref(false);
const formRef = ref();

// 预约表单
const appointmentForm = ref({
  patientName: '',
  patientPhone: '',
  notes: '',
});

// 表单验证规则
const formRules = {
  patientName: [
    { required: true, message: '请输入患者姓名', trigger: 'blur' },
  ],
  patientPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

// 计算属性
const availableDoctors = computed(() => {
  return store.getActiveDoctors();
});

const isFormValid = computed(() => {
  return selectedDoctorId.value && 
         selectedDate.value && 
         selectedTimeSlot.value && 
         appointmentForm.value.patientName;
});

// 方法
const handleDoctorChange = (doctorId: string) => {
  selectedDoctor.value = availableDoctors.value.find(d => d.id === doctorId) || null;
  selectedDate.value = '';
  selectedDateValue.value = null;
  selectedTimeSlot.value = null;
};

const disabledDate = (current: Dayjs) => {
  // 不能选择过去的日期
  return current && current < dayjs().startOf('day');
};

const handleDateChange = (date: Dayjs | null) => {
  if (date && selectedDoctorId.value) {
    selectedDate.value = date.format('YYYY-MM-DD');
    selectedTimeSlot.value = null;
    // 保留 selectedDateValue 以便日期能正确显示
  } else if (!date) {
    selectedDate.value = '';
    selectedTimeSlot.value = null;
  }
};

const handleTimeSlotSelect = (slot: TimeSlotDisplay) => {
  selectedTimeSlot.value = slot;
};

const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value.validate();
    
    if (!selectedDoctor.value || !selectedDate.value || !selectedTimeSlot.value) {
      message.error('请完成预约信息填写');
      return;
    }

    // 使用冲突检测进行验证
    const validation = store.validateAppointment(
      selectedDoctorId.value,
      selectedDate.value,
      selectedTimeSlot.value.startTime,
      selectedTimeSlot.value.endTime
    );

    if (!validation.valid) {
      message.error(validation.error || '预约验证失败');
      return;
    }

    submitting.value = true;

    // 创建预约
    const result = store.createAppointment({
      patientId: 'patient001', // 使用固定测试患者ID以便在"我的预约"中显示
      patientName: appointmentForm.value.patientName,
      doctorId: selectedDoctorId.value,
      doctorName: selectedDoctor.value.name,
      date: selectedDate.value,
      startTime: selectedTimeSlot.value.startTime,
      endTime: selectedTimeSlot.value.endTime,
      patientPhone: appointmentForm.value.patientPhone,
      notes: appointmentForm.value.notes,
    });

    submitting.value = false;

    if (result.success) {
      successModalVisible.value = true;
    }
    
  } catch (error) {
    submitting.value = false;
    message.error('预约提交失败，请重试');
  }
};

const handleSuccessConfirm = () => {
  successModalVisible.value = false;
  // 跳转到首页或预约列表
  router.push('/');
};

// 生命周期
onMounted(() => {
  // 如果有URL参数，预选医生
  const doctorId = route.params.doctorId as string;
  if (doctorId && availableDoctors.value.find(d => d.id === doctorId)) {
    selectedDoctorId.value = doctorId;
    handleDoctorChange(doctorId);
  }
});
</script>

<style scoped>
.appointment-create {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 64px;
}

.create-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.section {
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.doctor-info .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-info .info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.doctor-info .info p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.time-slots {
  margin-top: 16px;
}

.slot-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.time-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.time-slot:hover {
  border-color: #1890ff;
}

.time-slot.ant-radio-wrapper-checked {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.appointment-summary {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.appointment-summary h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.summary-content p {
  margin: 8px 0;
  color: #666;
}

.submit-section {
  text-align: center;
  margin-top: 32px;
}

.success-content {
  text-align: center;
}
</style>