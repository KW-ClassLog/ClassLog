"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./FileSelectModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import SelectableButton from "@/components/Button/SelectableButton/SelectableButton";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { X } from "lucide-react";
import { fetchLectureNotesByClass } from "@/api/lectures/fetchLectureNotesByClass";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";
import { uploadLectureNote } from "@/api/lectures/uploadLectureNote";
import { mappingLectureNote } from "@/api/lectures/mappingLectureNote";

type FileSelectModalProps = {
  classId: string;
  lectureId: string;
  onClose: () => void; // 모달을 닫을 함수
  registeredFiles?: string[]; // 이미 등록된 파일 이름 목록
  onComplete?: () => void; // 강의자료 선택 완료 시 호출할 콜백
};

const FileSelectModal: React.FC<FileSelectModalProps> = ({
  classId,
  lectureId,
  onClose,
  registeredFiles,
  onComplete,
}) => {
  const [fileList, setFileList] = useState<FetchLectureNotesByClassResult[]>(
    []
  ); // 업로드된 파일 관리
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    registeredFiles || []
  ); // 선택된 파일 이름만 저장
  const [initialSelectedFiles] = useState<string[]>(registeredFiles || []); // 초기 선택된 파일 상태 저장
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // 선택 상태가 변경되었는지 확인하는 함수
  const hasSelectionChanged = () => {
    if (selectedFiles.length !== initialSelectedFiles.length) {
      return true;
    }

    // 선택된 파일들이 초기 상태와 다른지 확인
    const currentSet = new Set(selectedFiles);
    const initialSet = new Set(initialSelectedFiles);

    for (const file of selectedFiles) {
      if (!initialSet.has(file)) return true;
    }

    for (const file of initialSelectedFiles) {
      if (!currentSet.has(file)) return true;
    }

    return false;
  };

  // classId로 파일 목록 가져오기
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetchLectureNotesByClass(classId);

      if (response.isSuccess && response.result) {
        setFileList(response.result);
      }
    } catch (error) {
      console.error("파일 목록을 가져오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [classId]);

  // 파일 선택/해제
  const handleSelectFile = (fileName: string) => {
    setSelectedFiles(
      (prevSelected) =>
        prevSelected.includes(fileName)
          ? prevSelected.filter((name) => name !== fileName) // 선택 해제
          : [...prevSelected, fileName] // 선택
    );
  };

  // 선택 완료 버튼 클릭 시
  const handleComplete = async () => {
    try {
      // 선택된 파일 이름들을 lectureNoteId로 변환
      const selectedLectureNoteIds = fileList
        .filter((file) => selectedFiles.includes(file.lectureNoteName))
        .map((file) => file.lectureNoteId);

      // 선택한 파일들을 강의와 맵핑하는 api 호출
      const response = await mappingLectureNote(
        lectureId,
        selectedLectureNoteIds
      );

      if (response.isSuccess) {
        console.log("강의자료 맵핑 성공:", response.result);
        onClose(); // 모달 닫기
        if (onComplete) {
          onComplete();
        }
      } else {
        console.error("강의자료 맵핑 실패:", response.message);
        alert("강의자료 맵핑에 실패했습니다.");
      }
    } catch (error) {
      console.error("강의자료 맵핑 중 오류 발생:", error);
      alert("강의자료 맵핑 중 오류가 발생했습니다.");
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const fileArray = Array.from(files);

      const response = await uploadLectureNote(classId, fileArray);

      if (response.isSuccess) {
        console.log("파일 업로드 성공:", response.result);
        // 파일 업로드 성공 후 파일 목록 다시 불러오기
        await loadFiles();
        // 파일 input 초기화
        e.target.value = "";
      } else {
        console.error("파일 업로드 실패:", response.message);
        alert("파일 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <ClosableModal onClose={onClose}>
      <div className={styles.modalContent}>
        <h1>강의자료 선택</h1>
        <div className={styles.description}>
          원하는 강의자료가 없다면?{" "}
          <span
            className={styles.uploadLink}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {isUploading ? "업로드 중..." : "강의자료 업로드하기"}
          </span>
        </div>

        {/* 선택된 파일 상단에 표시 */}
        {selectedFiles.length > 0 && (
          <div className={styles.selectedFiles}>
            {selectedFiles.map((fileName, index) => (
              <div key={index} className={styles.selectedFileItem}>
                <FileDisplay fileName={fileName} />
                <X
                  className={styles.deleteIcon}
                  onClick={() => {
                    const newFiles = [...selectedFiles];
                    newFiles.splice(index, 1);
                    setSelectedFiles(newFiles);
                  }}
                  size={20}
                />
              </div>
            ))}
          </div>
        )}

        {/* 파일 업로드 input */}
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={isUploading}
          style={{ display: "none" }}
        />

        {/* 파일 목록 */}
        <div className={styles.fileList}>
          {isLoading ? (
            <LoadingSpinner text="해당 클래스에 등록된 파일 목록을 불러오는 중..." />
          ) : fileList.length === 0 ? (
            <div className={styles.emptyState}>
              업로드된 강의자료가 없습니다.
            </div>
          ) : (
            fileList.map((file) => (
              <div key={file.lectureNoteId} className={styles.fileItem}>
                <div className={styles.fileDisplay}>
                  <FileDisplay fileName={file.lectureNoteName} />
                </div>
                <span className={styles.fileSize}>{file.fileSize}</span>
                <SelectableButton
                  selected={selectedFiles.includes(file.lectureNoteName)}
                  onClick={() => handleSelectFile(file.lectureNoteName)}
                />
              </div>
            ))
          )}
        </div>

        <div className={styles.buttonContainer}>
          <FullWidthButton
            onClick={handleComplete}
            disabled={!hasSelectionChanged()}
          >
            강의자료 선택 완료
          </FullWidthButton>
        </div>
      </div>
    </ClosableModal>,
    document.body
  );
};

export default FileSelectModal;
