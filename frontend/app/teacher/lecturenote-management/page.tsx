"use client";
import ManagementTable from "@/components/ManagementTable/ManagementTable";

export default function TeacherLectureNoteManagementPage() {
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

  return (
    <div style={{ padding: "20px" }}>
      <ManagementTable
        type="lectureNote"
        data={lectureNotes}
        onDelete={handleDelete}
      />
    </div>
  );
}
