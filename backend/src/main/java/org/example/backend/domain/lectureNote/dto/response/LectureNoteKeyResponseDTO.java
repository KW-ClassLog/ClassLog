package org.example.backend.domain.lectureNote.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureNoteKeyResponseDTO {

    private UUID lectureNoteId;        // LectureNote ID
    private UUID classId;           // Class ID (Classroom ID)
    private String lectureNoteUrl;  // 저장된 S3 URL
    private String lectureNoteName; //강의록 이름
    private String fileSize;    //파일 크기
    private List<Integer> session;
}