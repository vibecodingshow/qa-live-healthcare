<template>
  <div class="doctor-room">
    <div class="room-container" v-if="currentDoctor">
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

      <!-- 排班管理区域 -->
      <div class="schedule-section">
        <div class="section-header">
          <h2>排班管理</h2>
          <a-button type="primary" @click="showScheduleModal = true">
            <PlusOutlined />
            新增排班
          </a-button>
        </div>

        <a-empty v-if="doctorSchedules.length === 0" description="暂无排班记录" />

        <div v-else class="schedule-list">
          <a-card
            v-for="schedule in sortedSchedules"
            :key="schedule.id"
            class="schedule-card"
            :class="{ 'past-schedule': isPastSchedule(schedule) }"
          >
            <div class="schedule-content">
              <div class="schedule-info">
                <div class="schedule-date">
                  <strong>{{ formatDate(schedule.date) }}</strong>
                  <span class="time-slot">{{ schedule.startTime }} - {{ schedule.endTime }}</span>
                </div>
                <div class="schedule-status">
                  <a-tag :color="schedule.isAvailable ? 'green' : 'red'">
                    {{ schedule.isAvailable ? '可用' : '不可用' }}
                  </a-tag>
                  <span class="appointment-count">{{ schedule.currentAppointments }}/{{ schedule.maxAppointments }} 预约</span>
                </div>
              </div>
              <div class="schedule-actions">
                <a-button 
                  size="small" 
                  @click="editSchedule(schedule)"
                  :disabled="isPastSchedule(schedule)"
                >
                  <EditOutlined />
                  编辑
                </a-button>
                <a-button 
                  size="small" 
                  danger 
                  @click="deleteSchedule(schedule)"
                  :disabled="hasActiveAppointments(schedule)"
                >
                  <DeleteOutlined />
                  删除
                </a-button>
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 医生预约管理区域 -->
      <div class="appointments-section">
        <div class="section-header">
          <h2>预约管理</h2>
          <a-select
            v-model:value="appointmentStatusFilter"
            placeholder="筛选预约状态"
            style="width: 150px"
            allowClear
          >
            <a-select-option value="pending">待确认</a-select-option>
            <a-select-option value="confirmed">已确认</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </div>

        <a-empty v-if="filteredDoctorAppointments.length === 0" description="暂无预约记录" />

        <div v-else class="appointments-list">
          <a-card
            v-for="appointment in filteredDoctorAppointments"
            :key="appointment.id"
            class="appointment-card"
          >
            <div class="appointment-content">
              <div class="appointment-header">
                <div class="patient-info">
                  <UserOutlined class="patient-icon" />
                  <div class="patient-details">
                    <h3>{{ appointment.patientName }}</h3>
                    <p>{{ appointment.patientPhone || '未填写电话' }}</p>
                  </div>
                </div>
                <AppointmentStatusTag :status="appointment.status" />
              </div>

              <div class="appointment-details">
                <div class="detail-item">
                  <CalendarOutlined class="icon" />
                  <span>{{ formatDate(appointment.date) }} {{ appointment.startTime }} - {{ appointment.endTime }}</span>
                </div>
                <div class="detail-item" v-if="appointment.notes">
                  <FileTextOutlined class="icon" />
                  <span>{{ appointment.notes }}</span>
                </div>
              </div>

              <div class="appointment-actions">
                <template v-if="appointment.status === 'pending'">
                  <a-button type="primary" @click="confirmDoctorAppointment(appointment.id)">
                    确认预约
                  </a-button>
                  <a-button danger @click="cancelDoctorAppointment(appointment)">
                    拒绝预约
                  </a-button>
                </template>
                <a-button 
                  v-if="appointment.status === 'confirmed'" 
                  type="primary"
                  @click="completeDoctorAppointment(appointment.id)"
                >
                  标记完成
                </a-button>
                <a-button ghost @click="viewDoctorAppointmentDetails(appointment)">
                  查看详情
                </a-button>
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 排班编辑模态框 -->
      <a-modal
        v-model:open="scheduleModalVisible"
        :title="isEditing ? '编辑排班' : '新增排班'"
        @ok="submitSchedule"
        @cancel="closeScheduleModal"
        :confirmLoading="submittingSchedule"
      >
        <a-form
          :model="scheduleForm"
          :rules="scheduleRules"
          ref="scheduleFormRef"
          layout="vertical"
        >
          <a-form-item label="日期" name="date">
            <a-date-picker
              v-model:value="scheduleForm.date"
              placeholder="请选择日期"
              :disabled-date="disabledScheduleDate"
              style="width: 100%"
            />
          </a-form-item>
          
          <a-form-item label="开始时间" name="startTime">
            <a-time-picker
              v-model:value="scheduleForm.startTime"
              placeholder="请选择开始时间"
              format="HH:mm"
              style="width: 100%"
            />
          </a-form-item>
          
          <a-form-item label="结束时间" name="endTime">
            <a-time-picker
              v-model:value="scheduleForm.endTime"
              placeholder="请选择结束时间"
              format="HH:mm"
              style="width: 100%"
            />
          </a-form-item>
          
          <a-form-item label="最大预约数" name="maxAppointments">
            <a-input-number
              v-model:value="scheduleForm.maxAppointments"
              :min="1"
              :max="20"
              placeholder="请输入最大预约数"
              style="width: 100%"
            />
          </a-form-item>
          
          <a-form-item label="是否可用" name="isAvailable">
            <a-switch v-model:checked="scheduleForm.isAvailable" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

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
import {
  CopyOutlined,
  LogoutOutlined,
  ReloadOutlined,
  UserOutlined,
  EditOutlined,
  CheckOutlined,
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue';
import { store, Question, Schedule, ScheduleInput, Appointment } from '../store';
import AppointmentStatusTag from '@/components/AppointmentStatusTag.vue';

const route = useRoute();
const router = useRouter();

const username = route.params.username as string;
const currentDoctor = computed(() => store.state.currentDoctor);
const roomUrl = computed(() => `${window.location.origin}/consultation/${username}`);

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

// 排班管理相关计算属性
const doctorSchedules = computed(() => {
  if (!currentDoctor.value) return [];
  return store.getSchedulesByDoctor(currentDoctor.value.id);
});

const sortedSchedules = computed(() => {
  return [...doctorSchedules.value].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
});

// 医生预约管理相关计算属性
const doctorAppointments = computed(() => {
  if (!currentDoctor.value) return [];
  return store.getAppointmentsByDoctor(currentDoctor.value.id);
});

const filteredDoctorAppointments = computed(() => {
  if (!appointmentStatusFilter.value) {
    return doctorAppointments.value;
  }
  return doctorAppointments.value.filter(a => a.status === appointmentStatusFilter.value);
});

const answerModalVisible = ref(false);
const selectedQuestion = ref<Question | null>(null);
const answerText = ref('');
const submitting = ref(false);

// 排班管理相关状态
const scheduleModalVisible = ref(false);
const isEditing = ref(false);
const editingSchedule = ref<Schedule | null>(null);
const submittingSchedule = ref(false);
const scheduleFormRef = ref();

// 排班表单
const scheduleForm = ref<{
  date: string;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  isAvailable: boolean;
}>({
  date: '',
  startTime: '',
  endTime: '',
  maxAppointments: 5,
  isAvailable: true
});

// 预约管理相关状态
const appointmentStatusFilter = ref<string>('');

// 表单验证规则
const scheduleRules = {
  date: [
    { required: true, message: '请选择日期', trigger: 'change' },
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
  ],
  maxAppointments: [
    { required: true, message: '请输入最大预约数', trigger: 'blur' },
    { type: 'number', min: 1, max: 20, message: '预约数必须在1-20之间', trigger: 'blur' },
  ],
};

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

// 排班管理方法
const isPastSchedule = (schedule: Schedule): boolean => {
  return new Date(schedule.date) < new Date();
};

const hasActiveAppointments = (schedule: Schedule): boolean => {
  return schedule.currentAppointments > 0;
};

const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY年MM月DD日');
};

const disabledScheduleDate = (current: any): boolean => {
  // 不能选择过去的日期
  return current && current < dayjs().startOf('day');
};

const showScheduleModal = () => {
  scheduleModalVisible.value = true;
  isEditing.value = false;
  editingSchedule.value = null;
  scheduleForm.value = {
    date: '',
    startTime: '',
    endTime: '',
    maxAppointments: 5,
    isAvailable: true
  };
};

const editSchedule = (schedule: Schedule) => {
  scheduleModalVisible.value = true;
  isEditing.value = true;
  editingSchedule.value = schedule;
  scheduleForm.value = {
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    maxAppointments: schedule.maxAppointments,
    isAvailable: schedule.isAvailable
  };
};

const deleteSchedule = async (schedule: Schedule) => {
  if (hasActiveAppointments(schedule)) {
    message.error('该排班已有预约，无法删除');
    return;
  }
  
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${formatDate(schedule.date)} ${schedule.startTime}-${schedule.endTime} 的排班吗？`,
    onOk: async () => {
      const success = store.deleteSchedule(schedule.id);
      if (success) {
        message.success('排班删除成功');
      } else {
        message.error('排班删除失败');
      }
    }
  });
};

const closeScheduleModal = () => {
  scheduleModalVisible.value = false;
  scheduleFormRef.value?.resetFields();
};

const submitSchedule = async () => {
  try {
    await scheduleFormRef.value.validate();
    
    submittingSchedule.value = true;
    
    const scheduleData: ScheduleInput = {
      doctorId: currentDoctor.value!.id,
      date: typeof scheduleForm.value.date === 'string' 
        ? scheduleForm.value.date 
        : scheduleForm.value.date.format('YYYY-MM-DD'),
      startTime: typeof scheduleForm.value.startTime === 'string'
        ? scheduleForm.value.startTime
        : scheduleForm.value.startTime.format('HH:mm'),
      endTime: typeof scheduleForm.value.endTime === 'string'
        ? scheduleForm.value.endTime
        : scheduleForm.value.endTime.format('HH:mm'),
      maxAppointments: scheduleForm.value.maxAppointments,
      isAvailable: scheduleForm.value.isAvailable
    };
    
    if (isEditing.value && editingSchedule.value) {
      // 编辑逻辑 - 这里需要先删除再创建，因为Store没有直接编辑方法
      store.deleteSchedule(editingSchedule.value.id);
      store.createSchedule(scheduleData);
      message.success('排班更新成功');
    } else {
      // 新增逻辑
      store.createSchedule(scheduleData);
      message.success('排班创建成功');
    }
    
    closeScheduleModal();
    
  } catch (error) {
    console.error('排班提交失败:', error);
  } finally {
    submittingSchedule.value = false;
  }
};

// 医生预约管理方法
const confirmDoctorAppointment = (appointmentId: string) => {
  const success = store.confirmAppointment(appointmentId);
  if (success) {
    message.success('预约已确认');
  } else {
    message.error('确认失败，请重试');
  }
};

const completeDoctorAppointment = (appointmentId: string) => {
  const success = store.completeAppointment(appointmentId);
  if (success) {
    message.success('预约已完成');
  } else {
    message.error('操作失败，请重试');
  }
};

const cancelDoctorAppointment = (appointment: Appointment) => {
  Modal.confirm({
    title: '确认拒绝预约',
    content: `确定要拒绝 ${appointment.patientName} 的预约吗？`,
    onOk: () => {
      const success = store.cancelAppointment(appointment.id, '医生拒绝');
      if (success) {
        message.success('已拒绝预约');
      } else {
        message.error('操作失败，请重试');
      }
    }
  });
};

const viewDoctorAppointmentDetails = (appointment: Appointment) => {
  Modal.info({
    title: '预约详情',
    content: `
      <p><strong>患者姓名：</strong>${appointment.patientName}</p>
      <p><strong>联系电话：</strong>${appointment.patientPhone || '未填写'}</p>
      <p><strong>预约日期：</strong>${formatDate(appointment.date)}</p>
      <p><strong>预约时间：</strong>${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>预约状态：</strong>${getStatusText(appointment.status)}</p>
      <p><strong>备注：</strong>${appointment.notes || '无'}</p>
      <p><strong>创建时间：</strong>${formatDateTime(appointment.createTime)}</p>
    `,
    okText: '关闭'
  });
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
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

.questions-section,
.answered-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

/* 排班管理样式 */
.schedule-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.schedule-card.past-schedule {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.schedule-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.schedule-info {
  flex: 1;
}

.schedule-date {
  margin-bottom: 8px;
}

.schedule-date strong {
  font-size: 16px;
  color: #333;
}

.time-slot {
  margin-left: 12px;
  color: #666;
  font-size: 14px;
}

.schedule-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.appointment-count {
  font-size: 12px;
  color: #999;
}

.schedule-actions {
  display: flex;
  gap: 8px;
}

.schedule-actions .ant-btn {
  font-size: 12px;
}

/* 医生预约管理样式 */
.appointments-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.appointment-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.appointment-content {
  padding: 8px;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-icon {
  font-size: 24px;
  color: #1890ff;
}

.patient-details h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.patient-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.appointment-details {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .icon {
  color: #1890ff;
  font-size: 16px;
}

.appointment-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
}
</style>
