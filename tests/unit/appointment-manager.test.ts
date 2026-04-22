import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AppointmentManager, appointmentManager } from '../../src/utils/appointment-manager'
import type { Appointment, AppointmentQueryParams, APPOINTMENT_STATUS } from '../../src/types'
import { ErrorCode, AppointmentError } from '../../src/types'

describe('AppointmentManager', () => {
  let manager: AppointmentManager

  beforeEach(() => {
    manager = new AppointmentManager()
    vi.clearAllMocks()
  })

  describe('getPatientAppointments', () => {
    it('应该返回患者预约记录列表', async () => {
      const params: AppointmentQueryParams = {
        page: 1,
        pageSize: 10
      }

      const result = await manager.getPatientAppointments(params)

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
      expect(result).toHaveProperty('totalPages')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('应该支持状态筛选', async () => {
      const params: AppointmentQueryParams = {
        status: 'confirmed'
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.data.every(app => app.status === 'confirmed')).toBe(true)
    })

    it('应该支持日期范围筛选', async () => {
      const params: AppointmentQueryParams = {
        startDate: '2026-04-22',
        endDate: '2026-04-23'
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.data.every(app => 
        app.appointmentDate >= '2026-04-22' && 
        app.appointmentDate <= '2026-04-23'
      )).toBe(true)
    })

    it('应该支持分页', async () => {
      const params: AppointmentQueryParams = {
        page: 1,
        pageSize: 2
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.data.length).toBeLessThanOrEqual(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(2)
    })

    it('应该处理空结果', async () => {
      const params: AppointmentQueryParams = {
        status: 'no_show' as APPOINTMENT_STATUS
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.data.length).toBe(0)
      expect(result.total).toBe(0)
    })
  })

  describe('getDoctorAppointments', () => {
    it('应该返回医生预约管理列表', async () => {
      const params: AppointmentQueryParams = {
        doctorId: 'doctor-001'
      }

      const result = await manager.getDoctorAppointments(params)

      expect(result.data.every(app => app.doctorId === 'doctor-001')).toBe(true)
    })

    it('应该处理不存在的医生ID', async () => {
      const params: AppointmentQueryParams = {
        doctorId: 'non-existent-doctor'
      }

      const result = await manager.getDoctorAppointments(params)

      expect(result.data.length).toBe(0)
      expect(result.total).toBe(0)
    })
  })

  describe('updateAppointmentStatus', () => {
    it('应该成功更新预约状态', async () => {
      const appointmentId = 'app-001'
      const newStatus: APPOINTMENT_STATUS = 'completed'

      const result = await manager.updateAppointmentStatus(appointmentId, newStatus)

      expect(result.status).toBe(newStatus)
      expect(result.id).toBe(appointmentId)
    })

    it('应该支持备注更新', async () => {
      const appointmentId = 'app-001'
      const newStatus: APPOINTMENT_STATUS = 'completed'
      const notes = '患者已按时就诊'

      const result = await manager.updateAppointmentStatus(appointmentId, newStatus, notes)

      expect(result.notes).toBe(notes)
    })

    it('应该拒绝无效的状态转换', async () => {
      const appointmentId = 'app-001'
      const invalidStatus: APPOINTMENT_STATUS = 'pending'

      await expect(manager.updateAppointmentStatus(appointmentId, invalidStatus))
        .rejects
        .toThrow(AppointmentError)
    })
  })

  describe('updateAppointmentNotes', () => {
    it('应该成功更新预约备注', async () => {
      const appointmentId = 'app-001'
      const notes = '新的备注信息'

      const result = await manager.updateAppointmentNotes(appointmentId, notes)

      expect(result.notes).toBe(notes)
      expect(result.id).toBe(appointmentId)
    })

    it('应该拒绝超长的备注', async () => {
      const appointmentId = 'app-001'
      const longNotes = 'a'.repeat(201)

      await expect(manager.updateAppointmentNotes(appointmentId, longNotes))
        .rejects
        .toThrow(AppointmentError)
    })
  })

  describe('searchAppointments', () => {
    it('应该根据关键词搜索预约记录', async () => {
      const keyword = '头痛'
      const params: AppointmentQueryParams = {}

      const result = await manager.searchAppointments(keyword, params)

      expect(result.data.every(app => 
        app.doctorName.toLowerCase().includes(keyword) ||
        app.department.toLowerCase().includes(keyword) ||
        app.symptoms.toLowerCase().includes(keyword) ||
        app.patientName.toLowerCase().includes(keyword) ||
        app.location.toLowerCase().includes(keyword)
      )).toBe(true)
    })

    it('应该返回空结果当没有匹配项时', async () => {
      const keyword = '不存在的关键词'
      const params: AppointmentQueryParams = {}

      const result = await manager.searchAppointments(keyword, params)

      expect(result.data.length).toBe(0)
    })
  })

  describe('exportAppointments', () => {
    it('应该生成CSV格式的导出数据', async () => {
      const params: AppointmentQueryParams = {}

      const result = await manager.exportAppointments(params)

      expect(result).toBeInstanceOf(Blob)
      expect(result.type).toBe('text/csv;charset=utf-8;')
    })

    it('应该包含正确的CSV结构', async () => {
      const params: AppointmentQueryParams = {}

      const blob = await manager.exportAppointments(params)
      const text = await blob.text()

      expect(text).toContain('预约编号')
      expect(text).toContain('患者姓名')
      expect(text).toContain('医生姓名')
      expect(text).toContain('预约日期')
      expect(text).toContain('状态')
    })
  })

  describe('getAppointmentStatistics', () => {
    it('应该返回总体统计信息', async () => {
      const result = await manager.getAppointmentStatistics()

      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('pending')
      expect(result).toHaveProperty('confirmed')
      expect(result).toHaveProperty('completed')
      expect(result).toHaveProperty('cancelled')
      expect(result).toHaveProperty('noShow')
      expect(result.total).toBeGreaterThanOrEqual(0)
    })

    it('应该返回指定医生的统计信息', async () => {
      const doctorId = 'doctor-001'
      const result = await manager.getAppointmentStatistics(doctorId)

      expect(result.total).toBeGreaterThanOrEqual(0)
    })

    it('应该处理不存在的医生统计', async () => {
      const doctorId = 'non-existent-doctor'
      const result = await manager.getAppointmentStatistics(doctorId)

      expect(result.total).toBe(0)
    })
  })

  describe('错误处理', () => {
    it('应该抛出正确的错误类型', async () => {
      // 模拟无效的状态转换
      const appointmentId = 'app-001'
      const invalidStatus: APPOINTMENT_STATUS = 'pending'

      try {
        await manager.updateAppointmentStatus(appointmentId, invalidStatus)
        expect(true).toBe(false) // 不应该执行到这里
      } catch (error) {
        expect(error).toBeInstanceOf(AppointmentError)
        if (error instanceof AppointmentError) {
          expect(error.code).toBe(ErrorCode.APPOINTMENT_STATUS_INVALID)
        }
      }
    })

    it('应该包含详细的错误信息', async () => {
      const appointmentId = 'app-001'
      const longNotes = 'a'.repeat(201)

      try {
        await manager.updateAppointmentNotes(appointmentId, longNotes)
        expect(true).toBe(false) // 不应该执行到这里
      } catch (error) {
        expect(error).toBeInstanceOf(AppointmentError)
        if (error instanceof AppointmentError) {
          expect(error.message).toBe('备注长度不能超过200字符')
          expect(error.severity).toBe('LOW')
        }
      }
    })
  })

  describe('单例模式', () => {
    it('应该返回相同的单例实例', () => {
      const instance1 = appointmentManager
      const instance2 = appointmentManager

      expect(instance1).toBe(instance2)
    })

    it('单例实例应该具有完整的功能', async () => {
      const params: AppointmentQueryParams = {}
      const result = await appointmentManager.getPatientAppointments(params)

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('性能测试', () => {
    it('应该在大数据量下保持良好性能', async () => {
      const startTime = performance.now()
      
      const params: AppointmentQueryParams = {
        page: 1,
        pageSize: 100
      }
      
      await manager.getPatientAppointments(params)
      
      const endTime = performance.now()
      const executionTime = endTime - startTime
      
      // 期望响应时间小于100ms
      expect(executionTime).toBeLessThan(100)
    })

    it('应该支持并发查询', async () => {
      const promises = Array(5).fill(null).map(() => 
        manager.getPatientAppointments({})
      )
      
      const results = await Promise.all(promises)
      
      expect(results).toHaveLength(5)
      results.forEach(result => {
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('total')
      })
    })
  })

  describe('边界条件测试', () => {
    it('应该处理无效的页码', async () => {
      const params: AppointmentQueryParams = {
        page: -1,
        pageSize: 10
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.page).toBe(1) // 应该自动修正为有效值
      expect(result.data.length).toBeGreaterThanOrEqual(0)
    })

    it('应该处理超大的页面大小', async () => {
      const params: AppointmentQueryParams = {
        page: 1,
        pageSize: 1000
      }

      const result = await manager.getPatientAppointments(params)

      expect(result.data.length).toBeLessThanOrEqual(1000)
    })

    it('应该处理空的关键词搜索', async () => {
      const keyword = ''
      const params: AppointmentQueryParams = {}

      const result = await manager.searchAppointments(keyword, params)

      expect(result.data.length).toBeGreaterThanOrEqual(0)
    })
  })
})