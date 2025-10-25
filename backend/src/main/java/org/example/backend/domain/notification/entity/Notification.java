package org.example.backend.domain.notification.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.entitiy.BaseEntity;
import java.util.UUID;


@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "lecture_id", nullable = true)
    private Lecture lecture;

    @Enumerated(EnumType.STRING)
    @Column(name = "alarm_type", nullable = false)
    private AlarmType alarmType;

    @JsonProperty("isRead")
    @Column(name = "is_read", nullable = false)
    private boolean isRead;


}

