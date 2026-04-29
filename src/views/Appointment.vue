<template>
  <div class="appointment-page">
    <div class="page-header">
      <h1>预约挂号</h1>
      <p>选择医生和时间段，轻松预约门诊</p>
    </div>

    <!-- ========== 未登录引导 ========== -->
    <div v-if="!currentPatient" class="appointment-container">
      <div class="auth-prompt-card">
        <a-result
          status="warning"
          title="请先完成身份验证"
          sub-title="预约挂号需要先验证您的患者身份，请前往问诊页面完成身份验证后再进行预约"
        >
          <template #extra>
            <router-link to="/consultation">
              <a-button type="primary" size="large">
                前往身份验证
              </a-button>
            </router-link>
          </template>
        </a-result>
      </div>
    </div>

    <!-- ========== 已登录：完整预约流程 ========== -->
    <div v-else class="appointment-container">

      <!-- 状态 selecting：选择时段 + 填写表单 -->
      <div v-if="step === 'selecting'" class="selecting-section">

        <!-- 医生信息卡片 -->
        <a-card class="doctor-info-card" :bordered="false">
          <div class="doctor-info-header" v-if="selectedDoctor">
            <img :src="selectedDoctor.avatar" :alt="selectedDoctor.name" class="doctor-avatar" />
            <div class="doctor-detail">
              <h2>{{ selectedDoctor.name }}</h2>
              <p class="doctor-meta">{{ selectedDoctor.title }} · {{ selectedDoctor.department }}</p>
              <p class="doctor-exp">从业 {{ selectedDoctor.experience }}</p>
              <div class="doctor-tags">
                <a-tag v-for="spec in selectedDoctor.specialties" :key="spec" color="blue">
                  {{ spec }}
                </a-tag>
              </div>
            </div>
          </div>
          <!-- 无 doctor 参数时显示医生选择 -->
          <div v-else class="doctor-select-wrapper">
            <label>选择医生</label>
            <a-select
              v-model:value="manualDoctorId"
              size="large"
              placeholder="请选择要预约的医生"
              style="width: 100%"
            >
              <a-select-option v-for="doc in availableDoctors" :key="doc.id" :value="doc.id">
                <div class="select-doctor-option">
                  <img :src="doc.avatar" :alt="doc.name" class="option-avatar" />
                  <span>{{ doc.name }} - {{ doc.department }}</span>
                </div>
              </a-select-option>
            </a-select>
          </div>
        </a-card>

        <!-- 排班日历（仅在有 doctorId 时展示） -->
        <a-card v-if="effectiveDoctorId" class="schedule-card" title="选择就诊时间" :bordered="false">
          <ScheduleCalendar
            v-model="selectedSlotInfo"
            :doctorId="effectiveDoctorId"
          />
        </a-card>

        <!-- 病情描述（选中时段后激活） -->
        <a-card
          v-if="selectedSlotInfo"
          class="symptom-card"
          title="病情描述（选填）"
          :bordered="false"
        >
          <a-textarea
            v-model:value="symptoms"
            placeholder="请简要描述您的症状或病情，方便医生提前了解（最多200字）..."
            :rows="4"
            :maxlength="200"
            show-count
            allow-clear
          />
        </a-card>

        <!-- 提交按钮区 -->
        <div class="submit-action-bar">
          <a-button type="primary" size="large" block :disabled="!canSubmit" @click="openConfirmModal">
            <CheckCircleOutlined />
            提交预约申请
          </a-button>
          <p v-if="!effectiveDoctorId" class="submit-hint">请先选择医生</p>
          <p v-else-if="!selectedSlotInfo" class="submit-hint">请先选择就诊时间段</p>
        </div>
      </div>

      <!-- 状态 success：预约回执 -->
      <div v-if="step === 'success'" class="success-section">
        <a-result
          status="success"
          title="预约申请已提交"
          :sub-title="`预约编号：${createdAppointment?.id}`"
        >
          <template #extra>
            <a-descriptions bordered :column="1" class="receipt-descriptions" v-if="createdAppointment">
              <a-descriptions-item label="预约编号">{{ formatAppointmentNo(createdAppointment.id) }}</a-descriptions-item>
              <a-descriptions-item label="医生">{{ createdAppointment.doctorName }}</a-descriptions-item>
              <a-descriptions-item label="科室">{{ createdAppointment.department }}</a-descriptions-item>
              <a-descriptions-item label="就诊日期">{{ createdAppointment.date }}</a-descriptions-item>
              <a-descriptions-item label="就诊时间">{{ createdAppointment.startTime }} - {{ createdAppointment.endTime }}</a-descriptions-item>
              <a-descriptions-item label="当前状态">
                <a-tag color="orange">待确认</a-tag>
              </a-descriptions-item>
            </a-descriptions>
            <div class="receipt-actions">
              <router-link to="/my-appointments">
                <a-button type="primary" size="large">
                  查看我的预约
                </a-button>
              </router-link>
              <a-button size="large" @click="resetToSelecting">
                继续预约
              </a-button>
            </div>
          </template>
        </a-result>
      </div>
    </div>

    <!-- ========== 确认弹窗 ========== -->
    <a-modal
      v-model:open="confirmModalVisible"
      title="确认预约信息"
      ok-text="确认提交"
      cancel-text="返回修改"
      :confirmLoading="submitting"
      width="520px"
      @ok="confirmSubmit"
    >
      <div class="confirm-content">
        <a-alert message="请仔细核对以下信息，提交后将无法自动修改" type="info" show-icon class="confirm-tip" />

        <template v-if="selectedSlotInfo && effectiveDoctorObj">
          <a-descriptions :column="1" bordered size="small" class="confirm-descriptions">
            <a-descriptions-item label="医生">{{ effectiveDoctorObj.name }}（{{ effectiveDoctorObj.title }}）</a-descriptions-item>
            <a-descriptions-item label="科室">{{ effectiveDoctorObj.department }}</a-descriptions-item>
            <a-descriptions-item label="就诊日期">{{ selectedSlotInfo.date }}</a-descriptions-item>
            <a-descriptions-item label="就诊时间">{{ selectedSlotInfo.slot.startTime }} - {{ selectedSlotInfo.slot.endTime }}（{{ selectedSlotInfo.slot.periodLabel }}）</a-descriptions-item>
            <a-descriptions-item label="病情描述">{{ symptoms || '未填写' }}</a-descriptions-item>
          </a-descriptions>
        </template>
        <template v-else>
          <a-empty description="预约信息加载异常，请返回重试" />
        </template>

        <div class="notice-box">
          <strong>就诊须知：</strong>
          <ul>
            <li>请提前15分钟到达医院候诊</li>
            <li>请携带身份证和既往病历</li>
            <li>如需改期请提前24小时取消</li>
          </ul>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { store, Doctor, ScheduleSlot } from '../store';
import ScheduleCalendar from '../components/ScheduleCalendar.vue';

type Step = 'selecting' | 'success';

const route = useRoute();

// ========== 状态 ==========
const step = ref<Step>('selecting');
const currentPatient = computed(() => store.state.currentPatient);

// 选中的时段信息 { slot, date }
const selectedSlotInfo = ref<{ slot: ScheduleSlot; date: string } | null>(null);
const symptoms = ref('');

// 确认弹窗
const confirmModalVisible = ref(false);
const submitting = ref(false);

// 创建成功后的预约记录
const createdAppointment = computed(() => store.state.currentCreatedAppointment ?? null);

// ========== 医生相关 ==========
/** 从 query 参数解析到的医生 */
const queryDoctorUsername = computed(() => route.query.doctor as string | undefined);
const selectedDoctor = computed(() => {
  if (!queryDoctorUsername.value) return null;
  return store.getDoctorByUsername(queryDoctorUsername.value) ?? null;
});

/** 手动选择的医生ID（无query参数时） */
const manualDoctorId = ref<string>('');

/** 实际生效的医生 ID */
const effectiveDoctorId = computed(() => {
  if (selectedDoctor.value) return selectedDoctor.value.id;
  return manualDoctorId.value;
});

/** 实际生效的医生对象 */
const effectiveDoctorObj = computed<Doctor | undefined>(() => {
  if (selectedDoctor.value) return selectedDoctor.value;
  if (!manualDoctorId.value) return undefined;
  return store.state.doctors.find(d => d.id === manualDoctorId.value);
});

/** 可选医生列表 */
const availableDoctors = computed(() => store.getActiveDoctors());

// ========== 计算属性 ==========
const canSubmit = computed(() => {
  return !!currentPatient.value && !!effectiveDoctorId.value && !!selectedSlotInfo.value && symptoms.value.length <= 200;
});

// ========== 方法 ==========
function openConfirmModal(): void {
  if (!canSubmit.value) return;
  confirmModalVisible.value = true;
}

function confirmSubmit(): void {
  if (!currentPatient.value || !selectedSlotInfo.value || !effectiveDoctorObj.value) return;

  submitting.value = true;

  // 模拟异步提交
  setTimeout(() => {
    const result = store.createAppointment({
      patientId: currentPatient.value!.id,
      patientName: currentPatient.value!.name,
      doctorId: effectiveDoctorObj.value!.id,
      doctorName: effectiveDoctorObj.value!.name,
      department: effectiveDoctorObj.value!.department,
      scheduleSlotId: selectedSlotInfo.value!.slot.id,
      date: selectedSlotInfo.value!.date,
      startTime: selectedSlotInfo.value!.slot.startTime,
      endTime: selectedSlotInfo.value!.slot.endTime,
      symptoms: symptoms.value.trim(),
    });

    if (result) {
      // 将创建结果临时存到 state 上供回执使用（非持久化）
      (store.state as any).currentCreatedAppointment = result;
      message.success('预约申请已提交成功！');
      confirmModalVisible.value = false;
      step.value = 'success';
    } else {
      message.error('预约失败，该时段可能已被抢完，请重新选择');
    }

    submitting.value = false;
  }, 600);
}

function resetToSelecting(): void {
  step.value = 'selecting';
  selectedSlotInfo.value = null;
  symptoms.value = '';
  (store.state as any).currentCreatedAppointment = null;
}

function formatAppointmentNo(id: string): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const suffix = id.replace('apt', '').slice(-5).padStart(5, '0');
  return `APT-${ymd}-${suffix}`;
}

// ========== 生命周期 ==========
onMounted(() => {
  // 如果有 query 参数但找不到医生，提示一下
  if (queryDoctorUsername.value && !selectedDoctor.value) {
    message.warning(`未找到医生 ${queryDoctorUsername.value}，请手动选择医生`);
  }
});
</script>

<style scoped>
.appointment-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 24px;
  text-align: center;
  color: #fff;
}

.page-header h1 {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.page-header p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.appointment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 未登录引导卡 */
.auth-prompt-card {
  max-width: 600px;
  margin: 80px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* 选择区域 */
.selecting-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 医生信息卡片 */
.doctor-info-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-info-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.doctor-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.doctor-detail h2 {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px;
}

.doctor-meta {
  font-size: 15px;
  color: #667eea;
  margin: 0 0 4px;
  font-weight: 500;
}

.doctor-exp {
  font-size: 13px;
  color: #999;
  margin: 0 0 10px;
}

.doctor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 手动选择医生 */
.doctor-select-wrapper {
  padding: 8px 0;
}

.doctor-select-wrapper > label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.select-doctor-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

/* 排班卡片 */
.schedule-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.schedule-card :deep(.ant-card-head-title) {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

/* 病情描述卡片 */
.symptom-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.symptom-card :deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 提交操作栏 */
.submit-action-bar {
  padding: 20px 0;
}

.submit-hint {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}

/* 成功/回执区域 */
.success-section {
  max-width: 700px;
  margin: 40px auto;
}

.receipt-descriptions {
  margin: 24px 0;
}

.receipt-descriptions :deep(.ant-descriptions-item-label) {
  width: 120px;
  font-weight: 500;
}

.receipt-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

/* 确认弹窗 */
.confirm-content {
  padding: 8px 0;
}

.confirm-tip {
  margin-bottom: 16px;
}

.confirm-descriptions {
  margin-bottom: 16px;
}

.notice-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #666;
  line-height: 1.7;
}

.notice-box strong {
  color: #d48806;
}

.notice-box ul {
  margin: 6px 0 0;
  padding-left: 18px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 16px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 15px;
  }

  .appointment-container {
    padding: 12px;
  }

  .doctor-info-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .doctor-tags {
    justify-content: center;
  }

  .receipt-actions {
    flex-direction: column;
  }

  .receipt-actions .ant-btn {
    width: 100%;
  }
}
</style>
