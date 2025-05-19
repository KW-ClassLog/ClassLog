"use client";

import styles from "./ClassList.module.scss";
import { MoreVertical, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import CreateClassModal from "./CreateClassModal/CreateClassModal";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";

interface Class {
  classId: string;
  className: string;
  classDate: string;
  startDate: string;
  endDate: string;
}

interface ClassListProps {
  classes: Class[];
}

export default function ClassList({ classes }: ClassListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <h2 className={styles.mainTitle}>내 클래스 목록</h2>
        <button className={styles.addButton} onClick={handleOpenModal}>
          + 클래스 생성하기
        </button>
      </div>
      <div className={styles.classList}>
        {classes.map((classItem) => (
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
        ))}
      </div>

      {isModalOpen && (
        <ClosableModal onClose={handleCloseModal}>
          <CreateClassModal onClose={handleCloseModal} />
        </ClosableModal>
      )}
    </div>
  );
}
