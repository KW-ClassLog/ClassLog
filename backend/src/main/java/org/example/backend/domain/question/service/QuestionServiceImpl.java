package org.example.backend.domain.question.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.exception.LectureErrorCode;
import org.example.backend.domain.lecture.exception.LectureException;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.question.converter.QuestionConverter;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.entity.Question;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.example.backend.domain.question.repository.QuestionRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.security.auth.CustomSecurityUtil;
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
    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;
    private final QuestionConverter questionConverter;
    private final RedisTemplate<String,String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final CustomSecurityUtil customSecurityUtil;

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

    @Override
    public void saveChatting(UUID lectureId) {
        // 1. 접근 권한 확인
        Role role = customSecurityUtil.getUserRole();
        if(role != Role.TEACHER){
            throw new QuestionException(QuestionErrorCode._FORBIDDEN_CHATTING_ACCESS);
        }

        // 2. 강의 존재 확인
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new LectureException(LectureErrorCode.LECTURE_NOT_FOUND));

        // 3. redis key 정의
        String redisKey = "chat:lecture:" + lectureId;

        // 4. redis에서 채팅 내역 가져오기
        List<String> rawMessages = redisTemplate.opsForList().range(redisKey, 0, -1);

        if(rawMessages == null || rawMessages.isEmpty()){
            // 이전 내용이 없다면 저장 X
            return;
        }

        // 5. JSON -> Entity 변환
        List<Question> questionEntities = new ArrayList<>();
        for(String raw: rawMessages){
            try{
                // JSON -> DTO
                QuestionResponseDTO.afterChatting dto = objectMapper.readValue(raw, QuestionResponseDTO.afterChatting.class);

                // DTO -> Entity
                User user = userRepository.findById(dto.getSenderId())
                        .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));

                Question question = questionConverter.toQuestion(dto,lecture,user);

                // Entity -> list에 넣기
                if(question != null) questionEntities.add(question);
            }
            catch (JsonProcessingException e){
                throw new QuestionException(QuestionErrorCode._INVALID_JSON_FORMAT);
            }
        }

        // 6. DB 저장
        questionRepository.saveAll(questionEntities);

        // 7. Redis 비우기
        redisTemplate.delete(redisKey);
    }
}
