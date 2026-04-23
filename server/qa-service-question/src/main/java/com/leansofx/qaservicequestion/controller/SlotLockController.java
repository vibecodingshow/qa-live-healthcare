package com.leansofx.qaservicequestion.controller;

import com.leansofx.qaservicequestion.dto.SlotLockRequest;
import com.leansofx.qaservicequestion.dto.SlotLockResponse;
import com.leansofx.qaservicequestion.service.SlotLockService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 号源锁定控制器
 */
@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@Slf4j
@Validated
public class SlotLockController {
    
    private final SlotLockService slotLockService;
    
    /**
     * 锁定号源
     */
    @PostMapping("/lock")
    public ResponseEntity<SlotLockResponse> lockSlot(@Valid @RequestBody SlotLockRequest request) {
        log.info("锁定号源请求: slotId={}, timeoutMs={}", request.getSlotId(), request.getTimeoutMs());
        
        try {
            // 尝试获取锁
            String lockToken = slotLockService.tryLockSlot(
                request.getSlotId(), 
                request.getTimeoutMs() != null ? request.getTimeoutMs() : 10 * 60 * 1000
            );
            
            if (lockToken != null) {
                // 获取锁成功
                Long ttlMs = slotLockService.getLockTtl(request.getSlotId());
                SlotLockResponse response = SlotLockResponse.success(lockToken, ttlMs);
                log.info("号源锁定成功: slotId={}, lockToken={}", request.getSlotId(), lockToken);
                return ResponseEntity.ok(response);
            } else {
                // 获取锁失败
                SlotLockResponse response = SlotLockResponse.failure("该号源已被锁定，请选择其他时段");
                log.warn("号源锁定失败: slotId={}", request.getSlotId());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("锁定号源异常: slotId={}", request.getSlotId(), e);
            SlotLockResponse response = SlotLockResponse.failure("系统繁忙，请稍后重试");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 解锁号源
     */
    @PostMapping("/unlock")
    public ResponseEntity<SlotLockResponse> unlockSlot(
            @RequestParam Long slotId, 
            @RequestParam String lockToken) {
        log.info("解锁号源请求: slotId={}, lockToken={}", slotId, lockToken);
        
        try {
            boolean success = slotLockService.unlockSlot(slotId, lockToken);
            
            if (success) {
                SlotLockResponse response = SlotLockResponse.success(null, null);
                log.info("号源解锁成功: slotId={}", slotId);
                return ResponseEntity.ok(response);
            } else {
                SlotLockResponse response = SlotLockResponse.failure("解锁失败，锁不存在或已过期");
                log.warn("号源解锁失败: slotId={}", slotId);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("解锁号源异常: slotId={}", slotId, e);
            SlotLockResponse response = SlotLockResponse.failure("解锁异常，请稍后重试");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 验证锁状态
     */
    @GetMapping("/lock/status")
    public ResponseEntity<SlotLockResponse> checkLockStatus(
            @RequestParam Long slotId, 
            @RequestParam(required = false) String lockToken) {
        log.debug("检查锁状态: slotId={}, lockToken={}", slotId, lockToken);
        
        try {
            if (lockToken == null) {
                // 检查锁是否存在
                long ttl = slotLockService.getLockTtl(slotId);
                SlotLockResponse response = new SlotLockResponse();
                response.setSuccess(ttl > 0);
                response.setTtlMs(ttl > 0 ? ttl : null);
                return ResponseEntity.ok(response);
            } else {
                // 验证锁是否仍然有效
                boolean isValid = slotLockService.isLockValid(slotId, lockToken);
                long ttl = slotLockService.getLockTtl(slotId);
                
                SlotLockResponse response = new SlotLockResponse();
                response.setSuccess(isValid);
                response.setTtlMs(isValid ? ttl : null);
                
                if (!isValid) {
                    response.setErrorMessage("锁已失效或已过期");
                }
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            log.error("检查锁状态异常: slotId={}", slotId, e);
            SlotLockResponse response = SlotLockResponse.failure("检查锁状态异常");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 强制解锁号源（管理员接口）
     */
    @PostMapping("/lock/force-unlock")
    public ResponseEntity<SlotLockResponse> forceUnlockSlot(@RequestParam Long slotId) {
        log.warn("强制解锁号源: slotId={}", slotId);
        
        try {
            boolean success = slotLockService.forceUnlockSlot(slotId);
            
            if (success) {
                SlotLockResponse response = SlotLockResponse.success(null, null);
                return ResponseEntity.ok(response);
            } else {
                SlotLockResponse response = SlotLockResponse.failure("强制解锁失败");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("强制解锁号源异常: slotId={}", slotId, e);
            SlotLockResponse response = SlotLockResponse.failure("强制解锁异常");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}