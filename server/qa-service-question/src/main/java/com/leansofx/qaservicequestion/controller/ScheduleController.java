package com.leansofx.qaservicequestion.controller;

import com.leansofx.qaservicequestion.dto.ScheduleSlotDTO;
import com.leansofx.qaservicequestion.service.ScheduleService;
import com.leansofx.qaservicequestion.service.SlotService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班API控制器
 */
@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    private final SlotService slotService;
    
    /**
     * 根据医生ID查询号源列表
     */
    @GetMapping("/doctor/{doctorId}/slots")
    public ResponseEntity<ApiResponse<List<ScheduleSlotDTO>>> getSlotsByDoctorId(
            @PathVariable Long doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            // 设置默认日期范围（未来7天）
            if (startDate == null) {
                startDate = LocalDate.now();
            }
            if (endDate == null) {
                endDate = startDate.plusDays(7);
            }
            
            // 验证日期范围
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(400, "开始日期不能晚于结束日期"));
            }
            
            List<ScheduleSlotDTO> slots = scheduleService.getSlotsByDoctorId(doctorId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(slots));
            
        } catch (Exception e) {
            log.error("查询医生{}号源失败：{}", doctorId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "查询号源失败：" + e.getMessage()));
        }
    }
    
    /**
     * 根据科室ID查询号源列表
     */
    @GetMapping("/department/{departmentId}/slots")
    public ResponseEntity<ApiResponse<List<ScheduleSlotDTO>>> getSlotsByDepartmentId(
            @PathVariable Long departmentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            // 设置默认日期范围（未来7天）
            if (startDate == null) {
                startDate = LocalDate.now();
            }
            if (endDate == null) {
                endDate = startDate.plusDays(7);
            }
            
            // 验证日期范围
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(400, "开始日期不能晚于结束日期"));
            }
            
            List<ScheduleSlotDTO> slots = scheduleService.getSlotsByDepartmentId(departmentId, startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(slots));
            
        } catch (Exception e) {
            log.error("查询科室{}号源失败：{}", departmentId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "查询号源失败：" + e.getMessage()));
        }
    }
    
    /**
     * 查询可用号源列表（分页）
     */
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<Page<ScheduleSlotDTO>>> getAvailableSlots(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            // 设置默认日期范围（未来7天）
            if (startDate == null) {
                startDate = LocalDate.now();
            }
            if (endDate == null) {
                endDate = startDate.plusDays(7);
            }
            
            // 验证日期范围
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(400, "开始日期不能晚于结束日期"));
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ScheduleSlotDTO> slots = scheduleService.getAvailableSchedules(startDate, endDate, pageable);
            return ResponseEntity.ok(ApiResponse.success(slots));
            
        } catch (Exception e) {
            log.error("查询可用号源失败：{}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "查询可用号源失败：" + e.getMessage()));
        }
    }
    
    /**
     * 查询医生未来N天的排班
     */
    @GetMapping("/doctor/{doctorId}/upcoming")
    public ResponseEntity<ApiResponse<List<ScheduleSlotDTO>>> getUpcomingSchedules(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "7") int days) {
        
        try {
            // 验证天数范围
            if (days <= 0 || days > 30) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(400, "天数范围应为1-30"));
            }
            
            List<ScheduleSlotDTO> schedules = scheduleService.getUpcomingSchedules(doctorId, days);
            return ResponseEntity.ok(ApiResponse.success(schedules));
            
        } catch (Exception e) {
            log.error("查询医生{}未来排班失败：{}", doctorId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "查询排班失败：" + e.getMessage()));
        }
    }
    
    /**
     * 刷新号源缓存
     */
    @PostMapping("/cache/refresh")
    public ResponseEntity<ApiResponse<String>> refreshCache() {
        try {
            scheduleService.refreshCache();
            return ResponseEntity.ok(ApiResponse.success("缓存刷新成功"));
            
        } catch (Exception e) {
            log.error("刷新缓存失败：{}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "刷新缓存失败：" + e.getMessage()));
        }
    }
    
    /**
     * 统一API响应格式
     */
    @Data
    public static class ApiResponse<T> {
        private int code;
        private String message;
        private T data;
        
        public static <T> ApiResponse<T> success(T data) {
            ApiResponse<T> response = new ApiResponse<>();
            response.code = 200;
            response.message = "成功";
            response.data = data;
            return response;
        }
        
        public static <T> ApiResponse<T> error(int code, String message) {
            ApiResponse<T> response = new ApiResponse<>();
            response.code = code;
            response.message = message;
            return response;
        }
    }
}