package org.example.backend.global.exception;

import org.example.backend.global.code.BaseErrorCode;

public class FailureException extends GeneralException {

  public FailureException(BaseErrorCode baseErrorCode) {
    super(baseErrorCode);
  }
}