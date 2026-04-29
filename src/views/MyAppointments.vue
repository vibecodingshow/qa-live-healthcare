<template>
  <div class="my-appointments-page">
    <div class="page-header">
      <h1>我的预约</h1>
      <p>查看和管理您的预约记录</p>
    </div>

    <!-- ========== 未登录引导 ========== -->
    <div v-if="!currentPatient" class="appointments-container">
      <div class="auth-prompt-card">
        <a-result
          status="warning"
          title="请先完成身份验证"
          sub-title="查看预约记录需要先验证您的患者身份，请前往问诊页面完成身份验证"
        >
          <template #extra>
            <router-link to="/consultation">
              <a-button type="primary" size="large">前往身份验证</a-button>
            </router-link>
          </template>
        </a-result>
      </div>
    </div>

    <!-- ========== 已登录：预约列表 ========== -->
    <div v-else class="appointments-container">

      <!-- 筛选区 + 统计 -->
      <div class="filter-bar">
        <a-segmented
          v-model:value="statusFilter"
          :options="filterOptions"
          size="large"
        />
        <span class="record-count">共 {{ filteredAppointments.length }} 条记录</span>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredAppointments.length === 0" class="empty-section">
        <a-empty :description="emptyDescription" />
        <router-link to="/appointment" v-if="statusFilter === 'all' && allAppointments.length === 0">
          <a-button type="primary" style="margin-top: 16px;">立即预约</a-button>
        </router-link>
      </div>

      <!-- 有数据时：双视图（CSS 控制响应式切换） -->
      <template v-else>
        <!-- 桌面端：表格视图 -->
        <div class="table-view">
          <a-table
            :columns="tableColumns"
            :data-source="filteredAppointments"
            :pagination="{ pageSize: 10, showSizeChanger: false, showTotal: (total: number) => `共 ${total} 条` }"
            row-key="id"
            :scroll="{ x: 900 }"
          >
            <!-- 预约编号列：截断 + tooltip -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'id'">
                <a-tooltip :title="record.id">
                  {{ formatAppointmentNo(record.id) }}
                </a-tooltip>
              </template>

              <!-- 状态标签列 -->
              <template v-if="column.dataIndex === 'status'">
                <a-tag :color="statusColorMap[record.status]">
                  {{ statusLabelMap[record.status] }}
                </a-tag>
              </template>

              <!-- 病情描述列：截断 -->
              <template v-if="column.dataIndex === 'symptoms'">
                <a-tooltip :title="record.symptoms || '未填写'">
                  {{ record.symptoms ? truncate(record.symptoms, 20) : '—' }}
                </a-tooltip>
              </template>

              <!-- 操作列 -->
              <template v-if="column.dataIndex === 'action'">
                <template v-if="record.status === 'PENDING'">
                  <a-popconfirm
                    title="确定要取消该预约吗？取消后将释放号源。"
                    ok-text="确定取消"
                    cancel-text="想想再说"
                    @confirm="handleCancel(record.id)"
                    :ok-button-props="{ danger: true }"
                  >
                    <a-button type="link" danger size="small" :loading="cancellingId === record.id">
                      取消预约
                    </a-button>
                  </a-popconfirm>
                </template>
                <span v-else style="color: #ccc; font-size: 12px;">—</span>
              </template>
            </template>
          </a-table>
        </div>

        <!-- 移动端：卡片列表视图 -->
        <div class="card-list-view">
        <a-card
          v-for="apt in filteredAppointments"
          :key="apt.id"
          class="appointment-card"
          :bordered="false"
        >
          <div class="card-top">
            <div class="card-doctor">
              <strong>{{ apt.doctorName }}</strong>
              <span class="card-dept">{{ apt.department }}</span>
            </div>
            <a-tag :color="statusColorMap[apt.status]" class="card-status">
              {{ statusLabelMap[apt.status] }}
            </a-tag>
          </div>
          <div class="card-info">
            <div class="info-item">
              <CalendarOutlined />
              <span>{{ apt.date }} {{ apt.startTime }}-{{ apt.endTime }}</span>
            </div>
            <div class="info-item" v-if="apt.symptoms">
              <FileTextOutlined />
              <span>{{ truncate(apt.symptoms, 40) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <template v-if="apt.status === 'PENDING'">
              <a-popconfirm
                title="确定要取消该预约吗？取消后将释放号源。"
                ok-text="确定取消"
                cancel-text="想想再说"
                @confirm="handleCancel(apt.id)"
                :ok-button-props="{ danger: true }"
              >
                <a-button type="text" danger size="small" :loading="cancellingId === apt.id">
                  取消预约
                </a-button>
              </a-popconfirm>
            </template>
          </div>
        </a-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import { store, Appointment } from '../store';

// ========== 状态 ==========
const currentPatient = computed(() => store.state.currentPatient);

const statusFilter = ref<string>('all');

/** 当前正在取消的预约 ID（用于 loading 状态） */
const cancellingId = ref<string | null>(null);

/** 所有预约记录 */
const allAppointments = computed<Appointment[]>(() =>
  currentPatient.value
    ? store.getAppointmentsByPatient(currentPatient.value.id)
    : []
);

// ========== 筛选 ==========
type FilterOption = { label: string; value: string };

const filterOptions: FilterOption[] = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: 'PENDING' },
  { label: '已确认', value: 'CONFIRMED' },
  { label: '已取消', value: 'CANCELLED' },
  { label: '已完成', value: 'COMPLETED' },
];

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') return allAppointments.value;
  return allAppointments.value.filter(a => a.status === statusFilter.value);
});

const emptyDescription = computed(() => {
  if (!currentPatient.value) return '';
  const map: Record<string, string> = {
    all: allAppointments.value.length > 0 ? '该筛选条件下暂无记录' : '暂无预约记录',
    PENDING: '暂无待确认的预约',
    CONFIRMED: '暂无已确认的预约',
    CANCELLED: '暂无已取消的预约',
    COMPLETED: '暂无已完成的预约',
  };
  return map[statusFilter.value] ?? '暂无数据';
});

// ========== 状态映射 ==========
const statusLabelMap: Record<string, string> = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  CANCELLED: '已取消',
  COMPLETED: '已完成',
};

const statusColorMap: Record<string, string> = {
  PENDING: 'orange',
  CONFIRMED: 'green',
  CANCELLED: 'default',
  COMPLETED: 'blue',
};

// ========== 表格列配置 ==========
const tableColumns = [
  {
    title: '预约编号',
    dataIndex: 'id',
    width: 160,
    ellipsis: true,
  },
  {
    title: '医生',
    dataIndex: 'doctorName',
    width: 100,
  },
  {
    title: '科室',
    dataIndex: 'department',
    width: 120,
  },
  {
    title: '预约日期',
    dataIndex: 'date',
    width: 120,
  },
  {
    title: '时段',
    key: 'timeRange',
    width: 110,
    customRender: ({ record }: { record: Appointment }) => `${record.startTime}-${record.endTime}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center' as const,
  },
  {
    title: '病情简述',
    dataIndex: 'symptoms',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    align: 'center' as const,
  },
];

// ========== 取消预约 ==========
async function handleCancel(appointmentId: string): Promise<void> {
  cancellingId.value = appointmentId;

  try {
    const success = store.cancelAppointment(appointmentId);
    if (success) {
      message.success('预约已取消，号源已释放。如需重新预约，请前往预约挂号页面');
    } else {
      message.error('取消失败，请重试（仅待确认状态的预约可取消）');
    }
  } catch (e) {
    message.error('操作异常，请重试');
  } finally {
    cancellingId.value = null;
  }
}

// ========== 工具函数 ==========
function formatAppointmentNo(id: string): string {
  // 从 id 中提取时间信息，格式化为 APT-YYYYMMDD-XXXXX
  const ts = id.replace('apt', '');
  if (ts.length >= 13) {
    const d = new Date(parseInt(ts));
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const suffix = ts.slice(-5).padStart(5, '0');
    return `APT-${ymd}-${suffix}`;
  }
  return id;
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}
</script>

<style scoped>
.my-appointments-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 24px;
  text-align: center;
  color: #fff;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.appointments-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 未登录引导 */
.auth-prompt-card {
  max-width: 600px;
  margin: 60px auto;
  border-radius: 12px;
  overflow: hidden;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.record-count {
  font-size: 14px;
  color: #999;
  white-space: nowrap;
}

/* 空状态 */
.empty-section {
  text-align: center;
  padding: 60px 24px;
  background: #fff;
  border-radius: 12px;
}

/* 桌面端表格 */
.table-view {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 移动端卡片列表 —— 默认隐藏，媒体查询中启用 */
.card-list-view {
  display: none;
  flex-direction: column;
  gap: 12px;
}

.appointment-card {
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-doctor strong {
  font-size: 16px;
  color: #333;
  display: block;
}

.card-dept {
  font-size: 13px;
  color: #667eea;
  margin-top: 2px;
  display: block;
}

.card-status {
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
}

.info-item .anticon {
  color: #999;
}

.card-footer {
  padding-top: 10px;
  text-align: right;
}

/* 响应式：移动端隐藏表格、显示卡片 */
@media (max-width: 768px) {
  .page-header {
    padding: 36px 16px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .appointments-container {
    padding: 12px;
  }

  .table-view {
    display: none;
  }

  .card-list-view {
    display: flex;
  }

  .filter-bar {
    justify-content: center;
  }
}
</style>
