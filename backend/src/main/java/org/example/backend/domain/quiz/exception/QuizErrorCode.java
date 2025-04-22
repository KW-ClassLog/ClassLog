package org.example.backend.domain.quiz.exception;

import lombok.AllArgsConstructor;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum QuizErrorCode implements BaseErrorCode {

    LectureNotFound(HttpStatus.NOT_FOUND, "LECTURE404_1", "해당 강의를 찾을 수 없습니다."),
    LectureNoteNotFound(HttpStatus.NOT_FOUND, "LECTURE404_2", "해당 강의에 등록된 강의록을 찾을 수 없습니다."),
    AiCallFailed(HttpStatus.INTERNAL_SERVER_ERROR, "AI_500", "AI 호출 중 오류가 발생했습니다.");

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
