package org.example.backend.domain.lectureNoteMapping.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.global.entitiy.BaseEntity;

@Entity
@Table(name = "lecture_note_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureNoteMapping extends BaseEntity {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name = "lecture_note_id", nullable = false)
    private LectureNote lectureNote;
}