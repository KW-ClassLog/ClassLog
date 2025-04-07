package org.example.backend.global.exception;

import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(GeneralException e) {
        ErrorReasonDTO errorReason = e.getBaseErrorCode().getReasonHttpStatus();

        return ResponseEntity
                .status(errorReason.getHttpStatus())
                .body(ApiResponse.onFailure(errorReason));
    }
}
