package com.leansofx.qaservicequestion.service;

import com.leansofx.qaservicequestion.entity.ScheduleSlot;
import com.leansofx.qaservicequestion.repository.ScheduleSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 号源服务
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SlotService {
    
    private final ScheduleSlotRepository scheduleSlotRepository;
    
    /**
     * 查询排班的可用号源
     */
    public List<ScheduleSlot> getAvailableSlots(Long scheduleId) {
        LocalDateTime currentTime = LocalDateTime.now();
        return scheduleSlotRepository.findAvailableSlots(scheduleId, currentTime);
    }
    
    /**
     * 锁定号源
     */
    @Transactional
    public boolean lockSlot(Long slotId, Long patientId, int lockDurationMinutes) {
        try {
            ScheduleSlot slot = scheduleSlotRepository.findById(slotId)
                    .orElseThrow(() -> new RuntimeException("号源不存在"));
            
            if (!slot.isAvailable()) {
                log.warn("号源{}不可用，当前状态：{}，锁定状态：{}", 
                        slotId, slot.getSlotStatus(), slot.getIsLocked());
                return false;
            }
            
            // 设置锁定信息
            slot.setIsLocked(true);
            slot.setLockedUntil(LocalDateTime.now().plusMinutes(lockDurationMinutes));
            slot.setPatientId(patientId);
            
            scheduleSlotRepository.save(slot);
            log.info("号源{}已锁定，锁定时间：{}分钟", slotId, lockDurationMinutes);
            return true;
            
        } catch (Exception e) {
            log.error("锁定号源失败：{}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 解锁号源
     */
    @Transactional
    public boolean unlockSlot(Long slotId) {
        try {
            ScheduleSlot slot = scheduleSlotRepository.findById(slotId)
                    .orElseThrow(() -> new RuntimeException("号源不存在"));
            
            slot.setIsLocked(false);
            slot.setLockedUntil(null);
            slot.setPatientId(null);
            
            scheduleSlotRepository.save(slot);
            log.info("号源{}已解锁", slotId);
            return true;
            
        } catch (Exception e) {
            log.error("解锁号源失败：{}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 清理过期的锁定号源
     */
    @Transactional
    public int cleanupExpiredLocks() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<ScheduleSlot> expiredSlots = scheduleSlotRepository.findExpiredLockedSlots(currentTime);
        
        if (!expiredSlots.isEmpty()) {
            for (ScheduleSlot slot : expiredSlots) {
                slot.setIsLocked(false);
                slot.setLockedUntil(null);
                slot.setPatientId(null);
            }
            scheduleSlotRepository.saveAll(expiredSlots);
            log.info("清理了{}个过期的锁定号源", expiredSlots.size());
        }
        
        return expiredSlots.size();
    }
    
    /**
     * 获取患者的预约号源
     */
    public List<ScheduleSlot> getPatientSlots(Long patientId) {
        List<String> statusList = List.of("reserved", "confirmed");
        return scheduleSlotRepository.findByPatientIdAndSlotStatusIn(patientId, statusList);
    }
}