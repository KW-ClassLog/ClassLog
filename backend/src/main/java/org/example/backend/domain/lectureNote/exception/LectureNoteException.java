package org.example.backend.domain.lectureNote.exception;

import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.exception.GeneralException;

public class LectureNoteException extends GeneralException {
    public LectureNoteException(BaseErrorCode baseErrorCode) {
        super(baseErrorCode);
    }
}