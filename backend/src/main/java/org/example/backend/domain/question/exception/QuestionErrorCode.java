package org.example.backend.domain.question.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum QuestionErrorCode implements BaseErrorCode {
    _FORBIDDEN_LECTURE_ACCESS(HttpStatus.FORBIDDEN,"QUESTION403_1","해당 강의를 수강중인 학생만 조회가능합니다."),
    _CHAT_MESSAGE_SEND_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "QUESTION500_1", "채팅 메시지 전송에 실패했습니다."),
    _INVALID_JSON_FORMAT(HttpStatus.BAD_REQUEST,"QUESTION400_1","저장된 채팅 데이터를 읽는 데 실패했습니다."),
    _FORBIDDEN_CHATTING_ACCESS(HttpStatus.FORBIDDEN,"QUESTION403_2","채팅 저장 권한은 강사에게만 있습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
                .httpStatus(httpStatus)
                .isSuccess(false)
                .code(this.code)
                .message(this.message)
                .build();
    }
}
