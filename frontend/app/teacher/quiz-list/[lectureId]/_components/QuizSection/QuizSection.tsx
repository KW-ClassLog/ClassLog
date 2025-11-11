"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchQuizList } from "@/api/quizzes/fetchQuizList";
import { fetchQuizListResult } from "@/types/quizzes/fetchQuizListTypes";
import styles from "./QuizSection.module.scss";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";

export default function QuizSection() {
  const { lectureId } = useParams();
  const [quizzes, setQuizzes] = useState<fetchQuizListResult["quizzes"][number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId || typeof lectureId !== "string") return;

    const loadQuizzes = async () => {
      try {
        const res = await fetchQuizList(lectureId);

        if (res.isSuccess && res.result?.quizzes) {
          const mapped = res.result.quizzes.map((q) => ({
            quizId: q.quizId,
            quizOrder: q.quizOrder,
            quizBody: q.quizBody,
            solution: q.solution,
            type: q.type,
            options: q.options,
          }));

          setQuizzes(mapped);
        } else {
          setError("퀴즈 목록을 불러오지 못했습니다.");
        }
      } catch {
        setError("퀴즈 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, [lectureId]);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <LoadingSpinner
          text={["퀴즈 목록을 불러오는 중이에요", "잠시만 기다려주세요!"]}
        />
      </div>
    );

  if (error)
    return <AlertModal onClose={() => setError(null)}>{error}</AlertModal>;

  if (quizzes.length === 0)
    return <div className={styles.emptyBox}>등록된 퀴즈가 없습니다.</div>;

  const multipleChoice = quizzes.filter((q) => q.type === "multipleChoice");
  const ox = quizzes.filter((q) => q.type === "trueFalse");
  const short = quizzes.filter((q) => q.type === "shortAnswer");

  return (
    <div className={styles.wrapper}>
      {/* 객관식 */}
      <h3 className={styles.sectionTitle}>객관식</h3>
      <div className={styles.quizGrid}>
        {multipleChoice.map((quiz) => (
          <div key={quiz.quizId} className={styles.quizBox}>
            <div className={styles.question}>{quiz.quizBody}</div>

            <div className={styles.optionList}>
              {quiz.options?.map((opt, i) => (
                <div key={i} className={styles.optionRow}>
                  <span className={styles.optionNumber}>{i + 1}</span>
                  <div
                    className={`${styles.optionText} ${
                      opt.text === quiz.solution ? styles.selectedOption : ""
                    }`}
                  >
                    {opt.text}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.answerRow}>
              <span className={styles.label}>정답:</span>
              <span className={styles.correctAnswer}>{quiz.solution}</span>
            </div>
          </div>
        ))}
      </div>

      {/* OX */}
      <h3 className={styles.sectionTitle}>O/X</h3>
      <div className={styles.quizGrid}>
        {ox.map((quiz) => (
          <div key={quiz.quizId} className={`${styles.quizBox} ${styles.oxBox}`}>
            <div className={styles.question}>{quiz.quizBody}</div>
            <div className={styles.answerRow}>
              <span className={styles.label}>정답:</span>
              {["O", "X"].map((v) => (
                <span
                  key={v}
                  className={`${styles.answerBtn} ${
                    quiz.solution === v ? styles.selected : ""
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 단답형 */}
      <h3 className={styles.sectionTitle}>단답형</h3>
      <div className={styles.quizGrid}>
        {short.map((quiz) => (
          <div key={quiz.quizId} className={`${styles.quizBox} ${styles.shortBox}`}>
            <div className={styles.question}>{quiz.quizBody}</div>
            <div className={styles.answerRow}>
              <span className={styles.label}>정답:</span>
              <span className={styles.shortAnswer}>{quiz.solution}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}