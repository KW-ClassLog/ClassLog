package org.example.backend.domain.lectureNote.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.classroom.entity.Classroom;

@Entity
@Table(name = "lecture_note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureNote {

    @Id
    private String id;

    @Column(name = "note_url", nullable = false)
    private String noteUrl;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private Classroom classroom;
}