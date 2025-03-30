package org.example.backend.domain.studentClass.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.studentClass.entity.id.StudentClassId;

@Entity
@Table(name = "student_class")
@IdClass(StudentClassId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClass {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "class_id")
    private String classId;

    @Column(name = "class_nickname", nullable = false)
    private String classNickname;
}