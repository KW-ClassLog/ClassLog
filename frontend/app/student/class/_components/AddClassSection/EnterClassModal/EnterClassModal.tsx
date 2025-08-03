import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import React, { useState } from "react";
import styles from "./EnterClassModal.module.scss";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import CodeEntryModal from "./CodeEntryModal/CodeEntryModal";
import QRScanModal from "./QRScanModal/QRScanModal";

type EnterClassModalProps = {
  onClose: () => void;
};

type ModalState = "selection" | "codeEntry" | "qrScan";

export default function EnterClassModal({ onClose }: EnterClassModalProps) {
  const [modalState, setModalState] = useState<ModalState>("selection");

  const handleCodeEntry = () => {
    setModalState("codeEntry");
  };

  const handleQRScan = () => {
    setModalState("qrScan");
  };

  const handleBack = () => {
    setModalState("selection");
  };

  // QR 스캔 모달이 활성화된 경우
  if (modalState === "qrScan") {
    return <QRScanModal onBack={handleBack} />;
  }

  // 문자코드 입력 모달이 활성화된 경우
  if (modalState === "codeEntry") {
    return <CodeEntryModal onClose={onClose} onBack={handleBack} />;
  }

  // 기본 선택 화면
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
