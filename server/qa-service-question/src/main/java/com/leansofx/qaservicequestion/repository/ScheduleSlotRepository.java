package com.leansofx.qaservicequestion.repository;

import com.leansofx.qaservicequestion.entity.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 号源Repository接口
 */
@Repository
public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {
    
    /**
     * 根据排班ID查询号源列表
     */
    List<ScheduleSlot> findByScheduleIdOrderByStartTime(Long scheduleId);
    
    /**
     * 查询可用的号源
     */
    @Query("SELECT s FROM ScheduleSlot s WHERE s.scheduleId = :scheduleId " +
           "AND (s.slotStatus = 'available' OR (s.isLocked = true AND s.lockedUntil < :currentTime)) " +
           "ORDER BY s.startTime")
    List<ScheduleSlot> findAvailableSlots(@Param("scheduleId") Long scheduleId,
                                         @Param("currentTime") LocalDateTime currentTime);
    
    /**
     * 查询过期的锁定号源
     */
    @Query("SELECT s FROM ScheduleSlot s WHERE s.isLocked = true " +
           "AND s.lockedUntil < :currentTime")
    List<ScheduleSlot> findExpiredLockedSlots(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * 根据患者ID查询预约的号源
     */
    List<ScheduleSlot> findByPatientIdAndSlotStatusIn(Long patientId, List<String> statusList);
}