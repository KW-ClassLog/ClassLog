package org.example.backend.domain.lecture.service;


import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.converter.LectureConverter;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.LectureRecordingResponseDTO;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.dto.response.TodayLectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.exception.LectureErrorCode;
import org.example.backend.domain.lecture.exception.LectureException;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.global.S3.exception.S3ErrorCode;
import org.example.backend.global.S3.exception.S3Exception;
import org.example.backend.global.S3.service.S3Service;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final LectureConverter lectureConverter;
    private final S3Service s3Service;
    private final LectureNoteRepository lectureNoteRepository;
    private final LectureNoteMappingRepository lectureNoteMappingRepository;
    private final QuizRepository quizRepository;

    // lecture 생성
    @Override
    public Lecture createLecture(LectureRequestDTO dto) {
        UUID classId = dto.getClassId();
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.CLASS_NOT_FOUND));

        Lecture lecture = lectureConverter.toEntity(dto, classroom);
        lectureRepository.save(lecture);
        updateLectureSessions(classId);
        return lecture;
    }

    // lecture 조회
    @Override
    public LectureResponseDTO getLectureDetail(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));


        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startDateTime = LocalDateTime.of(lecture.getLectureDate(), lecture.getStartTime());
        LocalDateTime endDateTime = LocalDateTime.of(lecture.getLectureDate(), lecture.getEndTime());

        String status;

        if (now.isBefore(startDateTime)) {
            status = "beforeLecture";
        } else if (!now.isBefore(startDateTime) && now.isBefore(endDateTime)) {
            status = "onLecture";
        } else {
            boolean hasQuiz = quizRepository.existsByLectureId(lecture.getId());
            status = hasQuiz ? "checkDashboard" : "makeQuiz";
        }


        String weekDay = lecture.getLectureDate()
                .getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.KOREAN);


        return LectureResponseDTO.builder()
                .lectureId(lecture.getId())
                .classId(lecture.getClassroom().getId().toString())
                .lectureName(lecture.getLectureName())
                .lectureDate(lecture.getLectureDate())
                .weekDay(weekDay)
                .session(lecture.getSession())
                .startTime(lecture.getStartTime())
                .endTime(lecture.getEndTime())
                .status(status)
                .build();

    }

    // lecture 수정
    @Transactional
    @Override
    public void updateLecture(UUID lectureId, LectureRequestDTO dto) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        if (dto.getLectureName() != null) {
            lecture.setLectureName(dto.getLectureName());
        }

        if (dto.getLectureDate() != null) {
            lecture.setLectureDate(dto.getLectureDate());
        }

        if (dto.getClassId() != null && !dto.getClassId().equals(lecture.getClassroom().getId())) {
            Classroom classroom = classroomRepository.findById(dto.getClassId())
                    .orElseThrow(() -> new LectureException(LectureErrorCode.CLASS_NOT_FOUND));
            lecture.setClassroom(classroom);
        }
        UUID classId = lecture.getClassroom().getId();
        updateLectureSessions(classId);

    }

    // lecture 삭제
    @Override
    public void deleteLecture(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));
        UUID classId = lecture.getClassroom().getId();
        lectureRepository.delete(lecture);
        updateLectureSessions(classId);
    }

    //녹음본 저장
    public LectureRecordingResponseDTO uploadLectureRecording(UUID lectureId, MultipartFile file) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        String key = "recordings/" + lectureId +"/" + UUID.randomUUID() + "/" + file.getOriginalFilename();

        try {
            s3Service.uploadFile(file, key); // private 업로드
        } catch (IOException e) {
            throw new S3Exception(S3ErrorCode.UPLOAD_FAIL);
        }

        lecture.setAudioUrl(key);
        lectureRepository.save(lecture);

        String audioName = key.substring(key.lastIndexOf('/') + 1);

        return LectureRecordingResponseDTO.builder()
                .lectureId(lecture.getId())
                .audioName(audioName)
                .audioUrl(s3Service.getPresignedUrl(key))
                .build();
    }

    //녹음본 조회
    public LectureRecordingResponseDTO getLectureRecording(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        String s3Key = lecture.getAudioUrl();

        if (s3Key == null) {
            throw new LectureException(LectureErrorCode.NO_AUDIO_FILE);
        }
        String audioUrl = s3Service.getPresignedUrl(s3Key);
        String audioName = s3Key.substring(s3Key.lastIndexOf('/') + 1);
        String fileSize = s3Service.getFileSize(s3Key);

        return LectureRecordingResponseDTO.builder()
                .lectureId(lectureId)
                .audioName(audioName)
                .audioUrl(audioUrl)
                .fileSize(fileSize)
                .build();
    }

    @Transactional
    public List<UUID> mapNotes(UUID lectureId, List<UUID> requestedNoteIds) {
        // 1. 강의 조회
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        // 2. 요청한 강의자료들 존재 여부 확인
        List<LectureNote> requestedNotes = lectureNoteRepository.findAllById(requestedNoteIds);
        if (requestedNotes.size() != requestedNoteIds.size()) {
            throw new LectureException(LectureErrorCode.LECTURE_NOTE_NOT_FOUND);
        }

        // 3. 기존 매핑 조회
        List<LectureNoteMapping> existingMappings = lectureNoteMappingRepository.findAllByLectureId(lectureId);
        Map<UUID, LectureNoteMapping> existingMapByNoteId = existingMappings.stream()
                .collect(Collectors.toMap(m -> m.getLectureNote().getId(), m -> m));

        Set<UUID> existingNoteIds = existingMapByNoteId.keySet();
        Set<UUID> requestedNoteIdSet = new HashSet<>(requestedNoteIds);

        // 4. 제거 대상: 기존에 있었지만 요청에 없는 것
        Set<UUID> toRemove = new HashSet<>(existingNoteIds);
        toRemove.removeAll(requestedNoteIdSet);

        // 5. 추가 대상: 요청에 있지만 기존에 없던 것
        Set<UUID> toAdd = new HashSet<>(requestedNoteIdSet);
        toAdd.removeAll(existingNoteIds);

        // 6. 삭제
        List<LectureNoteMapping> mappingsToDelete = toRemove.stream()
                .map(existingMapByNoteId::get)
                .toList();
        lectureNoteMappingRepository.deleteAll(mappingsToDelete);

        // 7. 추가
        List<LectureNote> notesToAdd = requestedNotes.stream()
                .filter(note -> toAdd.contains(note.getId()))
                .toList();

        List<LectureNoteMapping> newMappings = notesToAdd.stream()
                .map(note -> LectureNoteMapping.builder()
                        .lecture(lecture)
                        .lectureNote(note)
                        .build())
                .toList();
        lectureNoteMappingRepository.saveAll(newMappings);

        // 8. 최종 매핑된 노트 ID 반환
        Set<UUID> finalMappedIds = new HashSet<>(requestedNoteIdSet); // 요청된 ID가 최종 상태
        return new ArrayList<>(finalMappedIds);
    }

    // 교수 날짜별 강의 조회
    @Override
    public List<TodayLectureResponseDTO> getClassListByProfessor(LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        UUID professorId = ((CustomUserDetails) principal).getUser().getId();
        List<Classroom> classrooms = classroomRepository.findByProfessorId(professorId);

        List<Lecture> lectures = lectureRepository.findByClassroomInAndLectureDate(classrooms, date);

        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        return lectures.stream()
                .sorted(Comparator.comparing(Lecture::getStartTime))
                .map(lecture -> {
                    String status;
                    if (today.isAfter(lecture.getLectureDate())) {
                        status = "afterLecture";
                    } else if (today.isEqual(lecture.getLectureDate())) {
                        if (now.isBefore(lecture.getStartTime())) {
                            status = "beforeLecture";
                        } else if (!now.isBefore(lecture.getStartTime()) && now.isBefore(lecture.getEndTime())) {
                            status = "onLecture";
                        } else {
                            status = "afterLecture";
                        }
                    } else {
                        status = "beforeLecture";
                    }
                    return new TodayLectureResponseDTO(
                            lecture.getId(),
                            lecture.getLectureName(),
                            lecture.getLectureDate(),
                            lecture.getClassroom().getClassName(),
                            lecture.getStartTime(),
                            lecture.getEndTime(),
                            lecture.getSession(),
                            status
                    );
                })
                .collect(Collectors.toList());
    }

    //몇차시인지 입력하는 함수
    public void updateLectureSessions(UUID classId) {
        List<Lecture> lectures = lectureRepository.findByClassroom_IdOrderByLectureDateAscStartTimeAsc(classId);
        for (int i = 0; i < lectures.size(); i++) {
            lectures.get(i).setSession(i + 1);
        }
        lectureRepository.saveAll(lectures);
    }


}
