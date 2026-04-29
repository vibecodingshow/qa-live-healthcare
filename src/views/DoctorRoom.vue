<template>
  <div class="doctor-room">
    <div class="room-container" v-if="currentDoctor">
      <!-- 顶部医生信息栏 -->
      <div class="room-header">
        <div class="doctor-info">
          <img :src="currentDoctor.avatar" :alt="currentDoctor.name" class="doctor-avatar" />
          <div>
            <h1>{{ currentDoctor.name }}的诊室</h1>
            <p>{{ currentDoctor.title }} · {{ currentDoctor.department }}</p>
          </div>
        </div>
        <div class="room-actions">
          <a-button @click="copyRoomUrl">
            <CopyOutlined />
            复制诊室链接
          </a-button>
          <a-button danger @click="logout">
            <LogoutOutlined />
            退出登录
          </a-button>
        </div>
      </div>

      <div class="room-url">
        <a-alert
          :message="`诊室URL: ${roomUrl}`"
          type="success"
          show-icon
        />
      </div>

      <!-- Tab 切换：问题回复 / 预约管理 -->
      <a-tabs v-model:activeKey="activeTab" class="main-tabs">
        <!-- ========== Tab 1: 问题回复（原有功能）========== -->
        <a-tab-pane key="questions" tab="问题回复">
          <div class="questions-section">
            <div class="section-header">
              <h2>待响应问题 ({{ pendingQuestions.length }})</h2>
              <a-button type="primary" @click="refreshQuestions">
                <ReloadOutlined />
                刷新
              </a-button>
            </div>

            <a-empty v-if="pendingQuestions.length === 0" description="暂无待响应问题" />

            <div v-else class="questions-list">
              <div
                v-for="question in pendingQuestions"
                :key="question.id"
                class="question-card"
              >
                <div class="question-header">
                  <div class="patient-info">
                    <UserOutlined class="patient-icon" />
                    <span class="patient-name">{{ question.patientName }}</span>
                  </div>
                  <span class="submit-time">{{ formatTime(question.submitTime) }}</span>
                </div>
                <div class="question-content">
                  <p>{{ question.question }}</p>
                </div>
                <div class="question-actions">
                  <a-button type="primary" @click="showAnswerModal(question)">
                    <EditOutlined />
                    文字回复
                  </a-button>
                  <a-button @click="markAsAnswered(question.id)">
                    <CheckOutlined />
                    标记已解答
                  </a-button>
                </div>
              </div>
            </div>
          </div>

          <div class="answered-section">
            <h2>已解答问题 ({{ answeredQuestions.length }})</h2>
            <a-collapse v-if="answeredQuestions.length > 0" accordion>
              <a-collapse-panel
                v-for="question in answeredQuestions"
                :key="question.id"
                :header="`${question.patientName}: ${question.question.substring(0, 50)}...`"
              >
                <div class="answered-content">
                  <p class="question-text"><strong>问题:</strong> {{ question.question }}</p>
                  <p class="answer-text"><strong>回复:</strong> {{ question.answer }}</p>
                  <p class="answer-time">回复时间: {{ formatTime(question.answerTime!) }}</p>
                </div>
              </a-collapse-panel>
            </a-collapse>
            <a-empty v-else description="暂无已解答问题" />
          </div>
        </a-tab-pane>

        <!-- ========== Tab 2: 预约管理（新增）========== -->
        <a-tab-pane key="appointments" tab="预约管理">
          <div class="appointments-section">
            <!-- 状态筛选 -->
            <div class="filter-bar">
              <h3>预约列表</h3>
              <a-segmented
                v-model:value="aptStatusFilter"
                :options="statusFilterOptions"
                size="middle"
              />
            </div>

            <!-- 空状态 -->
            <a-empty
              v-if="filteredGroupedAppointments.length === 0"
              :description="aptStatusFilter === 'all' ? '暂无预约记录' : '该状态下无预约'"
            >
              <a-button type="primary" v-if="aptStatusFilter === 'all'" @click="$router.push('/doctors')">
                前往医生团队页
              </a-button>
            </a-empty>

            <!-- 按日期分组的预约列表 -->
            <div v-else class="grouped-appointments">
              <div
                v-for="group in filteredGroupedAppointments"
                :key="group.date"
                class="date-group"
              >
                <div class="date-group-header">
                  <a-badge
                    v-if="group.isToday"
                    status="processing"
                    :text="`今日 (${group.date})`"
                  />
                  <span v-else class="date-label">{{ group.date }}</span>
                  <span class="count-badge">{{ group.appointments.length }} 条</span>
                </div>

                <div class="appointment-cards">
                  <div
                    v-for="apt in group.appointments"
                    :key="apt.id"
                    class="appointment-card"
                  >
                    <div class="apt-top-row">
                      <div class="patient-cell">
                        <UserOutlined class="apt-icon" />
                        <span class="patient-name">{{ apt.patientName }}</span>
                      </div>
                      <a-tag :color="statusColorMap[apt.status]">{{ statusLabelMap[apt.status] }}</a-tag>
                    </div>

                    <div class="apt-details">
                      <div class="detail-item">
                        <CalendarOutlined class="detail-icon" />
                        <span>{{ apt.date }} {{ apt.startTime }}-{{ apt.endTime }}</span>
                      </div>
                      <div class="detail-item symptoms-item">
                        <FileTextOutlined class="detail-icon" />
                        <span class="symptoms-text" :title="apt.symptoms">{{ apt.symptoms || '—' }}</span>
                      </div>
                    </div>

                    <div class="apt-actions">
                      <!-- PENDING → 确认按钮 -->
                      <a-popconfirm
                        v-if="apt.status === 'PENDING'"
                        title="确认接诊该预约？"
                        ok-text="确认接诊"
                        cancel-text="暂不处理"
                        @confirm="handleConfirm(apt.id)"
                        :ok-button-props="{ type: 'primary' }"
                      >
                        <a-button type="link" size="small" :loading="actioningId === apt.id">
                          确认接诊
                        </a-button>
                      </a-popconfirm>

                      <!-- CONFIRMED → 完成按钮 -->
                      <a-popconfirm
                        v-if="apt.status === 'CONFIRMED'"
                        title="标记该预约为已完成？"
                        ok-text="确认完成"
                        cancel-text="暂不处理"
                        @confirm="handleComplete(apt.id)"
                        :ok-button-props="{ type: 'primary' }"
                      >
                        <a-button type="link" size="small" :loading="actioningId === apt.id">
                          标记完成
                        </a-button>
                      </a-popconfirm>

                      <span v-if="apt.status === 'CANCELLED' || apt.status === 'COMPLETED'" class="no-action">—</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 问题回复弹窗（原有） -->
    <a-modal
      v-model:open="answerModalVisible"
      title="回复问题"
      @ok="submitAnswer"
      @cancel="closeAnswerModal"
      :confirmLoading="submitting"
    >
      <div v-if="selectedQuestion" class="modal-content">
        <div class="question-info">
          <p><strong>患者:</strong> {{ selectedQuestion.patientName }}</p>
          <p><strong>问题:</strong> {{ selectedQuestion.question }}</p>
        </div>
        <a-form-item label="您的回复">
          <a-textarea
            v-model:value="answerText"
            :rows="6"
            placeholder="请输入您的专业建议和回复..."
          />
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import {
  CopyOutlined,
  LogoutOutlined,
  ReloadOutlined,
  UserOutlined,
  EditOutlined,
  CheckOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue';
import { store, Question, Appointment } from '../store';

dayjs.extend(isSameOrBefore);

const route = useRoute();
const router = useRouter();

const username = route.params.username as string;
const currentDoctor = computed(() => store.state.currentDoctor);
const roomUrl = computed(() => `${window.location.origin}/consultation/${username}`);

// ====== Tab 状态 ======
const activeTab = ref<string>('questions');

// ====== 问题回复（原有逻辑）======
const pendingQuestions = computed(() =>
  currentDoctor.value
    ? store.getQuestionsByDoctor(currentDoctor.value.id).filter(q => q.status === 'pending')
    : []
);

const answeredQuestions = computed(() =>
  currentDoctor.value
    ? store.getQuestionsByDoctor(currentDoctor.value.id).filter(q => q.status === 'answered')
    : []
);

const answerModalVisible = ref(false);
const selectedQuestion = ref<Question | null>(null);
const answerText = ref('');
const submitting = ref(false);

// ====== 预约管理（新增）======

/** 状态筛选值 */
const aptStatusFilter = ref<string>('all');

/** 当前正在操作（确认/完成）的预约 ID */
const actioningId = ref<string | null>(null);

/** 筛选选项 */
const statusFilterOptions = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: 'PENDING' },
  { label: '已确认', value: 'CONFIRMED' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' },
];

/** 状态 → 标签颜色 */
const statusColorMap: Record<Appointment['status'], string> = {
  PENDING: 'orange',
  CONFIRMED: 'green',
  CANCELLED: 'default',
  COMPLETED: 'blue',
};

/** 状态 → 标签文案 */
const statusLabelMap: Record<Appointment['status'], string> = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  CANCELLED: '已取消',
  COMPLETED: '已完成',
};

/** 原始医生预约列表 */
const doctorAppointments = computed<Appointment[]>(() =>
  currentDoctor.value
    ? store.getAppointmentsByDoctor(currentDoctor.value.id)
    : []
);

/** 按状态筛选后的列表 */
const filteredAppointments = computed(() => {
  if (aptStatusFilter.value === 'all') return doctorAppointments.value;
  return doctorAppointments.value.filter(a => a.status === aptStatusFilter.value);
});

interface DateGroup {
  date: string;
  isToday: boolean;
  appointments: Appointment[];
}

/** 按日期分组：今日优先，未来日期升序，每组内按时段排序 */
const filteredGroupedAppointments = computed<DateGroup[]>(() => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const map = new Map<string, Appointment[]>();

  for (const apt of filteredAppointments.value) {
    const list = map.get(apt.date) || [];
    list.push(apt);
    map.set(apt.date, list);
  }

  // 排序日期 keys：今天排最前，其余升序
  const sortedDates = Array.from(map.keys()).sort((a, b) => {
    if (a === todayStr) return -1;
    if (b === todayStr) return 1;
    return a.localeCompare(b);
  });

  return sortedDates.map(date => ({
    date,
    isToday: date === todayStr,
    appointments: map.get(date)!.sort((x, y) => x.startTime.localeCompare(y.startTime)),
  }));
});

// ====== 预约操作方法 ======

/** 确认接诊 */
async function handleConfirm(appointmentId: string): Promise<void> {
  actioningId.value = appointmentId;
  try {
    const success = store.confirmAppointment(appointmentId);
    if (success) {
      message.success('已确认接诊，患者将收到通知');
    } else {
      message.error('确认失败（仅待确认状态的预约可确认）');
    }
  } catch (e) {
    message.error('操作异常，请重试');
  } finally {
    actioningId.value = null;
  }
}

/** 标记完成 */
async function handleComplete(appointmentId: string): Promise<void> {
  actioningId.value = appointmentId;
  try {
    const success = store.completeAppointment(appointmentId);
    if (success) {
      message.success('预约已标记为完成');
    } else {
      message.error('标记失败（仅已确认状态的预约可完成）');
    }
  } catch (e) {
    message.error('操作异常，请重试');
  } finally {
    actioningId.value = null;
  }
}

// ====== 问题回复方法（原有）======

onMounted(() => {
  if (!currentDoctor.value || currentDoctor.value.username !== username) {
    message.error('请先登录');
    router.push('/doctor/login');
  }
});

const copyRoomUrl = () => {
  navigator.clipboard.writeText(roomUrl.value);
  message.success('诊室链接已复制到剪贴板');
};

const logout = () => {
  store.logoutDoctor();
  message.success('已退出登录');
  router.push('/');
};

const refreshQuestions = () => {
  message.success('已刷新问题列表');
};

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};

const showAnswerModal = (question: Question) => {
  selectedQuestion.value = question;
  answerText.value = '';
  answerModalVisible.value = true;
};

const closeAnswerModal = () => {
  answerModalVisible.value = false;
  selectedQuestion.value = null;
  answerText.value = '';
};

const submitAnswer = () => {
  if (!answerText.value.trim()) {
    message.error('请输入回复内容');
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    if (selectedQuestion.value) {
      store.answerQuestion(selectedQuestion.value.id, answerText.value);
      message.success('回复成功');
      closeAnswerModal();
    }
    submitting.value = false;
  }, 500);
};

const markAsAnswered = (questionId: string) => {
  store.markQuestionAsAnswered(questionId);
  message.success('已标记为已解答');
};
</script>

<style scoped>
.doctor-room {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.room-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.room-header {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.doctor-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.doctor-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.room-actions {
  display: flex;
  gap: 12px;
}

.room-url {
  margin-bottom: 24px;
}

/* ====== Tabs 样式 ====== */
.main-tabs {
  background: #fff;
  border-radius: 12px;
  padding: 0 24px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.main-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 20px;
}

/* ====== 问题回复区域（原有样式保留）====== */
.questions-section,
.answered-section {
  /* 不再需要独立的背景圆角，已在 tabs 内 */
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-header h2,
.answered-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.patient-icon {
  font-size: 16px;
  color: #1890ff;
}

.patient-name {
  font-weight: 600;
  color: #333;
}

.submit-time {
  font-size: 12px;
  color: #999;
}

.question-content {
  margin-bottom: 12px;
}

.question-content p {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.question-actions {
  display: flex;
  gap: 12px;
}

.answered-content {
  padding: 12px 0;
}

.question-text,
.answer-text {
  margin-bottom: 12px;
  line-height: 1.6;
}

.answer-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.modal-content .question-info {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.modal-content .question-info p {
  margin: 8px 0;
  line-height: 1.6;
}

/* ====== 预约管理区域（新增样式）====== */
.appointments-section {
  min-height: 300px;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-bar h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.grouped-appointments {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.date-group {
  background: #fafafa;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #eee;
}

.date-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}

.date-label {
  font-size: 15px;
  font-weight: 600;
  color: #555;
}

.count-badge {
  font-size: 12px;
  color: #999;
  background: #eee;
  padding: 2px 10px;
  border-radius: 10px;
}

.appointment-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.appointment-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 14px 16px;
  transition: box-shadow 0.2s;
}

.appointment-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.apt-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.apt-icon {
  color: #1890ff;
  font-size: 15px;
}

.apt-top-row .patient-name {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}

.apt-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.detail-icon {
  color: #999;
  margin-top: 2px;
  flex-shrink: 0;
}

.symptoms-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  display: inline-block;
}

.apt-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}

.no-action {
  color: #ccc;
  font-size: 13px;
}

@media (max-width: 768px) {
  .room-header {
    flex-direction: column;
    gap: 16px;
  }

  .room-actions {
    width: 100%;
    flex-direction: column;
  }

  .question-actions {
    flex-direction: column;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .symptoms-text {
    max-width: 200px;
  }

  .apt-top-row {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>
