package com.leansofx.qaservicequestion.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 号源分布式锁服务
 * 实现基于Redis的分布式锁机制，防止号源超卖
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SlotLockService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    // 锁的默认超时时间（10分钟）
    private static final long DEFAULT_LOCK_TIMEOUT = 10 * 60 * 1000; // 10分钟
    
    // 锁的key前缀
    private static final String LOCK_KEY_PREFIX = "slot_lock:";
    
    /**
     * 尝试获取号源锁
     * @param slotId 号源ID
     * @return 锁标识（如果获取成功），null表示获取失败
     */
    public String tryLockSlot(Long slotId) {
        return tryLockSlot(slotId, DEFAULT_LOCK_TIMEOUT);
    }
    
    /**
     * 尝试获取号源锁（带自定义超时时间）
     * @param slotId 号源ID
     * @param timeoutMs 超时时间（毫秒）
     * @return 锁标识（如果获取成功），null表示获取失败
     */
    public String tryLockSlot(Long slotId, long timeoutMs) {
        String lockKey = buildLockKey(slotId);
        String lockValue = UUID.randomUUID().toString();
        
        try {
            // 使用SETNX命令尝试获取锁
            Boolean success = redisTemplate.opsForValue()
                    .setIfAbsent(lockKey, lockValue, timeoutMs, TimeUnit.MILLISECONDS);
            
            if (Boolean.TRUE.equals(success)) {
                log.info("成功获取号源锁: slotId={}, lockValue={}", slotId, lockValue);
                return lockValue;
            } else {
                log.debug("号源锁已被占用: slotId={}", slotId);
                return null;
            }
        } catch (Exception e) {
            log.error("获取号源锁异常: slotId={}", slotId, e);
            return null;
        }
    }
    
    /**
     * 释放号源锁
     * @param slotId 号源ID
     * @param lockValue 锁标识
     * @return 是否释放成功
     */
    public boolean unlockSlot(Long slotId, String lockValue) {
        String lockKey = buildLockKey(slotId);
        
        // 使用Lua脚本保证原子性
        String luaScript = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
        """;
        
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptText(luaScript);
        redisScript.setResultType(Long.class);
        
        try {
            Long result = redisTemplate.execute(redisScript, Collections.singletonList(lockKey), lockValue);
            boolean success = result != null && result == 1;
            
            if (success) {
                log.info("成功释放号源锁: slotId={}, lockValue={}", slotId, lockValue);
            } else {
                log.warn("释放号源锁失败（锁不存在或已过期）: slotId={}, lockValue={}", slotId, lockValue);
            }
            
            return success;
        } catch (Exception e) {
            log.error("释放号源锁异常: slotId={}", slotId, e);
            return false;
        }
    }
    
    /**
     * 检查锁是否存在（用于验证锁是否仍然有效）
     * @param slotId 号源ID
     * @param lockValue 锁标识
     * @return 锁是否仍然有效
     */
    public boolean isLockValid(Long slotId, String lockValue) {
        String lockKey = buildLockKey(slotId);
        
        try {
            String currentValue = redisTemplate.opsForValue().get(lockKey);
            return lockValue.equals(currentValue);
        } catch (Exception e) {
            log.error("检查锁状态异常: slotId={}", slotId, e);
            return false;
        }
    }
    
    /**
     * 强制释放号源锁（管理员操作，谨慎使用）
     * @param slotId 号源ID
     * @return 是否释放成功
     */
    public boolean forceUnlockSlot(Long slotId) {
        String lockKey = buildLockKey(slotId);
        
        try {
            Boolean success = redisTemplate.delete(lockKey);
            log.warn("强制释放号源锁: slotId={}, success={}", slotId, success);
            return Boolean.TRUE.equals(success);
        } catch (Exception e) {
            log.error("强制释放号源锁异常: slotId={}", slotId, e);
            return false;
        }
    }
    
    /**
     * 获取锁的剩余生存时间
     * @param slotId 号源ID
     * @return 剩余时间（毫秒），-1表示永不过期，-2表示锁不存在
     */
    public long getLockTtl(Long slotId) {
        String lockKey = buildLockKey(slotId);
        
        try {
            Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.MILLISECONDS);
            return ttl != null ? ttl : -2;
        } catch (Exception e) {
            log.error("获取锁TTL异常: slotId={}", slotId, e);
            return -2;
        }
    }
    
    private String buildLockKey(Long slotId) {
        return LOCK_KEY_PREFIX + slotId;
    }
}