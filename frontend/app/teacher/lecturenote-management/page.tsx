"use client";
import ManagementTable from "@/components/ManagementTable/ManagementTable";
import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import NoDataView from "@/components/NoDataView/NoDataView";
import { FileText } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function TeacherLectureNoteManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();

  const lectureNotes = [
    {
      lectureNoteId: "note1",
      lectureId: "lec1",
      session: [1],
      lectureNoteUrl: "Proposal.docx",
      fileSize: "2.9 MB",
    },
    {
      lectureNoteId: "note2",
      lectureId: "lec1",
      session: [1, 2],
      lectureNoteUrl: "Proposal.docx",
      fileSize: "2.9 MB",
    },
    // Additional data...
  ];

  const handleDelete = (selectedIds: string[]) => {
    const updatedLectureNotes = lectureNotes.filter(
      (note) => !selectedIds.includes(note.lectureNoteId)
    );
    console.log("Updated Lecture Notes:", updatedLectureNotes);
  };

  if (!selectedClassId || !selectedClassName) {
    return (
      <div className={styles.container}>
        <h1>퀴즈 관리</h1>
        <NoDataView
          icon={FileText}
          title="선택된 클래스가 없습니다"
          description="좌상단의 클래스 선택 메뉴에서 클래스를 선택해주세요"
        />
      </div>
    );
  }
  // if (isLoading) {
  //   return (
  //     <div className={styles.container}>
  //       <h1>[{selectedClassName}] 강의 관리</h1>
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      <h1>[{selectedClassName}] 강의자료 관리</h1>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton}>+ 강의자료 추가하기</button>
      </div>
      <div className={styles.lectureNoteListContainer}>
        <ManagementTable
          type="lectureNote"
          data={lectureNotes}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
