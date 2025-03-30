package org.example.backend.domain.studentClass.repository;
import org.example.backend.domain.studentClass.entity.StudentClass;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentClassRepository extends JpaRepository<StudentClass, StudentClassId> {

}