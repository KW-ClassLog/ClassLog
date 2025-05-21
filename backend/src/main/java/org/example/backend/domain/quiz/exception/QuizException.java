package org.example.backend.domain.quiz.exception;

import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;

@Getter
public class QuizException extends RuntimeException {
    private final BaseErrorCode errorCode;

    public QuizException(BaseErrorCode errorCode) {
        super(errorCode.getReasonHttpStatus().getMessage());
        this.errorCode = errorCode;
    }
}