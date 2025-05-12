package org.example.backend.domain.studentClass.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.studentClass.converter.StudentClassConverter;
import org.example.backend.domain.studentClass.dto.request.ClassEnterRequestDTO;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.exception.StudentClassErrorCode;
import org.example.backend.domain.studentClass.exception.StudentClassException;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentClassServiceImpl implements StudentClassService{

    private final StudentClassRepository studentClassRepository;
    private final StudentClassConverter studentClassConverter;

    // 클래스 입장  & 닉네임 설정
    @Override
    public void studentClassEnter(ClassEnterRequestDTO classEnterRequestDTO) {

        StudentClass studentClass = studentClassConverter.toClassEnterRequestDTO(classEnterRequestDTO);

        // 이미 입장했는지 확인
        if (studentClassRepository.existsByUserIdAndClassId(studentClass.getUserId(), studentClass.getClassId())) {
            throw new StudentClassException(StudentClassErrorCode._STUDENT_ALREADY_ENTER);
        }

        studentClassRepository.save(studentClass);

    }
}
