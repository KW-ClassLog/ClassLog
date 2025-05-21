package org.example.backend.domain.studentClass.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;
import org.example.backend.global.entitiy.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "student_class")
@IdClass(StudentClassId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClass extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "class_id")
    private UUID classId;

    @Column(name = "class_nickname", nullable = false)
    private String classNickname;
}