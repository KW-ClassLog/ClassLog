package org.example.backend.domain.lecture.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class LectureException extends GeneralException {
    public LectureException(BaseErrorCode baseErrorCode) {
        super(baseErrorCode);
    }
}
