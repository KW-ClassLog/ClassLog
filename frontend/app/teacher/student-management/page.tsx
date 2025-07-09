"use client";

import ManagementTable from "@/components/ManagementTable/ManagementTable";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import styles from "./page.module.scss";
import MakeInvitationCodeModal from "@/components/Modal/MakeInvitationCodeModal/MakeInvitationCodeModal";
import React from "react";
import NoDataView from "@/components/NoDataView/NoDataView";
import { UsersRound } from "lucide-react";

export default function TeacherStudentManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  const students = [
    {
      userId: "user1",
      name: "김클로",
      nickname: "김클로",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user2",
      name: "주세원",
      nickname: "강백호",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user3",
      name: "김해민",
      nickname: "로하스",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user4",
      name: "김수민",
      nickname: "허경민",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user5",
      name: "김수민",
      nickname: "김민혁",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user6",
      name: "김수민",
      nickname: "장성우",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user7",
      name: "김수민",
      nickname: "천성호",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user8",
      name: "김수민",
      nickname: "배정대",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user9",
      name: "김수민",
      nickname: "김상수",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user10",
      name: "김수민",
      nickname: "윤준혁",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    // 추가적인 학생 데이터
  ];

  // 삭제 함수
  const handleDelete = () => {
    // 선택된 학생 ID를 통해 데이터를 필터링하여 삭제
    // const updatedStudents = students.filter(
    //   (student) => !selectedIds.includes(student.userId)
    // );
    // 이제 삭제된 학생을 반영하는 로직을 추가할 수 있습니다.
  };

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
