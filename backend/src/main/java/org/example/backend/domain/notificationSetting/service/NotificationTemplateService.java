package org.example.backend.domain.notificationSetting.service;

import org.example.backend.domain.notification.entity.AlarmType;
import org.springframework.stereotype.Service;

@Service
public class NotificationTemplateService {

    public String getTitle(AlarmType type) {
        return switch (type) {
            case quizUpload -> "📘 새 퀴즈 업로드";
            case quizAnswerUpload -> "✍️ 퀴즈 답안 업로드";
            case lectureNoteUpload -> "📄 강의 노트 업로드";
            case startLecture -> "📢 강의 시작 알림";
            case recordUpload -> "🎙️ 녹음 파일 업로드";
        };
    }

    public String getBody(AlarmType type, String senderName, String extra) {
        return switch (type) {
            case quizUpload -> senderName + " 선생님이 퀴즈를 올리셨습니다: " + extra;
            case quizAnswerUpload -> senderName + " 선생님이 퀴즈 답안을 업로드하셨습니다.";
            case lectureNoteUpload -> senderName + " 선생님이 강의 노트를 공유하셨습니다.";
            case startLecture -> senderName + " 선생님의 강의가 곧 시작됩니다. " + extra;
            case recordUpload -> senderName + " 선생님이 강의 녹음을 업로드하셨습니다.";
        };
    }
}
