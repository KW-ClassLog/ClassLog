"use client";

import ManagementTable from "@/components/ManagementTable/ManagementTable";

export default function TeacherStudentManagementPage() {
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
  const handleDelete = (selectedIds: string[]) => {
    // 선택된 학생 ID를 통해 데이터를 필터링하여 삭제
    const updatedStudents = students.filter(
      (student) => !selectedIds.includes(student.userId)
    );

    // 이제 삭제된 학생을 반영하는 로직을 추가할 수 있습니다.
  };

  return (
    <div style={{ padding: "20px" }}>
      <ManagementTable type="student" data={students} onDelete={handleDelete} />
    </div>
  );
}
