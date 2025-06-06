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
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
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
    public LectureResponseDTO getLectureDetail(UUID classId, UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        if (!lecture.getClassroom().getId().equals(classId)) {
            throw new LectureException(LectureErrorCode.LECTURE_NOT_IN_CLASS);
        }

        List<Lecture> lecturesInClass = lectureRepository
                .findByClassroom_IdOrderByLectureDateAscCreatedAtAsc(classId);

        int session = 1;
        for (int i = 0; i < lecturesInClass.size(); i++) {
            if (lecturesInClass.get(i).getId().equals(lectureId)) {
                session = i + 1;
                break;
            }
        }
        return lectureConverter.toResponseDTO(lecture, session);
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

        return LectureRecordingResponseDTO.builder()
                .lectureId(lecture.getId())
                .audioKey(key)
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
        String fileSize = s3Service.getFileSize(s3Key);

        return LectureRecordingResponseDTO.builder()
                .lectureId(lectureId)
                .audioKey(s3Key)
                .audioUrl(audioUrl)
                .fileSize(fileSize)
                .build();
    }

    //강의록 강의 맵핑
    @Transactional
    public List<UUID> mapNotes(UUID lectureId, List<UUID> lectureNoteIds) {
        // 1. 강의 조회
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        // 2. 노트 목록 조회
        List<LectureNote> notes = lectureNoteRepository.findAllById(lectureNoteIds);

        if (notes.size() != lectureNoteIds.size()) {
            throw new LectureException(LectureErrorCode.LECTURE_NOTE_NOT_FOUND);
        }

        // 3. 매핑 생성
        List<LectureNoteMapping> mappings = notes.stream()
                .map(note -> LectureNoteMapping.builder()
                        .lecture(lecture)
                        .lectureNote(note)
                        .build())
                .toList();

        // 4. 저장
        lectureNoteMappingRepository.saveAll(mappings);

        // 5. 응답용 lectureNoteId 목록 반환
        return notes.stream()
                .map(LectureNote::getId)
                .toList();
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
                            status
                    );
                })
                .collect(Collectors.toList());
    }

    //몇차시인지 입력하는 함수
    public void updateLectureSessions(UUID classId) {
        List<Lecture> lectures = lectureRepository.findByClassroom_IdOrderByLectureDateAsc(classId);
        for (int i = 0; i < lectures.size(); i++) {
            lectures.get(i).setSession(i + 1);
        }
        lectureRepository.saveAll(lectures);
    }


}
