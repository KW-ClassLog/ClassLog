// _components/QuizPreview.tsx
import styles from "./QuizPreview.module.scss";

interface Quiz {
  quizBody: string;
  solution: string;
  choices: string[];
  type: "객관식" | "단답형" | "OX";
}

const QuizPreview = ({ quiz }: { quiz: Quiz }) => {
  return (
    <div className={styles.quizCard}>
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
  );
};

export default QuizPreview;
