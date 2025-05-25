package org.example.backend.domain.studentClass.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseStudentDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.studentClass.converter.StudentClassConverter;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentEnrolledResponseDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.exception.StudentClassErrorCode;
import org.example.backend.domain.studentClass.exception.StudentClassException;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.exception.FailureException;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentClassServiceImpl implements StudentClassService{

    private final StudentClassRepository studentClassRepository;
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final StudentClassConverter studentClassConverter;
    private final CustomSecurityUtil customSecurityUtil;
    private final ClassroomConverter classroomConverter;

    // 클래스 입장  & 닉네임 설정
    @Override
    public void studentClassEnter(StudentClassRequestDTO dto) {

        UUID classId = dto.getClassId();
        UUID studentId = customSecurityUtil.getUserId();

        classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        userRepository.findById(studentId)
                .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));

        if (studentClassRepository.findByUserIdAndClassId(studentId, classId).isPresent()) {
            throw new StudentClassException(StudentClassErrorCode._STUDENT_ALREADY_ENTER);
        }

        StudentClass studentClass = studentClassConverter.toClassEnterRequestDTO(studentId, dto);

        studentClassRepository.save(studentClass);
    }

    // 클래스별 닉네임 수정
    @Override
    public void updateNickname(StudentClassRequestDTO dto) {

        UUID classId = dto.getClassId();
        UUID studentId = customSecurityUtil.getUserId();
        String newNickname = dto.getClassNickname();

        StudentClass studentClass = studentClassRepository.findByUserIdAndClassId(studentId, classId)
                .orElseThrow(() -> new StudentClassException(StudentClassErrorCode._STUDENT_NOT_IN_CLASS));

        // 닉네임 수정
        studentClass.setClassNickname(newNickname);

        studentClassRepository.save(studentClass);
    }

    // 클래스 전체 닉네임 조회
    @Override
    public List<StudentClassResponseDTO> getNicknameByUserId() {
        UUID studentId = customSecurityUtil.getUserId();

        List<StudentClass> studentClasses = studentClassRepository.findByUserId(studentId);

        return studentClasses.stream()
                .map(studentClassConverter::toResponseDTO)
                .collect(Collectors.toList());
    }

    // 클래스별 닉네임 조회
    @Override
    public StudentClassResponseDTO getNicknameByClassId(UUID classId) {
        UUID studentId = customSecurityUtil.getUserId();

        StudentClass studentClass = studentClassRepository.findByUserIdAndClassId(studentId, classId)
                .orElseThrow(() -> new StudentClassException(StudentClassErrorCode._STUDENT_NOT_IN_CLASS));

        return studentClassConverter.toResponseDTO(studentClass);
    }

    // 참여중인 클래스 조회
    @Override
    public List<ClassroomResponseStudentDTO> getClassroomByStudentId() {
        UUID studentId = customSecurityUtil.getUserId();

        List<StudentClass> studentClasses = studentClassRepository.findByUserId(studentId);

        if (studentClasses.isEmpty()) {
            throw new StudentClassException(StudentClassErrorCode._STUDENT_NOT_IN_CLASS);
        }

        List<UUID> classIds = studentClasses.stream()
                .map(StudentClass::getClassId)
                .collect(Collectors.toList());

        List<Classroom> classrooms = classroomRepository.findAllById(classIds);

        return classrooms.stream()
                .map(classroomConverter::toResponseStudentDTO)
                .collect(Collectors.toList());
    }

    // 클래스 학생목록 조회
    @Override
    public List<StudentEnrolledResponseDTO> getStudentByClassId(UUID classId) {
        Role role = customSecurityUtil.getUserRole();

        if (role != Role.TEACHER) {
            throw new FailureException(FailureCode._FORBIDDEN);
        }

        classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        List<StudentClass> studentClasses = studentClassRepository.findAllByClassId(classId);

        return studentClasses.stream()
                .map(sc -> {
                    User user = userRepository.findById(sc.getUserId())
                            .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));
                    return studentClassConverter.toStudentEnrolledResponseDTO(sc, user);
                })
                .collect(Collectors.toList());
    }
}
