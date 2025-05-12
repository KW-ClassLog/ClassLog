package org.example.backend.domain.studentClass.service;

import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;

import java.util.List;

public interface StudentClassService {

    // 클래스 입장  & 닉네임 설정
    void studentClassEnter(StudentClassRequestDTO dto);

    // 클래스별 닉네임 수정
    void updateNickname(StudentClassRequestDTO dto);

    // 클래스뵬 닉네임 조회
    List<StudentClassResponseDTO> getNicknameByUserId();
}
