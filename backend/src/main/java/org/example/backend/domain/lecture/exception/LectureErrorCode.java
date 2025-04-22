package org.example.backend.domain.lecture.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum LectureErrorCode implements BaseErrorCode {

    CLASS_NOT_FOUND(HttpStatus.NOT_FOUND,
            "CLASS404_1", "존재하지 않는 클래스입니다."),
    LECTURE_NOT_FOUND(HttpStatus.NOT_FOUND,
            "LECTURE404_2", "존재하지 않는 강의입니다."),
    LECTURE_NOT_IN_CLASS(HttpStatus.NOT_FOUND,
            "LECTURE404_3", "해당 강의는 이 클래스에 속하지 않습니다.");
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
