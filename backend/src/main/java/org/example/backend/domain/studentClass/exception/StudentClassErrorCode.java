package org.example.backend.domain.studentClass.exception;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum StudentClassErrorCode implements BaseErrorCode {

    _CLASS_NOT_FOUND(HttpStatus.NOT_FOUND,"STUDENTCLASS404_1","존재하지 않는 클래스입니다."),
    _STUDENT_NOT_FOUND(HttpStatus.NOT_FOUND,"STUDENTCLASS404_2","존재하지 않는 학생입니다.");

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