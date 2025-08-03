import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import React from "react";
import styles from "./EnterClassModal.module.scss";
import { IMAGES } from "@/constants/images";
import Image from "next/image";

type EnterClassModalProps = {
  onClose: () => void;
};

export default function EnterClassModal({ onClose }: EnterClassModalProps) {
  const handleCodeEntry = () => {
    // 문자코드 입력 로직
  };

  const handleQRScan = () => {
    // QR 스캔 로직
  };

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>입장 방식을 선택하세요</h2>

        <div className={styles.optionsContainer}>
          <div className={styles.optionCard} onClick={handleCodeEntry}>
            <div className={styles.codeDisplay}>12B3</div>
            <div className={styles.optionText}>문자코드 입력</div>
          </div>

          <div className={styles.optionCard} onClick={handleQRScan}>
            <Image src={IMAGES.qrCode} alt="QR Code" width={80} height={80} />
            <div className={styles.optionText}>QR 스캔</div>
          </div>
        </div>
      </div>
    </ClosableModal>
  );
}
