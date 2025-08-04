package org.example.backend.domain.studentClass.repository;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentClassRepository extends JpaRepository<StudentClass, StudentClassId> {
    Optional<StudentClass> findByUserIdAndClassId(UUID userId, UUID classId);
    List<StudentClass> findByUserId(UUID userId);
    List<StudentClass> findAllByClassId(UUID classId);
    // studentId가 수강중인 classId 조회
    @Query("SELECT sc.classId FROM StudentClass sc WHERE sc.userId = :userId")
    List<UUID> findClassIdsByUserId(@Param("userId") UUID userId);


    //클래스에서 학생 아이디 찾아서 삭제
    @Modifying
    @Query("DELETE FROM StudentClass cs WHERE cs.classroom.id = :classId AND cs.userId IN :studentIds")
    void deleteByClassroomIdAndStudentIds(@Param("classId") UUID classId, @Param("studentIds") List<UUID> studentIds);


    @Query("""
    SELECT CASE WHEN COUNT(sc) > 0 THEN TRUE ELSE FALSE END
    FROM StudentClass sc
    WHERE sc.userId = :userId
      AND sc.classId = (
          SELECT l.classroom.id FROM Lecture l WHERE l.id = :lectureId
      )
""")
    boolean existsByUserIdAndLectureId(@Param("userId") UUID userId, @Param("lectureId") UUID lectureId);
}