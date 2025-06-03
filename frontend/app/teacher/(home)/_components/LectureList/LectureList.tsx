"use client";

import styles from "./LectureList.module.scss";
import LectureItem from "./LectureItem";
import { FetchLecturesByDateResult } from "@/types/classes/fetchLecturesByDate";
import { BookOpenText } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";

interface LectureListProps {
  lectures: FetchLecturesByDateResult[];
  loading: boolean;
  error: string | null;
}

export default function LectureList({
  lectures,
  loading,
  error,
}: LectureListProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>강의 목록</h2>
      <div className={styles.lectureList}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div>{error}</div>
        ) : lectures.length === 0 ? (
          <NoDataView
            icon={BookOpenText}
            title={"강의 없음"}
            description={"해당 날짜에 강의가 없습니다."}
          />
        ) : (
          lectures.map((lecture) => (
            <LectureItem key={lecture.lectureId} {...lecture} />
          ))
        )}
      </div>
    </div>
  );
}
