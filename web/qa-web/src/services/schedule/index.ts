/**
 * 医生排班相关 API 服务
 */
import type {
  DoctorSchedule,
  ScheduleFilterParams,
  ScheduleListResponse,
  Department,
  SlotStatus,
} from './types'
import { SlotStatus as Status } from './types'

/** 模拟排班数据 */
const mockSchedules: DoctorSchedule[] = [
  {
    id: '1',
    doctorId: 'd001',
    doctorName: '张医生',
    doctorAvatar: '',
    department: '内科',
    title: '主任医师',
    hospital: '第一医院',
    scheduleDate: '2026-04-23',
    timeSlots: [
      { id: 's1', startTime: '08:00', endTime: '12:00', total: 30, remaining: 5, status: Status.LOW_STOCK },
      { id: 's2', startTime: '14:00', endTime: '18:00', total: 30, remaining: 15, status: Status.AVAILABLE },
    ],
    status: Status.AVAILABLE,
  },
  {
    id: '2',
    doctorId: 'd002',
    doctorName: '李医生',
    doctorAvatar: '',
    department: '外科',
    title: '副主任医师',
    hospital: '第一医院',
    scheduleDate: '2026-04-23',
    timeSlots: [
      { id: 's3', startTime: '08:00', endTime: '12:00', total: 25, remaining: 0, status: Status.FULL },
      { id: 's4', startTime: '14:00', endTime: '18:00', total: 25, remaining: 8, status: Status.AVAILABLE },
    ],
    status: Status.AVAILABLE,
  },
  {
    id: '3',
    doctorId: 'd003',
    doctorName: '王医生',
    doctorAvatar: '',
    department: '儿科',
    title: '主治医师',
    hospital: '第一医院',
    scheduleDate: '2026-04-23',
    timeSlots: [
      { id: 's5', startTime: '08:00', endTime: '12:00', total: 40, remaining: 20, status: Status.AVAILABLE },
    ],
    status: Status.AVAILABLE,
  },
  {
    id: '4',
    doctorId: 'd004',
    doctorName: '赵医生',
    doctorAvatar: '',
    department: '妇产科',
    title: '主任医师',
    hospital: '第一医院',
    scheduleDate: '2026-04-24',
    timeSlots: [
      { id: 's6', startTime: '08:00', endTime: '12:00', total: 20, remaining: 0, status: Status.SUSPENDED },
    ],
    status: Status.SUSPENDED,
  },
  {
    id: '5',
    doctorId: 'd005',
    doctorName: '刘医生',
    doctorAvatar: '',
    department: '内科',
    title: '副主任医师',
    hospital: '第二医院',
    scheduleDate: '2026-04-23',
    timeSlots: [
      { id: 's7', startTime: '08:00', endTime: '12:00', total: 35, remaining: 12, status: Status.AVAILABLE },
      { id: 's8', startTime: '14:00', endTime: '18:00', total: 35, remaining: 3, status: Status.LOW_STOCK },
    ],
    status: Status.AVAILABLE,
  },
]

/** 模拟科室数据 */
const mockDepartments: Department[] = [
  { id: 'dept001', name: '内科' },
  { id: 'dept002', name: '外科' },
  { id: 'dept003', name: '儿科' },
  { id: 'dept004', name: '妇产科' },
  { id: 'dept005', name: '骨科' },
  { id: 'dept006', name: '皮肤科' },
  { id: 'dept007', name: '眼科' },
  { id: 'dept008', name: '耳鼻喉科' },
]

/** 模拟 API 延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取排班列表
 */
export async function getScheduleList(
  params: ScheduleFilterParams = {}
): Promise<ScheduleListResponse> {
  // 模拟 API 延迟
  await delay(500)

  let filteredList = [...mockSchedules]

  // 按科室筛选
  if (params.department) {
    filteredList = filteredList.filter(
      item => item.department === params.department
    )
  }

  // 按日期范围筛选
  if (params.startDate) {
    filteredList = filteredList.filter(
      item => item.scheduleDate >= params.startDate!
    )
  }
  if (params.endDate) {
    filteredList = filteredList.filter(
      item => item.scheduleDate <= params.endDate!
    )
  }

  // 按关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredList = filteredList.filter(
      item =>
        item.doctorName.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword)
    )
  }

  // 分页
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedList = filteredList.slice(startIndex, endIndex)

  return {
    list: paginatedList,
    total: filteredList.length,
    page,
    pageSize,
  }
}

/**
 * 获取科室列表
 */
export async function getDepartmentList(): Promise<Department[]> {
  await delay(200)
  return mockDepartments
}

/**
 * 获取排班详情
 */
export async function getScheduleDetail(id: string): Promise<DoctorSchedule | null> {
  await delay(300)
  return mockSchedules.find(item => item.id === id) || null
}

/**
 * 获取号源状态文本
 */
export function getSlotStatusText(status: SlotStatus): string {
  const statusMap: Record<SlotStatus, string> = {
    [Status.AVAILABLE]: '可预约',
    [Status.LOW_STOCK]: '紧张',
    [Status.FULL]: '已满',
    [Status.SUSPENDED]: '停诊',
  }
  return statusMap[status] || '未知'
}

/**
 * 获取号源状态颜色
 */
export function getSlotStatusColor(status: SlotStatus): string {
  const colorMap: Record<SlotStatus, string> = {
    [Status.AVAILABLE]: '#52c41a',
    [Status.LOW_STOCK]: '#faad14',
    [Status.FULL]: '#d9d9d9',
    [Status.SUSPENDED]: '#ff4d4f',
  }
  return colorMap[status] || '#d9d9d9'
}
