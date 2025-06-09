"use client";

import ManagementTable from "@/components/ManagementTable/ManagementTable";

export default function TeacherStudentManagementPage() {
  const students = [
    {
      userId: "user1",
      name: "손아현",
      nickname: "아현",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user2",
      name: "주세원",
      nickname: "세원",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user3",
      name: "김해민",
      nickname: "해민",
      phoneNumber: "010-0000-0000",
      organization: "광운대학교",
    },
    {
      userId: "user4",
      name: "김수민",
      nickname: "수민",
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
