"use client";
import { useParams } from "next/navigation";
import LectureInfoSection from "./_components/LectureInfoSection/LectureInfoSection";
import style from "./page.module.scss";

export default function StudentLectureDetailPage() {
  const params = useParams();
  const lectureId = params.lectureId as string;
  return (
    <div className={style.lectureDetailPage}>
      <LectureInfoSection lectureId={lectureId} />
    </div>
  );
}
