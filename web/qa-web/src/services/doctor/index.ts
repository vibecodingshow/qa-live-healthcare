import { DoctorDetailResponse, DoctorScheduleCalendarResponse, DoctorScheduleCalendarParams } from './types'

/**
 * 获取医生详情
 */
export async function getDoctorDetail(doctorId: string): Promise<DoctorDetailResponse> {
  // 模拟API调用，实际项目中替换为真实的API接口
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        doctor: {
          id: doctorId,
          name: '张医生',
          avatar: '/assets/doctor-avatar.jpg',
          title: '主任医师',
          department: '心血管内科',
          hospital: '北京协和医院',
          experience: '从业20年',
          specialties: ['高血压', '冠心病', '心律失常'],
          introduction: '毕业于北京大学医学部，长期从事心血管疾病临床工作，擅长高血压、冠心病、心律失常等疾病的诊断和治疗。',
          isActive: true
        },
        schedules: [
          {
            id: '1',
            doctorId: doctorId,
            scheduleDate: '2026-04-23',
            timeSlots: [
              { id: '1', startTime: '09:00', endTime: '10:00', total: 10, remaining: 5, status: 'available' },
              { id: '2', startTime: '10:00', endTime: '11:00', total: 10, remaining: 2, status: 'low_stock' },
              { id: '3', startTime: '14:00', endTime: '15:00', total: 10, remaining: 0, status: 'full' }
            ],
            status: 'available'
          },
          {
            id: '2',
            doctorId: doctorId,
            scheduleDate: '2026-04-24',
            timeSlots: [
              { id: '4', startTime: '09:00', endTime: '10:00', total: 10, remaining: 8, status: 'available' },
              { id: '5', startTime: '10:00', endTime: '11:00', total: 10, remaining: 10, status: 'available' }
            ],
            status: 'available'
          }
        ]
      })
    }, 500)
  })
}

/**
 * 获取医生排班日历
 */
export async function getDoctorScheduleCalendar(
  params: DoctorScheduleCalendarParams
): Promise<DoctorScheduleCalendarResponse[]> {
  // 模拟API调用，返回指定月份的排班日历
  return new Promise((resolve) => {
    setTimeout(() => {
      const { year, month } = params
      const daysInMonth = new Date(year, month, 0).getDate()
      const calendar: DoctorScheduleCalendarResponse[] = []
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        const isWeekend = new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6
        
        // 模拟排班数据
        const available = !isWeekend && day % 3 !== 0 // 非周末且不是每3天休息一天
        const totalSlots = available ? 30 : 0
        const remainingSlots = available ? Math.max(0, totalSlots - (day % 10) * 3) : 0
        
        let status: any = 'suspended'
        if (available) {
          if (remainingSlots === 0) status = 'full'
          else if (remainingSlots <= 5) status = 'low_stock'
          else status = 'available'
        }
        
        calendar.push({
          date,
          available,
          totalSlots,
          remainingSlots,
          status
        })
      }
      
      resolve(calendar)
    }, 300)
  })
}