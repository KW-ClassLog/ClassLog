package org.example.backend.domain.studentClass.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentClassServiceImpl implements StudentClassService{

    private final StudentClassRepository studentClassRepository;

    // 클래스 입장  & 닉네임 설정
    @Override
    public void studentClassEnter(UUID classId, UUID studentId) {



    }
}
