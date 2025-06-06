import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";

interface Props {
  item: FetchLectureNotesByClassResult;
}

const LectureNoteRow: React.FC<Props> = ({ item }) => (
  <>
    <td>{Array.isArray(item.session) ? item.session.join(", ") : ""}</td>
    <td>
      <a
        href={item.lectureNoteUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#4894fe",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {item.lectureNoteName || item.lectureNoteUrl}
      </a>
    </td>
    <td>{item.fileSize}</td>
    <td></td>
  </>
);

export default LectureNoteRow;
