package org.example.backend.global.exception;

import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;

@Getter
public class GeneralException extends RuntimeException{
    private final BaseErrorCode baseErrorCode;

    public GeneralException(BaseErrorCode baseErrorCode){
        super(baseErrorCode.getReasonHttpStatus().getMessage());
        this.baseErrorCode = baseErrorCode;
    }
}