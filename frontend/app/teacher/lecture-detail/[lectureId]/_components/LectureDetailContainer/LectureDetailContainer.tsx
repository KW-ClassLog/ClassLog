"use client";
import LectureHeader from "../LectureHeader/LectureHeader";
import LectureMainGrid from "../LectureMainGrid/LectureMainGrid";
import style from "./LectureDetailContainer.module.scss";

export default function LectureDetailContainer({
  lectureId,
}: {
  lectureId: string;
}) {
  return (
    <div className={style.lectureDetailContainer}>
      {lectureId && (
        <>
          <LectureHeader />
          <LectureMainGrid />
        </>
      )}
    </div>
  );
}
