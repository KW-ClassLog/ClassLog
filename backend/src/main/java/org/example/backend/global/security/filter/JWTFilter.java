package org.example.backend.global.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.service.UserRedisService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.example.backend.global.security.token.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final UserRedisService userRedisService;

    public JWTFilter(JWTUtil jwtUtil, UserRedisService userRedisService){
        this.jwtUtil = jwtUtil;
        this.userRedisService = userRedisService;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // 로그인, 회원가입에 대해 필터링 제외
        if (uri.equals("/api/users/login") ||
                uri.equals("/api/users")||
                uri.equals("/api/users/password/temp")||
                uri.equals("/api/users/verify-email")||
                uri.equals("/api/users/refresh")||
                uri.equals("/api/users/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 개발 중 인증 생략
        if (uri.startsWith("/api/lectures")|| uri.startsWith("/api/classes")|| uri.startsWith("/api/notifications")|| uri.startsWith("/api/quizzes")) {
            filterChain.doFilter(request, response);
            return;
        }

        // request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증
        if(authorization == null || !authorization.startsWith("Bearer ")){
            System.out.println("token null or invalid");
            setErrorResponse(response, UserErrorCode._TOKEN_MISSING);

            // 조건이 해당되면 메소드 종료
            return;
        }

        // Bearer 제외하고 토큰만 획득
        String token = authorization.substring(7);

        // 블랙리스트 토큰 검증
        if (userRedisService.isBlackList(token)) {
            System.out.println("블랙리스트에 등록된 토큰입니다.");
            setErrorResponse(response, UserErrorCode._TOKEN_BLACKLISTED);

            return;
        }


        // 토큰 소멸 시간 검증
        try {

            // 토큰에서 userId, role 획득
            UUID userId = jwtUtil.getUserId(token);
            String roleString = jwtUtil.getRole(token);

            // entity를 생성해서 값 세팅
            User user = new User();

            user.setId(userId);
            Role role = Role.valueOf(roleString); // Role enum으로 변환
            user.setRole(role);

            // UserDetail에 회원정보 객체 담기
            CustomUserDetails customUserDetails = new CustomUserDetails(user);

            // 스프링 시큐리티 인증 토큰 생성
            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

            // 세션에 사용자 등록
            SecurityContextHolder.getContext().setAuthentication(authToken);

            filterChain.doFilter(request, response);

        }catch(io.jsonwebtoken.ExpiredJwtException e){
            // 토큰 만료
            setErrorResponse(response, UserErrorCode._TOKEN_EXPIRED);
        } catch(Exception e){
            // 인증 실패
            setErrorResponse(response, FailureCode._UNAUTHORIZED);
        }

    }
    // UserError 타입
    private void setErrorResponse(HttpServletResponse response, UserErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getReasonHttpStatus().getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Object> apiResponse = ApiResponse.onFailure(errorCode);
        String json = new ObjectMapper().writeValueAsString(apiResponse);
        response.getWriter().write(json);
    }

    //  FailureCode 타입
    private void setErrorResponse(HttpServletResponse response, FailureCode errorCode) throws IOException {
        response.setStatus(errorCode.getReasonHttpStatus().getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Object> apiResponse = ApiResponse.onFailure(errorCode);
        String json = new ObjectMapper().writeValueAsString(apiResponse);
        response.getWriter().write(json);
    }

}
