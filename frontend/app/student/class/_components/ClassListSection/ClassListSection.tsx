"use client";
import React, { useEffect, useState } from "react";
import styles from "./ClassListSection.module.scss";
import { fetchMyClassList } from "@/api/student-classes/fetchMyClassList";
import { FetchMyClassListResult } from "@/types/classes/fetchMyClassListTypes";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function ClassListSection() {
  const [classList, setClassList] = useState<FetchMyClassListResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadClassList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchMyClassList();

        if (response.isSuccess) {
          setClassList(response.result || []);
        } else {
          setError(
            response.message || "클래스 목록을 불러오는데 실패했습니다."
          );
        }
      } catch (error) {
        console.error("클래스 목록 로드 오류:", error);
        setError("클래스 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClassList();
  }, []);

  const handleClassClick = (classId: string) => {
    router.push(ROUTES.studentClassDetail(classId));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner text="클래스 목록을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (classList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>등록된 클래스가 없습니다.</p>
          <p>QR 코드를 스캔하거나 입장코드를 입력하여 클래스에 참여해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.classList}>
        {classList.map((classItem) => (
          <div
            key={classItem.classId}
            className={styles.classCard}
            onClick={() => handleClassClick(classItem.classId)}
          >
            <div className={styles.classHeader}>
              <div className={styles.classTitle}>
                <span className={styles.className}>{classItem.className}</span>
                <span className={styles.teacherName}>박재성</span>
              </div>
              <ChevronRight size={20} className={styles.arrowIcon} />
            </div>

            <div className={styles.classDetails}>
              <div className={styles.detailItem}>
                <Clock size={16} />
                <span>월 (10:15~11:45)/수 (12:00~13:15)</span>
              </div>

              <div className={styles.detailItem}>
                <Calendar size={16} />
                <span>2024.03.04 ~ 2025.06.13</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
