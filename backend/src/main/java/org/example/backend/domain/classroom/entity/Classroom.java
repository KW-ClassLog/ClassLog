package org.example.backend.domain.classroom.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.example.backend.domain.lecture.entity.Lecture;
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
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "class_date", nullable = false)
    private String classDate;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private User professor;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL)
    private List<Lecture> lectureList = new ArrayList<>();
}
