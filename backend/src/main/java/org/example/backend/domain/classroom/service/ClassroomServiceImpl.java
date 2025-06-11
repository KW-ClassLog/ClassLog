package org.example.backend.domain.classroom.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.EntryCodeResponseDTO;
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
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.S3.service.S3Service;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ClassroomServiceImpl implements ClassroomService {

    private ClassroomRepository classroomRepository;
    private ClassroomConverter classroomConverter;
    private LectureNoteRepository lectureNoteRepository;
    private S3Service s3Service;
    private LectureRepository lectureRepository;
    private final StringRedisTemplate redisTemplate;
    private StudentClassRepository studentClassRepository;

    //의존성 주입
    @Autowired
    public ClassroomServiceImpl(ClassroomConverter classroomConverter, ClassroomRepository classroomRepository, LectureNoteRepository lectureNoteRepository, S3Service s3Service, LectureRepository lectureRepository, StringRedisTemplate redisTemplate, StudentClassRepository studentClassRepository) {
        this.classroomConverter = classroomConverter;
        this.classroomRepository = classroomRepository;
        this.lectureNoteRepository = lectureNoteRepository;
        this.s3Service = s3Service;
        this.lectureRepository = lectureRepository;
        this.redisTemplate = redisTemplate;
        this.studentClassRepository = studentClassRepository;
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

    //입장코드 레디스 저장
    public EntryCodeResponseDTO generateCode(UUID classId) {
        String code = generateRandomCode();
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(1)); // 10분 유효

        ZonedDateTime seoulTime = expiresAt.atZone(ZoneId.of("Asia/Seoul"));


        String key = "class:entrycode:" + classId;

        // Redis에 저장 (10분 TTL)
        redisTemplate.opsForValue().set(key, code, Duration.ofMinutes(1));

        return new EntryCodeResponseDTO(classId, code, seoulTime.toString());
    }

    //입장코드 생성
    private String generateRandomCode() {
        return RandomStringUtils.randomAlphanumeric(6).toUpperCase(); // 예: ABC123
    }

    //입장코드 확인
    public boolean validateEntryCode(UUID classId, String inputCode) {
        String key = "class:entrycode:" + classId;
        String storedCode = redisTemplate.opsForValue().get(key);
        return inputCode.equals(storedCode);
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
        LocalDate today = LocalDate.now();


        // 교수 ID로 해당 교수의 클래스 목록 조회
        List<Classroom> classrooms = classroomRepository.findByProfessorId(professorId);

        // Classroom 객체를 ClassroomResponseDTO로 변환
        return classrooms.stream()
                .filter(classroom -> classroom.getEndDate().isAfter(today) || classroom.getEndDate().isEqual(today))
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
        // 서울 시간 기준 now
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        // 강의 시작/종료 시간도 서울 시간대로 맞춰서 LocalDateTime -> ZonedDateTime
        ZonedDateTime startDateTime = ZonedDateTime.of(LocalDateTime.of(lectureDate, startTime), ZoneId.of("Asia/Seoul"));
        ZonedDateTime endDateTime = ZonedDateTime.of(LocalDateTime.of(lectureDate, endTime), ZoneId.of("Asia/Seoul"));

        if (now.isBefore(startDateTime)) {
            return "beforeLecture";
        } else if (!now.isBefore(startDateTime) && now.isBefore(endDateTime)) {
            return "onLecture";
        } else {
            return "afterLecture";
        }
    }

    // 이미 입장한 학생인지 확인
    public void checkAlreadyJoined(UUID classId, UUID userId) {

        boolean alreadyJoined = studentClassRepository
                .findByUserIdAndClassId(userId, classId)
                .isPresent();

        if (alreadyJoined) {
            throw new ClassroomException(ClassroomErrorCode.ALREADY_JOINED);
        }
    }
}
