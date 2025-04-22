package org.example.backend.domain.lecture.repository;

import org.example.backend.domain.lecture.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LectureRepository extends JpaRepository<Lecture, UUID> {
    List<Lecture> findByClassroom_IdOrderByLectureDateAscCreatedAtAsc(UUID classId);
}
