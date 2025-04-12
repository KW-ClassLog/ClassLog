"use client";

import React from "react";
import Image from "next/image";
import styles from "./FileDisplay.module.scss";

// 파일 확장자 그룹화 및 매핑
const fileIcons: { [key: string]: string } = {
  zip: "/icons/zip.svg",
  word: "/icons/word.svg",
  video: "/icons/video.svg",
  text: "/icons/text.svg",
  ppt: "/icons/ppt.svg",
  pdf: "/icons/pdf.svg",
  none: "/icons/none.svg",
  music: "/icons/music.svg",
  img: "/icons/img.svg",
  excel: "/icons/excel.svg",
  code: "/icons/code.svg",
};

type FileDisplayProps = {
  fileName: string;
};

const FileDisplay: React.FC<FileDisplayProps> = ({ fileName }) => {
  // 파일 확장자 추출
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  // 여러 확장자를 하나로 묶기 (예: ppt, pptx, doc, docx 등)
  const getIcon = (ext: string | undefined) => {
    if (!ext) return fileIcons.none;

    if (["doc", "docx"].includes(ext)) return fileIcons.word; // doc, docx
    if (["ppt", "pptx"].includes(ext)) return fileIcons.ppt; // ppt, pptx
    if (["xls", "xlsx"].includes(ext)) return fileIcons.excel; // xls, xlsx
    if (["jpg", "jpeg", "png"].includes(ext)) return fileIcons.img; // 이미지 파일
    if (
      [
        "js",
        "ts",
        "html",
        "css",
        "tsx",
        "jsx",
        "py",
        "ipynb",
        "java",
        "rb",
        "go",
        "php",
        "c",
        "cpp",
        "swift",
      ].includes(ext)
    ) {
      return fileIcons.code;
    }
    return fileIcons[ext] || fileIcons.none; // 여기 없는 것들은 기본 아이콘 처리
  };

  const icon = getIcon(fileExtension);

  return (
    <div className="mixed-layout-2">
      <div className={styles.fileIconContainer}>
        <Image
          src={icon}
          alt={fileExtension || "file icon"}
          className={styles.icon}
          width={24}
          height={24}
        />
      </div>

      <span className={styles.fileName}>{fileName}</span>
    </div>
  );
};

export default FileDisplay;
