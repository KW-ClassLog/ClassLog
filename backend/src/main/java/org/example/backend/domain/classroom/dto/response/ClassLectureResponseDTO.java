package org.example.backend.domain.classroom.dto.response;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClassLectureResponseDTO {

    private UUID lectureId;        // 강의 ID
    private String lectureName;    // 강의 이름
    private LocalDate lectureDate; // 강의 날짜
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;   // 강의 시작 시간
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;   // 강의 종료 시간
    private String status;  //'beforeLecture' | 'showDashboard' | 'quizCreation’
    private Integer session; //차시
}
