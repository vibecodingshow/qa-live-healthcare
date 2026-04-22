<template>
  <div class="patient-appointment">
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{ active: currentStep >= index, current: currentStep === index }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-title">{{ step }}</div>
      </div>
    </div>

    <!-- 步骤一：选择医生 -->
    <div v-if="currentStep === 0" class="step-content">
      <!-- 筛选器 -->
      <div class="filter-section">
        <div class="filter-group">
          <label>选择科室：</label>
          <select v-model="filters.department" @change="applyFilters">
            <option value="">全部科室</option>
            <option
              v-for="dept in departments"
              :key="dept"
              :value="dept"
            >
              {{ dept }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>选择日期：</label>
          <input
            type="date"
            v-model="filters.date"
            :min="minDate"
            @change="applyFilters"
          />
        </div>

        <div class="filter-group search">
          <input
            type="text"
            v-model="filters.keyword"
            placeholder="搜索医生姓名"
            @input="applyFilters"
          />
        </div>
      </div>

      <!-- 医生列表 -->
      <DoctorList
        :doctors="filteredDoctors"
        :selectedDoctorId="selectedDoctor?.id"
        @doctor-select="handleDoctorSelect"
      />
    </div>

    <!-- 步骤二：选择时间 -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="selected-doctor-info">
        <img :src="selectedDoctor!.avatar" :alt="selectedDoctor!.name" />
        <div class="doctor-detail">
          <div class="doctor-name">{{ selectedDoctor!.name }}</div>
          <div class="doctor-dept">{{ selectedDoctor!.department }}</div>
        </div>
        <button class="btn-change" @click="changeDoctor">
          更换医生
        </button>
      </div>

      <TimeSlotGrid
        :timeSlots="availableTimeSlots"
        :selectedSlotId="selectedSlot?.id"
        :currentDate="filters.date"
        @slot-select="handleSlotSelect"
        @date-change="handleDateChange"
      />

      <div class="step-actions">
        <button class="btn-back" @click="goBack">
          上一步
        </button>
        <button
          class="btn-next"
          @click="goNext"
          :disabled="!selectedSlot"
        >
          下一步
        </button>
      </div>
    </div>

    <!-- 步骤三：确认预约 -->
    <div v-if="currentStep === 2" class="step-content">
      <AppointmentConfirm
        :appointmentInfo="appointmentConfirmInfo"
        @confirm="handleAppointmentConfirm"
        @cancel="handleCancel"
      />

      <div class="step-actions">
        <button class="btn-back" @click="goBack">
          上一步
        </button>
      </div>
    </div>

    <!-- 操作提示 -->
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DoctorList from './DoctorList.vue';
import TimeSlotGrid from './TimeSlotGrid.vue';
import AppointmentConfirm from './AppointmentConfirm.vue';
import {
  filterDoctors,
  getDepartmentList,
  createAppointment,
  checkAppointmentConflict
} from '../utils/appointment-helper';
import type { Appointment } from '../types/appointment';
import type { Schedule, ScheduleTimeSlot } from '../types/schedule';
import appointmentsData from '../data/appointments.json';
import schedulesData from '../data/schedules.json';
import doctorUserList from '../data/doctor-user-list.json';

// 步骤定义
const steps = ['选择医生', '选择时间', '确认预约'];
const currentStep = ref(0);

// 医生列表
const doctors = ref(doctorUserList);

// 排班数据
const schedules = ref<Schedule[]>(schedulesData);

// 预约数据
const appointments = ref<Appointment[]>(appointmentsData);

// 筛选条件
const filters = ref({
  department: '',
  date: new Date().toISOString().split('T')[0],
  keyword: ''
});

// 选中医生和时间段
const selectedDoctor = ref<any>(null);
const selectedSlot = ref<ScheduleTimeSlot | null>(null);

// 提示消息
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

// 科室列表
const departments = computed(() => getDepartmentList(doctors.value));

// 最小日期（今天）
const minDate = computed(() => new Date().toISOString().split('T')[0]);

// 过滤后的医生列表
const filteredDoctors = computed(() => {
  return filterDoctors(doctors.value, {
    department: filters.value.department,
    searchKeyword: filters.value.keyword,
    availableOnly: true
  });
});

// 可用时间段
const availableTimeSlots = computed(() => {
  if (!selectedDoctor.value || !filters.value.date) {
    return [];
  }

  const doctorSchedules = schedules.value.filter(
    s => s.doctorId === selectedDoctor.value.id && s.date === filters.value.date
  );

  if (doctorSchedules.length === 0) {
    return [];
  }

  return doctorSchedules[0].timeSlots.filter(slot => 
    !slot.isBooked && slot.isAvailable
  );
});

// 预约确认信息
const appointmentConfirmInfo = computed(() => {
  if (!selectedDoctor.value || !selectedSlot.value) {
    return {
      doctorId: '',
      doctorName: '',
      department: '',
      date: '',
      timeSlot: '',
      scheduleId: ''
    };
  }

  return {
    id: '',
    doctorId: selectedDoctor.value.id,
    doctorName: selectedDoctor.value.name,
    department: selectedDoctor.value.department,
    date: filters.value.date,
    timeSlot: `${selectedSlot.value.startTime} - ${selectedSlot.value.endTime}`,
    scheduleId: schedules.value.find(
      s => s.doctorId === selectedDoctor.value.id && s.date === filters.value.date
    )?.id || ''
  };
});

onMounted(() => {
  filters.value.date = minDate.value;
});

watch(() => filters.value.date, () => {
  selectedSlot.value = null;
});

function applyFilters() {
  selectedSlot.value = null;
}

function handleDoctorSelect(doctor: any) {
  selectedDoctor.value = doctor;
}

function handleSlotSelect(slot: ScheduleTimeSlot) {
  selectedSlot.value = slot;
}

function handleDateChange(date: string) {
  filters.value.date = date;
  selectedSlot.value = null;
}

function changeDoctor() {
  selectedDoctor.value = null;
  selectedSlot.value = null;
  currentStep.value = 0;
}

function goBack() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function goNext() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
}

function handleAppointmentConfirm(data: { symptoms: string; notes: string }) {
  if (!selectedDoctor.value || !selectedSlot.value) {
    showToastMessage('请选择医生和时间段', 'error');
    return;
  }

  const appointmentTime = `${filters.value.date}T${selectedSlot.value.startTime}:00.000Z`;

  const conflict = checkAppointmentConflict({
    patientId: 'current_patient',
    doctorId: selectedDoctor.value.id,
    appointmentTime
  }, appointments.value);

  if (conflict.hasConflict) {
    showToastMessage(conflict.message, 'error');
    return;
  }

  const newAppointment = createAppointment({
    patientId: 'current_patient',
    doctorId: selectedDoctor.value.id,
    scheduleId: appointmentConfirmInfo.value.scheduleId,
    appointmentTime,
    symptoms: data.symptoms,
    notes: data.notes
  });

  appointments.value.push(newAppointment);

  const schedule = schedules.value.find(
    s => s.doctorId === selectedDoctor.value.id && s.date === filters.value.date
  );
  if (schedule) {
    const slot = schedule.timeSlots.find(t => t.id === selectedSlot.value!.id);
    if (slot) {
      slot.isBooked = true;
      slot.appointmentId = newAppointment.id;
    }
  }

  showToastMessage('预约成功', 'success');
}

function handleCancel() {
  currentStep.value = 0;
  selectedDoctor.value = null;
  selectedSlot.value = null;
}

function showToastMessage(message: string, type: 'success' | 'error') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}
</script>

<style scoped>
.patient-appointment {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 32px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: all 0.3s;
}

.step.active {
  opacity: 1;
}

.step.current .step-number {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.step-number {
  width: 32px;
  height: 32px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #999;
  transition: all 0.3s;
}

.step.active .step-number {
  border-color: #1890ff;
  color: #1890ff;
}

.step-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.step.current .step-title {
  color: #1890ff;
  font-weight: 600;
}

.step-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  min-width: 180px;
}

.filter-group.search {
  flex: 1;
}

.filter-group.search input {
  width: 100%;
}

.selected-doctor-info {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  margin-bottom: 24px;
}

.selected-doctor-info img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-detail {
  flex: 1;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.doctor-dept {
  font-size: 14px;
  color: #52c41a;
}

.btn-change {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-change:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.btn-back,
.btn-next {
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-back:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.btn-next {
  background: #1890ff;
  border: none;
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-next:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background: #52c41a;
  color: white;
}

.toast.error {
  background: #ff4d4f;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
