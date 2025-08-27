import { fetchStudentTodayLecturesResult } from "@/types/lectures/fetchStudentTodayLecturesTypes";
import styles from "./TodaySummaryCard.module.scss";
import { CheckIcon, X } from "lucide-react";

interface TodaySummaryCardProps {
  todayData: fetchStudentTodayLecturesResult;
  date: string;
}

export default function TodaySummaryCard({
  todayData,
  date,
}: TodaySummaryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <div className={styles.summaryCard}>
      <div className={styles.dateSection}>
        <div className={styles.date}>{formatDate(date)}</div>
        <div className={styles.totalLectures}>
          오늘의 강의 총 {todayData.todayTotal}개
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.statusSection}>
        <div className={styles.statusItem}>
          <div className={styles.statusIcon}>
            <CheckIcon size={16} />
          </div>
          <span className={styles.statusText}>
            완료한 강의 {todayData.todayDone}개
          </span>
        </div>
        <div className={styles.statusItem}>
          <div className={styles.statusIcon}>
            <X size={16} />
          </div>
          <span className={styles.statusText}>
            미완료한 강의 {todayData.todayLeft}개
          </span>
        </div>
      </div>
    </div>
  );
}
