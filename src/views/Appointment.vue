<template>
  <div class="appointment">
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

    <div v-else class="appointment-container">
      <a-alert message="预约数据仅保存在当前会话中，刷新页面后将丢失" type="warning" show-icon style="margin-bottom: 24px" />

      <!-- 医生列表视图 -->
      <div v-if="!selectedDoctor">
        <h2 class="section-title">选择医生</h2>
        <div class="doctor-grid">
          <a-card
            v-for="doctor in activeDoctors"
            :key="doctor.id"
            class="doctor-card"
            hoverable
            @click="selectedDoctor = doctor"
          >
            <template #cover>
              <img :src="doctor.avatar" :alt="doctor.name" class="doctor-avatar" />
            </template>
            <a-card-meta :title="doctor.name" :description="doctor.department">
              <template #description>
                <p>{{ doctor.title }}</p>
                <div class="specialty-tags">
                  <a-tag v-for="tag in doctor.specialties" :key="tag">{{ tag }}</a-tag>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>

      <!-- 排班详情视图 -->
      <div v-else class="schedule-detail">
        <div class="schedule-header">
          <a-button @click="goBackToList">
            <LeftOutlined />
            返回列表
          </a-button>
          <div class="selected-doctor-info">
            <img :src="selectedDoctor.avatar" :alt="selectedDoctor.name" class="doctor-avatar-small" />
            <div>
              <h3>{{ selectedDoctor.name }}</h3>
              <p>{{ selectedDoctor.title }} · {{ selectedDoctor.department }}</p>
            </div>
          </div>
        </div>

        <div class="date-selector">
          <a-button
            v-for="d in next7Days"
            :key="d.date"
            :type="selectedDate === d.date ? 'primary' : 'default'"
            shape="round"
            size="small"
            @click="selectDate(d.date)"
            :title="d.fullLabel"
          >
            {{ d.label }}
          </a-button>
        </div>

        <div v-if="slotsForDate.length === 0" class="no-slots">
          <a-empty description="该日暂无排班" />
        </div>

        <div v-else-if="allBooked" class="no-slots">
          <a-empty description="该日已约满" />
        </div>

        <div v-else class="slot-sections">
          <div class="slot-group">
            <h4>上午</h4>
            <div v-if="morningSlots.length === 0" class="no-period-slots">暂无排班</div>
            <div v-else class="slot-buttons">
              <a-button
                v-for="slot in morningSlots"
                :key="slot.id"
                :disabled="slot.status === 'booked'"
                :type="selectedSlot?.id === slot.id ? 'primary' : 'default'"
                size="small"
                @click="selectedSlot = slot"
              >
                {{ slot.timeSlot }}
              </a-button>
            </div>
          </div>

          <div class="slot-group">
            <h4>下午</h4>
            <div v-if="afternoonSlots.length === 0" class="no-period-slots">暂无排班</div>
            <div v-else class="slot-buttons">
              <a-button
                v-for="slot in afternoonSlots"
                :key="slot.id"
                :disabled="slot.status === 'booked'"
                :type="selectedSlot?.id === slot.id ? 'primary' : 'default'"
                size="small"
                @click="selectedSlot = slot"
              >
                {{ slot.timeSlot }}
              </a-button>
            </div>
          </div>

          <a-button
            type="primary"
            size="large"
            block
            :disabled="!selectedSlot"
            @click="confirmModalVisible = true"
            style="margin-top: 24px"
          >
            预约挂号
          </a-button>
        </div>
      </div>
    </div>

    <!-- 预约确认 Modal -->
    <a-modal
      v-model:open="confirmModalVisible"
      title="确认预约"
      :confirmLoading="submitting"
      :maskClosable="false"
      :closable="!submitting"
      okText="确认预约"
      cancelText="取消"
      @ok="handleSubmitAppointment"
      @cancel="confirmModalVisible = false"
    >
      <div v-if="selectedDoctor && selectedDate && selectedSlot">
        <p><strong>医生：</strong>{{ selectedDoctor.name }}（{{ selectedDoctor.title }}·{{ selectedDoctor.department }}）</p>
        <p><strong>日期：</strong>{{ dayjs(selectedDate).format('YYYY年MM月DD日 dddd') }}</p>
        <p><strong>时段：</strong>{{ selectedSlot.timeSlot }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { UserOutlined, LeftOutlined } from '@ant-design/icons-vue';
import { store, AppointmentSlot } from '../store';

const currentPatient = computed(() => store.state.currentPatient);
const activeDoctors = computed(() => store.getActiveDoctors());

const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});
const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

const selectedDoctor = ref<any>(null);
const selectedDate = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'));
const selectedSlot = ref<AppointmentSlot | null>(null);

const confirmModalVisible = ref(false);
const submitting = ref(false);

const next7Days = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().add(i + 1, 'day');
    return {
      date: d.format('YYYY-MM-DD'),
      label: d.format('M/D'),
      fullLabel: d.format('YYYY年MM月DD日 dddd'),
    };
  });
});

const slotsForDate = computed(() => {
  if (!selectedDoctor.value || !selectedDate.value) return [];
  return store.getSlotsByDoctorAndDate(selectedDoctor.value.id, selectedDate.value);
});

const morningSlots = computed(() => slotsForDate.value.filter(s => s.period === 'morning'));
const afternoonSlots = computed(() => slotsForDate.value.filter(s => s.period === 'afternoon'));
const allBooked = computed(() => slotsForDate.value.length > 0 && slotsForDate.value.every(s => s.status === 'booked'));

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

const selectDate = (date: string) => {
  selectedDate.value = date;
  selectedSlot.value = null;
};

const goBackToList = () => {
  selectedDoctor.value = null;
  selectedSlot.value = null;
};

const handleSubmitAppointment = () => {
  submitting.value = true;
  setTimeout(() => {
    const result = store.createAppointment({
      patientId: currentPatient.value!.id,
      patientName: currentPatient.value!.name,
      doctorId: selectedDoctor.value.id,
      doctorName: selectedDoctor.value.name,
      date: selectedDate.value,
      timeSlot: selectedSlot.value!.timeSlot,
    });
    if (result) {
      message.success('预约挂号成功');
      selectedSlot.value = null;
      confirmModalVisible.value = false;
    } else {
      message.error('预约失败，该时段已被预约');
    }
    submitting.value = false;
  }, 500);
};
</script>

<style scoped>
.appointment {
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

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.doctor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.doctor-card {
  border-radius: 12px;
  overflow: hidden;
}

.doctor-card .doctor-avatar {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.specialty-tags {
  margin-top: 8px;
}

.schedule-detail {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.selected-doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-avatar-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.selected-doctor-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 2px;
}

.selected-doctor-info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.date-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.no-slots {
  text-align: center;
  padding: 40px 0;
}

.slot-sections {
  margin-top: 8px;
}

.slot-group {
  margin-bottom: 20px;
}

.slot-group h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.no-period-slots {
  color: #999;
  font-size: 14px;
}

.slot-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 24px;
    padding: 32px 24px;
  }

  .doctor-grid {
    grid-template-columns: 1fr;
  }

  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
