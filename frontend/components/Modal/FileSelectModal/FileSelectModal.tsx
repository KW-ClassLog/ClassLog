"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./FileSelectModal.module.scss";
import ClosableModal from "../ClosableModal/ClosableModal";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import SelectableButton from "@/components/Button/SelectableButton/SelectableButton";
import { X } from "lucide-react";

type FileSelectModalProps = {
  sessionNumber: number; // 차시
  files: { id: string; name: string; size: string }[]; // 파일 이름과 크기를 가진 배열
  onClose: () => void; // 모달을 닫을 함수
  onComplete: (selectedFiles: string[]) => void; // 선택된 파일들을 처리할 함수
};

const FileSelectModal: React.FC<FileSelectModalProps> = ({
  sessionNumber,
  files,
  onClose,
  onComplete,
}) => {
  const [fileList, setFileList] = useState(files); // 업로드된 파일 관리
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]); // 선택된 파일 이름만 저장

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
  const handleComplete = () => {
    onComplete(selectedFiles); // 선택된 파일들 처리
    onClose(); // 모달 닫기
  };
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // FileList를 배열로 변환하여 기존 fileList에 추가
      const newFiles = Array.from(files).map((file) => ({
        id: file.name, // id는 파일 이름을 사용 (고유해야 함)
        name: file.name,
        size: formatFileSize(file.size), // 파일 크기 표시
      }));
      // TODO: 서버에 파일 업로드 처리 추가

      setFileList((prevFileList) => [...prevFileList, ...newFiles]);
    }
  };

  return createPortal(
    <ClosableModal onClose={onClose}>
      <div className={`${styles.modalContent} mixed-layout-3`}>
        <h1>{sessionNumber}차시 강의자료 선택</h1>
        <div className={styles.description}>
          원하는 강의자료가 없다면?{" "}
          <span
            className={styles.uploadLink}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            강의자료 업로드하기
          </span>
        </div>

        {/* 선택된 파일 상단에 표시 */}
        {selectedFiles.length > 0 && (
          <div className={styles.selectedFiles}>
            {selectedFiles.map((fileName, index) => (
              <div key={index} className={styles.selectedFileItem}>
                <FileDisplay fileName={fileName} />
                <X
                  className={styles.delelteIcon}
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
          style={{ display: "none" }}
        />

        {/* 파일 목록 */}
        <div className={styles.fileList}>
          {fileList.map((file, id) => (
            <div key={id} className={styles.fileItem}>
              <div className={styles.fileDisplay}>
                <FileDisplay fileName={file.name} />
              </div>
              <span className={styles.fileSize}>{file.size}</span>
              <SelectableButton
                selected={selectedFiles.includes(file.name)}
                onClick={() => handleSelectFile(file.name)}
              />
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <FullWidthButton onClick={handleComplete}>선택 완료</FullWidthButton>
        </div>
      </div>
    </ClosableModal>,
    document.body
  );
};

export default FileSelectModal;
