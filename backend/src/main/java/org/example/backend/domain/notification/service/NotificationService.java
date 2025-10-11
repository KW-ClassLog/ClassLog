package org.example.backend.domain.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.notification.converter.NotificationConverter;
import org.example.backend.domain.notification.dto.response.NotificationResponseDTO;
import org.example.backend.domain.notification.entity.AlarmType;
import org.example.backend.domain.notification.entity.Notification;
import org.example.backend.domain.notification.repository.NotificationRepository;
import org.example.backend.domain.notificationSetting.service.FcmService;
import org.example.backend.domain.notificationSetting.service.NotificationTemplateService;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.userdeviceToken.repository.UserDeviceTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationService implements NotificationServiceImpl{
    private final NotificationRepository notificationRepository;
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final NotificationConverter notificationConverter;
    private final NotificationTemplateService templateService;
    private final UserDeviceTokenRepository tokenRepository;
    private final FcmService fcmService;
    private final StudentClassRepository studentClassRepository;
    private final UserRepository userRepository;

    public List<NotificationResponseDTO> getNotificationsByUserId(UUID userId) {
        List<Notification> notificationList =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return notificationList.stream()
                .map(notification -> {
                    Lecture lecture = notification.getLecture();

                    String className = null;
                    if (lecture != null && lecture.getClassroom() != null) {
                        className = lecture.getClassroom().getClassName();
                    }

                    return notificationConverter.toDTO(notification, className);
                })
                .toList();
    }

    public void sendAlarmToProfessor(UUID lectureId, AlarmType type, String senderName, String extra) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        UUID professorId = lecture.getClassroom().getProfessor().getId();

        String title = templateService.getTitle(type);
        String body = templateService.getBody(type, senderName, extra);

        var tokens = tokenRepository.findAllByUserIdAndIsActiveTrue(professorId);
        tokens.forEach(token ->
                fcmService.sendNotification(token.getFcmToken(), title, body)
        );

        Notification notification = Notification.builder()
                .user(lecture.getClassroom().getProfessor())
                .lecture(lecture)
                .alarmType(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void sendAlarmToStudentInLecture(UUID lectureId, UUID studentUserId,
                                            AlarmType type, String senderName, String extra) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        UUID classId = lecture.getClassroom().getId();

        // 수강 검증 (해당 반의 학생인지)
        if (!studentClassRepository.existsByClassIdAndUserId(classId, studentUserId)) {
            throw new RuntimeException("Student does not belong to this class");
        }

        String title = templateService.getTitle(type);
        String body  = templateService.getBody(type, senderName, extra);

        sendToUser(studentUserId, title, body);

        User student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = Notification.builder()
                .user(student)
                .lecture(lecture)
                .alarmType(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void sendAlarmToAllStudentsInLecture(UUID lectureId,
                                                AlarmType type, String senderName, String extra) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        UUID classId = lecture.getClassroom().getId();

        String title = templateService.getTitle(type);
        String body  = templateService.getBody(type, senderName, extra);

        // 이 반에 속한 모든 학생 userId
        List<UUID> studentIds = studentClassRepository.findUserIdsByClassId(classId);

        log.info("[Notification] classId={}, lectureId={}, studentCount={}", classId, lectureId, studentIds);
        log.debug("[Notification] studentIds={}", studentIds);

        // (간단 버전) 각 유저별 토큰 찾아 전송
        studentIds.stream().distinct().forEach(id -> sendToUser(id, title, body));

        List<Notification> notifications = studentIds.stream()
                .distinct()
                .map(id -> Notification.builder()
                        .user(userRepository.getReferenceById(id))
                        .lecture(lecture)
                        .alarmType(type)
                        .isRead(false)
                        .build()
                ).toList();

        notificationRepository.saveAll(notifications);
    }

    /** 공통 전송 헬퍼: 유저의 활성 FCM 토큰 전부에 발송 */
    private void sendToUser(UUID userId, String title, String body) {
        var tokens = tokenRepository.findAllByUserIdAndIsActiveTrue(userId);
        tokens.forEach(token -> fcmService.sendNotification(token.getFcmToken(), title, body));
    }
    @Transactional
    public void sendAlarmToAllStudentsInClass(UUID classId,
                                              AlarmType type,
                                              String senderName,
                                              String extra) {
        // 1) 반 로딩
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // 2) 템플릿 생성
        String title = templateService.getTitle(type);
        String body  = templateService.getBody(type, senderName, extra);

        // 3) 학생 userId 조회 (null 제거 + 중복 제거)
        List<UUID> studentIds = studentClassRepository.findUserIdsByClassId(classId)
                .stream()
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();

        log.info("[Notification] classId={}, studentCount={}", classId, studentIds.size());
        log.debug("[Notification] studentIds={}", studentIds);

        if (studentIds.isEmpty()) return;

        // 4) 푸시 발송 (유저별 활성 토큰에 전송)
        studentIds.forEach(id -> sendToUser(id, title, body));

        // 5) Notification 저장 (lecture는 클래스 단위이므로 null 가능해야 함)
        var students = userRepository.findAllById(studentIds);
        var userMap = students.stream().collect(
                java.util.stream.Collectors.toMap(
                        org.example.backend.domain.user.entity.User::getId,
                        java.util.function.Function.identity()
                )
        );

        List<Notification> notifications = studentIds.stream()
                .map(id -> {
                    User u = userMap.get(id);
                    if (u == null) {
                        log.warn("[Notification] user not found for userId={} (skipped)", id);
                        return null;
                    }
                    return Notification.builder()
                            .user(u)
                            .lecture(null)     // 특정 회차가 없으므로 null (엔티티가 nullable이어야 함)
                            .alarmType(type)
                            .isRead(false)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();

        notificationRepository.saveAll(notifications);
        log.info("[Notification] saved notifications={}", notifications.size());
    }







    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
}
