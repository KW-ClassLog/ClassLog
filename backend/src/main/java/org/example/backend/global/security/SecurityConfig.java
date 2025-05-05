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
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

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
    public JWTFilter jwtFilter(){
        return new JWTFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration),jwtUtil,userRedisService);
        loginFilter.setFilterProcessesUrl("/api/users/login");


        http
                .csrf((auth)->auth.disable()) // csrf disable
                .cors((cors) -> cors.configurationSource(corsConfigurationSource())) //cors 설정
                .formLogin((auth)->auth.disable()) //Form 로그인 방식 disable
                .httpBasic((auth)-> auth.disable()) // http basic 인증방식 disable
                .authorizeHttpRequests((auth)->auth // 경로별 인가 작업
                        .anyRequest().permitAll())
//                        .requestMatchers("/api/users","/api/users/verify-email","/api/users/login","/api/users/password/temp").permitAll()
//                        .anyRequest().authenticated())
                .addFilterBefore(new FilterExceptionHandler(), LogoutFilter.class) // 예외처리 필터
                .addFilterBefore(jwtFilter(),LoginFilter.class) // 미들웨어
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class) // custom한 login필터 추가
                .sessionManagement((session)->session // 세션설정
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // cors 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
