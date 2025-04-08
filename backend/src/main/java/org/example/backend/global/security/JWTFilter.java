package org.example.backend.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.domain.accountLocal.entity.AccountLocal;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.service.CustomUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증
        if(authorization == null || !authorization.startsWith("Bearer ")){
            System.out.println("token null or invalid");
            filterChain.doFilter(request, response);

            // 조건이 해당되면 메소드 종료
            return;
        }

        System.out.println("authorization now");
        // Bearer 제외하고 토큰만 획득
        String token = authorization.substring(7);
        System.out.println(token);

        // 토큰 소멸 시간 검증
        if(jwtUtil.isExpired(token)){

            System.out.println("token expired");
            filterChain.doFilter(request,response);

            // 조건에 해당되면 메소드 종료
            return;
        }

        // 토큰에서 email, username, role 획득
        String email = jwtUtil.getEmail(token);
        String roleString = jwtUtil.getRole(token);
        String name = jwtUtil.getName(token);

        System.out.println("name = " + name);
        System.out.println("roleString = " + roleString);
        System.out.println("email = " + email);

        // entity를 생성해서 값 세팅
        User user = new User();
        AccountLocal accountLocal = new AccountLocal();

        accountLocal.setEmail(email);
        user.setName(name);
        Role role = Role.valueOf(roleString); // Role enum으로 변환
        user.setRole(role);

        // UserDetail에 회원정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(user,accountLocal);

        // 스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails,null,customUserDetails.getAuthorities());

        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);

    }
}
