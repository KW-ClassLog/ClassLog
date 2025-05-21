package org.example.backend.domain.studentClass.service;

import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseStudentDTO;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;

import java.util.List;
import java.util.UUID;

public interface StudentClassService {

    // 클래스 입장  & 닉네임 설정
    void studentClassEnter(StudentClassRequestDTO dto);

    // 클래스별 닉네임 수정
    void updateNickname(StudentClassRequestDTO dto);

    // 클래스 전체 닉네임 조회
    List<StudentClassResponseDTO> getNicknameByUserId();

    // 클래스별 닉네임 조회
    StudentClassResponseDTO getNicknameByClassId(UUID classId);

    // 참여중인 클래스 조회
    List<ClassroomResponseStudentDTO> getClassroomByStudentId();
}
