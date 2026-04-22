<template>
  <div class="doctor-schedule-manager">
    <!-- 头部工具栏 -->
    <div class="schedule-toolbar">
      <div class="toolbar-left">
        <h2>医生排班管理</h2>
        <div class="doctor-selector">
          <label>选择医生：</label>
          <select v-model="selectedDoctorId" @change="loadDoctorSchedules">
            <option value="">请选择医生</option>
            <option 
              v-for="doctor in doctors" 
              :key="doctor.id" 
              :value="doctor.id"
            >
              {{ doctor.name }} ({{ doctor.department }})
            </option>
          </select>
        </div>
      </div>
      
      <div class="toolbar-right">
        <button class="btn-tool" @click="switchToPrevWeek" title="上一周">
          ← 上一周
        </button>
        <button class="btn-tool current-week" @click="goToCurrentWeek">
          本周
        </button>
        <button class="btn-tool" @click="switchToNextWeek" title="下一周">
          下一周 →
        </button>
        <button class="btn-tool" @click="showTemplateDialog = true">
          📋 排班模板
        </button>
        <button class="btn-tool" @click="exportSchedules">
          📥 导出
        </button>
      </div>
    </div>

    <!-- 周视图导航 -->
    <div class="week-navigation">
      <div class="current-period">
        {{ formatWeekPeriod() }}
      </div>
    </div>

    <!-- 周视图排班表格 -->
    <div class="week-schedule-view">
      <div class="schedule-table">
        <!-- 表头 -->
        <div class="table-header">
          <div class="header-cell time-column">时间段</div>
          <div 
            v-for="date in weekDates" 
            :key="date.toISOString()"
            class="header-cell day-column"
            :class="{ 'is-today': isToday(date) }"
          >
            <div class="day-name">{{ formatWeekday(date) }}</div>
            <div class="day-date">{{ formatShortDate(date) }}</div>
          </div>
        </div>

        <!-- 表格内容 -->
        <div class="table-body">
          <div 
            v-for="timeSlot in timeSlots" 
            :key="timeSlot"
            class="table-row"
          >
            <div class="time-cell">{{ timeSlot }}</div>
            <div 
              v-for="date in weekDates" 
              :key="date.toISOString()"
              class="schedule-cell"
              :class="{ 'is-today': isToday(date) }"
              @click="handleCellClick(date, timeSlot)"
            >
              <div v-if="getScheduleForCell(date, timeSlot)" class="schedule-info">
                <div class="schedule-badge">
                  {{ getScheduleStatusText(date, timeSlot) }}
                </div>
                <div v-if="hasAppointment(date, timeSlot)" class="appointment-info">
                  {{ getAppointmentInfo(date, timeSlot) }}
                </div>
              </div>
              <div v-else class="empty-cell">
                <span v-if="isEditableCell(date, timeSlot)">+ 添加</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="statistics-bar">
      <div class="stat-item">
        <span class="stat-label">本周排班：</span>
        <span class="stat-value">{{ weekScheduleCount }} 天</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">可用时段：</span>
        <span class="stat-value">{{ availableSlotCount }} 个</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已预约：</span>
        <span class="stat-value">{{ bookedSlotCount }} 个</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">利用率：</span>
        <span class="stat-value">{{ utilizationRate }}%</span>
      </div>
    </div>

    <!-- 排班编辑对话框 -->
    <div v-if="showEditDialog" class="edit-dialog-overlay" @click.self="closeEditDialog">
      <div class="edit-dialog">
        <div class="dialog-header">
          <h3>{{ isEditing ? '编辑排班' : '添加排班' }}</h3>
          <button class="close-btn" @click="closeEditDialog">×</button>
        </div>
        
        <div class="dialog-content">
          <div class="form-group">
            <label>日期：</label>
            <input 
              type="date" 
              v-model="editForm.date"
              :min="today"
            />
          </div>
          
          <div class="form-group">
            <label>医生：</label>
            <select v-model="editForm.doctorId" :disabled="isEditing">
              <option value="">请选择医生</option>
              <option 
                v-for="doctor in doctors" 
                :key="doctor.id" 
                :value="doctor.id"
              >
                {{ doctor.name }}
              </option>
            </select>
          </div>

          <!-- 时间段选择组件 -->
          <TimeSlotPicker
            v-model="editForm.timeSlots"
            title="排班时间段"
            @slot-change="handleSlotChange"
            @conflict="handleConflict"
          />
        </div>

        <div class="dialog-footer">
          <button class="btn-cancel" @click="closeEditDialog">
            取消
          </button>
          <button 
            class="btn-save" 
            @click="saveSchedule"
            :disabled="!isFormValid"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 冲突提示对话框 -->
    <ScheduleConflictDialog
      v-model:visible="showConflictDialog"
      :conflicts="currentConflicts"
      :suggestions="conflictSuggestions"
    />

    <!-- 排班模板对话框 -->
    <div v-if="showTemplateDialog" class="template-dialog-overlay" @click.self="showTemplateDialog = false">
      <div class="template-dialog">
        <div class="dialog-header">
          <h3>排班模板</h3>
          <button class="close-btn" @click="showTemplateDialog = false">×</button>
        </div>
        
        <div class="dialog-content">
          <div class="template-list">
            <div class="template-item">
              <h4>周一至周五标准排班</h4>
              <p>工作时间：09:00-12:00, 14:00-17:00</p>
              <div class="template-actions">
                <button class="btn-apply" @click="applyTemplate('weekdays')">
                  应用模板
                </button>
              </div>
            </div>
            
            <div class="template-item">
              <h4>周末值班排班</h4>
              <p>工作时间：10:00-15:00</p>
              <div class="template-actions">
                <button class="btn-apply" @click="applyTemplate('weekend')">
                  应用模板
                </button>
              </div>
            </div>
            
            <div class="template-item">
              <h4>全周排班</h4>
              <p>工作时间：09:00-17:00（午休12:00-13:00）</p>
              <div class="template-actions">
                <button class="btn-apply" @click="applyTemplate('fullweek')">
                  应用模板
                </button>
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import type { Schedule, ScheduleTimeSlot } from '../types/schedule';
import TimeSlotPicker from './TimeSlotPicker.vue';
import ScheduleConflictDialog from './ScheduleConflictDialog.vue';
import {
  generateWeekDates,
  getWeekStartDate,
  formatDate,
  formatWeekday,
  generateTimeSlots,
  generateScheduleId,
  checkScheduleConflict,
  exportSchedulesToJSON
} from '../utils/schedule-helper';
import type { Conflict } from './ScheduleConflictDialog.vue';

// 导入医生数据
import doctorUserList from '../data/doctor-user-list.json';

interface Doctor {
  id: string;
  name: string;
  department: string;
  title: string;
}

// 医生列表
const doctors = ref<Doctor[]>(doctorUserList.map(d => ({
  id: d.id,
  name: d.name,
  department: d.department,
  title: d.title
})));

// 状态
const selectedDoctorId = ref<string>('');
const currentWeekStart = ref<Date>(getWeekStartDate(new Date()));
const weekDates = computed(() => generateWeekDates(currentWeekStart.value));

// 时间段
const timeSlots = ['09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
                   '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'];

// 排班数据
const schedules = ref<Schedule[]>([]);

// 编辑对话框状态
const showEditDialog = ref(false);
const isEditing = ref(false);
const editingScheduleId = ref<string>('');
const editForm = ref({
  date: '',
  doctorId: '',
  timeSlots: [] as ScheduleTimeSlot[]
});

// 冲突对话框状态
const showConflictDialog = ref(false);
const currentConflicts = ref<Conflict[]>([]);
const conflictSuggestions = [
  '请调整时间段的开始或结束时间',
  '或选择其他可用的时间段',
  '如有疑问，请联系管理员'
];

// 模板对话框状态
const showTemplateDialog = ref(false);

// 提示消息
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

// 当前日期
const today = computed(() => formatDate(new Date()));

// 统计数据
const weekScheduleCount = computed(() => {
  return schedules.value.filter(s => {
    const scheduleDate = new Date(s.date);
    return weekDates.value.some(d => d.toDateString() === scheduleDate.toDateString());
  }).length;
});

const availableSlotCount = computed(() => {
  return schedules.value.reduce((sum, s) => sum + s.availableSlots, 0);
});

const bookedSlotCount = computed(() => {
  return schedules.value.reduce((sum, s) => sum + s.bookedSlots, 0);
});

const utilizationRate = computed(() => {
  const total = availableSlotCount.value + bookedSlotCount.value;
  return total > 0 ? Math.round((bookedSlotCount.value / total) * 100) : 0;
});

// 表单验证
const isFormValid = computed(() => {
  return editForm.value.date && editForm.value.doctorId && editForm.value.timeSlots.length > 0;
});

// 生命周期钩子
onMounted(() => {
  loadSchedulesFromStorage();
});

// 加载排班数据
function loadSchedulesFromStorage() {
  try {
    const stored = localStorage.getItem('doctor_schedules');
    if (stored) {
      schedules.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load schedules:', error);
  }
}

// 保存排班数据到存储
function saveSchedulesToStorage() {
  try {
    localStorage.setItem('doctor_schedules', JSON.stringify(schedules.value));
  } catch (error) {
    console.error('Failed to save schedules:', error);
  }
}

// 加载医生排班
function loadDoctorSchedules() {
  if (!selectedDoctorId.value) {
    return;
  }
}

// 周导航
function switchToPrevWeek() {
  currentWeekStart.value = new Date(
    currentWeekStart.value.getTime() - 7 * 24 * 60 * 60 * 1000
  );
}

function switchToNextWeek() {
  currentWeekStart.value = new Date(
    currentWeekStart.value.getTime() + 7 * 24 * 60 * 60 * 1000
  );
}

function goToCurrentWeek() {
  currentWeekStart.value = getWeekStartDate(new Date());
}

// 格式化日期显示
function formatWeekPeriod(): string {
  const start = weekDates.value[0];
  const end = weekDates.value[6];
  return `${formatDate(start)} 至 ${formatDate(end)}`;
}

function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatWeekday(date: Date): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
}

function isToday(date: Date): boolean {
  const todayDate = new Date();
  return date.toDateString() === todayDate.toDateString();
}

// 获取单元格对应的排班
function getScheduleForCell(date: Date, timeSlot: string): Schedule | null {
  const dateStr = formatDate(date);
  return schedules.value.find(s => {
    if (s.date !== dateStr) return false;
    const [start] = timeSlot.split('-');
    return s.timeSlots.some(slot => slot.startTime === start);
  }) || null;
}

function getScheduleStatusText(date: Date, timeSlot: string): string {
  const schedule = getScheduleForCell(date, timeSlot);
  if (!schedule) return '';
  const [start] = timeSlot.split('-');
  const slot = schedule.timeSlots.find(s => s.startTime === start);
  return slot?.isBooked ? '已预约' : '可预约';
}

function hasAppointment(date: Date, timeSlot: string): boolean {
  const schedule = getScheduleForCell(date, timeSlot);
  if (!schedule) return false;
  const [start] = timeSlot.split('-');
  const slot = schedule.timeSlots.find(s => s.startTime === start);
  return slot?.isBooked || false;
}

function getAppointmentInfo(date: Date, timeSlot: string): string {
  const schedule = getScheduleForCell(date, timeSlot);
  if (!schedule) return '';
  const [start] = timeSlot.split('-');
  const slot = schedule.timeSlots.find(s => s.startTime === start);
  return slot?.appointmentId ? `预约ID: ${slot.appointmentId}` : '';
}

function isEditableCell(date: Date, timeSlot: string): boolean {
  if (!selectedDoctorId.value) return false;
  const dateStr = formatDate(date);
  const hasSchedule = schedules.value.some(s => 
    s.date === dateStr && s.doctorId === selectedDoctorId.value
  );
  return !hasSchedule && !isToday(date);
}

// 处理单元格点击
function handleCellClick(date: Date, timeSlot: string) {
  if (!selectedDoctorId.value) {
    showToastMessage('请先选择医生', 'error');
    return;
  }
  
  const dateStr = formatDate(date);
  const existingSchedule = schedules.value.find(s => 
    s.date === dateStr && s.doctorId === selectedDoctorId.value
  );
  
  if (existingSchedule) {
    isEditing.value = true;
    editingScheduleId.value = existingSchedule.id;
    editForm.value = {
      date: dateStr,
      doctorId: existingSchedule.doctorId,
      timeSlots: [...existingSchedule.timeSlots]
    };
  } else {
    isEditing.value = false;
    editingScheduleId.value = '';
    const [start, end] = timeSlot.split('-');
    editForm.value = {
      date: dateStr,
      doctorId: selectedDoctorId.value,
      timeSlots: [{
        id: `slot_${Date.now()}`,
        scheduleId: '',
        startTime: start,
        endTime: end,
        isBooked: false,
        maxCapacity: 1,
        currentCapacity: 0,
        isAvailable: true
      }]
    };
  }
  
  showEditDialog.value = true;
}

// 关闭编辑对话框
function closeEditDialog() {
  showEditDialog.value = false;
  isEditing.value = false;
  editingScheduleId.value = '';
  editForm.value = {
    date: '',
    doctorId: '',
    timeSlots: []
  };
}

// 处理时间段变更
function handleSlotChange(slot: ScheduleTimeSlot) {
  console.log('Slot changed:', slot);
}

// 处理冲突
function handleConflict() {
  currentConflicts.value = [{
    type: 'time_overlap',
    time: editForm.value.date,
    detail: '时间段与现有排班存在重叠'
  }];
  showConflictDialog.value = true;
}

// 保存排班
function saveSchedule() {
  if (!isFormValid.value) {
    showToastMessage('请填写完整信息', 'error');
    return;
  }
  
  const newSchedule: Schedule = {
    id: isEditing.value ? editingScheduleId.value : generateScheduleId(),
    doctorId: editForm.value.doctorId,
    date: editForm.value.date,
    timeSlots: editForm.value.timeSlots,
    isAvailable: true,
    totalSlots: editForm.value.timeSlots.length,
    bookedSlots: editForm.value.timeSlots.filter(s => s.isBooked).length,
    availableSlots: editForm.value.timeSlots.filter(s => !s.isBooked).length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: selectedDoctorId.value
  };
  
  const conflict = checkScheduleConflict(newSchedule, schedules.value);
  if (conflict.hasConflict) {
    currentConflicts.value = [{
      type: 'time_overlap',
      time: newSchedule.date,
      detail: conflict.message || '存在排班冲突'
    }];
    showConflictDialog.value = true;
    return;
  }
  
  if (isEditing.value) {
    const index = schedules.value.findIndex(s => s.id === editingScheduleId.value);
    if (index !== -1) {
      schedules.value[index] = newSchedule;
    }
  } else {
    schedules.value.push(newSchedule);
  }
  
  saveSchedulesToStorage();
  closeEditDialog();
  showToastMessage('排班保存成功', 'success');
}

// 应用模板
function applyTemplate(templateType: string) {
  if (!selectedDoctorId.value) {
    showToastMessage('请先选择医生', 'error');
    return;
  }
  
  const weekDays = weekDates.value;
  
  switch (templateType) {
    case 'weekdays':
      weekDays.forEach((date, index) => {
        if (index < 5) {
          addScheduleFromTemplate(date, ['09:00', '12:00'], ['14:00', '17:00']);
        }
      });
      break;
    case 'weekend':
      weekDays.forEach((date, index) => {
        if (index >= 5) {
          addScheduleFromTemplate(date, ['10:00', '15:00'], []);
        }
      });
      break;
    case 'fullweek':
      weekDays.forEach(date => {
        addScheduleFromTemplate(date, ['09:00', '12:00'], ['14:00', '17:00']);
      });
      break;
  }
  
  saveSchedulesToStorage();
  showTemplateDialog.value = false;
  showToastMessage('模板应用成功', 'success');
}

function addScheduleFromTemplate(date: Date, morning: string[], afternoon: string[]) {
  const timeSlots: ScheduleTimeSlot[] = [];
  
  if (morning.length === 2) {
    const morningSlots = generateTimeSlots(
      parseInt(morning[0].split(':')[0]),
      parseInt(morning[1].split(':')[0])
    );
    morningSlots.forEach(slot => {
      timeSlots.push({
        id: `slot_${Date.now()}_${Math.random()}`,
        scheduleId: '',
        ...slot,
        isBooked: false,
        maxCapacity: 1,
        currentCapacity: 0,
        isAvailable: true
      });
    });
  }
  
  if (afternoon.length === 2) {
    const afternoonSlots = generateTimeSlots(
      parseInt(afternoon[0].split(':')[0]),
      parseInt(afternoon[1].split(':')[0])
    );
    afternoonSlots.forEach(slot => {
      timeSlots.push({
        id: `slot_${Date.now()}_${Math.random()}`,
        scheduleId: '',
        ...slot,
        isBooked: false,
        maxCapacity: 1,
        currentCapacity: 0,
        isAvailable: true
      });
    });
  }
  
  const dateStr = formatDate(date);
  const existingIndex = schedules.value.findIndex(
    s => s.date === dateStr && s.doctorId === selectedDoctorId.value
  );
  
  const newSchedule: Schedule = {
    id: existingIndex !== -1 ? schedules.value[existingIndex].id : generateScheduleId(),
    doctorId: selectedDoctorId.value,
    date: dateStr,
    timeSlots,
    isAvailable: true,
    totalSlots: timeSlots.length,
    bookedSlots: 0,
    availableSlots: timeSlots.length,
    createdAt: existingIndex !== -1 ? schedules.value[existingIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: selectedDoctorId.value
  };
  
  if (existingIndex !== -1) {
    schedules.value[existingIndex] = newSchedule;
  } else {
    schedules.value.push(newSchedule);
  }
}

// 导出排班
function exportSchedules() {
  const data = exportSchedulesToJSON(schedules.value);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedules_${formatDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToastMessage('排班导出成功', 'success');
}

// 显示提示消息
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
.doctor-schedule-manager {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.schedule-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.toolbar-left h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.doctor-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doctor-selector label {
  font-size: 14px;
  color: #666;
}

.doctor-selector select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.btn-tool {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  color: #666;
}

.btn-tool:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-tool.current-week {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.week-navigation {
  margin-bottom: 16px;
}

.current-period {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.week-schedule-view {
  overflow-x: auto;
  margin-bottom: 20px;
}

.schedule-table {
  min-width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  background: #fafafa;
  border-bottom: 2px solid #e8e8e8;
}

.header-cell {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.header-cell.is-today {
  background: #e6f7ff;
  color: #1890ff;
}

.day-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.day-date {
  font-size: 12px;
  color: #666;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  border-bottom: 1px solid #e8e8e8;
}

.table-row:last-child {
  border-bottom: none;
}

.time-cell {
  padding: 16px 8px;
  text-align: center;
  font-size: 12px;
  color: #666;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
}

.schedule-cell {
  padding: 8px;
  min-height: 60px;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.schedule-cell:last-child {
  border-right: none;
}

.schedule-cell:hover {
  background: #f5f5f5;
}

.schedule-cell.is-today {
  background: #e6f7ff;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.schedule-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  background: #f6ffed;
  color: #52c41a;
}

.appointment-info {
  font-size: 10px;
  color: #999;
}

.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
  font-size: 12px;
}

.empty-cell:hover {
  color: #1890ff;
}

.statistics-bar {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 编辑对话框样式 */
.edit-dialog-overlay,
.template-dialog-overlay {
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
}

.edit-dialog,
.template-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.dialog-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.btn-cancel {
  padding: 10px 24px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.btn-save {
  padding: 10px 24px;
  background: #1890ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.btn-save:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

/* 模板列表样式 */
.template-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.template-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.template-item p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-apply {
  padding: 8px 16px;
  background: #1890ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

/* Toast 提示样式 */
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
