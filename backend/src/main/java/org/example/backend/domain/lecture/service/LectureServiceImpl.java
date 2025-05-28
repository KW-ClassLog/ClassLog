package org.example.backend.domain.lecture.service;


import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.converter.LectureConverter;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.exception.LectureErrorCode;
import org.example.backend.domain.lecture.exception.LectureException;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final LectureConverter lectureConverter;
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
    }

    // lecture 삭제
    @Override
    public void deleteLecture(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        lectureRepository.delete(lecture);
    }

    @Transactional
    public List<UUID> mapNotes(UUID lectureId, List<UUID> lectureNoteIds) {
        // 1. 강의 조회
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        // 2. 노트 목록 조회
        List<LectureNote> notes = lectureNoteRepository.findAllById(lectureNoteIds);

        if (notes.size() != lectureNoteIds.size()) {
            throw new LectureException(LectureErrorCode.LECTURE_NOT_FOUND);
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
}
