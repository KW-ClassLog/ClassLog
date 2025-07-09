package org.example.backend.global.security.auth;


import org.example.backend.domain.user.entity.Status;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.exception.FailureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        //DB 조회
        // Optional에서 값 추출: get() 또는 orElseThrow 사용
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + email + " not found"));

        // 탈퇴 회원 검증
        if (user.getDeletedAt() != null || user.getStatus() == Status.INACTIVE) {
            throw new FailureException(UserErrorCode._USER_DEACTIVATED_EXISTS);
        }

        return new CustomUserDetails(user);
    }

    public UserDetails loadUserByUserId(UUID userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User with ID " + userId + " not found"));
        return new CustomUserDetails(user);
    }

}
