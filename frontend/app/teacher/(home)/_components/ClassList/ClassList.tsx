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
import { School, PencilLine, Trash2 } from "lucide-react";
import { deleteClass } from "@/api/classes/deleteClass";

export default function ClassList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<FetchMyClassListResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

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

  const handleMoreClick = (classId: string) => {
    setDropdownOpenId((prev) => (prev === classId ? null : classId));
  };

  const handleEdit = (classId: string) => {
    setDropdownOpenId(null);
    alert(`수정: ${classId}`);
  };

  const handleDelete = async (classId: string) => {
    setDropdownOpenId(null);
    const res = await deleteClass(classId);
    if (res && res.isSuccess) {
      setClasses(classes.filter((classItem) => classItem.classId !== classId));
    } else {
      setError(res?.message || "클래스를 삭제하지 못했습니다.");
    }
  };

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
            <div
              key={classItem.classId}
              className={styles.classCard}
              style={{ position: "relative" }}
            >
              <div className={styles.header}>
                <h3 className={styles.title}>{classItem.className}</h3>
                <button
                  className={styles.moreButton}
                  onClick={() => handleMoreClick(classItem.classId)}
                  type="button"
                >
                  <MoreVertical size={20} />
                </button>
                {dropdownOpenId === classItem.classId && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => handleEdit(classItem.classId)}>
                      <PencilLine size={16} />
                      <span>수정하기</span>
                    </button>
                    <button onClick={() => handleDelete(classItem.classId)}>
                      <Trash2 size={16} />
                      <span>삭제하기</span>
                    </button>
                  </div>
                )}
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
