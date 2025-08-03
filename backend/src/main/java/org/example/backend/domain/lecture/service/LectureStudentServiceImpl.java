package org.example.backend.domain.lecture.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lecture.converter.LectureStudentConverter;
import org.example.backend.domain.lecture.dto.response.StudentTodayLectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class LectureStudentServiceImpl implements LectureStudentService {

    private final StudentClassRepository studentClassRepository;
    private final LectureRepository lectureRepository;
    private final ClassroomRepository classroomRepository;
    private final LectureStudentConverter lectureStudentConverter;

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
}
