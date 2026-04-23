<template>
  <a-card class="doctor-card" hoverable>
    <div class="card-header">
      <img :src="doctor.avatar" :alt="doctor.name" class="doctor-avatar" />
    </div>
    <div class="card-body">
      <h3 class="doctor-name">{{ doctor.name }}</h3>
      <p class="doctor-title">{{ doctor.title }}</p>
      <p class="doctor-department">
        <MedicineBoxOutlined class="icon" />
        {{ doctor.department }}
      </p>
      <p class="doctor-experience">
        <ClockCircleOutlined class="icon" />
        {{ doctor.experience }}
      </p>
      <div class="doctor-specialties">
        <a-tag v-for="specialty in displayedSpecialties" :key="specialty" color="blue">
          {{ specialty }}
        </a-tag>
        <a-tag v-if="doctor.specialties.length > 3" color="default">
          +{{ doctor.specialties.length - 3 }}
        </a-tag>
      </div>
    </div>
    <div class="card-footer">
      <a-button type="primary" block @click="handleBook">
        <CalendarOutlined />
        立即预约
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarOutlined, MedicineBoxOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import type { Doctor } from '../../store';

interface Props {
  doctor: Doctor;
}

const props = defineProps<Props>();
const router = useRouter();

const displayedSpecialties = computed(() => {
  return props.doctor.specialties.slice(0, 3);
});

const handleBook = () => {
  router.push(`/appointment/book/${props.doctor.id}`);
};
</script>

<style scoped>
.doctor-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.doctor-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.doctor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e6f7ff;
}

.card-body {
  flex: 1;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.doctor-title {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
}

.doctor-department,
.doctor-experience {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  color: #999;
  font-size: 12px;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  justify-content: center;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .doctor-avatar {
    width: 80px;
    height: 80px;
  }

  .doctor-name {
    font-size: 16px;
  }
}
</style>
