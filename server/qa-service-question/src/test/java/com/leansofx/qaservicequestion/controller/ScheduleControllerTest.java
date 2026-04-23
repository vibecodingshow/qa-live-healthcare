package com.leansofx.qaservicequestion.controller;

import com.leansofx.qaservicequestion.dto.ScheduleSlotDTO;
import com.leansofx.qaservicequestion.service.ScheduleService;
import com.leansofx.qaservicequestion.service.SlotService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ScheduleController单元测试
 */
@WebMvcTest(ScheduleController.class)
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScheduleService scheduleService;

    @MockBean
    private SlotService slotService;

    @Test
    void getSlotsByDoctorId_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // Arrange
        Long doctorId = 1L;
        ScheduleSlotDTO slotDTO = createTestSlotDTO();
        List<ScheduleSlotDTO> slots = Arrays.asList(slotDTO);
        
        when(scheduleService.getSlotsByDoctorId(eq(doctorId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(slots);

        // Act & Assert
        mockMvc.perform(get("/api/schedule/doctor/{doctorId}/slots", doctorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].doctorId").value(doctorId));
    }

    @Test
    void getSlotsByDepartmentId_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // Arrange
        Long departmentId = 1L;
        ScheduleSlotDTO slotDTO = createTestSlotDTO();
        List<ScheduleSlotDTO> slots = Arrays.asList(slotDTO);
        
        when(scheduleService.getSlotsByDepartmentId(eq(departmentId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(slots);

        // Act & Assert
        mockMvc.perform(get("/api/schedule/department/{departmentId}/slots", departmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].departmentId").value(departmentId));
    }

    @Test
    void getAvailableSlots_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // Arrange
        ScheduleSlotDTO slotDTO = createTestSlotDTO();
        List<ScheduleSlotDTO> slots = Arrays.asList(slotDTO);
        Page<ScheduleSlotDTO> page = new PageImpl<>(slots, PageRequest.of(0, 20), slots.size());
        
        when(scheduleService.getAvailableSchedules(any(LocalDate.class), any(LocalDate.class), any()))
                .thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/schedule/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void getUpcomingSchedules_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // Arrange
        Long doctorId = 1L;
        ScheduleSlotDTO slotDTO = createTestSlotDTO();
        List<ScheduleSlotDTO> slots = Arrays.asList(slotDTO);
        
        when(scheduleService.getUpcomingSchedules(eq(doctorId), anyInt()))
                .thenReturn(slots);

        // Act & Assert
        mockMvc.perform(get("/api/schedule/doctor/{doctorId}/upcoming", doctorId)
                        .param("days", "7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].doctorId").value(doctorId));
    }

    @Test
    void getSlotsByDoctorId_ShouldReturnBadRequest_WhenInvalidDateRange() throws Exception {
        // Arrange
        Long doctorId = 1L;
        
        // Act & Assert
        mockMvc.perform(get("/api/schedule/doctor/{doctorId}/slots", doctorId)
                        .param("startDate", "2024-01-02")
                        .param("endDate", "2024-01-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void getUpcomingSchedules_ShouldReturnBadRequest_WhenInvalidDays() throws Exception {
        // Arrange
        Long doctorId = 1L;
        
        // Act & Assert
        mockMvc.perform(get("/api/schedule/doctor/{doctorId}/upcoming", doctorId)
                        .param("days", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    private ScheduleSlotDTO createTestSlotDTO() {
        ScheduleSlotDTO dto = new ScheduleSlotDTO();
        dto.setScheduleId(1L);
        dto.setDoctorId(1L);
        dto.setDoctorName("张医生");
        dto.setDepartmentId(1L);
        dto.setDepartmentName("内科");
        dto.setScheduleDate(LocalDate.now().plusDays(1));
        dto.setTotalSlots(20);
        dto.setRemainingSlots(15);
        return dto;
    }
}