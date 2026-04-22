import type { 
  Appointment, 
  AppointmentQueryParams, 
  AppointmentUpdateParams,
  PaginationResponse,
  APPOINTMENT_STATUS 
} from '../types'
import { ErrorCode, ErrorSeverity, AppointmentError } from '../types'

/**
 * 预约管理工具类
 * 提供预约记录的增删改查和状态管理功能
 */
export class AppointmentManager {
  private baseUrl = '/api/appointments'
  
  /**
   * 获取患者预约记录列表
   */
  async getPatientAppointments(params: AppointmentQueryParams): Promise<PaginationResponse<Appointment>> {
    try {
      // 模拟API调用
      const mockAppointments = this.generateMockAppointments(params)
      const filteredAppointments = this.filterAppointments(mockAppointments, params)
      const paginatedData = this.paginateData(filteredAppointments, params)
      
      return {
        data: paginatedData,
        total: filteredAppointments.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: Math.ceil(filteredAppointments.length / (params.pageSize || 10))
      }
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_QUERY_FAILED,
        '获取预约记录失败',
        ErrorSeverity.MEDIUM,
        { params, error }
      )
    }
  }

  /**
   * 获取医生预约管理列表
   */
  async getDoctorAppointments(params: AppointmentQueryParams): Promise<PaginationResponse<Appointment>> {
    try {
      // 模拟API调用
      const mockAppointments = this.generateMockAppointments(params)
      const doctorAppointments = mockAppointments.filter(app => 
        app.doctorId === params.doctorId
      )
      const filteredAppointments = this.filterAppointments(doctorAppointments, params)
      const paginatedData = this.paginateData(filteredAppointments, params)
      
      return {
        data: paginatedData,
        total: filteredAppointments.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: Math.ceil(filteredAppointments.length / (params.pageSize || 10))
      }
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_QUERY_FAILED,
        '获取医生预约列表失败',
        ErrorSeverity.MEDIUM,
        { params, error }
      )
    }
  }

  /**
   * 更新预约状态
   */
  async updateAppointmentStatus(appointmentId: string, status: APPOINTMENT_STATUS, notes?: string): Promise<Appointment> {
    try {
      // 验证状态转换的合法性
      this.validateStatusTransition(appointmentId, status)
      
      // 模拟API调用
      const updatedAppointment: Appointment = {
        id: appointmentId,
        patientId: 'patient-001',
        patientName: '张三',
        patientAge: 35,
        patientGender: 'male',
        patientPhone: '13800138000',
        doctorId: 'doctor-001',
        doctorName: '张医生',
        doctorAvatar: '/avatars/doctor-001.jpg',
        doctorTitle: '主任医师',
        department: '内科',
        appointmentDate: '2026-04-22',
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        status: status,
        symptoms: '头痛、发热',
        notes: notes || '',
        location: '门诊大楼3楼',
        createdAt: '2026-04-21T10:00:00Z',
        updatedAt: new Date().toISOString()
      }
      
      return updatedAppointment
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_UPDATE_FAILED,
        '更新预约状态失败',
        ErrorSeverity.MEDIUM,
        { appointmentId, status, notes, error }
      )
    }
  }

  /**
   * 更新预约备注
   */
  async updateAppointmentNotes(appointmentId: string, notes: string): Promise<Appointment> {
    try {
      // 验证备注长度
      if (notes.length > 200) {
        throw new AppointmentError(
          ErrorCode.VALIDATION_ERROR,
          '备注长度不能超过200字符',
          ErrorSeverity.LOW,
          { appointmentId, notes }
        )
      }
      
      // 模拟API调用
      const updatedAppointment: Appointment = {
        id: appointmentId,
        patientId: 'patient-001',
        patientName: '张三',
        patientAge: 35,
        patientGender: 'male',
        patientPhone: '13800138000',
        doctorId: 'doctor-001',
        doctorName: '张医生',
        doctorAvatar: '/avatars/doctor-001.jpg',
        doctorTitle: '主任医师',
        department: '内科',
        appointmentDate: '2026-04-22',
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        status: 'confirmed',
        symptoms: '头痛、发热',
        notes: notes,
        location: '门诊大楼3楼',
        createdAt: '2026-04-21T10:00:00Z',
        updatedAt: new Date().toISOString()
      }
      
      return updatedAppointment
    } catch (error) {
      if (error instanceof AppointmentError) {
        throw error
      }
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_UPDATE_FAILED,
        '更新预约备注失败',
        ErrorSeverity.MEDIUM,
        { appointmentId, notes, error }
      )
    }
  }

  /**
   * 搜索预约记录
   */
  async searchAppointments(keyword: string, params: AppointmentQueryParams): Promise<PaginationResponse<Appointment>> {
    try {
      const mockAppointments = this.generateMockAppointments(params)
      
      // 关键词搜索逻辑
      const searchResults = mockAppointments.filter(appointment => {
        const searchText = keyword.toLowerCase()
        return (
          appointment.doctorName.toLowerCase().includes(searchText) ||
          appointment.department.toLowerCase().includes(searchText) ||
          appointment.symptoms.toLowerCase().includes(searchText) ||
          appointment.patientName.toLowerCase().includes(searchText) ||
          appointment.location.toLowerCase().includes(searchText)
        )
      })
      
      const filteredAppointments = this.filterAppointments(searchResults, params)
      const paginatedData = this.paginateData(filteredAppointments, params)
      
      return {
        data: paginatedData,
        total: filteredAppointments.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: Math.ceil(filteredAppointments.length / (params.pageSize || 10))
      }
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_SEARCH_FAILED,
        '搜索预约记录失败',
        ErrorSeverity.MEDIUM,
        { keyword, params, error }
      )
    }
  }

  /**
   * 导出预约记录
   */
  async exportAppointments(params: AppointmentQueryParams): Promise<Blob> {
    try {
      const appointments = await this.getPatientAppointments(params)
      
      // 生成CSV格式数据
      const csvData = this.generateCSV(appointments.data)
      
      // 创建Blob对象
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      
      return blob
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.EXPORT_FAILED,
        '导出预约记录失败',
        ErrorSeverity.MEDIUM,
        { params, error }
      )
    }
  }

  /**
   * 获取预约统计信息
   */
  async getAppointmentStatistics(doctorId?: string): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    noShow: number
  }> {
    try {
      const mockAppointments = this.generateMockAppointments({})
      const targetAppointments = doctorId 
        ? mockAppointments.filter(app => app.doctorId === doctorId)
        : mockAppointments
      
      return {
        total: targetAppointments.length,
        pending: targetAppointments.filter(app => app.status === 'pending').length,
        confirmed: targetAppointments.filter(app => app.status === 'confirmed').length,
        completed: targetAppointments.filter(app => app.status === 'completed').length,
        cancelled: targetAppointments.filter(app => app.status === 'cancelled').length,
        noShow: targetAppointments.filter(app => app.status === 'no_show').length
      }
    } catch (error) {
      throw new AppointmentError(
        ErrorCode.STATISTICS_QUERY_FAILED,
        '获取预约统计失败',
        ErrorSeverity.MEDIUM,
        { doctorId, error }
      )
    }
  }

  // 私有方法

  /**
   * 生成模拟预约数据
   */
  private generateMockAppointments(params: AppointmentQueryParams): Appointment[] {
    const mockAppointments: Appointment[] = [
      {
        id: 'app-001',
        patientId: 'patient-001',
        patientName: '张三',
        patientAge: 35,
        patientGender: 'male',
        patientPhone: '13800138000',
        doctorId: 'doctor-001',
        doctorName: '张医生',
        doctorAvatar: '/avatars/doctor-001.jpg',
        doctorTitle: '主任医师',
        department: '内科',
        appointmentDate: '2026-04-22',
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        status: 'confirmed',
        symptoms: '头痛、发热持续3天',
        notes: '患者有高血压病史',
        location: '门诊大楼3楼',
        createdAt: '2026-04-21T10:00:00Z',
        updatedAt: '2026-04-21T14:30:00Z'
      },
      {
        id: 'app-002',
        patientId: 'patient-002',
        patientName: '李四',
        patientAge: 28,
        patientGender: 'female',
        patientPhone: '13900139000',
        doctorId: 'doctor-002',
        doctorName: '李医生',
        doctorAvatar: '/avatars/doctor-002.jpg',
        doctorTitle: '副主任医师',
        department: '外科',
        appointmentDate: '2026-04-23',
        startTime: '10:30',
        endTime: '11:00',
        duration: 30,
        status: 'pending',
        symptoms: '右肩关节疼痛',
        notes: '',
        location: '门诊大楼2楼',
        createdAt: '2026-04-21T11:30:00Z',
        updatedAt: '2026-04-21T11:30:00Z'
      },
      {
        id: 'app-003',
        patientId: 'patient-003',
        patientName: '王五',
        patientAge: 45,
        patientGender: 'male',
        patientPhone: '13700137000',
        doctorId: 'doctor-001',
        doctorName: '张医生',
        doctorAvatar: '/avatars/doctor-001.jpg',
        doctorTitle: '主任医师',
        department: '内科',
        appointmentDate: '2026-04-24',
        startTime: '14:00',
        endTime: '14:30',
        duration: 30,
        status: 'completed',
        symptoms: '咳嗽、胸闷',
        notes: '已完成检查，建议复查',
        location: '门诊大楼3楼',
        createdAt: '2026-04-20T09:00:00Z',
        updatedAt: '2026-04-24T15:00:00Z'
      }
    ]

    return mockAppointments
  }

  /**
   * 筛选预约数据
   */
  private filterAppointments(appointments: Appointment[], params: AppointmentQueryParams): Appointment[] {
    let filtered = [...appointments]

    // 状态筛选
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(app => app.status === params.status)
    }

    // 日期范围筛选
    if (params.startDate && params.endDate) {
      filtered = filtered.filter(app => 
        app.appointmentDate >= params.startDate! && 
        app.appointmentDate <= params.endDate!
      )
    }

    // 医生筛选
    if (params.doctorId) {
      filtered = filtered.filter(app => app.doctorId === params.doctorId)
    }

    // 排序
    if (params.sortBy) {
      const [field, order] = params.sortBy.split('_')
      filtered.sort((a, b) => {
        let aValue: any = a[field as keyof Appointment]
        let bValue: any = b[field as keyof Appointment]
        
        if (field === 'appointmentDate' || field === 'createdAt' || field === 'updatedAt') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }
        
        if (order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }

  /**
   * 分页处理
   */
  private paginateData(data: Appointment[], params: AppointmentQueryParams): Appointment[] {
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const startIndex = (page - 1) * pageSize
    
    return data.slice(startIndex, startIndex + pageSize)
  }

  /**
   * 验证状态转换合法性
   */
  private validateStatusTransition(appointmentId: string, newStatus: APPOINTMENT_STATUS): void {
    const validTransitions: Record<APPOINTMENT_STATUS, APPOINTMENT_STATUS[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled', 'no_show'],
      completed: [],
      cancelled: [],
      no_show: []
    }

    // 这里需要获取当前预约状态，暂时使用模拟数据
    const currentStatus: APPOINTMENT_STATUS = 'confirmed'
    
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new AppointmentError(
        ErrorCode.APPOINTMENT_STATUS_INVALID,
        `无法从${currentStatus}状态转换到${newStatus}状态`,
        ErrorSeverity.MEDIUM,
        { appointmentId, currentStatus, newStatus }
      )
    }
  }

  /**
   * 生成CSV数据
   */
  private generateCSV(appointments: Appointment[]): string {
    const headers = [
      '预约编号', '患者姓名', '患者年龄', '患者性别', '联系电话',
      '医生姓名', '科室', '预约日期', '时间段', '状态',
      '症状描述', '备注', '创建时间', '更新时间'
    ].join(',')

    const rows = appointments.map(app => [
      app.id,
      app.patientName,
      app.patientAge,
      app.patientGender === 'male' ? '男' : '女',
      app.patientPhone,
      app.doctorName,
      app.department,
      app.appointmentDate,
      `${app.startTime}-${app.endTime}`,
      this.getStatusText(app.status),
      `"${app.symptoms}"`,
      `"${app.notes || ''}"`,
      app.createdAt,
      app.updatedAt
    ].join(','))

    return [headers, ...rows].join('\n')
  }

  /**
   * 获取状态文本
   */
  private getStatusText(status: APPOINTMENT_STATUS): string {
    const statusMap: Record<APPOINTMENT_STATUS, string> = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消',
      no_show: '未就诊'
    }
    return statusMap[status] || '未知状态'
  }
}

// 创建单例实例
export const appointmentManager = new AppointmentManager()