<template>
  <div class="doctor-list">
    <div class="list-header">
      <h3>选择医生</h3>
      <div class="doctor-count">
        共 {{ doctors.length }} 位医生
      </div>
    </div>

    <div class="list-content">
      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="doctor-card"
        :class="{ 'is-selected': selectedDoctorId === doctor.id }"
        @click="selectDoctor(doctor)"
      >
        <div class="doctor-avatar">
          <img :src="doctor.avatar" :alt="doctor.name" />
        </div>
        
        <div class="doctor-info">
          <div class="doctor-name">
            {{ doctor.name }}
            <span class="doctor-title">{{ doctor.title }}</span>
          </div>
          <div class="doctor-department">
            {{ doctor.department }}
          </div>
          <div class="doctor-specialties">
            <span
              v-for="(specialty, index) in doctor.specialties"
              :key="index"
              class="specialty-tag"
            >
              {{ specialty }}
            </span>
          </div>
          <div class="doctor-experience">
            {{ doctor.experience }}
          </div>
        </div>

        <div class="doctor-status">
          <span v-if="doctor.isActive" class="status-badge available">
            可预约
          </span>
          <span v-else class="status-badge unavailable">
            暂停预约
          </span>
        </div>

        <div v-if="selectedDoctorId === doctor.id" class="selected-indicator">
          ✓
        </div>
      </div>

      <div v-if="doctors.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>暂无符合条件的医生</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}

interface Props {
  doctors: Doctor[];
  selectedDoctorId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  doctors: () => [],
  selectedDoctorId: ''
});

const emit = defineEmits<{
  (e: 'doctor-select', doctor: Doctor): void;
}>();

function selectDoctor(doctor: Doctor) {
  if (doctor.isActive) {
    emit('doctor-select', doctor);
  }
}
</script>

<style scoped>
.doctor-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.doctor-count {
  font-size: 14px;
  color: #666;
}

.list-content {
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;
}

.doctor-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.doctor-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.doctor-card.is-selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.doctor-card:last-child {
  margin-bottom: 0;
}

.doctor-avatar {
  flex-shrink: 0;
}

.doctor-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8e8e8;
}

.doctor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doctor-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.doctor-title {
  font-size: 12px;
  font-weight: normal;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.doctor-department {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.specialty-tag {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.doctor-experience {
  font-size: 13px;
  color: #999;
}

.doctor-status {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.available {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge.unavailable {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #d9d9d9;
}

.selected-indicator {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
