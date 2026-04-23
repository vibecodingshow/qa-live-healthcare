package com.leansofx.qaservicequestion.service;

import com.leansofx.qaservicequestion.dto.ScheduleSlotDTO;
import com.leansofx.qaservicequestion.entity.Schedule;
import com.leansofx.qaservicequestion.enums.ScheduleStatus;
import com.leansofx.qaservicequestion.enums.TimePeriod;
import com.leansofx.qaservicequestion.repository.ScheduleRepository;
import com.leansofx.qaservicequestion.repository.ScheduleSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * ScheduleService单元测试
 */
@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private ScheduleSlotRepository scheduleSlotRepository;

    @InjectMocks
    private ScheduleService scheduleService;

    private Schedule schedule1, schedule2;

    @BeforeEach
    void setUp() {
        // 创建测试数据
        schedule1 = new Schedule();
        schedule1.setId(1L);
        schedule1.setDoctorId(1L);
        schedule1.setScheduleDate(LocalDate.now().plusDays(1));
        schedule1.setTimePeriod(TimePeriod.MORNING);
        schedule1.setTotalSlots(20);
        schedule1.setRemainingSlots(15);
        schedule1.setStatus(ScheduleStatus.AVAILABLE);

        schedule2 = new Schedule();
        schedule2.setId(2L);
        schedule2.setDoctorId(1L);
        schedule2.setScheduleDate(LocalDate.now().plusDays(1));
        schedule2.setTimePeriod(TimePeriod.AFTERNOON);
        schedule2.setTotalSlots(15);
        schedule2.setRemainingSlots(3);
        schedule2.setStatus(ScheduleStatus.LIMITED);
    }

    @Test
    void getSlotsByDoctorId_ShouldReturnSlots_WhenValidParameters() {
        // Arrange
        Long doctorId = 1L;
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(7);
        
        List<Schedule> schedules = Arrays.asList(schedule1, schedule2);
        when(scheduleRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate))
                .thenReturn(schedules);
        when(scheduleSlotRepository.findByScheduleIdOrderByStartTime(anyLong())).thenReturn(List.of());

        // Act
        List<ScheduleSlotDTO> result = scheduleService.getSlotsByDoctorId(doctorId, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(doctorId, result.get(0).getDoctorId());
    }

    @Test
    void getSlotsByDepartmentId_ShouldReturnSlots_WhenValidParameters() {
        // Arrange
        Long departmentId = 1L;
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(7);
        
        List<Schedule> schedules = Arrays.asList(schedule1, schedule2);
        when(scheduleRepository.findByDepartmentIdAndDateRange(departmentId, startDate, endDate))
                .thenReturn(schedules);
        when(scheduleSlotRepository.findByScheduleIdOrderByStartTime(anyLong())).thenReturn(List.of());

        // Act
        List<ScheduleSlotDTO> result = scheduleService.getSlotsByDepartmentId(departmentId, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getUpcomingSchedules_ShouldReturnSchedules_WhenValidParameters() {
        // Arrange
        Long doctorId = 1L;
        int days = 7;
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        
        List<Schedule> schedules = Arrays.asList(schedule1, schedule2);
        when(scheduleRepository.findUpcomingSchedules(doctorId, today, endDate))
                .thenReturn(schedules);
        when(scheduleSlotRepository.findByScheduleIdOrderByStartTime(anyLong())).thenReturn(List.of());

        // Act
        List<ScheduleSlotDTO> result = scheduleService.getUpcomingSchedules(doctorId, days);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void testScheduleStatusCalculation() {
        // 测试号源状态计算逻辑
        Schedule schedule = new Schedule();
        
        // 测试可预约状态
        schedule.setRemainingSlots(10);
        schedule.updateStatus();
        assertEquals(ScheduleStatus.AVAILABLE, schedule.getStatus());
        
        // 测试号源紧张状态
        schedule.setRemainingSlots(3);
        schedule.updateStatus();
        assertEquals(ScheduleStatus.LIMITED, schedule.getStatus());
        
        // 测试已满状态
        schedule.setRemainingSlots(0);
        schedule.updateStatus();
        assertEquals(ScheduleStatus.FULL, schedule.getStatus());
    }
}