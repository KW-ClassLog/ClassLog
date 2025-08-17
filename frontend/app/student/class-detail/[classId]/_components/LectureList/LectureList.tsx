import React, { useEffect, useState } from "react";
import styles from "./LectureList.module.scss";
import { useParams } from "next/navigation";
import { fetchLecturesByClass } from "@/api/classes/fetchLecturesByClass";
import { FetchLecturesByClassResult } from "@/types/classes/fetchLecturesByClassTypes";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function LectureList() {
  const { classId } = useParams();
  const [lectures, setLectures] = useState<FetchLecturesByClassResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const response = await fetchLecturesByClass(classId as string);
        if (response.isSuccess && response.result) {
          setLectures(response.result);
        }
      } catch (error) {
        console.error("강의 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [classId]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "beforeLecture":
        return "강의 전";
      case "onLecture":
        return "강의 중";
      case "afterLecture":
        return "강의 종료";
      default:
        return "알 수 없음";
    }
  };

  if (loading) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (lectures.length === 0) {
    return <div className={styles.container}>등록된 강의가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.lectureList}>
        {lectures.map((lecture) => (
          <div
            key={lecture.lectureId}
            className={styles.lectureCard}
            onClick={() => {
              router.push(ROUTES.studentLectureDetail(lecture.lectureId));
            }}
          >
            <div className={styles.lectureInfo}>
              <div className={styles.lectureTitle}>
                <div>
                  {String(lecture.session).padStart(2, "0")}.
                  {lecture.lectureName}
                  <span className={styles.status}>
                    {getStatusText(lecture.status)}
                  </span>
                </div>
                <button className={styles.viewButton}>
                  <ChevronRight />
                </button>
              </div>
              <div className={styles.lectureDetails}>
                <div className={styles.dateInfo}>
                  <Calendar size={16} />
                  <span>{lecture.lectureDate}</span>
                </div>
                <div className={styles.timeInfo}>
                  <Clock size={16} />
                  <span>
                    {lecture.startTime} ~ {lecture.endTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
