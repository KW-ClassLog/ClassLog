package org.example.backend.domain.studentClass.service;

import java.util.UUID;

public interface StudentClassService {

    // 클래스 입장  & 닉네임 설정
    void studentClassEnter(UUID classId, UUID studentId);
}
