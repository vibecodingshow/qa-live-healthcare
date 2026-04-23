<template>
  <div class="patient-selector">
    <!-- 标题和操作区域 -->
    <div class="selector-header">
      <h3 class="selector-title">选择就诊人</h3>
      <a-button type="primary" @click="showAddForm" class="add-btn">
        <template #icon><plus-outlined /></template>
        新增就诊人
      </a-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="搜索就诊人姓名、身份证号或手机号"
        @search="handleSearch"
        :loading="loading"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <a-alert
        :message="error"
        type="error"
        show-icon
        closable
        @close="clearError"
      />
    </div>

    <!-- 就诊人列表 -->
    <div v-else class="patient-list">
      <div v-if="patients.length === 0" class="empty-state">
        <a-empty 
          description="暂无就诊人"
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        >
          <template #description>
            <div class="empty-description">
              <p>暂无就诊人信息</p>
              <a-button type="link" @click="showAddForm">立即添加</a-button>
            </div>
          </template>
        </a-empty>
      </div>

      <div v-else class="patient-cards">
        <div
          v-for="patient in patients"
          :key="patient.id"
          class="patient-card"
          :class="{ 
            'selected': selectedPatient?.id === patient.id,
            'default-patient': patient.isDefault 
          }"
          @click="handleSelectPatient(patient)"
        >
          <!-- 默认就诊人标识 -->
          <div v-if="patient.isDefault" class="default-badge">
            <star-filled class="star-icon" /> 默认就诊人
          </div>

          <!-- 就诊人信息 -->
          <div class="patient-info">
            <div class="patient-name">
              <span class="name-text">{{ patient.name }}</span>
              <span class="relation-badge">{{ formatRelation(patient.relation, patient.relationName) }}</span>
            </div>
            <div class="patient-details">
              <p class="id-card">身份证: {{ formatIdCard(patient.idCard) }}</p>
              <p class="phone">手机号: {{ patient.phone }}</p>
            </div>
            <div class="patient-actions">
              <a-button type="link" size="small" @click.stop="handleEdit(patient)">编辑</a-button>
              <a-button 
                v-if="!patient.isDefault"
                type="link" 
                size="small" 
                danger
                @click.stop="handleDelete(patient)"
              >
                删除
              </a-button>
              <a-button 
                v-if="!patient.isDefault"
                type="link" 
                size="small"
                @click.stop="handleSetDefault(patient)"
              >
                设为默认
              </a-button>
            </div>
          </div>

          <!-- 选中状态指示器 -->
          <div v-if="selectedPatient?.id === patient.id" class="selected-indicator">
            <check-circle-filled class="check-icon" />
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑就诊人表单 -->
    <patient-form
      v-model:visible="showForm"
      :patient="editingPatient"
      :mode="formMode"
      @success="handleFormSuccess"
      @cancel="handleFormCancel"
    />

    <!-- 删除确认对话框 -->
    <a-modal
      v-model:visible="showDeleteConfirm"
      title="确认删除"
      ok-text="确认删除"
      cancel-text="取消"
      :ok-button-props="{ danger: true }"
      @ok="confirmDelete"
      @cancel="cancelDelete"
    >
      <p>确定要删除就诊人 <strong>{{ deletingPatient?.name }}</strong> 吗？此操作不可撤销。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { PlusOutlined, StarFilled, CheckCircleFilled } from '@ant-design/icons-vue'
import type { Patient } from '@/services/patient/types'
import { getPatientList, deletePatient, setDefaultPatient } from '@/services/patient'
import PatientForm from './PatientForm.vue'

// 组件属性
interface Props {
  value?: Patient | null
}

const props = withDefaults(defineProps<Props>(), {
  value: null
})

// 组件事件
const emit = defineEmits<{
  'update:value': [patient: Patient | null]
  'select': [patient: Patient]
}>()

// 状态管理
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const formMode = ref<'add' | 'edit'>('add')

const patients = ref<Patient[]>([])
const selectedPatient = ref<Patient | null>(null)
const editingPatient = ref<Patient | null>(null)
const deletingPatient = ref<Patient | null>(null)

// 计算属性
const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value
  
  const query = searchQuery.value.toLowerCase()
  return patients.value.filter(patient => 
    patient.name.toLowerCase().includes(query) ||
    patient.idCard.includes(query) ||
    patient.phone.includes(query)
  )
})

// 加载就诊人列表
async function loadPatients() {
  loading.value = true
  error.value = null
  
  try {
    const response = await getPatientList({ search: searchQuery.value })
    patients.value = response.patients
    
    // 如果有默认就诊人，自动选中
    const defaultPatient = patients.value.find(p => p.isDefault)
    if (defaultPatient && !selectedPatient.value) {
      handleSelectPatient(defaultPatient)
    }
  } catch (err) {
    console.error('加载就诊人列表失败:', err)
    error.value = '加载就诊人列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 处理搜索
function handleSearch() {
  loadPatients()
}

// 选择就诊人
function handleSelectPatient(patient: Patient) {
  selectedPatient.value = patient
  emit('update:value', patient)
  emit('select', patient)
}

// 显示新增表单
function showAddForm() {
  formMode.value = 'add'
  editingPatient.value = null
  showForm.value = true
}

// 处理编辑
function handleEdit(patient: Patient) {
  formMode.value = 'edit'
  editingPatient.value = patient
  showForm.value = true
}

// 处理删除
function handleDelete(patient: Patient) {
  deletingPatient.value = patient
  showDeleteConfirm.value = true
}

// 确认删除
async function confirmDelete() {
  if (!deletingPatient.value) return
  
  try {
    await deletePatient(deletingPatient.value.id)
    await loadPatients()
    
    // 如果删除的是当前选中的就诊人，清空选中状态
    if (selectedPatient.value?.id === deletingPatient.value.id) {
      selectedPatient.value = null
      emit('update:value', null)
    }
  } catch (err) {
    console.error('删除就诊人失败:', err)
    error.value = '删除就诊人失败，请稍后重试'
  } finally {
    showDeleteConfirm.value = false
    deletingPatient.value = null
  }
}

// 取消删除
function cancelDelete() {
  showDeleteConfirm.value = false
  deletingPatient.value = null
}

// 设为默认就诊人
async function handleSetDefault(patient: Patient) {
  try {
    await setDefaultPatient(patient.id)
    await loadPatients()
  } catch (err) {
    console.error('设置默认就诊人失败:', err)
    error.value = '设置默认就诊人失败，请稍后重试'
  }
}

// 处理表单成功
function handleFormSuccess() {
  loadPatients()
  showForm.value = false
}

// 处理表单取消
function handleFormCancel() {
  showForm.value = false
  editingPatient.value = null
}

// 清除错误
function clearError() {
  error.value = null
}

// 格式化身份证号（脱敏显示）
function formatIdCard(idCard: string): string {
  if (idCard.length !== 18) return idCard
  return `${idCard.substring(0, 6)}****${idCard.substring(14)}`
}

// 格式化关系显示
function formatRelation(relation: string, relationName?: string): string {
  const relationMap = {
    self: '本人',
    family: '家人',
    other: relationName || '其他'
  }
  return relationMap[relation as keyof typeof relationMap] || relation
}

// 监听属性变化
onMounted(() => {
  // 初始化选中的就诊人
  if (props.value) {
    selectedPatient.value = props.value
  }
  
  // 加载就诊人列表
  loadPatients()
})
</script>

<style scoped>
.patient-selector {
  width: 100%;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.selector-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.search-section {
  margin-bottom: 16px;
}

.patient-list {
  min-height: 200px;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-description p {
  margin-bottom: 8px;
  color: #999;
}

.patient-cards {
  display: grid;
  gap: 12px;
}

.patient-card {
  position: relative;
  padding: 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.patient-card:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.patient-card.selected {
  border-color: #1890ff;
  background: #f0f8ff;
}

.patient-card.default-patient {
  border-left: 4px solid #ffc53d;
}

.default-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  font-size: 12px;
  color: #d46b08;
}

.star-icon {
  color: #faad14;
}

.patient-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.patient-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.relation-badge {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.patient-details {
  margin: 0;
}

.patient-details p {
  margin: 2px 0;
  font-size: 14px;
  color: #666;
}

.patient-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.selected-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  color: #52c41a;
  font-size: 16px;
}

.check-icon {
  color: #52c41a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .selector-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .add-btn {
    width: 100%;
  }
  
  .patient-actions {
    flex-direction: column;
  }
  
  .patient-card {
    padding: 12px;
  }
}
</style>