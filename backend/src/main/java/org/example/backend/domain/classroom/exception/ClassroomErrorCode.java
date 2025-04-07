package org.example.backend.domain.classroom.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ClassroomErrorCode implements BaseErrorCode {

    CLASS_NOT_FOUND(HttpStatus.NOT_FOUND,
            "CLASS404_1", "존재하지 않는 클래스입니다."),
    PROFESSOR_NOT_FOUND(HttpStatus.NOT_FOUND,
            "CLASS404_2", "존재하지 않는 사용자입니다."),
    ;
    private final HttpStatus status;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
                .httpStatus(getStatus())
                .code(getCode())
                .message(getMessage())
                .build();
    }
}