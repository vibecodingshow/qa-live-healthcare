package com.leansofx.qaservicequestion.dto;

import lombok.Data;

/**
 * 号源锁定响应DTO
 */
@Data
public class SlotLockResponse {
    
    /**
     * 是否锁定成功
     */
    private boolean success;
    
    /**
     * 锁标识（如果锁定成功）
     */
    private String lockToken;
    
    /**
     * 锁定失败的错误信息
     */
    private String errorMessage;
    
    /**
     * 锁定剩余时间（毫秒）
     */
    private Long ttlMs;
    
    /**
     * 构建成功响应
     */
    public static SlotLockResponse success(String lockToken, Long ttlMs) {
        SlotLockResponse response = new SlotLockResponse();
        response.setSuccess(true);
        response.setLockToken(lockToken);
        response.setTtlMs(ttlMs);
        return response;
    }
    
    /**
     * 构建失败响应
     */
    public static SlotLockResponse failure(String errorMessage) {
        SlotLockResponse response = new SlotLockResponse();
        response.setSuccess(false);
        response.setErrorMessage(errorMessage);
        return response;
    }
}