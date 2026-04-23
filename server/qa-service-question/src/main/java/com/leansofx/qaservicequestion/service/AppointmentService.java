package com.leansofx.qaservicequestion.service;

import com.leansofx.qaservicequestion.dto.AppointmentSubmitRequest;
import com.leansofx.qaservicequestion.dto.AppointmentSubmitResponse;
import com.leansofx.qaservicequestion.entity.Appointment;
import com.leansofx.qaservicequestion.entity.ScheduleSlot;
import com.leansofx.qaservicequestion.enums.AppointmentStatus;
import com.leansofx.qaservicequestion.repository.AppointmentRepository;
import com.leansofx.qaservicequestion.repository.ScheduleSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 预约服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final SlotLockService slotLockService;
    private final PaymentService paymentService;
    
    /**
     * 提交预约
     * 包含号源锁定、预约创建、支付流程等完整逻辑
     */
    @Transactional
    public AppointmentSubmitResponse submitAppointment(AppointmentSubmitRequest request) {
        log.info("开始处理预约提交: slotId={}, patientName={}", request.getTimeSlotId(), request.getPatientName());
        
        // 1. 验证号源状态
        ScheduleSlot slot = validateSlotAvailability(request.getTimeSlotId());
        
        // 2. 尝试获取号源锁
        String lockToken = acquireSlotLock(request.getTimeSlotId(), request.getLockToken());
        
        try {
            // 3. 检查重复预约
            checkDuplicateAppointment(request.getPatientIdCard(), request.getTimeSlotId());
            
            // 4. 创建预约记录
            Appointment appointment = createAppointment(request, slot);
            
            // 5. 扣减号源余量
            updateSlotRemaining(slot);
            
            // 6. 生成支付信息（如果需要）
            AppointmentSubmitResponse response = generatePaymentInfo(appointment);
            
            log.info("预约提交完成: appointmentId={}, status={}", appointment.getId(), response.getStatus());
            return response;
            
        } finally {
            // 释放号源锁
            if (request.getLockToken() == null) {
                slotLockService.unlockSlot(request.getTimeSlotId(), lockToken);
            }
        }
    }
    
    /**
     * 验证号源可用性
     */
    private ScheduleSlot validateSlotAvailability(Long slotId) {
        ScheduleSlot slot = scheduleSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("号源不存在"));
        
        if (!slot.isAvailable()) {
            throw new RuntimeException("号源不可用");
        }
        
        if (slot.getIsLocked() && slot.getLockedUntil() != null 
                && slot.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("号源已被锁定");
        }
        
        return slot;
    }
    
    /**
     * 获取号源锁
     */
    private String acquireSlotLock(Long slotId, String existingLockToken) {
        if (existingLockToken != null) {
            // 验证现有锁是否有效
            boolean isValid = slotLockService.isLockValid(slotId, existingLockToken);
            if (!isValid) {
                throw new RuntimeException("号源锁定已失效");
            }
            return existingLockToken;
        } else {
            // 获取新的锁
            String lockToken = slotLockService.tryLockSlot(slotId, 5 * 60 * 1000); // 5分钟锁定
            if (lockToken == null) {
                throw new RuntimeException("号源已被锁定，请稍后重试");
            }
            return lockToken;
        }
    }
    
    /**
     * 检查重复预约
     */
    private void checkDuplicateAppointment(String patientIdCard, Long slotId) {
        boolean exists = appointmentRepository.existsByPatientIdCardAndSlotIdAndStatusNot(
                patientIdCard, slotId, AppointmentStatus.CANCELLED);
        
        if (exists) {
            throw new RuntimeException("重复预约，您已预约该时段的号源");
        }
    }
    
    /**
     * 创建预约记录
     */
    private Appointment createAppointment(AppointmentSubmitRequest request, ScheduleSlot slot) {
        Appointment appointment = new Appointment();
        appointment.setId(generateAppointmentId());
        appointment.setAppointmentNumber(generateAppointmentNumber());
        appointment.setScheduleId(request.getScheduleId());
        appointment.setSlotId(request.getTimeSlotId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setPatientName(request.getPatientName());
        appointment.setPatientIdCard(request.getPatientIdCard());
        appointment.setPatientPhone(request.getPatientPhone());
        appointment.setVisitType(request.getVisitType());
        appointment.setSymptoms(request.getSymptoms());
        appointment.setAppointmentTime(slot.getStartTime());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCreateTime(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
    
    /**
     * 更新号源余量
     */
    private void updateSlotRemaining(ScheduleSlot slot) {
        // 更新时段锁定状态
        slot.setIsLocked(true);
        slot.setLockedUntil(LocalDateTime.now().plusMinutes(30)); // 锁定30分钟
        scheduleSlotRepository.save(slot);
        
        // 更新排班余量（这里需要调用排班服务更新总余量）
        // scheduleService.updateRemainingSlots(slot.getScheduleId());
    }
    
    /**
     * 生成支付信息
     */
    private AppointmentSubmitResponse generatePaymentInfo(Appointment appointment) {
        AppointmentSubmitResponse response = new AppointmentSubmitResponse();
        response.setAppointmentId(appointment.getId());
        response.setAppointmentNumber(appointment.getAppointmentNumber());
        response.setStatus(appointment.getStatus().name());
        response.setCreateTime(appointment.getCreateTime());
        
        // 模拟支付信息生成
        boolean paymentRequired = "first".equals(appointment.getVisitType()); // 初诊需要支付
        
        if (paymentRequired) {
            // 生成支付订单
            PaymentService.PaymentOrder paymentOrder = paymentService.createPaymentOrder(
                    appointment.getId(), 5000); // 50元
            
            response.setPaymentRequired(true);
            response.setPaymentAmount(paymentOrder.getAmount());
            response.setPaymentOrderId(paymentOrder.getOrderId());
            response.setPaymentUrl(paymentOrder.getPaymentUrl());
        } else {
            response.setPaymentRequired(false);
            response.setStatus("confirmed"); // 复诊直接确认
        }
        
        return response;
    }
    
    /**
     * 获取预约详情
     */
    public AppointmentSubmitResponse getAppointmentDetail(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElse(null);
        
        if (appointment == null) {
            return null;
        }
        
        AppointmentSubmitResponse response = new AppointmentSubmitResponse();
        response.setAppointmentId(appointment.getId());
        response.setAppointmentNumber(appointment.getAppointmentNumber());
        response.setStatus(appointment.getStatus().name());
        response.setCreateTime(appointment.getCreateTime());
        
        // 这里可以添加更多详细信息，如医生信息、排班信息等
        
        return response;
    }
    
    /**
     * 取消预约
     */
    @Transactional
    public AppointmentSubmitResponse cancelAppointment(String appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("预约不存在"));
        
        // 检查预约状态是否可以取消
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            AppointmentSubmitResponse response = new AppointmentSubmitResponse();
            response.setSuccess(false);
            response.setErrorMessage("当前预约状态无法取消");
            return response;
        }
        
        // 更新预约状态
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelReason(reason);
        appointment.setCancelTime(LocalDateTime.now());
        appointmentRepository.save(appointment);
        
        // 恢复号源余量
        restoreSlotAvailability(appointment.getSlotId());
        
        AppointmentSubmitResponse response = new AppointmentSubmitResponse();
        response.setSuccess(true);
        response.setAppointmentId(appointmentId);
        response.setStatus(AppointmentStatus.CANCELLED.name());
        
        return response;
    }
    
    /**
     * 恢复号源可用性
     */
    private void restoreSlotAvailability(Long slotId) {
        ScheduleSlot slot = scheduleSlotRepository.findById(slotId).orElse(null);
        if (slot != null) {
            slot.setIsLocked(false);
            slot.setLockedUntil(null);
            scheduleSlotRepository.save(slot);
            
            // 恢复排班余量
            // scheduleService.restoreRemainingSlots(slot.getScheduleId());
        }
    }
    
    /**
     * 生成预约ID
     */
    private String generateAppointmentId() {
        return "appt_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * 生成预约编号
     */
    private String generateAppointmentNumber() {
        return "A" + System.currentTimeMillis() % 1000000;
    }
}