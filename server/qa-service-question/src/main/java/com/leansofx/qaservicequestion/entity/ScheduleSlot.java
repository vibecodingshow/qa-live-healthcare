package com.leansofx.qaservicequestion.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 号源明细实体类
 */
@Entity
@Table(name = "schedule_slot")
@Data
public class ScheduleSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", insertable = false, updatable = false)
    private Schedule schedule;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "slot_status", nullable = false)
    private String slotStatus = "available";
    
    @Column(name = "patient_id")
    private Long patientId;
    
    @Column(name = "appointment_id")
    private Long appointmentId;
    
    @Column(name = "is_locked", nullable = false)
    private Boolean isLocked = false;
    
    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 检查号源是否可用
    public boolean isAvailable() {
        return "available".equals(slotStatus) && !isLocked;
    }
    
    // 检查锁定是否过期
    public boolean isLockExpired() {
        return isLocked && lockedUntil != null && LocalDateTime.now().isAfter(lockedUntil);
    }
}