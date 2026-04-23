package com.leansofx.qaservicequestion.repository;

import com.leansofx.qaservicequestion.entity.Appointment;
import com.leansofx.qaservicequestion.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 预约仓库
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    
    /**
     * 根据身份证号和时段ID检查是否存在预约（排除已取消的）
     */
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.patientIdCard = :patientIdCard AND a.slotId = :slotId AND a.status <> :status")
    boolean existsByPatientIdCardAndSlotIdAndStatusNot(
            @Param("patientIdCard") String patientIdCard,
            @Param("slotId") Long slotId,
            @Param("status") AppointmentStatus status);
    
    /**
     * 根据患者身份证号查询预约列表
     */
    List<Appointment> findByPatientIdCardOrderByCreateTimeDesc(String patientIdCard);
    
    /**
     * 根据医生ID查询预约列表
     */
    List<Appointment> findByDoctorIdOrderByAppointmentTimeDesc(Long doctorId);
    
    /**
     * 根据预约编号查询
     */
    Optional<Appointment> findByAppointmentNumber(String appointmentNumber);
    
    /**
     * 根据状态查询预约列表
     */
    List<Appointment> findByStatusOrderByAppointmentTimeAsc(AppointmentStatus status);
    
    /**
     * 统计指定时段的预约数量
     */
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.slotId = :slotId AND a.status IN :statuses")
    long countBySlotIdAndStatusIn(@Param("slotId") Long slotId, @Param("statuses") List<AppointmentStatus> statuses);
}