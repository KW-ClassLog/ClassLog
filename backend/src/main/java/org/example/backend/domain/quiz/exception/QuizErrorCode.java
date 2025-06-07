package org.example.backend.domain.quiz.exception;

import lombok.AllArgsConstructor;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public enum QuizErrorCode implements BaseErrorCode {

    LECTURE_NOT_FOUND(HttpStatus.NOT_FOUND, "LECTURE404_1", "해당 강의를 찾을 수 없습니다."),
    LECTURE_NOTE_NOT_FOUND(HttpStatus.NOT_FOUND, "LECTURE404_2", "해당 강의에 등록된 강의록을 찾을 수 없습니다."),
    QUIZ_NOT_FOUND(HttpStatus.NOT_FOUND, "QUIZ404_1", "해당 퀴즈를 찾을 수 없습니다."),
    STUDENT_NOT_CREATE_QUIZ(HttpStatus.BAD_REQUEST, "QUIZ403_1", "강사만 퀴즈를 생성할 수 있습니다."),
    UNAUTHORIZED_ACCESS(HttpStatus.FORBIDDEN, "QUIZ403_2", "접근 권한이 없습니다."),
    INVALID_QUIZ_TYPE(HttpStatus.BAD_REQUEST, "QUIZ400_1", "잘못된 퀴즈 유형입니다."),
    UNSUPPORTED_NOTE_FORMAT(HttpStatus.BAD_REQUEST, "QUIZ400_2", "강의자료는 존재하나, 퀴즈 생성은 PDF, PPTX, DOCX, HWP 형식의 자료에서만 가능합니다."),
    AUDIO_NOT_FOUND(HttpStatus.NOT_FOUND, "QUIZ404_2", "녹음본 기반 퀴즈는 서비스 내에서 강의 시작 후 녹음이 완료된 경우에만 생성할 수 있습니다."),
    AI_CALL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "AI_500", "AI 호출 중 오류가 발생했습니다.");

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
