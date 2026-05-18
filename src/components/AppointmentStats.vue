/**
 * 预约统计卡片组件
 * 
 * 展示医生的预约统计数据
 * 
 * @version 1.0.0
 * @created 2026-04-22
 */

<template>
  <div class="appointment-stats">
    <div class="stats-card total">
      <div class="stats-icon">
        <CalendarOutlined />
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stats.totalCount }}</div>
        <div class="stats-label">总预约数</div>
      </div>
    </div>

    <div class="stats-card pending">
      <div class="stats-icon">
        <ClockCircleOutlined />
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stats.pendingCount }}</div>
        <div class="stats-label">待确认</div>
      </div>
    </div>

    <div class="stats-card confirmed">
      <div class="stats-icon">
        <CheckCircleOutlined />
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stats.confirmedCount }}</div>
        <div class="stats-label">已确认</div>
      </div>
    </div>

    <div class="stats-card today">
      <div class="stats-icon">
        <HeartOutlined />
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stats.todayCount }}</div>
        <div class="stats-label">今日待诊</div>
      </div>
    </div>

    <div class="stats-card completed">
      <div class="stats-icon">
        <FileDoneOutlined />
      </div>
      <div class="stats-content">
        <div class="stats-value">{{ stats.completedCount }}</div>
        <div class="stats-label">已完成</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, HeartOutlined, FileDoneOutlined } from '@ant-design/icons-vue';

/**
 * 统计数据类型
 */
export interface AppointmentStatsData {
  /** 总预约数 */
  totalCount: number;
  /** 待确认数量 */
  pendingCount: number;
  /** 已确认数量 */
  confirmedCount: number;
  /** 今日待诊数量 */
  todayCount: number;
  /** 已完成数量 */
  completedCount: number;
}

/**
 * Props 定义
 */
interface Props {
  /** 统计数据 */
  stats: AppointmentStatsData;
}

defineProps<Props>();
</script>

<style scoped>
.appointment-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stats-card.total .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.stats-card.pending .stats-icon {
  background: #fff7e6;
  color: #faad14;
}

.stats-card.confirmed .stats-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.stats-card.today .stats-icon {
  background: #f6ffed;
  color: #52c41a;
}

.stats-card.completed .stats-icon {
  background: #f9f0ff;
  color: #722ed1;
}

.stats-content {
  flex: 1;
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stats-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

@media (max-width: 1024px) {
  .appointment-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .appointment-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .appointment-stats {
    grid-template-columns: 1fr;
  }

  .stats-card {
    padding: 16px;
  }

  .stats-value {
    font-size: 24px;
  }
}
</style>
