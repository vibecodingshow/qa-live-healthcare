package com.leansofx.qaservicequestion.entity;

import com.leansofx.qaservicequestion.enums.ScheduleStatus;
import com.leansofx.qaservicequestion.enums.TimePeriod;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 排班实体类
 */
@Entity
@Table(name = "schedule", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"doctor_id", "schedule_date", "time_period"})
})
@Data
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;
    
    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "time_period", nullable = false)
    private TimePeriod timePeriod;
    
    @Column(name = "total_slots", nullable = false)
    private Integer totalSlots = 0;
    
    @Column(name = "remaining_slots", nullable = false)
    private Integer remainingSlots = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScheduleStatus status = ScheduleStatus.AVAILABLE;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 计算属性：号源紧张程度
    public boolean isLimited() {
        return remainingSlots > 0 && remainingSlots < 5;
    }
    
    // 更新状态的方法
    public void updateStatus() {
        if (remainingSlots <= 0) {
            this.status = ScheduleStatus.FULL;
        } else if (isLimited()) {
            this.status = ScheduleStatus.LIMITED;
        } else {
            this.status = ScheduleStatus.AVAILABLE;
        }
    }
}