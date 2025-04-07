package org.example.backend.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.validation.ConstraintViolation;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestControllerAdvice(annotations = RestController.class)
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<List<String>>> constraintViolationException(ConstraintViolationException e) {

        log.error(Arrays.toString(e.getStackTrace()));
        List<String> message = e.getConstraintViolations().stream().map(ConstraintViolation::getMessage).toList();

        ErrorReasonDTO reasonDTO = FailureCode._BAD_REQUEST.getReasonHttpStatus();
        log.error("Exception Advice(ConstraintViolationException): {}", message);

        return ResponseEntity.status(reasonDTO.getHttpStatus()).body(ApiResponse.onFailure(reasonDTO.getCode(), reasonDTO.getMessage(), message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> methodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> error = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(field -> error.put(field.getField(), field.getDefaultMessage()));
        ErrorReasonDTO dto = FailureCode._BAD_REQUEST.getReasonHttpStatus();

        log.error("Exception Advice(MethodArgumentNotValidException): {}", error);
        return ResponseEntity.status(dto.getHttpStatus()).body(ApiResponse.onFailure(dto.getCode(), dto.getMessage(), error));
    }

    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ApiResponse<String>> generalException(GeneralException e) {
        BaseErrorCode code = e.getBaseErrorCode();
        ErrorReasonDTO dto = code.getReasonHttpStatus();

        log.error("Exception Advice(General Exception): {}", dto.getMessage());

        return ResponseEntity.status(dto.getHttpStatus()).body(ApiResponse.onFailure(dto.getCode(), dto.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> exception(Exception e) {

        ErrorReasonDTO dto = FailureCode._INTERNAL_SERVER_ERROR.getReasonHttpStatus();
        log.error("Exception Advice({}): {}", e.getClass().getSimpleName(), e.getMessage());
        String message = e.getClass().getSimpleName() + ": " + e.getMessage();

        return ResponseEntity.status(dto.getHttpStatus()).body(ApiResponse.onFailure(dto.getCode(), dto.getMessage(), message));
    }
}
