package org.example.backend.domain.classroom.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.dto.response.ClassQuizResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;

@RequiredArgsConstructor
@Service
public class ClassQuizServiceImpl implements ClassQuizService {

    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;
    private final ClassroomRepository classroomRepository;


    public List<ClassQuizResponseDTO> getQuizzesByClass(UUID classId) {
        List<Lecture> lectures = lectureRepository.findByClassroom_Id(classId);


        if (lectures.isEmpty()) {
            throw new QuizException(QuizErrorCode.LECTURE_NOT_FOUND);
        }

        lectures.sort(Comparator.comparing(Lecture::getLectureDate)
                .thenComparing(Lecture::getStartTime));

        List<ClassQuizResponseDTO> quizList = new ArrayList<>();

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        for (Lecture lecture : lectures) {
            LocalDate date = lecture.getLectureDate();
            LocalTime end = lecture.getEndTime();

            ZonedDateTime endDateTime = ZonedDateTime.of(date, end, ZoneId.of("Asia/Seoul"));

            String status;
            if (now.isBefore(endDateTime)) {
                status = "beforeLecture";
            } else {
                boolean hasQuiz = quizRepository.existsByLectureId(lecture.getId());
                status = hasQuiz ? "checkDashboard" : "makeQuiz";
            }
            quizList.add(
                    ClassQuizResponseDTO.builder()
                            .session(lecture.getSession())
                            .title(lecture.getLectureName())
                            .date(date.toString())
                            .day(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN))
                            .startTime(lecture.getStartTime())
                            .endTime(end)
                            .status(status)
                            .lectureId(lecture.getId())
                            .build()
            );
        }

        return quizList;
    }
}
