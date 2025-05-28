package org.example.backend.global.S3.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class S3Exception extends GeneralException {
    public S3Exception(BaseErrorCode baseErrorCode){
        super(baseErrorCode);
    }
}