"use client";

import ManagementTable from "@/components/ManagementTable/ManagementTable";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import styles from "./page.module.scss";
import MakeInvitationCodeModal from "@/components/Modal/MakeInvitationCodeModal/MakeInvitationCodeModal";
import React, { useEffect, useState } from "react";
import NoDataView from "@/components/NoDataView/NoDataView";
import { UsersRound } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { FetchStudentsByClassResult } from "@/types/student-classes/fetchStudentsByClassTypes";
import { fetchStudentsByClass } from "@/api/student-classes/fetchStudentsByClass";

export default function TeacherStudentManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<FetchStudentsByClassResult[]>([]);

  // 학생 목록 불러오기
  const loadStudents = async (classId: string) => {
    setIsLoading(true);
    const response = await fetchStudentsByClass(classId);
    if (response.isSuccess && response.result) {
      setStudents(response.result);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
    }
  }, [selectedClassId]);

  // 삭제 함수
  const handleDelete = () => {
    // 선택된 학생 ID를 통해 데이터를 필터링하여 삭제
    // const updatedStudents = students.filter(
    //   (student) => !selectedIds.includes(student.userId)
    // );
    // 이제 삭제된 학생을 반영하는 로직을 추가할 수 있습니다.
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>[{selectedClassName}] 학생 관리</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedClassId || !selectedClassName) {
    return (
      <div className={styles.container}>
        <h1>학생 관리</h1>
        <NoDataView
          icon={UsersRound}
          title="선택된 클래스가 없습니다"
          description="좌상단의 클래스 선택 메뉴에서 클래스를 선택해주세요"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>[{selectedClassName}] 학생 관리</h1>
      <div className={styles.inviteButtonContainer}>
        <button
          className={styles.inviteButton}
          onClick={() => setIsInviteModalOpen(true)}
        >
          + 학생 초대하기
        </button>
      </div>
      <div className={styles.lectureNoteListContainer}>
        <ManagementTable
          type="student"
          data={students}
          onDelete={handleDelete}
        />
      </div>
      {isInviteModalOpen && selectedClassId && (
        <MakeInvitationCodeModal
          onClose={() => setIsInviteModalOpen(false)}
          classId={selectedClassId}
        />
      )}
    </div>
  );
}
