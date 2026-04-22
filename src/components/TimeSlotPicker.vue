<template>
  <div class="time-slot-picker">
    <div class="picker-header">
      <h4>{{ title }}</h4>
      <button 
        v-if="showAddButton" 
        class="btn-add"
        @click="handleAddNew"
      >
        添加时间段
      </button>
    </div>
    
    <!-- 时间段列表 -->
    <div class="time-slots-list">
      <div 
        v-for="(slot, index) in modelValue" 
        :key="slot.id"
        class="time-slot-item"
        :class="{ 
          'is-booked': slot.isBooked,
          'is-editing': editingSlotId === slot.id 
        }"
      >
        <!-- 查看模式 -->
        <div v-if="editingSlotId !== slot.id" class="slot-view">
          <div class="slot-time">
            <span class="time-range">{{ slot.startTime }} - {{ slot.endTime }}</span>
            <span 
              v-if="slot.isBooked" 
              class="status-badge booked"
            >
              已预约
            </span>
            <span 
              v-else 
              class="status-badge available"
            >
              可预约
            </span>
          </div>
          
          <div class="slot-actions">
            <button 
              v-if="!slot.isBooked && editable"
              class="btn-icon"
              @click="startEdit(slot)"
              title="编辑"
            >
              ✏️
            </button>
            <button 
              v-if="!slot.isBooked && editable"
              class="btn-icon delete"
              @click="handleDelete(index)"
              title="删除"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <!-- 编辑模式 -->
        <div v-else class="slot-edit">
          <div class="time-inputs">
            <div class="input-group">
              <label>开始时间</label>
              <input 
                type="time" 
                v-model="editForm.startTime"
                step="1800"
                @change="validateTime"
              />
            </div>
            <span class="time-separator">至</span>
            <div class="input-group">
              <label>结束时间</label>
              <input 
                type="time" 
                v-model="editForm.endTime"
                step="1800"
                @change="validateTime"
              />
            </div>
          </div>
          
          <div class="edit-actions">
            <button class="btn-cancel" @click="cancelEdit">
              取消
            </button>
            <button 
              class="btn-save" 
              @click="saveEdit(index)"
              :disabled="!isEditFormValid"
            >
              保存
            </button>
          </div>
          
          <div v-if="editError" class="error-message">
            {{ editError }}
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="modelValue.length === 0" class="empty-state">
        <p>暂无时间段</p>
        <p class="hint">点击"添加时间段"创建新的时间段</p>
      </div>
    </div>
    
    <!-- 添加新时间段表单 -->
    <div v-if="showAddForm" class="add-form">
      <div class="form-title">添加新时间段</div>
      <div class="time-inputs">
        <div class="input-group">
          <label>开始时间</label>
          <input 
            type="time" 
            v-model="newSlot.startTime"
            step="1800"
            @change="validateNewSlotTime"
          />
        </div>
        <span class="time-separator">至</span>
        <div class="input-group">
          <label>结束时间</label>
          <input 
            type="time" 
            v-model="newSlot.endTime"
            step="1800"
            @change="validateNewSlotTime"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <button class="btn-cancel" @click="cancelAdd">
          取消
        </button>
        <button 
          class="btn-save"
          @click="confirmAdd"
          :disabled="!isNewSlotValid"
        >
          确认添加
        </button>
      </div>
      
      <div v-if="addError" class="error-message">
        {{ addError }}
      </div>
    </div>
    
    <!-- 快捷时间按钮 -->
    <div v-if="showQuickButtons" class="quick-buttons">
      <span class="quick-label">快捷时段：</span>
      <button 
        v-for="preset in presetTimes" 
        :key="preset.label"
        class="preset-btn"
        @click="applyPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ScheduleTimeSlot } from '../types/schedule';
import { 
  validateScheduleTime, 
  generateSlotId,
  validateTimeFormat 
} from '../utils/schedule-helper';

interface Props {
  modelValue: ScheduleTimeSlot[];
  editable?: boolean;
  showAddButton?: boolean;
  showQuickButtons?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  showAddButton: true,
  showQuickButtons: true,
  title: '时间段设置'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: ScheduleTimeSlot[]): void;
  (e: 'slot-change', slot: ScheduleTimeSlot): void;
  (e: 'conflict', slot: ScheduleTimeSlot): void;
}>();

// 编辑状态
const editingSlotId = ref<string | null>(null);
const editForm = ref({
  startTime: '',
  endTime: ''
});
const editError = ref<string>('');

// 添加新时间段状态
const showAddForm = ref(false);
const newSlot = ref({
  startTime: '09:00',
  endTime: '09:30'
});
const addError = ref<string>('');

// 预设时间快捷按钮
const presetTimes = [
  { label: '上午(9:00-12:00)', startTime: '09:00', endTime: '12:00' },
  { label: '下午(14:00-17:00)', startTime: '14:00', endTime: '17:00' },
  { label: '全天(9:00-17:00)', startTime: '09:00', endTime: '17:00' }
];

// 验证编辑表单
const isEditFormValid = computed(() => {
  if (!editForm.value.startTime || !editForm.value.endTime) {
    return false;
  }
  return validateScheduleTime(editForm.value.startTime, editForm.value.endTime).valid;
});

// 验证新时间段表单
const isNewSlotValid = computed(() => {
  if (!newSlot.value.startTime || !newSlot.value.endTime) {
    return false;
  }
  return validateScheduleTime(newSlot.value.startTime, newSlot.value.endTime).valid;
});

// 开始编辑
function startEdit(slot: ScheduleTimeSlot) {
  editingSlotId.value = slot.id;
  editForm.value = {
    startTime: slot.startTime,
    endTime: slot.endTime
  };
  editError.value = '';
}

// 取消编辑
function cancelEdit() {
  editingSlotId.value = null;
  editForm.value = { startTime: '', endTime: '' };
  editError.value = '';
}

// 保存编辑
function saveEdit(index: number) {
  const validation = validateScheduleTime(editForm.value.startTime, editForm.value.endTime);
  
  if (!validation.valid) {
    editError.value = validation.message || '时间格式错误';
    return;
  }
  
  // 检查是否与现有时间段重叠
  const hasOverlap = props.modelValue.some((slot, i) => {
    if (i === index) return false;
    return isTimeOverlapping(
      editForm.value.startTime,
      editForm.value.endTime,
      slot.startTime,
      slot.endTime
    );
  });
  
  if (hasOverlap) {
    editError.value = '该时间段与现有时间段重叠';
    return;
  }
  
  const updatedSlots = [...props.modelValue];
  updatedSlots[index] = {
    ...updatedSlots[index],
    startTime: editForm.value.startTime,
    endTime: editForm.value.endTime
  };
  
  emit('update:modelValue', updatedSlots);
  emit('slot-change', updatedSlots[index]);
  cancelEdit();
}

// 删除时间段
function handleDelete(index: number) {
  if (confirm('确定要删除这个时间段吗？')) {
    const updatedSlots = props.modelValue.filter((_, i) => i !== index);
    emit('update:modelValue', updatedSlots);
  }
}

// 添加新时间段
function handleAddNew() {
  showAddForm.value = true;
  newSlot.value = { startTime: '09:00', endTime: '09:30' };
  addError.value = '';
}

// 取消添加
function cancelAdd() {
  showAddForm.value = false;
  addError.value = '';
}

// 确认添加
function confirmAdd() {
  const validation = validateScheduleTime(newSlot.value.startTime, newSlot.value.endTime);
  
  if (!validation.valid) {
    addError.value = validation.message || '时间格式错误';
    return;
  }
  
  // 检查是否与现有时间段重叠
  const hasOverlap = props.modelValue.some(slot => 
    isTimeOverlapping(
      newSlot.value.startTime,
      newSlot.value.endTime,
      slot.startTime,
      slot.endTime
    )
  );
  
  if (hasOverlap) {
    addError.value = '该时间段与现有时间段重叠';
    emit('conflict', {} as ScheduleTimeSlot);
    return;
  }
  
  const newTimeSlot: ScheduleTimeSlot = {
    id: generateSlotId(),
    scheduleId: '',
    startTime: newSlot.value.startTime,
    endTime: newSlot.value.endTime,
    isBooked: false,
    maxCapacity: 1,
    currentCapacity: 0,
    isAvailable: true
  };
  
  const updatedSlots = [...props.modelValue, newTimeSlot].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  emit('update:modelValue', updatedSlots);
  emit('slot-change', newTimeSlot);
  cancelAdd();
}

// 验证新时间段时间
function validateNewSlotTime() {
  if (newSlot.value.startTime && newSlot.value.endTime) {
    const validation = validateScheduleTime(newSlot.value.startTime, newSlot.value.endTime);
    if (!validation.valid) {
      addError.value = validation.message || '';
    } else {
      addError.value = '';
    }
  }
}

// 验证编辑时间
function validateTime() {
  if (editForm.value.startTime && editForm.value.endTime) {
    const validation = validateScheduleTime(editForm.value.startTime, editForm.value.endTime);
    if (!validation.valid) {
      editError.value = validation.message || '';
    } else {
      editError.value = '';
    }
  }
}

// 应用预设时间
function applyPreset(preset: { startTime: string; endTime: string }) {
  newSlot.value = { 
    startTime: preset.startTime, 
    endTime: preset.endTime 
  };
  validateNewSlotTime();
}

// 检查时间段是否重叠
function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = parseInt(start1.replace(':', ''));
  const e1 = parseInt(end1.replace(':', ''));
  const s2 = parseInt(start2.replace(':', ''));
  const e2 = parseInt(end2.replace(':', ''));
  
  return !(e1 <= s2 || e2 <= s1);
}
</script>

<style scoped>
.time-slot-picker {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.picker-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.btn-add {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #40a9ff;
}

.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-slot-item {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px;
  transition: all 0.3s;
}

.time-slot-item.is-booked {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.time-slot-item.is-editing {
  background: #e6f7ff;
  border-color: #91d5ff;
}

.slot-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-range {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.booked {
  background: #fff1b8;
  color: #d48806;
}

.status-badge.available {
  background: #f6ffed;
  color: #52c41a;
}

.slot-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: transparent;
  border: 1px solid #d9d9d9;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-icon:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-icon.delete:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.slot-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.input-group input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.input-group input:focus {
  outline: none;
  border-color: #1890ff;
}

.time-separator {
  color: #999;
  margin-top: 18px;
}

.edit-actions,
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-save {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

.btn-save {
  background: #1890ff;
  border: none;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-save:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: #999;
}

.empty-state p {
  margin: 0;
}

.empty-state .hint {
  margin-top: 8px;
  font-size: 12px;
}

.add-form {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.form-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.quick-buttons {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 12px;
  color: #666;
}

.preset-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.preset-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
