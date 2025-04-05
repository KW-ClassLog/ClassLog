package org.example.backend.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/redis")
public class UserRedisController {

    private final StringRedisTemplate redisTemplate;

    @GetMapping("/test")
    public String testRedis() {
        redisTemplate.opsForValue().set("hello", "world");
        return redisTemplate.opsForValue().get("hello");
    }
}
