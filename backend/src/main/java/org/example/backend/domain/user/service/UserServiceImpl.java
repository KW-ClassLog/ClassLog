package org.example.backend.domain.user.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.converter.UserConverter;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final PasswordEncoder passwordEncoder;


    //회원가입
    @Override
    public void registerUser(RegisterRequestDTO registerRequestDTO) {

        // 이메일 중복 인증
        Optional<User> existingAccount = userRepository.findByEmail(registerRequestDTO.getEmail());
        if (existingAccount.isPresent()) {
            throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
        }

        // 엔티티 변환
        User user = userConverter.toUser(registerRequestDTO,passwordEncoder);

        // User 저장
        userRepository.save(user);
    }

    // 이메일 중복 인증
    @Override
    public void validateEmailDuplication(String email) {

        Optional<User> existingAccount = userRepository.findByEmail(email);
        if (existingAccount.isPresent()) {
            throw new UserException(UserErrorCode._EMAIL_ALREADY_EXISTS);
        }
    }

    // 이메일이 존재 여부 확인 - 임시 비번 발급용
    @Override
    public boolean existEmail(String email) {
        Optional<User> existingAccount = userRepository.findByEmail(email);
        return existingAccount.isPresent();
    }

    // 임시비번 업데이트
    @Override
    public void updateTempPassword(String email, String tempPassword) {
        //  기존 사용자 조회
        User user= userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException(UserErrorCode._EMAIL_NOT_FOUND));

        // 비밀번호 암호화 후 저장
        String encoded = passwordEncoder.encode(tempPassword);
        user.setPassword(encoded);

        // 저장
        userRepository.save(user);
    }

    // 비밀번호 재설정
    @Override
    public void updatePassword(String currentPassword, String newPassword) {

        // 1. 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof CustomUserDetails)) {
            throw new UserException(FailureCode._UNAUTHORIZED); // 예상치 못한 타입 차단
        }

        UUID userId = ((CustomUserDetails) principal).getUser().getId();

        // 2. 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserErrorCode._EMAIL_NOT_FOUND));

        // 3. 기존 비밀번호 검증
        if(!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new UserException(UserErrorCode._INVALID_PASSWORD);
        }
        // 3. 비밀번호 암호화
        String encoded = passwordEncoder.encode(newPassword);

        // 4. 저장
        user.setPassword(encoded);
        userRepository.save(user);
    }

    // 쿠키에서 리프레시 토큰 추출
    @Override
    public String extractRefreshToken(HttpServletRequest request) {
        if(request.getCookies() == null){
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if ("refresh_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
