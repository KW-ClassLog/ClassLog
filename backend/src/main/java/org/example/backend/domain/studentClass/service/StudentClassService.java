package org.example.backend.domain.studentClass.service;

import org.example.backend.domain.studentClass.dto.request.ClassEnterRequestDTO;

public interface StudentClassService {

    // 클래스 입장  & 닉네임 설정
    void studentClassEnter(ClassEnterRequestDTO classEnterRequestDTO);
}
