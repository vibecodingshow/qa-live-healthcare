package com.leansofx.qaservicequestion.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

/**
 * 号源锁定请求DTO
 */
@Data
public class SlotLockRequest {
    
    /**
     * 号源ID
     */
    @NotNull(message = "号源ID不能为空")
    private Long slotId;
    
    /**
     * 锁定超时时间（毫秒），可选，默认10分钟
     */
    private Long timeoutMs;
    
    /**
     * 患者ID（可选，用于关联锁定）
     */
    private Long patientId;
}