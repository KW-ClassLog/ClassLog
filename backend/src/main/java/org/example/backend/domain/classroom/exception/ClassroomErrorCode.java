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
    STUDENT_CANNOT_CREATE_CLASSROOM(HttpStatus.BAD_REQUEST,
            "CLASS400_1", "학생은 클래스를 생성할 수 없습니다."),

    INVALID_ENTRY_CODE(HttpStatus.BAD_REQUEST,
            "ENTRY400", "입장 코드가 올바르지 않거나 만료되었습니다."),

    ALREADY_JOINED(HttpStatus.BAD_REQUEST,
            "CLASS400", "이미 입장한 클래스입니다.");
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