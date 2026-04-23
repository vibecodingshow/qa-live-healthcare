<template>
  <a-card class="doctor-info-card" :bordered="false">
    <div class="doctor-header">
      <div class="doctor-avatar-container">
        <img :src="doctor.avatar || '/default-avatar.png'" :alt="doctor.name" class="doctor-avatar" />
        <a-badge
          :status="doctor.isActive ? 'processing' : 'default'"
          :text="doctor.isActive ? '在线' : '离线'"
          class="status-badge"
        />
      </div>
      
      <div class="doctor-basic-info">
        <h2 class="doctor-name">{{ doctor.name }}</h2>
        <p class="doctor-title">{{ doctor.title }}</p>
        <p class="doctor-department">{{ doctor.department }} - {{ doctor.hospital }}</p>
        <p class="doctor-experience">{{ doctor.experience }}</p>
      </div>
    </div>
    
    <div class="doctor-specialties">
      <span class="specialties-label">擅长领域：</span>
      <a-tag v-for="specialty in doctor.specialties" :key="specialty" color="blue">
        {{ specialty }}
      </a-tag>
    </div>
    
    <div class="doctor-introduction">
      <h3>医生简介</h3>
      <div :class="['intro-content', { 'intro-collapsed': !expanded }]">
        {{ doctor.introduction }}
      </div>
      <a-button type="link" @click="expanded = !expanded" class="expand-btn">
        {{ expanded ? '收起' : '展开' }}
      </a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DoctorInfo } from '@/services/doctor/types'

interface Props {
  doctor: DoctorInfo
}

defineProps<Props>()

const expanded = ref(false)
</script>

<style scoped>
.doctor-info-card {
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.doctor-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.doctor-avatar-container {
  position: relative;
  margin-right: 16px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.status-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.doctor-basic-info {
  flex: 1;
}

.doctor-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.doctor-title {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 4px;
}

.doctor-department {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.doctor-experience {
  font-size: 14px;
  color: #999;
  margin-bottom: 0;
}

.doctor-specialties {
  margin-bottom: 16px;
}

.specialties-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.doctor-introduction h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.intro-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.intro-collapsed {
  max-height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.expand-btn {
  padding: 0;
  height: auto;
  font-size: 12px;
}

@media (max-width: 768px) {
  .doctor-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .doctor-avatar-container {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .doctor-name {
    font-size: 20px;
  }
}
</style>