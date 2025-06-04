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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        if (lectures.isEmpty()) {
            throw new QuizException(QuizErrorCode.LECTURE_NOT_FOUND);
        }

        lectures.sort(Comparator.comparing(Lecture::getLectureDate)
                .thenComparing(Lecture::getStartTime));

        List<ClassQuizResponseDTO> quizList = new ArrayList<>();

        int session = 1;
        LocalDateTime now = LocalDateTime.now();

        for (Lecture lecture : lectures) {
            LocalDate date = lecture.getLectureDate();
            LocalTime start = lecture.getStartTime();
            LocalTime end = lecture.getEndTime();
            LocalDateTime endDateTime = LocalDateTime.of(date, end);

            String status;
            if (now.isBefore(endDateTime)) {
                status = "beforeLecture";
            } else {
                boolean hasQuiz = quizRepository.existsByLectureId(lecture.getId());
                status = hasQuiz ? "checkDashboard" : "makeQuiz";
            }

            quizList.add(
                    ClassQuizResponseDTO.builder()
                            .session(session++)
                            .title(lecture.getLectureName())
                            .date(date.toString())
                            .day(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN))
                            .startTime(start)
                            .endTime(end)
                            .status(status)
                            .lectureId(lecture.getId())
                            .build()
            );
        }

        return quizList;
    }
}
