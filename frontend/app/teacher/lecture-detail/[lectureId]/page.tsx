import BackButtonHeader from "./_components/BackButtonHeader/BackButtonHeader";
import LectureDetailContainer from "./_components/LectureDetailContainer/LectureDetailContainer";
import style from "./page.module.scss";

export default function TeacherLectureDetailPage() {
  return (
    <div className={style.lectureDetailPage}>
      <BackButtonHeader />
      <LectureDetailContainer />
    </div>
  );
}
