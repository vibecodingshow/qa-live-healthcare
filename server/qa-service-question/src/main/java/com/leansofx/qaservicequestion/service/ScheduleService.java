package com.leansofx.qaservicequestion.service;

import com.leansofx.qaservicequestion.dto.ScheduleSlotDTO;
import com.leansofx.qaservicequestion.entity.Schedule;
import com.leansofx.qaservicequestion.entity.ScheduleSlot;
import com.leansofx.qaservicequestion.enums.ScheduleStatus;
import com.leansofx.qaservicequestion.repository.ScheduleRepository;
import com.leansofx.qaservicequestion.repository.ScheduleSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 排班服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    
    /**
     * 根据医生ID查询号源列表
     */
    @Cacheable(value = "scheduleSlots", key = "#doctorId + ':' + #startDate + ':' + #endDate")
    public List<ScheduleSlotDTO> getSlotsByDoctorId(Long doctorId, LocalDate startDate, LocalDate endDate) {
        log.info("查询医生{}在{}到{}期间的号源", doctorId, startDate, endDate);
        
        List<Schedule> schedules = scheduleRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return convertToDTOs(schedules);
    }
    
    /**
     * 根据科室ID查询号源列表
     */
    @Cacheable(value = "scheduleSlots", key = "'dept:' + #departmentId + ':' + #startDate + ':' + #endDate")
    public List<ScheduleSlotDTO> getSlotsByDepartmentId(Long departmentId, LocalDate startDate, LocalDate endDate) {
        log.info("查询科室{}在{}到{}期间的号源", departmentId, startDate, endDate);
        
        List<Schedule> schedules = scheduleRepository.findByDepartmentIdAndDateRange(departmentId, startDate, endDate);
        return convertToDTOs(schedules);
    }
    
    /**
     * 查询指定日期范围内的可用号源
     */
    @Cacheable(value = "availableSchedules", key = "#startDate + ':' + #endDate + ':' + #pageable.pageNumber")
    public Page<ScheduleSlotDTO> getAvailableSchedules(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.info("查询{}到{}期间的可用号源", startDate, endDate);
        
        List<ScheduleStatus> availableStatuses = List.of(ScheduleStatus.AVAILABLE, ScheduleStatus.LIMITED);
        Page<Schedule> schedules = scheduleRepository.findAvailableSchedulesByDateRange(
            startDate, endDate, availableStatuses, pageable);
        
        return schedules.map(this::convertToDTO);
    }
    
    /**
     * 查询医生未来N天的排班
     */
    @Cacheable(value = "upcomingSchedules", key = "#doctorId + ':' + #days")
    public List<ScheduleSlotDTO> getUpcomingSchedules(Long doctorId, int days) {
        log.info("查询医生{}未来{}天的排班", doctorId, days);
        
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        
        List<Schedule> schedules = scheduleRepository.findUpcomingSchedules(doctorId, today, endDate);
        return convertToDTOs(schedules);
    }
    
    /**
     * 刷新号源缓存
     */
    @CacheEvict(value = {"scheduleSlots", "availableSchedules", "upcomingSchedules"}, allEntries = true)
    public void refreshCache() {
        log.info("刷新号源缓存");
    }
    
    /**
     * 将Schedule实体列表转换为DTO列表
     */
    private List<ScheduleSlotDTO> convertToDTOs(List<Schedule> schedules) {
        return schedules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 将Schedule实体转换为DTO
     */
    private ScheduleSlotDTO convertToDTO(Schedule schedule) {
        ScheduleSlotDTO dto = new ScheduleSlotDTO();
        dto.setScheduleId(schedule.getId());
        dto.setDoctorId(schedule.getDoctorId());
        dto.setScheduleDate(schedule.getScheduleDate());
        dto.setTimePeriod(schedule.getTimePeriod());
        dto.setTotalSlots(schedule.getTotalSlots());
        dto.setRemainingSlots(schedule.getRemainingSlots());
        dto.setStatus(schedule.getStatus());
        
        // 查询号源明细
        List<ScheduleSlot> slots = scheduleSlotRepository.findByScheduleIdOrderByStartTime(schedule.getId());
        dto.setSlotDetails(convertSlotDetails(slots));
        
        return dto;
    }
    
    /**
     * 将ScheduleSlot实体列表转换为DTO列表
     */
    private List<ScheduleSlotDTO.SlotDetailDTO> convertSlotDetails(List<ScheduleSlot> slots) {
        return slots.stream().map(slot -> {
            ScheduleSlotDTO.SlotDetailDTO detail = new ScheduleSlotDTO.SlotDetailDTO();
            detail.setSlotId(slot.getId());
            detail.setStartTime(slot.getStartTime());
            detail.setEndTime(slot.getEndTime());
            detail.setSlotStatus(slot.getSlotStatus());
            detail.setIsLocked(slot.getIsLocked());
            detail.setLockedUntil(slot.getLockedUntil() != null ? slot.getLockedUntil().toString() : null);
            detail.setAvailable(slot.isAvailable());
            return detail;
        }).collect(Collectors.toList());
    }
}