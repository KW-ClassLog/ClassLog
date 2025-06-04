"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Trash2, X } from "lucide-react";
import Image from "next/image";
import styles from "./ManagementTable.module.scss";
import AlertModal from "../Modal/AlertModal/AlertModal";
import ConfirmModal from "../Modal/ConfirmModal/ConfirmModal";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";
import NoDataView from "../NoDataView/NoDataView";
import { FileText } from "lucide-react";

// student 타입 정의
type StudentData = {
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  organization?: string;
  profile?: string;
};

type ManagementTableProps = {
  type: "lectureNote" | "student"; // 데이터 유형
  data: (FetchLectureNotesByClassResult | StudentData)[]; // lectureNote와 student에 맞는 데이터
  onDelete: (index: string[]) => void; // 삭제 이벤트 처리 함수
};

const ManagementTable: React.FC<ManagementTableProps> = ({
  type,
  data,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // 편집 모드 상태
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set()); // 선택된 항목들 (Set 사용)
  const [phoneNumberCopyAlertModalOpen, setPhoneNumberCopyAlertModalOpen] =
    useState<boolean>(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("selectedItems", selectedItems);
  }, [selectedItems]);

  // 전체 선택 체크박스 클릭 시 모든 항목을 선택/해제
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allSelectedItems = new Set(
        data.map((item) =>
          type === "lectureNote"
            ? (item as FetchLectureNotesByClassResult).lectureNoteId
            : (item as StudentData).userId
        )
      );
      setSelectedItems(allSelectedItems); // 전체 선택
    } else {
      setSelectedItems(new Set()); // 전체 해제
    }
  };

  // 체크박스를 클릭했을 때 선택 항목 업데이트
  const toggleSelection = (id: string) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(id)) {
      updatedSelectedItems.delete(id); // 이미 선택된 항목은 제거
    } else {
      updatedSelectedItems.add(id); // 새 항목은 추가
    }
    setSelectedItems(updatedSelectedItems);
  };

  // 삭제 모달에서 확인 버튼 클릭 시 선택된 항목들 삭제
  const handleDelete = () => {
    onDelete([...selectedItems]); // selectedItems 배열로 변환하여 onDelete 함수에 전달
    setSelectedItems(new Set()); // 삭제 후 선택 항목 초기화
    setIsEditMode(false); // 편집 모드 종료
    setDeleteConfirmModalOpen(false);
  };

  // 취소 버튼 클릭 시 편집 모드 종료
  const handleCancel = () => {
    setSelectedItems(new Set()); // 선택 항목 초기화
    setIsEditMode(false); // 편집 모드 종료
  };

  // 전화번호 복사 함수
  const handleCopyPhoneNumber = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setPhoneNumberCopyAlertModalOpen(true);
    });
  };

  return (
    <div className={styles.managementTable}>
      {type === "lectureNote" && data.length === 0 ? (
        <NoDataView
          icon={FileText}
          title="강의자료가 없습니다"
          description="아직 업로드된 강의자료가 없습니다."
        />
      ) : (
        <table>
          <thead>
            <tr>
              {isEditMode && (
                <th>
                  <button
                    className={`${styles.selectButton} ${
                      selectedItems.size === data.length ? styles.selected : ""
                    }`}
                    onClick={() =>
                      handleSelectAll(selectedItems.size !== data.length)
                    }
                  >
                    <Check size={20} color="white" />
                  </button>
                </th>
              )}
              {type === "lectureNote" ? (
                <>
                  <th>차시</th>
                  <th>파일명</th>
                  <th>용량</th>
                </>
              ) : (
                <>
                  <th>이름</th>
                  <th>소속</th>
                  <th>휴대전화</th>
                </>
              )}
              <th className={styles.buttonContainer}>
                {isEditMode ? (
                  <>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancel}
                    >
                      <X size={14} color={"#606060"} />
                      닫기
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setDeleteConfirmModalOpen(true)}
                    >
                      <Trash2 size={14} color={"#ea4335"} />
                      삭제
                    </button>
                  </>
                ) : (
                  <Trash2
                    className={styles.trashIcon}
                    onClick={() => setIsEditMode(true)}
                  />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={
                  type === "lectureNote"
                    ? (item as FetchLectureNotesByClassResult).lectureNoteId
                    : (item as StudentData).userId
                }
                className={
                  selectedItems.has(
                    type === "lectureNote"
                      ? (item as FetchLectureNotesByClassResult).lectureNoteId
                      : (item as StudentData).userId
                  )
                    ? styles.selectedRow
                    : ""
                }
              >
                {isEditMode && (
                  <td>
                    <button
                      className={`${styles.selectButton} ${
                        selectedItems.has(
                          type === "lectureNote"
                            ? (item as FetchLectureNotesByClassResult)
                                .lectureNoteId
                            : (item as StudentData).userId
                        )
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        toggleSelection(
                          type === "lectureNote"
                            ? (item as FetchLectureNotesByClassResult)
                                .lectureNoteId
                            : (item as StudentData).userId
                        )
                      } // 버튼 클릭 시 선택/해제
                    >
                      <Check size={20} color="white" />
                    </button>
                  </td>
                )}
                {type === "lectureNote" ? (
                  <>
                    <td>
                      {(item as FetchLectureNotesByClassResult).session.join(
                        ", "
                      )}
                    </td>
                    <td>
                      <a
                        href={
                          (item as FetchLectureNotesByClassResult)
                            .lectureNoteUrl
                        }
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#4894fe",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {(item as FetchLectureNotesByClassResult).lectureName ||
                          (item as FetchLectureNotesByClassResult)
                            .lectureNoteUrl}
                      </a>
                    </td>
                    <td>{(item as FetchLectureNotesByClassResult).fileSize}</td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td className={styles.profileContainer}>
                      <Image
                        src={
                          (item as StudentData).profile ||
                          "/images/default_profile.jpg"
                        }
                        alt={(item as StudentData).name}
                        width={40}
                        height={40}
                        className={styles.profileImage}
                      />
                      {(item as StudentData).nickname}
                    </td>
                    <td>{(item as StudentData).organization}</td>
                    <td>
                      {(item as StudentData).phoneNumber}{" "}
                      {!isEditMode ? (
                        <button
                          className={styles.copyButton}
                          onClick={() =>
                            handleCopyPhoneNumber(
                              (item as StudentData).phoneNumber
                            )
                          }
                        >
                          <Copy className={styles.pasteIcon} />
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {phoneNumberCopyAlertModalOpen && (
        <AlertModal onClose={() => setPhoneNumberCopyAlertModalOpen(false)}>
          전화번호가 복사되었습니다.
        </AlertModal>
      )}

      {deleteConfirmModalOpen && (
        <ConfirmModal
          onClose={() => setDeleteConfirmModalOpen(false)}
          onConfirm={handleDelete}
        >
          {type === "lectureNote"
            ? "선택한 강의자료를 삭제하시겠습니까?"
            : "선택한 학생들을 퇴장시키겠습니까?"}
        </ConfirmModal>
      )}
    </div>
  );
};

export default ManagementTable;
