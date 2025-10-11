export interface getMyQuizResultResult {
  lectureId: string;
  quizzes: Quiz[];
}

type Quiz = MultipleChoiceQuiz | ShortAnswerQuiz | TrueFalseQuiz;

type MultipleChoiceQuiz = {
  quizId: string;
  quizOrder: number;
  quizBody: string;
  solution: string;
  type: "multipleChoice";
  studentAnswer: string;
  options: QuizOption[];
  isCollect: boolean;
};

type ShortAnswerQuiz = {
  quizId: string;
  quizOrder: number;
  quizBody: string;
  solution: string;
  type: "shortAnswer";
  studentAnswer: string;
  options: [];
  isCollect: boolean;
};

type TrueFalseQuiz = {
  quizId: string;
  quizOrder: number;
  quizBody: string;
  solution: string;
  type: "trueFalse";
  studentAnswer: string;
  options: [];
  isCollect: boolean;
};

type QuizOption = {
  id: string;
  optionOrder: number;
  text: string;
};
