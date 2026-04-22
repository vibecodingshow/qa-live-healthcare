<template>
  <div class="stats-container">
    <div class="stat-card total">
      <div class="stat-icon">
        <CalendarOutlined />
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.totalToday }}</div>
        <div class="stat-label">今日预约</div>
      </div>
    </div>

    <div class="stat-card pending">
      <div class="stat-icon">
        <ClockCircleOutlined />
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.pendingToday }}</div>
        <div class="stat-label">待到诊</div>
      </div>
    </div>

    <div class="stat-card arrived">
      <div class="stat-icon">
        <CheckCircleOutlined />
      </div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.arrivedToday }}</div>
        <div class="stat-label">已到诊</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue';

defineProps<{
  stats: {
    totalToday: number;
    arrivedToday: number;
    pendingToday: number;
  };
}>();
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.arrived {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon {
  font-size: 32px;
  color: #fff;
  opacity: 0.9;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    font-size: 24px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
