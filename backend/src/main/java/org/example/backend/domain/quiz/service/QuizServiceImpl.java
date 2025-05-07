package org.example.backend.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.infra.langchain.LangChainClient;
import org.springframework.stereotype.Service;
import org.example.backend.global.S3.service.S3Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final LectureRepository lectureRepository;
    private final LectureNoteMappingRepository lectureNoteMappingRepository;
    private final LectureNoteRepository lectureNoteRepository;
    private final LangChainClient langChainClient;
    private final S3Service s3Service;

    @Override
    public QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request) {
        // 1. 강의 존재 여부 확인
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LectureNotFound));

        // 2. 강의록 매핑 존재 여부 확인
        List<LectureNoteMapping> mappings = lectureNoteMappingRepository.findAllByLectureId(lectureId);
        if (mappings.isEmpty()) {
            throw new QuizException(QuizErrorCode.LectureNoteNotFound);
        }

        // 3. 모든 강의록을 조회
        List<LectureNote> notes = mappings.stream()
                .map(mapping -> {
                    // lectureNoteId를 통해 LectureNote를 가져온 뒤, note_url을 확인
                    LectureNote note = lectureNoteRepository.findById(mapping.getLectureNoteId())
                            .orElseThrow(() -> new QuizException(QuizErrorCode.LectureNoteNotFound));
                    return note;  // LectureNote 객체를 반환
                })
                .collect(Collectors.toList());

        // S3 URL
        String noteUrls = notes.stream()
                .map(note -> s3Service.getPresignedUrl(note.getNoteUrl()))
                .collect(Collectors.joining(","));

        try {
            // 4. LangChain 서버 호출 (필요한 정보를 가지고 호출)
            return langChainClient.requestQuiz(
                    lectureId.toString(),
                    noteUrls,
                    request.isUseAudio(),
                    lecture.getAudioUrl()
            );
        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AiCallFailed);
        }
    }
}