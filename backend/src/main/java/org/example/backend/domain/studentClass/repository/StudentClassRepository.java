package org.example.backend.domain.studentClass.repository;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;
import org.springframework.data.jpa.repository.JpaRepository;
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
}