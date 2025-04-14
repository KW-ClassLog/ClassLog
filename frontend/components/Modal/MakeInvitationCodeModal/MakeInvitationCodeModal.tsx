"use client";
import React, { useState } from "react";
import styles from "./MakeInvitationCodeModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import Image from "next/image";

// Props 타입 정의
type MakeInvitationCodeModalProps = { classId: string; onClose: () => void };

// MakeInvitationCodeModal 컴포넌트 정의
const MakeInvitationCodeModal: React.FC<MakeInvitationCodeModalProps> = ({
  classId,
  onClose,
}) => {
  // TODO1) 초대 코드 API 호출:
  // TODO2) 초대 코드 표시 및 카운트다운:
  // TODO3) 30초 카운트다운:

  // 모달 상태 관리: 1=선택 화면, 2=문자 코드 화면, 3=QR 코드 화면
  const [modalState, setModalState] = useState<1 | 2 | 3>(1);
  // 초대 코드 (실제로는 API에서 가져와야 함)
  const invitationCode = "13N4A0";

  // 문자 코드 선택 시
  const handleTextCodeClick = () => {
    setModalState(2);
  };

  // QR 코드 선택 시
  const handleQRCodeClick = () => {
    setModalState(3);
  };

  // 뒤로 가기 (선택 화면으로 돌아가기)
  const handleBackClick = () => {
    setModalState(1);
  };

  // 모달 상태에 따른 렌더링
  return (
    <ClosableModal onClose={onClose}>
      {modalState === 1 && (
        <div className={styles.modalContainer}>
          <h1>초대 코드 생성 방식 선택</h1>

          <div className={styles.optionsContainer}>
            {/* 문자 코드 선택 */}
            <div className={styles.option} onClick={handleTextCodeClick}>
              <div className={styles.code}>12B3</div>
              <h2>문자 코드</h2>
              <p>학생들이 생성된 문자 코드를 입력하여 입장할 수 있습니다</p>
            </div>

            {/* QR 코드 선택 */}
            <div className={styles.option} onClick={handleQRCodeClick}>
              <div className={styles.qrCode}>
                <Image
                  src="/images/QRcode.png"
                  alt="QR Code"
                  width={100}
                  height={100}
                />
              </div>
              <h2>QR 코드</h2>
              <p>학생들이 QR 코드를 스캔하여 입장할 수 있습니다</p>
            </div>
          </div>
        </div>
      )}

      {modalState === 2 && (
        <div className={styles.codeDisplayModal}>
          <div className={styles.timeLimit}>
            <span className={styles.number}>30</span>초 후 만료
          </div>
          <div className={styles.codeDisplay}>
            <h2>{invitationCode}</h2>
          </div>
          <p>문자 코드를 입력해 클래스에 입장하세요</p>
        </div>
      )}

      {modalState === 3 && (
        <div className={styles.codeDisplayModal}>
          <div className={styles.timeLimit}>
            {" "}
            <span className={styles.number}>30</span>초 후 만료
          </div>
          <div className={styles.qrCodeDisplay}>
            <Image
              src="/images/QRcode.png"
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
          <p>QR코드를 스캔해 클래스에 입장하세요</p>
        </div>
      )}
    </ClosableModal>
  );
};

export default MakeInvitationCodeModal;
