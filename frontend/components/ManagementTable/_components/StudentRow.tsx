import Image from "next/image";
import styles from "../ManagementTable.module.scss";
import { Copy } from "lucide-react";
import { FetchStudentsByClassResult } from "@/types/student-classes/fetchStudentsByClassTypes";

interface Props {
  item: FetchStudentsByClassResult;
  isEditMode: boolean;
  handleCopyPhoneNumber: (phone: string) => void;
}

const StudentRow: React.FC<Props> = ({
  item,
  isEditMode,
  handleCopyPhoneNumber,
}) => (
  <>
    <td className={styles.profileContainer}>
      <Image
        src={item.profileUrl || "/images/default_profile.jpg"}
        alt={item.name}
        width={40}
        height={40}
        className={styles.profileImage}
      />
      {item.name}
      {item.nickname && ` (${item.nickname})`}
    </td>
    <td>{item.organization}</td>
    <td>
      {item.phoneNumber}{" "}
      {!isEditMode ? (
        <button
          className={styles.copyButton}
          onClick={() =>
            handleCopyPhoneNumber(
              (item as FetchStudentsByClassResult).phoneNumber
            )
          }
        >
          <Copy className={styles.pasteIcon} />
        </button>
      ) : null}
    </td>
    <td></td>
  </>
);

export default StudentRow;
