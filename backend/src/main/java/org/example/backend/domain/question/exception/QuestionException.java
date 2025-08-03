package org.example.backend.domain.question.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class QuestionException extends GeneralException {
    public QuestionException(BaseErrorCode baseErrorCode){
        super(baseErrorCode);
    }
}
