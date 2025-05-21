package org.example.backend.domain.user.service;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.converter.UserConverter;
import org.example.backend.domain.user.dto.response.RefreshTokenResponseDTO;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.dto.request.RegisterRequestDTO;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.example.backend.global.security.token.JWTUtil;
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
    private final JWTUtil jwtUtil;
    private final UserRedisService userRedisService;


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


    // 리프레시 토큰 발급
    @Override
    public void getRefreshToken(HttpServletRequest request, HttpServletResponse response) {

        // 토큰 존재 확인
        String refreshToken = extractRefreshToken(request);

        if(refreshToken == null){
            throw new UserException(UserErrorCode._REFRESH_TOKEN_MISSING);
        }

        // 토큰 만료 검증 & 토큰 생성
        RefreshTokenResponseDTO dto = jwtUtil.reissueToken(refreshToken);

        response.setHeader("Authorization","Bearer "+dto.getAccessToken());

        Cookie cookie = new Cookie("refresh_token", dto.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(14 * 24 * 60 * 60); // 14일
        response.addCookie(cookie);
    }

    // 로그아웃
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {

        String accessToken = jwtUtil.resolveAccessToken(request);
        String refreshToken = extractRefreshToken(request);

        if(accessToken != null){
            // access token & refresh token 만료 처리
            try{
                System.out.println("access token = " + accessToken);
                long exp = jwtUtil.getExpiration(accessToken);
                userRedisService.setBlackList(accessToken, exp);
            } catch (ExpiredJwtException e){
                System.out.println("access token 만료됨, 블랙리스트 생략");
            } catch (Exception e){
                System.out.println("access token 처리 중 예외 발생");
            }
        }

        if(refreshToken != null){
            try{
                String userId = jwtUtil.getUserId(refreshToken).toString();
                userRedisService.deleteRefreshToken(userId);
            } catch (Exception e){
                System.out.println("refresh token 만료됨 또는 파싱 실패");
            }

            // 쿠키 삭제
            Cookie cookie = new Cookie("refresh_token", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            response.addCookie(cookie);
        }

    }
}
