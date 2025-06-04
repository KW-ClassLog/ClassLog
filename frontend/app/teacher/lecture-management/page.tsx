"use client";

import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import useLectureListStore from "@/store/useLectureListStore";
import { useEffect, useState } from "react";
import NoDataView from "@/components/NoDataView/NoDataView";
import { BookOpenText } from "lucide-react";
import LectureColumn from "./_components/LectureColumn/LectureColumn";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import CreateLectureModal from "./_components/CreateLectureModal/CreateLectureModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function TeacherLectureManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const { lectureList, isLoading, error, fetchLectureList } =
    useLectureListStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (selectedClassId) {
      fetchLectureList(selectedClassId);
    }
  }, [selectedClassId, fetchLectureList]);

  const beforeLectures = lectureList.filter(
    (l) => l.status === "beforeLecture"
  );
  const inProgressLectures = lectureList.filter(
    (l) => l.status === "onLecture"
  );
  const endedLectures = lectureList.filter((l) => l.status === "afterLecture");

  if (!selectedClassId || !selectedClassName) {
    return (
      <div className={styles.container}>
        <h1>퀴즈 관리</h1>
        <NoDataView
          icon={BookOpenText}
          title="선택된 클래스가 없습니다"
          description="좌상단의 클래스 선택 메뉴에서 클래스를 선택해주세요"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>[{selectedClassName}] 강의 관리</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>[{selectedClassName}] 강의 관리</h1>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>[{selectedClassName}] 강의 관리</h1>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={handleOpenModal}>
          + 강의 생성하기
        </button>
      </div>
      <div className={styles.lectureListContainer}>
        {/* 강의 종료 */}
        <LectureColumn
          title="강의 종료"
          count={endedLectures.length}
          emptyText="종료된 강의가 없습니다."
          lectures={endedLectures}
          columnClassName={styles.ended}
        />
        {/* 강의 중 */}
        <LectureColumn
          title="강의 중"
          count={inProgressLectures.length}
          emptyText="진행중인 강의가 없습니다."
          lectures={inProgressLectures}
          columnClassName={styles.inProgress}
        />
        {/* 강의 전 */}
        <LectureColumn
          title="강의 전"
          count={beforeLectures.length}
          emptyText="예정된 강의가 없습니다."
          lectures={beforeLectures}
          columnClassName={styles.before}
        />
      </div>
      {isModalOpen && (
        <ClosableModal onClose={handleCloseModal}>
          <CreateLectureModal onClose={handleCloseModal} />
        </ClosableModal>
      )}
    </div>
  );
}
