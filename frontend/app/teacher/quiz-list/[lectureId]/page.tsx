"use client";
import BackButtonHeader from "./_components/BackButtonHeader/BackButtonHeader";
import QuizListContainer from "./_components/QuizListContainer/QuizListContainer";
import style from "./page.module.scss";

export default function TeacherQuizListPage() {
  return (
    <div className={style.quizListPage}>
      <BackButtonHeader />
      <QuizListContainer />
    </div>
  );
}