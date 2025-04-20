package org.example.backend.global.security;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.service.UserRedisService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final UserRedisService userRedisService;

    //AuthenticationManger Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception
    {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil,userRedisService);
        loginFilter.setFilterProcessesUrl("/api/users/login");


        http
                .csrf((auth)->auth.disable()) // csrf disable
                .formLogin((auth)->auth.disable()) //Form 로그인 방식 disable
                .httpBasic((auth)-> auth.disable()) // http basic 인증방식 disable
                .authorizeHttpRequests((auth)->auth // 경로별 인가 작업
                        .anyRequest().permitAll())
//                        .requestMatchers("/api/users","/api/users/verify-email","/api/users/login","/api/users/password/temp").permitAll()
//                        .anyRequest().authenticated())
                .addFilterBefore(new JWTFilter(jwtUtil),LoginFilter.class) // 미들웨어
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class) // custom한 login필터 추가
                .sessionManagement((session)->session // 세션설정
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
