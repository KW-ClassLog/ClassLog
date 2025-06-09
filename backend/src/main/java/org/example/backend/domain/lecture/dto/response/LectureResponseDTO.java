package org.example.backend.domain.lecture.dto.response;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureResponseDTO {
    private UUID lectureId;
    private String classId;
    private String lectureName;
    private LocalDate lectureDate;
    private String weekDay;
    private Integer session;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;   // 강의 시작 시간
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;   // 강의 종료 시간
    private String status;
}
