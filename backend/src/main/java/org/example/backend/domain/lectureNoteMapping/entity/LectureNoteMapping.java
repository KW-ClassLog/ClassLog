package org.example.backend.domain.lectureNoteMapping.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.global.entitiy.BaseEntity;
import java.util.UUID;

@Entity
@Table(name = "lecture_note_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureNoteMapping extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name = "lecture_note_id", nullable = false)
    private LectureNote lectureNote;
}