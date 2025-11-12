package org.example.backend.domain.quizList.repository;

import org.example.backend.domain.quizList.entity.QuizList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizListRepository extends JpaRepository<QuizList, UUID> {

    @Query(value = """
            SELECT * FROM quiz_list
            WHERE lecture_id = :lectureId
              AND type = :type
              AND used = 'F'
            ORDER BY RAND()
            LIMIT :limit
            """, nativeQuery = true)
    List<QuizList> findRandomByLectureIdAndType(
            @Param("lectureId") UUID lectureId,
            @Param("type") String type,
            @Param("limit") int limit);

    @Query(value = """
            SELECT * FROM quiz_list
            WHERE lecture_id = :lectureId
              AND type = :type
              AND used != 'T'
            ORDER BY RAND()
            LIMIT :limit
            """, nativeQuery = true)
    List<QuizList> findRandomByLectureIdAndTypeExcludeUsed(
            @Param("lectureId") UUID lectureId,
            @Param("type") String type,
            @Param("limit") int limit);

    @Modifying
    @Query(value = "UPDATE quiz_list SET used = 'F'", nativeQuery = true)
    void resetAllUsedFlags();
}