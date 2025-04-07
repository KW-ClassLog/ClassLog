package org.example.backend.domain.classroom.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class ClassroomException extends GeneralException {
  public ClassroomException(BaseErrorCode baseErrorCode) {
    super(baseErrorCode);
  }
}