package com.leansofx.qaservicequestion.repository;

import com.leansofx.qaservicequestion.entity.Schedule;
import com.leansofx.qaservicequestion.enums.ScheduleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 排班Repository接口
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    /**
     * 根据医生ID和日期范围查询排班
     */
    @Query("SELECT s FROM Schedule s WHERE s.doctorId = :doctorId " +
           "AND s.scheduleDate BETWEEN :startDate AND :endDate " +
           "AND s.isActive = true " +
           "ORDER BY s.scheduleDate, s.timePeriod")
    List<Schedule> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);
    
    /**
     * 根据科室ID和日期范围查询排班
     */
    @Query("SELECT s FROM Schedule s JOIN Doctor d ON s.doctorId = d.id " +
           "WHERE d.departmentId = :departmentId " +
           "AND s.scheduleDate BETWEEN :startDate AND :endDate " +
           "AND s.isActive = true " +
           "ORDER BY s.scheduleDate, s.timePeriod")
    List<Schedule> findByDepartmentIdAndDateRange(@Param("departmentId") Long departmentId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
    
    /**
     * 根据医生ID、日期和时段查询排班
     */
    Optional<Schedule> findByDoctorIdAndScheduleDateAndTimePeriodAndIsActiveTrue(
            Long doctorId, LocalDate scheduleDate, String timePeriod);
    
    /**
     * 查询指定日期范围内的可用排班
     */
    @Query("SELECT s FROM Schedule s WHERE s.scheduleDate BETWEEN :startDate AND :endDate " +
           "AND s.isActive = true " +
           "AND s.status IN :statusList " +
           "ORDER BY s.scheduleDate, s.timePeriod")
    Page<Schedule> findAvailableSchedulesByDateRange(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate,
                                                    @Param("statusList") List<ScheduleStatus> statusList,
                                                    Pageable pageable);
    
    /**
     * 查询医生未来N天的排班
     */
    @Query("SELECT s FROM Schedule s WHERE s.doctorId = :doctorId " +
           "AND s.scheduleDate >= :today " +
           "AND s.scheduleDate <= :endDate " +
           "AND s.isActive = true " +
           "ORDER BY s.scheduleDate")
    List<Schedule> findUpcomingSchedules(@Param("doctorId") Long doctorId,
                                        @Param("today") LocalDate today,
                                        @Param("endDate") LocalDate endDate);
}