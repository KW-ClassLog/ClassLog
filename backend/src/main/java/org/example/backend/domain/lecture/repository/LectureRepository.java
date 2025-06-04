package org.example.backend.domain.lecture.repository;

import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.lecture.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface LectureRepository extends JpaRepository<Lecture, UUID> {
    List<Lecture> findByClassroom_IdOrderByLectureDateAscCreatedAtAsc(UUID classId);
    List<Lecture> findByClassroom_Id(UUID classId);
    List<Lecture> findByClassroom_IdInAndLectureDateOrderByStartTime(List<UUID> classIds, LocalDate lectureDate);
    List<Lecture> findByClassroomInAndLectureDate(List<Classroom> classrooms, LocalDate lectureDate);
    List<Lecture> findByClassroom_IdOrderByLectureDateAsc(UUID classId);

}
