package org.example.backend.domain.notificationSetting.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_setting")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSetting {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "quiz_upload", nullable = false)
    @Builder.Default
    private boolean quizUpload = true;

    @Column(name = "quiz_answer_upload", nullable = false)
    @Builder.Default
    private boolean quizAnswerUpload = true;

    @Column(name = "lecture_note_upload", nullable = false)
    @Builder.Default
    private boolean lectureNoteUpload = true;

    @Column(name = "lecture_upload", nullable = false)
    @Builder.Default
    private boolean lectureUpload = true;

    @Column(name = "record_upload", nullable = false)
    @Builder.Default
    private boolean recordUpload = true;
}
