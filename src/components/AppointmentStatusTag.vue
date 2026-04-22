<template>
  <a-tag :color="tagColor" class="appointment-status-tag">
    {{ statusText }}
  </a-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AppointmentStatus } from '@/types/appointment';

interface Props {
  status: AppointmentStatus;
}

const props = defineProps<Props>();

const statusText = computed(() => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[props.status] || props.status;
});

const tagColor = computed(() => {
  const colorMap = {
    pending: 'gold',
    confirmed: 'green',
    completed: 'blue',
    cancelled: 'default'
  };
  return colorMap[props.status] || 'default';
});
</script>

<style scoped>
.appointment-status-tag {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 4px;
}
</style>
