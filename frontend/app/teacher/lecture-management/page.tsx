"use client";

import styles from "./page.module.scss";
import useClassStore from "@/store/useClassStore";
import { useEffect, useState } from "react";
import NoDataView from "@/components/NoDataView/NoDataView";
import { BookOpenText } from "lucide-react";
import dayjs from "dayjs";
import LectureColumn from "./_components/LectureColumn/LectureColumn";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import CreateLectureModal from "./_components/CreateLectureModal/CreateLectureModal";

interface Lecture {
  lectureId: string;
  title: string;
  lectureDate: string;
  status: "beforeLecture" | "showDashboard" | "quizCreation";
  startTime: string;
  endTime: string;
}

export default function TeacherLectureManagementPage() {
  const { selectedClassId, selectedClassName } = useClassStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [lectures, setLectures] = useState<Lecture[]>([
    {
      lectureId: "1",
      title: "1주차",
      lectureDate: "2025.03.18 (화)",
      status: "beforeLecture",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "2",
      title: "2주차",
      lectureDate: "2025.03.18 (화)",
      status: "showDashboard",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "3",
      title: "3주차",
      lectureDate: "2025.03.18 (화)",
      status: "quizCreation",
      startTime: "10:30",
      endTime: "11:45",
    },
    {
      lectureId: "4",
      title: "4주차",
      lectureDate: "2025.03.18 (화)",
      status: "beforeLecture",
      startTime: "10:30",
      endTime: "11:45",
    },
  ]);

  useEffect(() => {
    if (selectedClassId) {
      // TODO: API 호출하여 해당 클래스의 강의 목록을 가져옴
      console.log("Selected Class ID:", selectedClassId);
    }
  }, [selectedClassId]);

  // 강의 상태 분류 함수
  const getLectureStatus = (lecture: Lecture) => {
    // 날짜에서 (화) 등 요일 제거
    const dateStr = lecture.lectureDate.split(" ")[0];
    const start = dayjs(`${dateStr} ${lecture.startTime}`, "YYYY.MM.DD HH:mm");
    const end = dayjs(`${dateStr} ${lecture.endTime}`, "YYYY.MM.DD HH:mm");
    const now = dayjs();
    if (now.isAfter(start) && now.isBefore(end)) {
      return "inProgress";
    }
    if (lecture.status === "beforeLecture") return "before";
    return "ended";
  };

  const beforeLectures = lectures.filter(
    (l) => getLectureStatus(l) === "before"
  );
  const inProgressLectures = lectures.filter(
    (l) => getLectureStatus(l) === "inProgress"
  );
  const endedLectures = lectures.filter((l) => getLectureStatus(l) === "ended");

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
