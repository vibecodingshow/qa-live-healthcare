<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="conflict-dialog-overlay" @click.self="handleClose">
        <div class="conflict-dialog">
          <!-- 头部 -->
          <div class="dialog-header">
            <div class="header-icon">
              ⚠️
            </div>
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="handleClose">×</button>
          </div>
          
          <!-- 内容 -->
          <div class="dialog-content">
            <!-- 警告信息 -->
            <div class="warning-box">
              <p class="warning-title">{{ warningTitle }}</p>
              <p class="warning-message">{{ warningMessage }}</p>
            </div>
            
            <!-- 冲突详情列表 -->
            <div v-if="conflicts.length > 0" class="conflicts-list">
              <h4>冲突详情</h4>
              <div 
                v-for="(conflict, index) in conflicts" 
                :key="index"
                class="conflict-item"
              >
                <div class="conflict-info">
                  <span class="conflict-type">{{ getConflictTypeLabel(conflict.type) }}</span>
                  <span class="conflict-time">{{ conflict.time }}</span>
                </div>
                <p class="conflict-detail">{{ conflict.detail }}</p>
              </div>
            </div>
            
            <!-- 建议 -->
            <div v-if="suggestions.length > 0" class="suggestions-box">
              <h4>💡 建议</h4>
              <ul>
                <li v-for="(suggestion, index) in suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 底部按钮 -->
          <div class="dialog-footer">
            <button 
              v-if="showCancelOption"
              class="btn-secondary"
              @click="handleCancel"
            >
              取消操作
            </button>
            <button 
              class="btn-primary"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Conflict {
  type: 'time_overlap' | 'doctor_busy' | 'capacity_full';
  time: string;
  detail: string;
}

interface Props {
  visible: boolean;
  title?: string;
  warningTitle?: string;
  warningMessage?: string;
  conflicts?: Conflict[];
  suggestions?: string[];
  showCancelOption?: boolean;
  confirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '排班冲突提醒',
  warningTitle: '检测到排班冲突',
  warningMessage: '您设置的时间段与现有排班存在冲突，请检查并调整。',
  conflicts: () => [],
  suggestions: () => [
    '请调整时间段的开始或结束时间',
    '或选择其他可用的时间段',
    '如有疑问，请联系管理员'
  ],
  showCancelOption: true,
  confirmText: '我知道了'
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

// 获取冲突类型标签
function getConflictTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    time_overlap: '时间段重叠',
    doctor_busy: '医生忙碌',
    capacity_full: '预约已满'
  };
  return labels[type] || '未知冲突';
}

// 关闭对话框
function handleClose() {
  emit('update:visible', false);
}

// 确认
function handleConfirm() {
  emit('confirm');
  emit('update:visible', false);
}

// 取消
function handleCancel() {
  emit('cancel');
  emit('update:visible', false);
}
</script>

<style scoped>
.conflict-dialog-overlay {
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

.conflict-dialog {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fffbf0;
}

.header-icon {
  font-size: 24px;
  margin-right: 12px;
}

.dialog-header h3 {
  flex: 1;
  margin: 0;
  font-size: 18px;
  color: #d48806;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.dialog-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.warning-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.warning-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #d48806;
}

.warning-message {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.6;
}

.conflicts-list {
  margin-bottom: 20px;
}

.conflicts-list h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.conflict-item {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
}

.conflict-item:last-child {
  margin-bottom: 0;
}

.conflict-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.conflict-type {
  background: #fff1b8;
  color: #d48806;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.conflict-time {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.conflict-detail {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.suggestions-box {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
}

.suggestions-box h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #52c41a;
  font-weight: 600;
}

.suggestions-box ul {
  margin: 0;
  padding-left: 20px;
}

.suggestions-box li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
}

.btn-secondary,
.btn-primary {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-secondary {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-secondary:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

/* 过渡动画 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .conflict-dialog,
.dialog-leave-active .conflict-dialog {
  transition: transform 0.3s ease;
}

.dialog-enter-from .conflict-dialog {
  transform: scale(0.9) translateY(-20px);
}

.dialog-leave-to .conflict-dialog {
  transform: scale(0.9) translateY(20px);
}
</style>
