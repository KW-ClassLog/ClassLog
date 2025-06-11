import { ExternalLink } from "lucide-react";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";
import styles from "../ManagementTable.module.scss";

interface Props {
  item: FetchLectureNotesByClassResult;
}

const LectureNoteRow: React.FC<Props> = ({ item }) => {
  const renderSessionLabels = () => {
    if (!Array.isArray(item.session) || item.session.length === 0) {
      return null;
    }

    return (
      <div className={styles.sessionLabelContainer}>
        {item.session.map((sessionItem, index) => (
          <span key={index} className={styles.sessionLabel}>
            {sessionItem}차시
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <td>{renderSessionLabels()}</td>
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
