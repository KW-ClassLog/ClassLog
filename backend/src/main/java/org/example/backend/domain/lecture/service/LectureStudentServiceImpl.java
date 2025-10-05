package org.example.backend.domain.lecture.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.converter.LectureStudentConverter;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.dto.response.StudentTodayLectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.exception.LectureErrorCode;
import org.example.backend.domain.lecture.exception.LectureException;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LectureStudentServiceImpl implements LectureStudentService {

    private final StudentClassRepository studentClassRepository;
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final LectureStudentConverter lectureStudentConverter;
    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final CustomSecurityUtil customSecurityUtil;

    // 오늘의 강의 목록
    @Override
    public StudentTodayLectureResponseDTO getClassListByStudent(LocalDate date) {
        UUID studentId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUser().getId();

        List<UUID> classIds = studentClassRepository.findClassIdsByUserId(studentId);

        if (classIds.isEmpty()) {
            return new StudentTodayLectureResponseDTO(0, 0, 0, Collections.emptyList());
        }

        List<Lecture> lectures = lectureRepository.findByClassroom_IdInAndLectureDateOrderByStartTime(classIds, date);

        lectures.sort(Comparator.comparing(Lecture::getStartTime));

        LocalTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalTime();

        List<StudentTodayLectureResponseDTO.LectureDTO> dtoList = new ArrayList<>();
        int done = 0;

        for (int i = 0; i < lectures.size(); i++) {
            Lecture lecture = lectures.get(i);
            if (now.isAfter(lecture.getEndTime())) {
                done++;
            }

            UUID classId = lecture.getClassroom().getId();

            String className = classroomRepository.findById(classId)
                    .map(Classroom::getClassName)
                    .orElse("Unknown");

            dtoList.add(lectureStudentConverter.toStudentLectureDTO(lecture, className, i + 1));
        }

        return lectureStudentConverter.toStudentLectureListDTO(dtoList, done);

    }

    // lecture 조회
    @Override
    public LectureResponseDTO getLecture(UUID lectureId) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        UUID userId = customSecurityUtil.getUserId();

        // 서울 시간 기준 now
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        ZonedDateTime startDateTime = ZonedDateTime.of(
                LocalDateTime.of(lecture.getLectureDate(), lecture.getStartTime()),
                ZoneId.of("Asia/Seoul")
        );

        ZonedDateTime endDateTime = ZonedDateTime.of(
                LocalDateTime.of(lecture.getLectureDate(), lecture.getEndTime()),
                ZoneId.of("Asia/Seoul")
        );

        String status;

        if (now.isBefore(startDateTime)) {
            status = "beforeLecture";
        } else if (!now.isBefore(startDateTime) && now.isBefore(endDateTime)) {
            status = "onLecture";
        } else {
            boolean hasQuiz = quizRepository.existsByLectureId(lecture.getId());
            if (!hasQuiz) {
                status = "afterLectureBeforeQuiz";
            } else{
                List<Quiz> quizzes = quizRepository.findByLectureId(lecture.getId());

                boolean allSubmitted = quizzes.stream()
                        .allMatch(q -> quizAnswerRepository.existsByUserIdAndQuizId(userId, q.getId()));
                status = allSubmitted ? "viewMyQuizResult" : "quizReadyForSubmission";
            }
        }

        String weekDay = lecture.getLectureDate()
                .getDayOfWeek()
                .getDisplayName(TextStyle.SHORT, Locale.KOREAN);

        return LectureResponseDTO.builder()
                .lectureId(lecture.getId())
                .classId(lecture.getClassroom().getId().toString())
                .lectureName(lecture.getLectureName())
                .lectureDate(lecture.getLectureDate())
                .weekDay(weekDay)
                .session(lecture.getSession())
                .startTime(lecture.getStartTime())
                .endTime(lecture.getEndTime())
                .status(status)
                .build();
    }
}
