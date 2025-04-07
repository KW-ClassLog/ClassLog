package org.example.backend.domain.user.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class UserException extends GeneralException {
    public UserException(BaseErrorCode baseErrorCode){
        super(baseErrorCode);
    }
}