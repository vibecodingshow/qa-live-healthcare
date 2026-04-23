package com.leansofx.qaservicequestion.controller;

import com.leansofx.qaservicequestion.dto.AppointmentSubmitRequest;
import com.leansofx.qaservicequestion.dto.AppointmentSubmitResponse;
import com.leansofx.qaservicequestion.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 预约提交控制器
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Slf4j
@Validated
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    /**
     * 提交预约
     */
    @PostMapping("/submit")
    public ResponseEntity<AppointmentSubmitResponse> submitAppointment(
            @Valid @RequestBody AppointmentSubmitRequest request) {
        log.info("预约提交请求: slotId={}, patientName={}, visitType={}", 
                request.getTimeSlotId(), request.getPatientName(), request.getVisitType());
        
        try {
            // 提交预约，包含号源锁定和预约创建
            AppointmentSubmitResponse response = appointmentService.submitAppointment(request);
            
            log.info("预约提交成功: appointmentId={}, status={}", 
                    response.getAppointmentId(), response.getStatus());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("预约提交失败: slotId={}", request.getTimeSlotId(), e);
            
            AppointmentSubmitResponse errorResponse = new AppointmentSubmitResponse();
            errorResponse.setSuccess(false);
            
            if (e.getMessage().contains("号源已被锁定")) {
                errorResponse.setErrorMessage("该时段号源已被预约，请选择其他时段");
                return ResponseEntity.badRequest().body(errorResponse);
            } else if (e.getMessage().contains("号源已满")) {
                errorResponse.setErrorMessage("该时段号源已满，请选择其他时段");
                return ResponseEntity.badRequest().body(errorResponse);
            } else if (e.getMessage().contains("重复预约")) {
                errorResponse.setErrorMessage("您已预约该时段的号源，请勿重复预约");
                return ResponseEntity.badRequest().body(errorResponse);
            } else {
                errorResponse.setErrorMessage("系统繁忙，请稍后重试");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
        }
    }
    
    /**
     * 获取预约详情
     */
    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentSubmitResponse> getAppointmentDetail(
            @PathVariable String appointmentId) {
        log.info("查询预约详情: appointmentId={}", appointmentId);
        
        try {
            AppointmentSubmitResponse response = appointmentService.getAppointmentDetail(appointmentId);
            
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("查询预约详情失败: appointmentId={}", appointmentId, e);
            
            AppointmentSubmitResponse errorResponse = new AppointmentSubmitResponse();
            errorResponse.setSuccess(false);
            errorResponse.setErrorMessage("查询预约详情失败");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 取消预约
     */
    @PostMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentSubmitResponse> cancelAppointment(
            @PathVariable String appointmentId,
            @RequestParam(required = false) String reason) {
        log.info("取消预约: appointmentId={}, reason={}", appointmentId, reason);
        
        try {
            AppointmentSubmitResponse response = appointmentService.cancelAppointment(appointmentId, reason);
            
            if (response.isSuccess()) {
                log.info("预约取消成功: appointmentId={}", appointmentId);
                return ResponseEntity.ok(response);
            } else {
                log.warn("预约取消失败: appointmentId={}", appointmentId);
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("取消预约异常: appointmentId={}", appointmentId, e);
            
            AppointmentSubmitResponse errorResponse = new AppointmentSubmitResponse();
            errorResponse.setSuccess(false);
            errorResponse.setErrorMessage("取消预约失败");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}