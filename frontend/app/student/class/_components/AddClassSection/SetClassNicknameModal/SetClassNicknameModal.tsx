"use client";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import styles from "./SetClassNicknameModal.module.scss";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import { useState, useEffect } from "react";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { fetchClassInfoByClassId } from "@/api/classes/fetchClassInfoByClassId";
import { Clock, Calendar } from "lucide-react";
import { FetchClassInfoByClassIdResult } from "@/types/classes/fetchClassInfoByClassIdTypes";
import { setClassNickname } from "@/api/student-classes/setClassNickname";

type SetClassNicknameModalProps = {
  onClose: () => void;
  classId: string;
};

export default function SetClassNicknameModal({
  onClose,
  classId,
}: SetClassNicknameModalProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [classInfo, setClassInfo] =
    useState<FetchClassInfoByClassIdResult | null>(null);
  const [isLoadingClassInfo, setIsLoadingClassInfo] = useState(true);

  // 클래스 정보 가져오기
  useEffect(() => {
    const getClassInfo = async () => {
      try {
        setIsLoadingClassInfo(true);
        const response = await fetchClassInfoByClassId(classId);

        if (response.isSuccess) {
          setClassInfo(response.result || null);
        } else {
          setAlertMessage(
            response.message || "클래스 정보를 불러오는데 실패했습니다."
          );
          setIsAlertModalOpen(true);
        }
      } catch (error) {
        console.error("클래스 정보 로드 오류:", error);
        setAlertMessage("클래스 정보를 불러오는 중 오류가 발생했습니다.");
        setIsAlertModalOpen(true);
      } finally {
        setIsLoadingClassInfo(false);
      }
    };

    getClassInfo();
  }, [classId]);

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      setAlertMessage("닉네임을 입력해주세요.");
      setIsAlertModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await setClassNickname({ classId, nickname });

      if (response.isSuccess) {
        router.push(ROUTES.studentClassDetail(classId));
      } else {
        setAlertMessage(response.message || "닉네임 설정에 실패했습니다.");
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error("닉네임 설정 오류:", error);
      setAlertMessage("닉네임 설정에 실패했습니다.");
      setIsAlertModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClosableModal onClose={onClose}>
      <div className={styles.container}>
        {isLoadingClassInfo ? (
          <div className={styles.loading}>
            <p>클래스 정보를 불러오는 중...</p>
          </div>
        ) : classInfo ? (
          <>
            {/* 클래스 정보 카드 */}
            <div className={styles.classInfoCard}>
              <h3 className={styles.className}>
                {classInfo.className} {classInfo.professorName}
              </h3>

              <div className={styles.classDetails}>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>월 (10:15~11:45)/수 (12:00~13:15)</span>
                </div>

                <div className={styles.detailItem}>
                  <Calendar size={16} />
                  <span>2024.03.04~2025.06.13</span>
                </div>
              </div>
            </div>

            {/* 닉네임 입력 섹션 */}
            <div className={styles.nicknameSection}>
              <p className={styles.nicknameLabel}>
                해당 클래스에서 사용할 닉네임을 입력해주세요
              </p>

              <div className={styles.inputContainer}>
                <BasicInput
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            {/* 클래스 입장 버튼 */}
            <div className={styles.buttonContainer}>
              <FullWidthButton
                onClick={handleSubmit}
                disabled={!nickname.trim() || isLoading}
              >
                {isLoading ? "입장 중..." : "클래스 입장"}
              </FullWidthButton>
            </div>
          </>
        ) : (
          <div className={styles.error}>
            <p>클래스 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>

      {/* 알림 모달 */}
      {isAlertModalOpen && (
        <AlertModal onClose={() => setIsAlertModalOpen(false)}>
          <p>{alertMessage}</p>
        </AlertModal>
      )}
    </ClosableModal>
  );
}
