package org.example.backend.global.redis;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.exception.FailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final StringRedisTemplate redisTemplate;

    // set
    public void set(String key, String value, Duration ttl){
        try {
            redisTemplate.opsForValue().set(key, value, ttl);
        } catch (Exception e) {
            throw new FailureException(FailureCode._REDIS_SERVER_ERROR);
        }
    }

    // get
    public String get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            throw new FailureException(FailureCode._REDIS_SERVER_ERROR);
        }
    }

    // delete
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            throw new FailureException(FailureCode._REDIS_SERVER_ERROR);
        }
    }

    // exists
    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            throw new FailureException(FailureCode._REDIS_SERVER_ERROR);
        }
    }


}
