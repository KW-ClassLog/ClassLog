"use client";
import { useParams } from "next/navigation";
import BackButtonHeader from "./_components/BackButtonHeader/BackButtonHeader";
import LectureDetailContainer from "./_components/LectureDetailContainer/LectureDetailContainer";
import style from "./page.module.scss";

export default function TeacherLectureDetailPage() {
  const params = useParams();
  // lectureId가 URL의 마지막 파라미터
  const lectureId = Array.isArray(params.lectureId)
    ? params.lectureId[params.lectureId.length - 1]
    : params.lectureId;

  return (
    <div className={style.lectureDetailPage}>
      <BackButtonHeader lectureId={lectureId as string} />
      <LectureDetailContainer lectureId={lectureId as string} />
    </div>
  );
}
