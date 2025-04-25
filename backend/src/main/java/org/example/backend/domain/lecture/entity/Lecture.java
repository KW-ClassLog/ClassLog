package org.example.backend.domain.lecture.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.global.entitiy.BaseEntity;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "lecture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lecture extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @OnDelete(action= OnDeleteAction.CASCADE)
    @JoinColumn(name = "class_id", nullable = false)
    private Classroom classroom;

    @Column(name = "lecture_name", nullable = false)
    private String lectureName;

    @Column(name = "audio_url")
    private String audioUrl;

    private Boolean isLectureStart;

    private Boolean saveAudio;

    @Column(name = "lecture_date", nullable = false)
    private LocalDate lectureDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;
}