"use client";
import BackButtonHeader from "./_components/BackButtonHeader/BackButtonHeader";
import DashboardContainer from "./_components/DashboardContainer/DashboardContainer";
import style from "./page.module.scss";
export default function TeacherQuizDashboardPage() {
  return (
    <div className={style.quizDashboardPage}>
      <BackButtonHeader />
      <DashboardContainer />
    </div>
  );
}
