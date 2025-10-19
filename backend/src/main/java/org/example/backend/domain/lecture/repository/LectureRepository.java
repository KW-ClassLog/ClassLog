package org.example.backend.domain.lecture.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.lecture.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface LectureRepository extends JpaRepository<Lecture, UUID> {
    List<Lecture> findByClassroom_IdOrderByLectureDateAscCreatedAtAsc(UUID classId);
    List<Lecture> findByClassroom_Id(UUID classId);
    List<Lecture> findByClassroom_IdInAndLectureDateOrderByStartTime(List<UUID> classIds, LocalDate lectureDate);
    List<Lecture> findByClassroomInAndLectureDate(List<Classroom> classrooms, LocalDate lectureDate);
    List<Lecture> findByClassroom_IdOrderByLectureDateAscStartTimeAsc(UUID classId);

    @Query("SELECT l FROM Lecture l " +
            "WHERE l.lectureDate = :today " +
            "AND l.startTime = :targetTime " +
            "AND l.isLectureStart = false")
    List<Lecture> findLecturesStartingAt(
            @Param("today") LocalDate today,
            @Param("targetTime") LocalTime targetTime
    );
}
