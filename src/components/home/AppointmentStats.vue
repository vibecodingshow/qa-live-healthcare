<template>
  <div class="appointment-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon appointment">
          <CalendarOutlined />
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalAppointments || 0 }}</h3>
          <p>总预约数</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon today">
          <ScheduleOutlined />
        </div>
        <div class="stat-info">
          <h3>{{ stats.todayAppointments || 0 }}</h3>
          <p>今日预约</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">
          <ClockCircleOutlined />
        </div>
        <div class="stat-info">
          <h3>{{ stats.todayPending || 0 }}</h3>
          <p>待到诊</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon arrived">
          <CheckCircleOutlined />
        </div>
        <div class="stat-info">
          <h3>{{ stats.todayArrived || 0 }}</h3>
          <p>已到诊</p>
        </div>
      </div>
    </div>

    <div v-if="stats.departmentStats && stats.departmentStats.length > 0" class="department-section">
      <h4>各科室预约分布</h4>
      <div class="department-list">
        <div
          v-for="item in stats.departmentStats.slice(0, 5)"
          :key="item.department"
          class="department-item"
        >
          <span class="department-name">{{ item.department }}</span>
          <div class="department-bar-wrapper">
            <div
              class="department-bar"
              :style="{ width: getBarWidth(item.count) + '%' }"
            ></div>
          </div>
          <span class="department-count">{{ item.count }}</span>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <span>暂无科室统计数据</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  CalendarOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';
import { store } from '../../store';

interface DepartmentStat {
  department: string;
  count: number;
}

interface Stats {
  totalAppointments: number;
  todayAppointments: number;
  todayArrived: number;
  todayPending: number;
  departmentStats: DepartmentStat[];
}

defineProps<{
  compact?: boolean;
}>();

const stats = computed<Stats>(() => store.getStatistics());

const maxCount = computed(() => {
  if (!stats.value.departmentStats || stats.value.departmentStats.length === 0) {
    return 1;
  }
  return Math.max(...stats.value.departmentStats.map(s => s.count));
});

const getBarWidth = (count: number) => {
  return (count / maxCount.value) * 100;
};
</script>

<style scoped>
.appointment-stats {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
}

.stat-icon.appointment {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.arrived {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.2;
}

.stat-info p {
  font-size: 13px;
  color: #666;
  margin: 4px 0 0;
}

.department-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.department-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px;
}

.department-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.department-name {
  width: 80px;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.department-bar-wrapper {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.department-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.department-count {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
