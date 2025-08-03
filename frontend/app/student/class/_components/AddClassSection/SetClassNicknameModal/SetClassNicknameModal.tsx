import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import { ROUTES } from "@/constants/routes";
import router from "next/router";
import styles from "./SetClassNicknameModal.module.scss";

type SetClassNicknameModalProps = {
  onClose: () => void;
  classId: string;
};

export default function SetClassNicknameModal({
  onClose,
  classId,
}: SetClassNicknameModalProps) {
  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>클래스 닉네임을 설정하세요.</h2>
      </div>
      <FullWidthButton
        onClick={() => {
          router.push(ROUTES.studentClassDetail(classId));
        }}
      >
        확인
      </FullWidthButton>
    </ClosableModal>
  );
}
