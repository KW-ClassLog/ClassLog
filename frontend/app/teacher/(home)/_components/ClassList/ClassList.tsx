"use client";

import styles from "./ClassList.module.scss";
import { MoreVertical, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import CreateClassModal from "./CreateClassModal/CreateClassModal";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import { fetchMyClassList } from "@/api/classes/fetchMyClassList";
import { FetchMyClassListResult } from "@/types/classes/fetchMyClassListTypes";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";
import { School } from "lucide-react";

export default function ClassList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<FetchMyClassListResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const res = await fetchMyClassList();
      if (res && res.isSuccess) {
        setClasses(res.result || []);
      } else {
        setError(res?.message || "클래스 목록을 불러오지 못했습니다.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <h2 className={styles.mainTitle}>내 클래스 목록</h2>
        <button className={styles.addButton} onClick={handleOpenModal}>
          + 클래스 생성하기
        </button>
      </div>
      <div className={styles.classList}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div>{error}</div>
        ) : classes.length === 0 ? (
          <NoDataView
            icon={School}
            title={"강의 없음"}
            description={"생성된 클래스가 없습니다."}
          />
        ) : (
          classes.map((classItem) => (
            <div key={classItem.classId} className={styles.classCard}>
              <div className={styles.header}>
                <h3 className={styles.title}>{classItem.className}</h3>
                <button className={styles.moreButton}>
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Clock className={styles.icon} size={16} />
                  <span className={styles.infoText}>{classItem.classDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar className={styles.icon} size={16} />
                  <span className={styles.infoText}>
                    {classItem.startDate} ~ {classItem.endDate}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ClosableModal onClose={handleCloseModal}>
          <CreateClassModal onClose={handleCloseModal} />
        </ClosableModal>
      )}
    </div>
  );
}
