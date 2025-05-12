package org.example.backend.domain.studentClass.repository;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudentClassRepository extends JpaRepository<StudentClass, StudentClassId> {
    boolean existsByUserIdAndClassId(UUID userId, UUID classId);
}