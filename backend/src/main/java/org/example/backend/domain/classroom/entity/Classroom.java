package org.example.backend.domain.classroom.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.entitiy.BaseEntity;

@Entity
@Table(name = "classroom")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom extends BaseEntity {

    @Id
    private String id;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "class_date", nullable = false)
    private LocalDateTime classDate;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private User professor;
}
