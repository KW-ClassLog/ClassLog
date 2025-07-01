"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./MakeInvitationCodeModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import { fetchEntryCode } from "@/api/classes/fetchEntryCode";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { QRCodeSVG } from "qrcode.react";

// Props 타입 정의
type MakeInvitationCodeModalProps = { onClose: () => void; classId: string };

// MakeInvitationCodeModal 컴포넌트 정의
const MakeInvitationCodeModal: React.FC<MakeInvitationCodeModalProps> = ({
  onClose,
  classId,
}) => {
  // 모달 상태 관리: 'select'=선택 화면, 'text'=문자 코드 화면, 'qr'=QR 코드 화면
  const [modalState, setModalState] = useState<"select" | "text" | "qr">(
    "select"
  );
  // 초대 코드 상태 및 만료 시간
  const [invitationCode, setInvitationCode] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 초대 코드 API 호출 함수
  const fetchCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEntryCode(classId);
      if (res && res.isSuccess && res.result) {
        setInvitationCode(res.result.entryCode);
        setCountdown(30);
      } else {
        setError(res?.message || "초대 코드 생성에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 문자 코드 선택 시
  const handleTextCodeClick = async () => {
    setModalState("text");
    await fetchCode();
  };

  // QR 코드 선택 시
  const handleQRCodeClick = async () => {
    setModalState("qr");
    await fetchCode();
  };

  // 카운트다운 타이머
  React.useEffect(() => {
    if (
      (modalState === "text" || modalState === "qr") &&
      countdown > 0 &&
      invitationCode
    ) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (countdown === 0) {
      setInvitationCode("");
    }
  }, [modalState, countdown, invitationCode]);

  // 모달 상태에 따른 렌더링
  return createPortal(
    <ClosableModal onClose={onClose}>
      {modalState === "select" && (
        <div className={styles.modalContainer}>
          <h1>초대 코드 생성 방식 선택</h1>

          <div className={styles.optionsContainer}>
            {/* 문자 코드 선택 */}
            <div className={styles.option} onClick={handleTextCodeClick}>
              <div className={styles.code}>12B3</div>
              <h2>문자 코드</h2>
              <p>
                학생들이 문자 코드를 입력하여 <br />
                입장할 수 있습니다
              </p>
            </div>

            {/* QR 코드 선택 */}
            <div className={styles.option} onClick={handleQRCodeClick}>
              <div className={styles.qrCode}>
                <Image
                  src={IMAGES.qrCode}
                  alt="QR Code"
                  width={100}
                  height={100}
                />
              </div>
              <h2>QR 코드</h2>
              <p>
                학생들이 QR 코드를 스캔하여 <br />
                입장할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      )}

      {(modalState === "text" || modalState === "qr") && (
        <div className={styles.codeDisplayModal}>
          {loading ? (
            <LoadingSpinner text="초대 코드 생성 중..." />
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : invitationCode ? (
            <>
              <div className={styles.timeLimit}>
                <span className={styles.number}>{countdown}</span>초 후 만료
              </div>
              {modalState === "text" ? (
                <div className={styles.codeDisplay}>
                  <h2>{invitationCode}</h2>
                </div>
              ) : (
                <div className={styles.qrCodeDisplay}>
                  <QRCodeSVG value={invitationCode} size={200} />
                </div>
              )}
              <p>
                {modalState === "text"
                  ? "문자 코드를 입력해 클래스에 입장하세요"
                  : "QR코드를 스캔해 클래스에 입장하세요"}
              </p>
            </>
          ) : (
            <div>코드가 만료되었습니다. 다시 시도해주세요.</div>
          )}
        </div>
      )}
    </ClosableModal>,
    document.body
  );
};

export default MakeInvitationCodeModal;
