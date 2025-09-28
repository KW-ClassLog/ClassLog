export interface fetchQuizListResult {
  lectureId: string;
  quizList: Quiz[];
}

type Quiz = {
  quizId: string;
  quizOrder: number;
  quizBody: string;
  solution: string;
  type: "multipleChoice" | "shortAnswer" | "trueFalse";
  options: QuizOption[] | [];
};

type QuizOption = {
  id: string;
  optionOrder: number;
  text: string;
};
