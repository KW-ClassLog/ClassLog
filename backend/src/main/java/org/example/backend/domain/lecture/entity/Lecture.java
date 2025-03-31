package org.example.backend.domain.lecture.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.global.entitiy.BaseEntity;

@Entity
@Table(name = "lecture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lecture extends BaseEntity {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private Classroom classroom;

    @Column(name = "lecture_name", nullable = false)
    private String lectureName;

    @Column(name = "audio_url")
    private String audioUrl;

    private Boolean isLectureStart;

    private Boolean saveAudio;

    @Column(nullable = false)
    private LocalDateTime lectureDate;
}