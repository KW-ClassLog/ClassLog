import { ExternalLink } from "lucide-react";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";
import styles from "../ManagementTable.module.scss";

interface Props {
  item: FetchLectureNotesByClassResult;
}

const LectureNoteRow: React.FC<Props> = ({ item }) => {
  return (
    <>
      <td>{Array.isArray(item.session) ? item.session.join(", ") : ""}</td>
      <td>
        <a
          href={item.lectureNoteUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fileLink}
        >
          <span>{item.lectureNoteName || item.lectureNoteUrl}</span>
          <ExternalLink size={16} />
        </a>
      </td>
      <td>{item.fileSize}</td>
    </>
  );
};

export default LectureNoteRow;
