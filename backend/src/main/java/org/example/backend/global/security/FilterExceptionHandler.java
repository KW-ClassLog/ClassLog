package org.example.backend.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

public class FilterExceptionHandler extends GenericFilterBean {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        try {
            chain.doFilter(request, response);
        } catch (AuthenticationServiceException e) {
            sendError(httpResponse, FailureCode._UNAUTHORIZED);
        } catch (BadCredentialsException e) {
            sendError(httpResponse, FailureCode._UNAUTHORIZED);
        }catch (Exception e) {
            sendError(httpResponse, FailureCode._INTERNAL_SERVER_ERROR);
        }
    }

    private void sendError(HttpServletResponse response, BaseErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getReasonHttpStatus().getHttpStatus().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Object> apiResponse = ApiResponse.onFailure(errorCode);
        response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
    }
}
