package org.example.backend.domain.question.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.converter.QuestionConverter;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.example.backend.domain.question.repository.QuestionRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.User;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final StudentClassRepository studentClassRepository;
    private final QuestionConverter questionConverter;
    private final RedisTemplate<String,String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public List<QuestionResponseDTO.teacher> getTeacherQuestions(UUID lectureId, User user ) {

        return questionRepository.findByLectureId(lectureId).stream()
                .map(questionConverter::toTeacherQuestions)
                .toList();
    }

    @Override
    public List<QuestionResponseDTO.student> getStudentQuestions(UUID lectureId, User user) {
        // 수강 여부 조회
        boolean isEnrolled = studentClassRepository.existsByUserIdAndLectureId(user.getId(),lectureId);

        if(!isEnrolled){
            throw new QuestionException(QuestionErrorCode._FORBIDDEN_LECTURE_ACCESS);
        }
        return questionRepository.findByLectureId(lectureId).stream()
                .map(questionConverter::toStudentQuestions)
                .toList();
    }

    // 이전 내용 불러오기
    @Override
    public List<QuestionResponseDTO.beforeChatting> getBeforeChatting(UUID lectureId) {
        String redisKey = "chat:lecture:" + lectureId;

        List<String> rawMessages = redisTemplate.opsForList().range(redisKey, 0, -1);

        // 이전 내용이 없다면 빈배열 반환
        if(rawMessages == null || rawMessages.isEmpty()){
            return Collections.emptyList();
        }

        // 반환리스트
        List<QuestionResponseDTO.beforeChatting> chatList = new ArrayList<>();

        // 최신 메시지가 먼저 저장됨 -> 역순으로 순회
        for(int i=rawMessages.size()-1;i>=0;i--){
            try{
                // JSON 문자열 -> DTO 변환
                QuestionResponseDTO.beforeChatting dto = objectMapper.readValue(rawMessages.get(i), QuestionResponseDTO.beforeChatting.class);
                chatList.add(dto);
            }
            catch (JsonProcessingException e){
                // 파싱 실패
                throw new QuestionException(QuestionErrorCode._INVALID_JSON_FORMAT);
            }
        }
        return chatList;
    }
}
