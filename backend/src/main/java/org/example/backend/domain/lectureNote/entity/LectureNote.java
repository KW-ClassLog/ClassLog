package org.example.backend.domain.lectureNote.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.global.entitiy.BaseEntity;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@Entity
@Table(name = "lecture_note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureNote extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "note_url", nullable = false)
    private String noteUrl;

    @ManyToOne
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "class_id", nullable = false)
    private Classroom classroom;
}