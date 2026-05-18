<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    layout="vertical"
    class="schedule-form"
  >
    <!-- 排班日期 -->
    <a-form-item label="排班日期" name="scheduleDate">
      <a-date-picker
        v-model:value="formState.scheduleDate"
        :disabled-date="disabledDate"
        placeholder="选择排班日期"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </a-form-item>

    <!-- 可用状态 -->
    <a-form-item label="出诊状态" name="isAvailable">
      <a-switch v-model:checked="formState.isAvailable" />
      <span class="status-text">{{ formState.isAvailable ? '正常出诊' : '停诊' }}</span>
    </a-form-item>

    <!-- 时段列表 -->
    <div class="time-slots-section">
      <div class="section-header">
        <span class="section-title">出诊时段</span>
        <a-button type="primary" ghost size="small" @click="addTimeSlot">
          <template #icon><PlusOutlined /></template>
          添加时段
        </a-button>
      </div>

      <div v-if="formState.timeSlots.length === 0" class="empty-slots">
        暂无出诊时段，请点击"添加时段"按钮添加
      </div>

      <div v-else class="time-slots-list">
        <div v-for="(slot, index) in formState.timeSlots" :key="index" class="time-slot-item">
          <div class="slot-header">
            <span class="slot-label">时段 {{ index + 1 }}</span>
            <a-button type="text" danger size="small" @click="removeTimeSlot(index)">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
          </div>

          <div class="slot-content">
            <a-form-item
              :name="['timeSlots', index, 'startTime']"
              :rules="[{ required: true, message: '请输入开始时间' }]"
              label="开始时间"
            >
              <a-time-picker
                v-model:value="slot.startTime"
                format="HH:mm"
                placeholder="开始时间"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item
              :name="['timeSlots', index, 'endTime']"
              :rules="[{ required: true, message: '请输入结束时间' }]"
              label="结束时间"
            >
              <a-time-picker
                v-model:value="slot.endTime"
                format="HH:mm"
                placeholder="结束时间"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item
              :name="['timeSlots', index, 'maxAppointments']"
              :rules="[{ required: true, message: '请输入最大预约数' }]"
              label="最大预约数"
            >
              <a-input-number
                v-model:value="slot.maxAppointments"
                :min="0"
                :max="100"
                placeholder="最大预约数"
                style="width: 100%"
              />
            </a-form-item>
          </div>
        </div>
      </div>
    </div>

    <!-- 时段冲突提示 -->
    <a-alert
      v-if="hasTimeConflict"
      message="时段冲突"
      description="检测到时段存在时间重叠，请检查并调整"
      type="warning"
      show-icon
      class="conflict-alert"
    />
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import type { DoctorSchedule } from '../types/appointment';

interface TimeSlotForm {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  maxAppointments: number;
}

interface FormState {
  scheduleDate: Dayjs | null;
  isAvailable: boolean;
  timeSlots: TimeSlotForm[];
}

const props = defineProps<{
  schedule?: DoctorSchedule;
}>();

defineEmits<{
  submit: [data: { scheduleDate: string; isAvailable: boolean; timeSlots: any[] }];
}>();

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  scheduleDate: null,
  isAvailable: true,
  timeSlots: [],
});

// 表单验证规则
const rules = {
  scheduleDate: [{ required: true, message: '请选择排班日期' }],
};

// 初始化表单数据
watch(() => props.schedule, (schedule) => {
  if (schedule) {
    formState.scheduleDate = dayjs(schedule.scheduleDate);
    formState.isAvailable = schedule.isAvailable;
    formState.timeSlots = schedule.timeSlots.map(slot => ({
      startTime: dayjs(slot.startTime, 'HH:mm'),
      endTime: dayjs(slot.endTime, 'HH:mm'),
      maxAppointments: slot.maxAppointments,
    }));
  }
}, { immediate: true });

// 禁用过去的日期
const disabledDate = (current: Dayjs) => {
  return current && current < dayjs().startOf('day');
};

// 添加时段
const addTimeSlot = () => {
  formState.timeSlots.push({
    startTime: null,
    endTime: null,
    maxAppointments: 20,
  });
};

// 删除时段
const removeTimeSlot = (index: number) => {
  formState.timeSlots.splice(index, 1);
};

// 检查时段冲突
const hasTimeConflict = computed(() => {
  const slots = formState.timeSlots.filter(
    s => s.startTime && s.endTime
  );
  
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      
      // 检查时间重叠
      if (
        a.startTime!.isBefore(b.endTime!) &&
        a.endTime!.isAfter(b.startTime!)
      ) {
        return true;
      }
    }
  }
  return false;
});

// 验证表单
const validate = async () => {
  try {
    await formRef.value?.validate();
    
    // 检查时段
    if (formState.timeSlots.length === 0) {
      return Promise.reject(new Error('请至少添加一个出诊时段'));
    }
    
    // 检查时段冲突
    if (hasTimeConflict.value) {
      return Promise.reject(new Error('时段存在时间重叠'));
    }
    
    return true;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 获取表单数据
const getFormData = () => {
  return {
    scheduleDate: formState.scheduleDate!.format('YYYY-MM-DD'),
    isAvailable: formState.isAvailable,
    timeSlots: formState.timeSlots.map(slot => ({
      date: formState.scheduleDate!.format('YYYY-MM-DD'),
      startTime: slot.startTime!.format('HH:mm'),
      endTime: slot.endTime!.format('HH:mm'),
      maxAppointments: slot.maxAppointments,
    })),
  };
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  formState.timeSlots = [];
};

// 暴露方法
defineExpose({
  validate,
  getFormData,
  resetForm,
});
</script>

<style scoped>
.schedule-form {
  padding: 8px 0;
}

.status-text {
  margin-left: 12px;
  color: #52c41a;
}

.time-slots-section {
  margin-top: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-weight: 500;
  color: #262626;
}

.empty-slots {
  padding: 24px;
  text-align: center;
  color: #8c8c8c;
}

.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-slot-item {
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.slot-label {
  font-weight: 500;
  color: #1890ff;
}

.slot-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.conflict-alert {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .slot-content {
    grid-template-columns: 1fr;
  }
}
</style>