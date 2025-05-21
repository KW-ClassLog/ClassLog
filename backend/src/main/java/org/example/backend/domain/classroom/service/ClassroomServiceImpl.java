package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassLectureResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.S3.service.S3Service;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassroomServiceImpl implements ClassroomService {

    private ClassroomRepository classroomRepository;
    private ClassroomConverter classroomConverter;
    private LectureNoteRepository lectureNoteRepository;
    private S3Service s3Service;
    private LectureRepository lectureRepository;

    //의존성 주입
    @Autowired
    public ClassroomServiceImpl(ClassroomConverter classroomConverter, ClassroomRepository classroomRepository, LectureNoteRepository lectureNoteRepository, S3Service s3Service, LectureRepository lectureRepository) {
        this.classroomConverter = classroomConverter;
        this.classroomRepository = classroomRepository;
        this.lectureNoteRepository = lectureNoteRepository;
        this.s3Service = s3Service;
        this.lectureRepository = lectureRepository;
    }

    // Classroom 생성
    public Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        UUID userId = ((CustomUserDetails) principal).getUser().getId();
        Role role =  ((CustomUserDetails) principal).getUser().getRole();

        if (role == Role.STUDENT) {
            throw new ClassroomException(ClassroomErrorCode.STUDENT_CANNOT_CREATE_CLASSROOM);
        }

        Classroom classroom = classroomConverter.toEntity(classroomRequestDTO, userId);

        return classroomRepository.save(classroom);
    }
    // Classroom 조회
    public Classroom getClassroom(UUID classId) {
        return classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND)); // 예외 처리
    }

    @Transactional
    // Classroom 삭제
    public void deleteClassroom(UUID classId) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        // 2. 관련 LectureNote 삭제
        List<LectureNote> notes = lectureNoteRepository.findByClassroom_Id(classId);

        // 3. S3에서 파일 삭제
        for (LectureNote note : notes) {
            // noteUrl 필드에서 S3 Key 추출 후 삭제
            String s3Key = note.getNoteUrl();  // noteUrl 필드에 S3 key가 저장되어 있다고 가정
            s3Service.deleteFile(s3Key);  // S3 파일 삭제
        }

        // 5. 관련된 Lecture 삭제
        List<Lecture> lectures = lectureRepository.findByClassroom_Id(classId);
        lectureRepository.deleteAll(lectures);

        // 4. DB에서 LectureNote 삭제
        lectureNoteRepository.deleteAll(notes);

        classroomRepository.delete(classroom);
    }

    // Classroom 수정
    public Classroom updateClassroom(UUID classId, ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));
        if (classroomRequestDTO.getClassName() != null) {
            classroom.setClassName(classroomRequestDTO.getClassName());
        }
        if (classroomRequestDTO.getClassDate() != null) {
            classroom.setClassDate(classroomRequestDTO.getClassDate());
        }
        if (classroomRequestDTO.getStartDate() != null) {
            classroom.setStartDate(classroomRequestDTO.getStartDate());
        }
        if (classroomRequestDTO.getEndDate() != null) {
            classroom.setEndDate(classroomRequestDTO.getEndDate());
        }

        return classroomRepository.save(classroom);
    }

    //강의 목록 조회
    @Override
    public List<Lecture> getLecturesByClassId(UUID classId) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        List<Lecture> lecturesInClass = lectureRepository.findByClassroom_IdOrderByLectureDateAscCreatedAtAsc(classroom.getId());

        return lecturesInClass;
    }
    //교수 나의 클래스 조회
    @Override
    public List<ClassroomResponseDTO> getClassListByProfessor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        UUID professorId = ((CustomUserDetails) principal).getUser().getId();

        // 교수 ID로 해당 교수의 클래스 목록 조회
        List<Classroom> classrooms = classroomRepository.findByProfessorId(professorId);

        // Classroom 객체를 ClassroomResponseDTO로 변환
        return classrooms.stream()
                .map(classroomConverter::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ClassLectureResponseDTO> getLectureDTOs(List<Lecture> lectures) {
        List<String> statuses = lectures.stream()
                .map(lecture -> calculateLectureStatus(
                        lecture.getLectureDate(),
                        lecture.getStartTime(),
                        lecture.getEndTime()))
                .toList();

        return classroomConverter.toDTOList(lectures, statuses);
    }

    public String calculateLectureStatus(LocalDate lectureDate, LocalTime startTime, LocalTime endTime) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (lectureDate.isAfter(today)) {
            // 강의 날짜가 오늘 이후
            return "beforeLecture";
        } else if (lectureDate.isEqual(today)) {
            // 오늘이라면 시간도 확인
            if (now.isBefore(startTime)) {
                return "beforeLecture";
            } else {
                return "quizCreation";
            }
        } else {
            // 과거 날짜
            return "quizCreation";
        }
    }



}
