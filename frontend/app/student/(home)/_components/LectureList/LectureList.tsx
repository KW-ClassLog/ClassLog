import { fetchStudentTodayLecturesResult } from "@/types/lectures/fetchStudentTodayLecturesTypes";
import styles from "./LectureList.module.scss";
import NoDataView from "@/components/NoDataView/NoDataView";
import { CalendarX } from "lucide-react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

interface LectureListProps {
  todayData: fetchStudentTodayLecturesResult;
}

export default function LectureList({ todayData }: LectureListProps) {
  const router = useRouter();
  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  if (!todayData.todayLectures || todayData.todayLectures.length === 0) {
    return (
      <div className={styles.lectureList}>
        <h2 className={styles.listTitle}>오늘의 강의 목록</h2>
        <NoDataView
          icon={CalendarX}
          title="오늘의 강의가 없어요"
          description="등록된 강의가 없거나 아직 일정이 없습니다."
        />
      </div>
    );
  }

  return (
    <div className={styles.lectureList}>
      <h2 className={styles.listTitle}>오늘의 강의 목록</h2>
      <div className={styles.lectureItems}>
        {todayData.todayLectures.map((lecture, index) => (
          <div
            key={lecture.lectureId}
            className={styles.lectureItem}
            onClick={() => {
              router.push(ROUTES.studentLectureDetail(lecture.lectureId));
            }}
          >
            <div className={styles.lectureContent}>
              <div className={styles.lectureTitle}>
                <span className={styles.lectureNumber}>
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span className={styles.lectureName}>
                  {lecture.lectureName}
                </span>
                <span className={styles.className}>{lecture.className}</span>
              </div>
              <div className={styles.lectureDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.icon}>
                    <CalendarIcon size={16} />
                  </span>
                  <span className={styles.detailText}>
                    {formatDate(lecture.lectureDate)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.icon}>
                    <ClockIcon size={16} />
                  </span>
                  <span className={styles.detailText}>
                    {formatTime(lecture.startTime, lecture.endTime)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.navigationArrow}>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
