package com.leansofx.qaservicequestion.entity;

import com.leansofx.qaservicequestion.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 预约实体
 */
@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    
    @Id
    @Column(name = "id", length = 64)
    private String id;
    
    /**
     * 预约编号
     */
    @Column(name = "appointment_number", length = 32, unique = true)
    private String appointmentNumber;
    
    /**
     * 排班ID
     */
    @Column(name = "schedule_id")
    private Long scheduleId;
    
    /**
     * 时段ID
     */
    @Column(name = "slot_id")
    private Long slotId;
    
    /**
     * 医生ID
     */
    @Column(name = "doctor_id")
    private Long doctorId;
    
    /**
     * 患者姓名
     */
    @Column(name = "patient_name", length = 50)
    private String patientName;
    
    /**
     * 患者身份证号
     */
    @Column(name = "patient_id_card", length = 18)
    private String patientIdCard;
    
    /**
     * 患者手机号
     */
    @Column(name = "patient_phone", length = 11)
    private String patientPhone;
    
    /**
     * 就诊类型
     */
    @Column(name = "visit_type", length = 10)
    private String visitType;
    
    /**
     * 症状描述
     */
    @Column(name = "symptoms", length = 500)
    private String symptoms;
    
    /**
     * 预约时间
     */
    @Column(name = "appointment_time")
    private LocalDateTime appointmentTime;
    
    /**
     * 预约状态
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private AppointmentStatus status;
    
    /**
     * 创建时间
     */
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    /**
     * 取消原因
     */
    @Column(name = "cancel_reason", length = 200)
    private String cancelReason;
    
    /**
     * 取消时间
     */
    @Column(name = "cancel_time")
    private LocalDateTime cancelTime;
    
    /**
     * 支付状态
     */
    @Column(name = "payment_status", length = 20)
    private String paymentStatus;
    
    /**
     * 支付订单号
     */
    @Column(name = "payment_order_id", length = 64)
    private String paymentOrderId;
}