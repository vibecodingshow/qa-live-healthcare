<template>
  <div class="schedule-calendar">
    <!-- 日历头部：周切换 + 标题 -->
    <div class="calendar-header">
      <a-button type="text" size="small" @click="prevWeek" :disabled="weekOffset <= 0">
        <LeftOutlined /> 上一周
      </a-button>
      <span class="week-title">{{ weekTitle }}</span>
      <a-button type="text" size="small" @click="nextWeek">
        下一周 <RightOutlined />
      </a-button>
    </div>

    <!-- 星期标题行 -->
    <div class="weekday-header">
      <div v-for="day in weekDays" :key="day.date" class="weekday-cell" :class="{ 'is-today': day.isToday }">
        <span class="weekday-name">{{ day.weekdayName }}</span>
        <span class="weekday-date">{{ day.dayNum }}</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!hasAnySchedule" class="empty-state">
      <a-empty description="暂无排班信息" />
    </div>

    <!-- 每日排班内容 -->
    <div v-else class="calendar-body">
      <div v-for="day in weekDays" :key="day.date" class="day-column" :class="{ 'is-today': day.isToday }">
        <div class="day-slots">
          <template v-if="getDaySchedule(day.date)">
            <div
              v-for="slot in getDaySchedule(day.date)!.slots"
              :key="slot.id"
              class="slot-card"
              :class="[
                getSlotStatus(slot, day.date),
                { selected: isSelected(slot, day.date) }
              ]"
              @click="selectSlot(slot, day.date)"
            >
              <div class="slot-time">{{ slot.startTime }}-{{ slot.endTime }}</div>
              <div class="slot-label">{{ slot.periodLabel }}</div>
              <div class="slot-remaining">
                <template v-if="getSlotStatus(slot, day.date) === 'available'">
                  剩余 {{ slot.remaining }}/{{ slot.totalCapacity }} 号
                </template>
                <a-badge v-else-if="getSlotStatus(slot, day.date) === 'full'" status="default" text="已满" />
                <span v-else class="passed-text">已过时</span>
              </div>
            </div>
          </template>
          <div v-else class="no-slots">—</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { store } from '../store';
import type { ScheduleSlot, Schedule } from '../store';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

const props = defineProps<{
  doctorId: string;
  modelValue?: { slot: ScheduleSlot; date: string } | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { slot: ScheduleSlot; date: string } | null): void;
}>();

/** 周偏移量：0=本周，1=下周，-1=上周 */
const weekOffset = ref(0);

const todayStr = dayjs().format('YYYY-MM-DD');

/** 当前周的 7 天数据 */
const weekDays = computed(() => {
  const startOfWeek = dayjs().add(weekOffset.value, 'week').startOf('isoWeek');
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = startOfWeek.add(i, 'day');
    days.push({
      date: d.format('YYYY-MM-DD'),
      dayNum: d.format('D'),
      weekdayName: ['日', '一', '二', '三', '四', '五', '六'][d.isoWeekday() % 7],
      isToday: d.format('YYYY-MM-DD') === todayStr,
    });
  }
  return days;
});

/** 周标题，如 "2026年5月 第18周" */
const weekTitle = computed(() => {
  const d = weekDays.value[0];
  if (!d) return '';
  return `${dayjs(d.date).format('YYYY年M月')} 第${dayjs(d.date).isoWeek()}周`;
});

/** 医生所有排班 */
const doctorSchedules = computed<Schedule[]>(() => store.getSchedulesByDoctor(props.doctorId));

/** 是否有任何排班数据 */
const hasAnySchedule = computed(() => doctorSchedules.value.length > 0);

/** 获取某天的排班计划 */
function getDaySchedule(date: string): Schedule | undefined {
  return doctorSchedules.value.find(s => s.date === date);
}

/** 判断时段状态 */
function getSlotStatus(slot: ScheduleSlot, date: string): 'available' | 'full' | 'passed' {
  if (dayjs(date).isBefore(todayStr, 'day')) return 'passed';
  if (dayjs(date).isSame(todayStr, 'day')) {
    // 今天已过的时段也标记为 passed
    const now = dayjs();
    const slotEnd = dayjs(`${date} ${slot.endTime}`);
    if (slotEnd.isBefore(now)) return 'passed';
  }
  if (slot.remaining <= 0) return 'full';
  return 'available';
}

/** 是否为当前选中项 */
function isSelected(slot: ScheduleSlot, date: string): boolean {
  if (!props.modelValue) return false;
  return props.modelValue.slot.id === slot.id && props.modelValue.date === date;
}

/** 选择时段 */
function selectSlot(slot: ScheduleSlot, date: string): void {
  const status = getSlotStatus(slot, date);
  if (status !== 'available') return;

  // 取消选择（点击已选中的）
  if (isSelected(slot, date)) {
    emit('update:modelValue', null);
  } else {
    emit('update:modelValue', { slot, date });
  }
}

/** 上一周 */
function prevWeek(): void {
  if (weekOffset.value > 0) {
    weekOffset.value--;
  }
}

/** 下一周 */
function nextWeek(): void {
  weekOffset.value++;
}
</script>

<style scoped>
.schedule-calendar {
  max-width: 1200px;
  margin: 0 auto;
}

/* 日历头部 */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.week-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  min-width: 200px;
  text-align: center;
}

/* 星期标题行 */
.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.weekday-cell {
  text-align: center;
  padding: 10px 0;
  border-radius: 8px;
  background: #fafafa;
}

.weekday-cell.is-today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.weekday-cell .weekday-name {
  font-size: 13px;
  color: #999;
  display: block;
}

.weekday-cell.is-today .weekday-name {
  color: rgba(255, 255, 255, 0.85);
}

.weekday-cell .weekday-date {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  display: block;
  margin-top: 4px;
}

.weekday-cell.is-today .weekday-date {
  color: #fff;
}

/* 空状态 */
.empty-state {
  padding: 48px 24px;
  text-align: center;
}

/* 日历主体 - 7列网格 */
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-column {
  min-height: 80px;
  padding: 8px;
  border-radius: 12px;
  background: #fafafa;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.day-column.is-today {
  border-color: #667eea;
  background: #f8f6ff;
}

.day-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.no-slots {
  color: #ddd;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
}

/* 时段卡片 */
.slot-card {
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;
  border: 2px solid transparent;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.slot-card.available {
  border-color: #d9f7be;
}

.slot-card.available:hover {
  border-color: #52c41a;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.15);
  transform: translateY(-1px);
}

.slot-card.selected.available {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
}

.slot-card.full {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.65;
}

.slot-card.passed {
  background: #fafafa;
  cursor: not-allowed;
  opacity: 0.35;
}

.slot-time {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.slot-label {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.slot-remaining {
  font-size: 11px;
  margin-top: 4px;
  color: #52c41a;
  font-weight: 500;
}

.passed-text {
  color: #bbb;
}

/* 响应式：移动端单列布局 */
@media (max-width: 768px) {
  .weekday-header {
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .weekday-cell {
    padding: 6px 0;
  }

  .weekday-cell .weekday-date {
    font-size: 16px;
  }

  .calendar-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .day-column {
    min-height: auto;
  }

  .calendar-header {
    flex-wrap: wrap;
  }

  .week-title {
    width: 100%;
    order: -1;
    margin-bottom: 8px;
  }
}
</style>
