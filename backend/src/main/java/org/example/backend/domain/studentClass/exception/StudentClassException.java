package org.example.backend.domain.studentClass.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class StudentClassException extends GeneralException {
    public StudentClassException(BaseErrorCode baseErrorCode){
        super(baseErrorCode);
    }
}