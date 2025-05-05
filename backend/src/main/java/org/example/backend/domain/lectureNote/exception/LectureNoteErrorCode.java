package org.example.backend.domain.lectureNote.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum LectureNoteErrorCode implements BaseErrorCode {
    LECTURE_NOTE_NOT_FOUND(HttpStatus.NOT_FOUND,
            "LECTURENOTE404_1", "존재하지 않는 강의록입니다."),
    ;

    private final HttpStatus status;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return org.example.backend.global.code.ErrorReasonDTO.builder()
                .httpStatus(getStatus())
                .code(getCode())
                .message(getMessage())
                .build();
    }
}