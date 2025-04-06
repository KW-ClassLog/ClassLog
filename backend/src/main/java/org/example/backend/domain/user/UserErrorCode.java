package org.example.backend.domain.user;

import lombok.AllArgsConstructor;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum UserErrorCode implements BaseErrorCode {

    _EMAIL_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "SIGNUP400_1", "이미 사용 중인 이메일입니다."),
    _INVALID_EMAIL_FORMAT(HttpStatus.BAD_REQUEST, "SIGNUP400_2", "올바른 이메일 형식이 아닙니다."),
    _REQUIRED_FIELD_MISSING(HttpStatus.BAD_REQUEST, "SIGNUP400_3", "필수 항목이 누락되었습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
                .httpStatus(this.httpStatus)
                .isSuccess(false)
                .code(this.code)
                .message(this.message)
                .build();
    }
}
