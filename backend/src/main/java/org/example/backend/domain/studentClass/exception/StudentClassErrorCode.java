package org.example.backend.domain.studentClass.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum StudentClassErrorCode implements BaseErrorCode {

    _STUDENT_ALREADY_ENTER(HttpStatus.BAD_REQUEST, "STUDENTCLASS400_1", "같은 클래스에 다시 입장할 수 없습니다."),
    _STUDENT_NOT_IN_CLASS(HttpStatus.BAD_REQUEST, "STUDENTCLASS400_2","수강 중인 클래스가 없습니다."),
    _NO_LECTURE_TODAY(HttpStatus.NOT_FOUND,"STUDENTCLASS404_1","오늘 진행되는 강의가 없습니다.");

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
