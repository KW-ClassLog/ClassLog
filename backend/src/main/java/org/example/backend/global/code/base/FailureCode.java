package org.example.backend.global.code.base;

import lombok.AllArgsConstructor;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum FailureCode implements BaseErrorCode {
    _BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON400", "잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMMON401", "인증에 실패했습니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "권한이 없습니다."),
    _NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON404", "컨텐츠를 찾지 못했습니다."),
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 관리자에게 문의하세요."),
    ;

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