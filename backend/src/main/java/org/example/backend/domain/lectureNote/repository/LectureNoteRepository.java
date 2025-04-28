package org.example.backend.domain.lectureNote.repository;

import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LectureNoteRepository extends JpaRepository<LectureNote, UUID> {
}
