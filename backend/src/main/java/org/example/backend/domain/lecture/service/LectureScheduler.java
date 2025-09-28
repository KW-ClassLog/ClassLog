package org.example.backend.domain.lecture.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.notification.entity.AlarmType;
import org.example.backend.domain.notification.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LectureScheduler {

    private final LectureRepository lectureRepository;
    private final NotificationService notificationService;

    // 매 분마다 실행
    @Scheduled(cron = "0 * * * * *")
    public void notifyProfessorBeforeLecture() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        // 🔥 "현재 시각 + 10분"이 lecture start_time 인 강의 찾기
        LocalTime targetStartTime = now.plusMinutes(10);

        List<Lecture> lectures = lectureRepository.findLecturesStartingAt(today, targetStartTime);

        for (Lecture lecture : lectures) {
            notificationService.sendAlarmToProfessor(
                    lecture.getId(),
                    AlarmType.startLecture,
                    "시스템",
                    lecture.getLectureName() + " 강의가 10분 후 시작됩니다."
            );
        }
    }
}