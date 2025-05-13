package org.example.backend.domain.classroom.converter;

import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassLectureResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.UUID;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;


@Component
public class ClassroomConverter {

    @Autowired
    private UserRepository userRepository;

    public Classroom toEntity(ClassroomRequestDTO dto, UUID userId) {
        User professor = userRepository.findById(userId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.PROFESSOR_NOT_FOUND));
        return Classroom.builder()
                .className(dto.getClassName())
                .classDate(dto.getClassDate())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .professor(professor)
                .build();
    }

    // Entity → ResponseDTO
    public ClassroomResponseDTO toResponseDTO(Classroom classroom) {
        return ClassroomResponseDTO.builder()
                .classId(classroom.getId())
                .className(classroom.getClassName())
                .startDate(classroom.getStartDate())
                .endDate(classroom.getEndDate())
                .classDate(classroom.getClassDate())
                .build();
    }

    // Lecture 엔티티를 LectureResponseDTO로 변환
    public static ClassLectureResponseDTO toDTO(Lecture lecture, int session) {
        return new ClassLectureResponseDTO(
                lecture.getId(),
                lecture.getLectureName(),
                lecture.getLectureDate(),
                lecture.getStartTime(),
                lecture.getEndTime(),
                lecture.getAudioUrl(),
                session
        );
    }

    // Lecture 엔티티 리스트를 LectureResponseDTO 리스트로 변환
    public static List<ClassLectureResponseDTO> toDTOList(List<Lecture> lectures) {
        return IntStream.range(0, lectures.size()) // 0부터 lectures.size()까지의 인덱스 범위 생성
                .mapToObj(i -> toDTO(lectures.get(i), i + 1)) // 인덱스를 기반으로 session 값을 계산하여 전달
                .collect(Collectors.toList());
    }
}