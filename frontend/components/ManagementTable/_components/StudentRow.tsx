import Image from "next/image";
import styles from "../ManagementTable.module.scss";
import { Copy } from "lucide-react";

export type StudentData = {
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  organization?: string;
  profile?: string;
};

interface Props {
  item: StudentData;
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
        src={item.profile || "/images/default_profile.jpg"}
        alt={item.name}
        width={40}
        height={40}
        className={styles.profileImage}
      />
      {item.nickname}
    </td>
    <td>{item.organization}</td>
    <td>
      {item.phoneNumber}{" "}
      {!isEditMode ? (
        <button
          className={styles.copyButton}
          onClick={() =>
            handleCopyPhoneNumber((item as StudentData).phoneNumber)
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
