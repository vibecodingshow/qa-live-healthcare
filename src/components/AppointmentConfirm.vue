<template>
  <div class="appointment-confirm">
    <div class="confirm-header">
      <h3>确认预约信息</h3>
    </div>

    <div class="confirm-content">
      <!-- 预约信息摘要 -->
      <div class="info-section">
        <h4>预约信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>医生：</label>
            <span class="value">{{ appointmentInfo.doctorName }}</span>
          </div>
          <div class="info-item">
            <label>科室：</label>
            <span class="value">{{ appointmentInfo.department }}</span>
          </div>
          <div class="info-item">
            <label>预约日期：</label>
            <span class="value">{{ appointmentInfo.date }}</span>
          </div>
          <div class="info-item">
            <label>预约时间：</label>
            <span class="value highlight">{{ appointmentInfo.timeSlot }}</span>
          </div>
        </div>
      </div>

      <!-- 症状描述表单 -->
      <div class="form-section">
        <h4>症状描述</h4>
        <div class="form-group">
          <label>请描述您的症状和需求 <span class="required">*</span></label>
          <textarea
            v-model="symptoms"
            rows="4"
            placeholder="请详细描述您的症状、持续时间、是否有过敏史等信息，以便医生更好地了解您的情况"
            maxlength="500"
          ></textarea>
          <div class="char-count">
            {{ symptoms.length }} / 500
          </div>
          <div v-if="errors.symptoms" class="error-message">
            {{ errors.symptoms }}
          </div>
        </div>

        <div class="form-group">
          <label>备注（选填）</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="如有其他需要说明的事项，请在此填写"
            maxlength="200"
          ></textarea>
          <div class="char-count">
            {{ notes.length }} / 200
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="notice-section">
        <h4>⚠️ 注意事项</h4>
        <ul>
          <li>请按时就诊，如无法按时前来，请提前取消预约</li>
          <li>就诊时请携带有效身份证件</li>
          <li>预约成功后，您将收到确认短信通知</li>
          <li>如需退号，请至少提前2小时操作</li>
        </ul>
      </div>

      <!-- 预约确认按钮 -->
      <div class="confirm-actions">
        <button class="btn-cancel" @click="handleCancel">
          取消
        </button>
        <button
          class="btn-confirm"
          @click="handleConfirm"
          :disabled="!canSubmit"
        >
          确认预约
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccessModal" class="success-modal-overlay">
          <div class="success-modal">
            <div class="success-icon">✓</div>
            <h3>预约成功</h3>
            <p>您的预约已提交，请等待医生确认</p>
            <p class="appointment-id">预约编号：{{ appointmentInfo.id }}</p>
            <button class="btn-close" @click="closeSuccessModal">
              完成
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface AppointmentInfo {
  id?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  scheduleId: string;
}

interface Props {
  appointmentInfo: AppointmentInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm', data: { symptoms: string; notes: string }): void;
  (e: 'cancel'): void;
}>();

// 表单数据
const symptoms = ref('');
const notes = ref('');
const errors = ref<Record<string, string>>({});

// 成功提示显示状态
const showSuccessModal = ref(false);

// 监听症状输入变化，清除错误
watch(symptoms, () => {
  if (errors.value.symptoms) {
    errors.value.symptoms = '';
  }
});

// 验证表单
function validateForm(): boolean {
  errors.value = {};

  if (!symptoms.value.trim()) {
    errors.value.symptoms = '请填写症状描述';
    return false;
  }

  if (symptoms.value.length > 500) {
    errors.value.symptoms = '症状描述不能超过500个字符';
    return false;
  }

  return true;
}

// 是否可以提交
const canSubmit = computed(() => {
  return symptoms.value.trim().length > 0 && symptoms.value.length <= 500;
});

// 确认预约
function handleConfirm() {
  if (validateForm()) {
    emit('confirm', {
      symptoms: symptoms.value.trim(),
      notes: notes.value.trim()
    });
    
    // 显示成功提示
    showSuccessModal.value = true;
  }
}

// 取消
function handleCancel() {
  emit('cancel');
}

// 关闭成功提示
function closeSuccessModal() {
  showSuccessModal.value = false;
  // 重置表单
  symptoms.value = '';
  notes.value = '';
  emit('cancel');
}
</script>

<style scoped>
.appointment-confirm {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.confirm-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.confirm-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.confirm-content {
  padding: 20px;
}

.info-section,
.form-section,
.notice-section {
  margin-bottom: 24px;
}

.info-section h4,
.form-section h4,
.notice-section h4 {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.info-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-item .value.highlight {
  color: #1890ff;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #ff4d4f;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group textarea:focus {
  outline: none;
  border-color: #1890ff;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.notice-section {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
}

.notice-section h4 {
  margin-bottom: 12px;
}

.notice-section ul {
  margin: 0;
  padding-left: 20px;
}

.notice-section li {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 4px;
}

.notice-section li:last-child {
  margin-bottom: 0;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-cancel:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.btn-confirm {
  background: #1890ff;
  border: none;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-confirm:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

/* 成功提示模态框样式 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.success-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #52c41a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 24px;
}

.success-modal h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
}

.success-modal p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.appointment-id {
  font-size: 13px !important;
  color: #999 !important;
  margin-bottom: 24px !important;
}

.btn-close {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-close:hover {
  background: #40a9ff;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .success-modal,
.modal-leave-active .success-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .success-modal {
  transform: scale(0.9);
}

.modal-leave-to .success-modal {
  transform: scale(0.9);
}
</style>
