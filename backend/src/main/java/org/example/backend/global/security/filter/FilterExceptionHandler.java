package org.example.backend.global.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.lettuce.core.RedisConnectionException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.exception.FailureException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FilterExceptionHandler extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        if (CorsUtils.isPreFlightRequest(request)) {
            chain.doFilter(request, response);
            return;
        }

        try {
            chain.doFilter(request, response);
        } catch (InternalAuthenticationServiceException e) {
            Throwable cause = e.getCause();
            if (cause instanceof FailureException fe) {
                sendError(request,response, fe.getBaseErrorCode());
            } else {
                sendError(request,response, FailureCode._UNAUTHORIZED);
            }
        } catch (AuthenticationServiceException| BadCredentialsException e) {
            sendError(request,response, FailureCode._UNAUTHORIZED);
        } catch (RedisConnectionFailureException | RedisConnectionException e) {
            sendError(request,response, FailureCode._REDIS_SERVER_ERROR);
        } catch (FailureException e) {
            sendError(request,response, e.getBaseErrorCode());
        } catch (Exception e) {
            sendError(request,response, FailureCode._INTERNAL_SERVER_ERROR);
        }

    }

//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException {
//        HttpServletResponse httpResponse = (HttpServletResponse) response;
//
//        try {
//            chain.doFilter(request, response);
//        } catch (InternalAuthenticationServiceException e) {
//            Throwable cause = e.getCause();
//            if (cause instanceof FailureException fe) {
//                sendError(httpResponse, fe.getBaseErrorCode());
//            } else {
//                sendError(httpResponse, FailureCode._UNAUTHORIZED);
//            }
//        } catch (AuthenticationServiceException| BadCredentialsException e) {
//            sendError(httpResponse, FailureCode._UNAUTHORIZED);
//        } catch (RedisConnectionFailureException | RedisConnectionException e) {
//            sendError(httpResponse, FailureCode._REDIS_SERVER_ERROR);
//        } catch (FailureException e) {
//            sendError(httpResponse, e.getBaseErrorCode());
//        } catch (Exception e) {
//            sendError(httpResponse, FailureCode._INTERNAL_SERVER_ERROR);
//        }
//    }

    private void sendError(HttpServletRequest request,HttpServletResponse response, BaseErrorCode errorCode) throws IOException {

        String origin = request.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Vary", "Origin");
            response.setHeader("Access-Control-Expose-Headers", "Authorization");
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }

        response.setStatus(errorCode.getReasonHttpStatus().getHttpStatus().value());
        response.setContentType("application/json;charset=UTF-8");

        ApiResponse<Object> apiResponse = ApiResponse.onFailure(errorCode);
        response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
//
//        response.setStatus(errorCode.getReasonHttpStatus().getHttpStatus().value());
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//
//        ApiResponse<Object> apiResponse = ApiResponse.onFailure(errorCode);
//        response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
    }
}
