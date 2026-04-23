package com.leansofx.qaservicequestion.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * 预约提交请求
 */
@Data
public class AppointmentSubmitRequest {
    
    /**
     * 排班ID
     */
    @NotNull(message = "排班ID不能为空")
    private Long scheduleId;
    
    /**
     * 时段ID
     */
    @NotNull(message = "时段ID不能为空")
    private Long timeSlotId;
    
    /**
     * 患者姓名
     */
    @NotBlank(message = "患者姓名不能为空")
    private String patientName;
    
    /**
     * 患者身份证号
     */
    @NotBlank(message = "身份证号不能为空")
    @Pattern(regexp = "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$", 
             message = "请输入正确的身份证号")
    private String patientIdCard;
    
    /**
     * 患者手机号
     */
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "请输入正确的手机号")
    private String patientPhone;
    
    /**
     * 就诊类型：first-初诊，followup-复诊
     */
    @NotBlank(message = "就诊类型不能为空")
    @Pattern(regexp = "^(first|followup)$", message = "就诊类型必须是first或followup")
    private String visitType;
    
    /**
     * 症状描述
     */
    private String symptoms;
    
    /**
     * 医生ID
     */
    @NotNull(message = "医生ID不能为空")
    private Long doctorId;
    
    /**
     * 预约锁定令牌（可选）
     */
    private String lockToken;
}