// _components/QuizPreview.tsx
import styles from "./QuizPreview.module.scss";

interface Quiz {
  quizBody: string;
  solution: string;
  choices: string[];
  type: "객관식" | "단답형" | "OX";
}

interface QuizPreviewProps {
  quizzes: Quiz[] | null;
  onCustomize?: () => void;
  onSubmit?: () => void;
}

const QuizPreview = ({ quizzes, onCustomize, onSubmit }: QuizPreviewProps) => {
  return (
    <>
      <div className={styles.content}>
        {quizzes === null ? (
          <div className={styles.loading}>
            AI가 퀴즈를 만들고 있어요
            <br />
            잠시만 기다려주세요
          </div>
        ) : (
          quizzes.map((quiz, index) => (
            <div key={index} className={styles.quizCard}>
              <div className={styles.type}>{quiz.type}</div>
              <div className={styles.question}>{quiz.quizBody}</div>
              {quiz.type === "객관식" && quiz.choices.length > 0 && (
                <ul className={styles.choices}>
                  {quiz.choices.map((choice, index) => (
                    <li key={index}>
                      {index + 1}. {choice}
                    </li>
                  ))}
                </ul>
              )}
              <div className={styles.answer}>정답: {quiz.solution}</div>
            </div>
          ))
        )}
      </div>
      {quizzes === null || (
        <div className={styles.buttonSection}>
          <button className={styles.customizing} onClick={onCustomize}>
            선택한 퀴즈를 기반으로 커스터마이징 하기
          </button>
          <button className={styles.submit} onClick={onSubmit}>
            이대로 퀴즈 제출하기
          </button>
        </div>
      )}
    </>
  );
};

export default QuizPreview;
