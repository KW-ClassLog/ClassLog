package org.example.backend.domain.lectureNoteMapping.repository;

import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LectureNoteMappingRepository  extends JpaRepository<LectureNoteMapping, UUID> {
    List<LectureNoteMapping> findAllByLectureId(UUID lectureId);
}