import { ConflictDetector } from '../../src/utils/conflict-detector';
import { Appointment, Schedule } from '../../src/types';

// Mock数据
const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    patientId: 'patient-001',
    patientName: '张三',
    doctorId: 'doctor-001',
    doctorName: '李医生',
    department: '内科',
    startTime: '2026-04-22T09:00:00',
    endTime: '2026-04-22T09:30:00',
    date: '2026-04-22',
    status: 'confirmed',
    symptoms: '头痛、发热',
    notes: '无特殊要求'
  },
  {
    id: 'appt-002',
    patientId: 'patient-001',
    patientName: '张三',
    doctorId: 'doctor-002',
    doctorName: '王医生',
    department: '外科',
    startTime: '2026-04-22T10:00:00',
    endTime: '2026-04-22T10:30:00',
    date: '2026-04-22',
    status: 'confirmed',
    symptoms: '手臂疼痛',
    notes: '需要拍X光片'
  },
  {
    id: 'appt-003',
    patientId: 'patient-002',
    patientName: '李四',
    doctorId: 'doctor-001',
    doctorName: '李医生',
    department: '内科',
    startTime: '2026-04-22T09:30:00',
    endTime: '2026-04-22T10:00:00',
    date: '2026-04-22',
    status: 'confirmed',
    symptoms: '咳嗽',
    notes: '无'
  }
];

const mockSchedules: Schedule[] = [
  {
    id: 'schedule-001',
    doctorId: 'doctor-001',
    doctorName: '李医生',
    date: '2026-04-22',
    timeSlots: [
      { startTime: '08:00', endTime: '12:00', available: true }
    ],
    status: 'active' as const
  },
  {
    id: 'schedule-002',
    doctorId: 'doctor-002',
    doctorName: '王医生',
    date: '2026-04-22',
    timeSlots: [
      { startTime: '09:00', endTime: '17:00', available: true }
    ],
    status: 'active' as const
  }
];

// 模拟数据导入
jest.mock('../../src/data/appointments.json', () => ({
  appointments: mockAppointments,
  schedules: mockSchedules
}));

describe('ConflictDetector', () => {
  let conflictDetector: ConflictDetector;

  beforeEach(() => {
    conflictDetector = new ConflictDetector();
  });

  describe('患者冲突检测', () => {
    test('检测到患者时间冲突', () => {
      const result = conflictDetector.checkPatientConflict(
        'patient-001',
        new Date('2026-04-22T09:15:00'),
        new Date('2026-04-22T09:45:00')
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflicts.length).toBe(1);
      expect(result.conflicts[0].appointmentId).toBe('appt-001');
      expect(result.message).toContain('已有 1 个预约');
    });

    test('患者无时间冲突', () => {
      const result = conflictDetector.checkPatientConflict(
        'patient-001',
        new Date('2026-04-22T11:00:00'),
        new Date('2026-04-22T11:30:00')
      );

      expect(result.hasConflict).toBe(false);
      expect(result.conflicts.length).toBe(0);
    });

    test('排除指定预约ID的冲突检测', () => {
      const result = conflictDetector.checkPatientConflict(
        'patient-001',
        new Date('2026-04-22T09:15:00'),
        new Date('2026-04-22T09:45:00'),
        'appt-001'
      );

      expect(result.hasConflict).toBe(false);
    });

    test('忽略已取消的预约', () => {
      // 添加一个已取消的预约
      const cancelledAppointment: Appointment = {
        ...mockAppointments[0],
        id: 'appt-cancelled',
        status: 'cancelled'
      };
      
      const result = conflictDetector.checkPatientConflict(
        'patient-001',
        new Date('2026-04-22T09:15:00'),
        new Date('2026-04-22T09:45:00')
      );

      // 应该只检测有效预约，不包含已取消的
      expect(result.conflicts.length).toBe(1);
    });
  });

  describe('医生冲突检测', () => {
    test('检测到医生时间冲突', () => {
      const result = conflictDetector.checkDoctorConflict(
        'doctor-001',
        new Date('2026-04-22T09:15:00'),
        new Date('2026-04-22T09:45:00')
      );

      expect(result.hasConflict).toBe(true);
      expect(result.conflicts.length).toBe(1);
      expect(result.conflicts[0].appointmentId).toBe('appt-003');
    });

    test('医生无时间冲突', () => {
      const result = conflictDetector.checkDoctorConflict(
        'doctor-001',
        new Date('2026-04-22T11:00:00'),
        new Date('2026-04-22T11:30:00')
      );

      expect(result.hasConflict).toBe(false);
    });

    test('医生无排班时的冲突检测', () => {
      const result = conflictDetector.checkDoctorConflict(
        'doctor-003', // 不存在的医生
        new Date('2026-04-22T09:00:00'),
        new Date('2026-04-22T09:30:00')
      );

      expect(result.hasConflict).toBe(true);
      expect(result.message).toContain('医生当天无排班');
    });

    test('时间段不在排班范围内的冲突检测', () => {
      const result = conflictDetector.checkDoctorConflict(
        'doctor-001',
        new Date('2026-04-22T07:00:00'), // 早于排班时间
        new Date('2026-04-22T07:30:00')
      );

      expect(result.hasConflict).toBe(true);
      expect(result.message).toContain('不在医生排班范围内');
    });
  });

  describe('时间段重叠检测', () => {
    test('检测时间段重叠', () => {
      const start1 = new Date('2026-04-22T09:00:00');
      const end1 = new Date('2026-04-22T10:00:00');
      const start2 = new Date('2026-04-22T09:30:00');
      const end2 = new Date('2026-04-22T10:30:00');

      const isOverlap = conflictDetector.isTimeOverlap(start1, end1, start2, end2);
      expect(isOverlap).toBe(true);
    });

    test('时间段不重叠', () => {
      const start1 = new Date('2026-04-22T09:00:00');
      const end1 = new Date('2026-04-22T09:30:00');
      const start2 = new Date('2026-04-22T10:00:00');
      const end2 = new Date('2026-04-22T10:30:00');

      const isOverlap = conflictDetector.isTimeOverlap(start1, end1, start2, end2);
      expect(isOverlap).toBe(false);
    });

    test('边界条件：刚好相邻的时间段', () => {
      const start1 = new Date('2026-04-22T09:00:00');
      const end1 = new Date('2026-04-22T09:30:00');
      const start2 = new Date('2026-04-22T09:30:00');
      const end2 = new Date('2026-04-22T10:00:00');

      const isOverlap = conflictDetector.isTimeOverlap(start1, end1, start2, end2);
      expect(isOverlap).toBe(false); // 正好相邻，不重叠
    });
  });

  describe('综合冲突检测', () => {
    test('检测所有冲突类型', () => {
      const result = conflictDetector.checkAllConflicts(
        'patient-001',
        'doctor-001',
        new Date('2026-04-22T09:15:00'),
        new Date('2026-04-22T09:45:00')
      );

      expect(result.hasAnyConflict).toBe(true);
      expect(result.patientConflict.hasConflict).toBe(true);
      expect(result.doctorConflict.hasConflict).toBe(true);
      expect(result.allConflicts.length).toBe(2);
    });

    test('无任何冲突', () => {
      const result = conflictDetector.checkAllConflicts(
        'patient-001',
        'doctor-001',
        new Date('2026-04-22T11:00:00'),
        new Date('2026-04-22T11:30:00')
      );

      expect(result.hasAnyConflict).toBe(false);
      expect(result.patientConflict.hasConflict).toBe(false);
      expect(result.doctorConflict.hasConflict).toBe(false);
    });
  });

  describe('可用时间段推荐', () => {
    test('推荐可用的时间段', () => {
      const slots = conflictDetector.suggestAlternativeSlots(
        'doctor-001',
        new Date('2026-04-22'),
        30
      );

      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty('startTime');
      expect(slots[0]).toHaveProperty('endTime');
      expect(slots[0].available).toBe(true);
    });

    test('医生无排班时返回空数组', () => {
      const slots = conflictDetector.suggestAlternativeSlots(
        'doctor-003', // 不存在的医生
        new Date('2026-04-22'),
        30
      );

      expect(slots.length).toBe(0);
    });
  });

  describe('预约时长验证', () => {
    test('验证有效的预约时长', () => {
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 30)).toBe(true);
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 60)).toBe(true);
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 90)).toBe(true);
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 120)).toBe(true);
    });

    test('验证无效的预约时长', () => {
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 15)).toBe(false);
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 45)).toBe(false);
      expect(conflictDetector.validateAppointmentDuration('doctor-001', 180)).toBe(false);
    });
  });

  describe('节假日和工作时间检测', () => {
    test('检测节假日', () => {
      const holiday = new Date('2026-01-01'); // 元旦
      expect(conflictDetector.isHoliday(holiday)).toBe(true);

      const normalDay = new Date('2026-04-22'); // 普通工作日
      expect(conflictDetector.isHoliday(normalDay)).toBe(false);
    });

    test('检测工作时间', () => {
      const workingTime = new Date('2026-04-22T10:00:00'); // 周四 10:00
      expect(conflictDetector.isWorkingHours(workingTime)).toBe(true);

      const nonWorkingTime = new Date('2026-04-22T18:00:00'); // 周四 18:00
      expect(conflictDetector.isWorkingHours(nonWorkingTime)).toBe(false);

      const weekend = new Date('2026-04-24T10:00:00'); // 周六 10:00
      expect(conflictDetector.isWorkingHours(weekend)).toBe(true);

      const sunday = new Date('2026-04-25T10:00:00'); // 周日 10:00
      expect(conflictDetector.isWorkingHours(sunday)).toBe(false);
    });
  });

  describe('性能测试', () => {
    test('冲突检测响应时间小于100ms', () => {
      const startTime = performance.now();
      
      // 执行100次冲突检测
      for (let i = 0; i < 100; i++) {
        conflictDetector.checkPatientConflict(
          'patient-001',
          new Date('2026-04-22T09:15:00'),
          new Date('2026-04-22T09:45:00')
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 平均每次检测时间应小于100ms
      expect(duration / 100).toBeLessThan(100);
    });
  });

  describe('边界条件测试', () => {
    test('空数据集的冲突检测', () => {
      // 模拟空数据集
      jest.doMock('../../src/data/appointments.json', () => ({
        appointments: [],
        schedules: []
      }));

      const emptyDetector = new ConflictDetector();
      const result = emptyDetector.checkPatientConflict(
        'patient-001',
        new Date('2026-04-22T09:00:00'),
        new Date('2026-04-22T09:30:00')
      );

      expect(result.hasConflict).toBe(false);
      expect(result.conflicts.length).toBe(0);
    });

    test('无效日期输入处理', () => {
      expect(() => {
        conflictDetector.checkPatientConflict(
          'patient-001',
          new Date('invalid-date'),
          new Date('2026-04-22T09:30:00')
        );
      }).toThrow();
    });
  });
});

describe('错误处理', () => {
  let conflictDetector: ConflictDetector;

  beforeEach(() => {
    conflictDetector = new ConflictDetector();
  });

  test('处理患者不存在的情况', () => {
    const result = conflictDetector.checkPatientConflict(
      'non-existent-patient',
      new Date('2026-04-22T09:00:00'),
      new Date('2026-04-22T09:30:00')
    );

    expect(result.hasConflict).toBe(false);
  });

  test('处理医生不存在的情况', () => {
    const result = conflictDetector.checkDoctorConflict(
      'non-existent-doctor',
      new Date('2026-04-22T09:00:00'),
      new Date('2026-04-22T09:30:00')
    );

    expect(result.hasConflict).toBe(true);
    expect(result.message).toContain('医生当天无排班');
  });
});