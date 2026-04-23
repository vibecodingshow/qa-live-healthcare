package com.leansofx.qaservicequestion.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * 号源锁清理定时任务
 * 定期扫描并清理过期的号源锁
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class SlotLockCleanupTask {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    // 锁的key前缀
    private static final String LOCK_KEY_PREFIX = "slot_lock:";
    
    /**
     * 定时清理过期的号源锁
     * 每5分钟执行一次
     */
    @Scheduled(fixedRate = 5 * 60 * 1000) // 5分钟
    public void cleanupExpiredLocks() {
        log.info("开始清理过期号源锁...");
        
        try {
            // 获取所有号源锁的key
            Set<String> lockKeys = redisTemplate.keys(LOCK_KEY_PREFIX + "*");
            
            if (lockKeys == null || lockKeys.isEmpty()) {
                log.debug("未发现需要清理的号源锁");
                return;
            }
            
            int cleanedCount = 0;
            for (String key : lockKeys) {
                // 检查key是否已过期（TTL <= 0）
                Long ttl = redisTemplate.getExpire(key);
                
                if (ttl != null && ttl <= 0) {
                    // 删除已过期的锁
                    Boolean deleted = redisTemplate.delete(key);
                    if (Boolean.TRUE.equals(deleted)) {
                        cleanedCount++;
                        log.debug("清理过期号源锁: {}", key);
                    }
                }
            }
            
            log.info("号源锁清理完成，共清理 {} 个过期锁", cleanedCount);
            
        } catch (Exception e) {
            log.error("清理过期号源锁异常", e);
        }
    }
    
    /**
     * 统计当前活跃的号源锁数量
     * 每30分钟执行一次统计
     */
    @Scheduled(fixedRate = 30 * 60 * 1000) // 30分钟
    public void reportLockStatistics() {
        try {
            Set<String> lockKeys = redisTemplate.keys(LOCK_KEY_PREFIX + "*");
            
            if (lockKeys != null) {
                int activeLocks = 0;
                int expiredLocks = 0;
                
                for (String key : lockKeys) {
                    Long ttl = redisTemplate.getExpire(key);
                    if (ttl != null && ttl > 0) {
                        activeLocks++;
                    } else {
                        expiredLocks++;
                    }
                }
                
                log.info("号源锁统计 - 活跃锁: {}, 过期锁: {}", activeLocks, expiredLocks);
            }
        } catch (Exception e) {
            log.error("统计号源锁异常", e);
        }
    }
}