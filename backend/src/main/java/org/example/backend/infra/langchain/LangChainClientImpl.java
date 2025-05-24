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
import java.util.stream.Collectors;

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
            body.put("document_path", documentUrl);
            body.put("use_audio", useAudio);
            if (useAudio) {
                body.put("audio_path", audioUrl);
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
                    .map(q -> {
                        Object choicesObj = q.get("choices");
                        List<String> choices;

                        if (choicesObj instanceof List<?>) {
                            choices = ((List<?>) choicesObj).stream()
                                    .map(Object::toString)
                                    .collect(Collectors.toList());
                        } else {
                            choices = Collections.emptyList();
                        }

                        String rawType = (String) q.get("type");
                        String mappedType;
                        switch (rawType) {
                            case "객관식" -> mappedType = "multipleChoice";
                            case "단답형" -> mappedType = "shortAnswer";
                            case "OX", "참/거짓", "참거짓", "True/False" -> mappedType = "trueFalse";
                            default -> mappedType = "UNKNOWN";
                        }

                        return QuizDTO.builder()
                                .quizBody((String) q.get("quiz_body"))
                                .solution((String) q.get("solution"))
                                .type(mappedType)
                                .choices(choices)
                                .build();
                    })
                    .toList();

            return QuizResponseDTO.builder()
                    .lectureId(UUID.fromString(lectureId))
                    .quizzes(quizDTOs)
                    .build();

        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AI_CALL_FAILED);
        }
    }
}