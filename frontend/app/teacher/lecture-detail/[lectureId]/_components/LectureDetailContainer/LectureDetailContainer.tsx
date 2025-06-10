"use client";
import { useParams } from "next/navigation";
import LectureHeader from "../LectureHeader/LectureHeader";
import LectureMainGrid from "../LectureMainGrid/LectureMainGrid";
import style from "./LectureDetailContainer.module.scss";

export default function LectureDetailContainer() {
  const params = useParams();
  // lectureId가 URL의 마지막 파라미터
  const lectureId = Array.isArray(params.lectureId)
    ? params.lectureId[params.lectureId.length - 1]
    : params.lectureId;

  return (
    <div className={style.lectureDetailContainer}>
      {lectureId && (
        <>
          <LectureHeader lectureId={lectureId} />
          <LectureMainGrid lectureId={lectureId} />
        </>
      )}
    </div>
  );
}
