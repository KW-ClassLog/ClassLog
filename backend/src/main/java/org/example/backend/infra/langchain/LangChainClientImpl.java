package org.example.backend.infra.langchain;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO.QuizDTO;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
@RequiredArgsConstructor
public class LangChainClientImpl implements LangChainClient {

    @Value("${ai.server.url}")
    private String langChainServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public QuizResponseDTO requestQuiz(String lectureId, String documentUrl, boolean useAudio, String audioUrl) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("document_url", documentUrl);
            body.put("use_audio", useAudio);
            if (useAudio) {
                body.put("audio_url", audioUrl);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            String url = langChainServerUrl + "/generate-quiz?lecture_id=" + lectureId;

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            List<Map<String, String>> quizzes = (List<Map<String, String>>) responseBody.get("quizzes");

            List<QuizDTO> quizDTOs = quizzes.stream()
                    .map(q -> QuizDTO.builder()
                            .quizBody(q.get("quiz_body"))
                            .solution(q.get("solution"))
                            .type(q.get("type"))
                            .build())
                    .toList();

            return QuizResponseDTO.builder()
                    .lectureId(UUID.fromString(lectureId))
                    .quizzes(quizDTOs)
                    .build();

        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AiCallFailed);
        }
    }
}