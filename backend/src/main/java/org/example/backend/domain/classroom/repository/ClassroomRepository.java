package org.example.backend.domain.classroom.repository;

import org.example.backend.domain.classroom.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    List<Classroom> findByProfessorId(UUID professorId);
    Optional<Classroom> findById(UUID id);
}
