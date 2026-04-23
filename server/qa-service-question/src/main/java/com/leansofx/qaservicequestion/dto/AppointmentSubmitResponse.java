package com.leansofx.qaservicequestion.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 预约提交响应
 */
@Data
public class AppointmentSubmitResponse {
    
    /**
     * 是否成功
     */
    private boolean success = true;
    
    /**
     * 错误信息
     */
    private String errorMessage;
    
    /**
     * 预约ID
     */
    private String appointmentId;
    
    /**
     * 预约编号
     */
    private String appointmentNumber;
    
    /**
     * 预约状态
     */
    private String status;
    
    /**
     * 预约时间
     */
    private String appointmentTime;
    
    /**
     * 医生姓名
     */
    private String doctorName;
    
    /**
     * 科室名称
     */
    private String department;
    
    /**
     * 医院名称
     */
    private String hospital;
    
    /**
     * 是否需要支付
     */
    private boolean paymentRequired;
    
    /**
     * 支付金额（分）
     */
    private Integer paymentAmount;
    
    /**
     * 支付订单号
     */
    private String paymentOrderId;
    
    /**
     * 支付链接
     */
    private String paymentUrl;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}