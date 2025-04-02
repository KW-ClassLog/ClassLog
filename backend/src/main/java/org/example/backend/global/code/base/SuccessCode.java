package org.example.backend.global.code.base;

import lombok.AllArgsConstructor;
import org.example.backend.global.code.BaseCode;
import org.example.backend.global.code.ReasonDTO;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum SuccessCode implements BaseCode {
    _OK(HttpStatus.OK, "COMMON200", "성공입니다."),
    _CREATED(HttpStatus.CREATED, "COMMON201", "생성했습니다."),
    _NO_CONTENT(HttpStatus.NO_CONTENT, "COMMON204", "삭제했습니다."),
    ;

    private final HttpStatus httpStatus;

    private final String code;
    private final String message;

    @Override
    public ReasonDTO getReasonHttpStatus() {
        return ReasonDTO.builder()
                .httpStatus(this.httpStatus)
                .isSuccess(true)
                .code(this.code)
                .message(this.message)
                .build();
    }
}