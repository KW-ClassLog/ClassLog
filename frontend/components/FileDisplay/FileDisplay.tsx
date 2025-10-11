"use client";

import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { ICONS } from "@/constants/images";
import styles from "./FileDisplay.module.scss";

// 파일 확장자 그룹화 및 매핑
const fileIcons: { [key: string]: StaticImageData } = {
  zip: ICONS.zip,
  word: ICONS.word,
  video: ICONS.video,
  text: ICONS.text,
  ppt: ICONS.ppt,
  pdf: ICONS.pdf,
  none: ICONS.none,
  music: ICONS.music,
  img: ICONS.img,
  excel: ICONS.excel,
  code: ICONS.code,
};

type FileDisplayProps = {
  fileName: string;
  size?: string;
};

const FileDisplay: React.FC<FileDisplayProps> = ({ fileName, size }) => {
  // 파일 확장자 추출
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  // 여러 확장자를 하나로 묶기 (예: ppt, pptx, doc, docx 등)
  const getIcon = (ext: string | undefined) => {
    if (!ext) return fileIcons.none;

    if (["doc", "docx", "hwp"].includes(ext)) return fileIcons.word; // doc, docx
    if (["ppt", "pptx"].includes(ext)) return fileIcons.ppt; // ppt, pptx
    if (["mp3"].includes(ext)) return fileIcons.music; // mp3
    if (["mp4", "avi", "mov"].includes(ext)) return fileIcons.video; // mp4, avi, mov
    if (["zip", "rar"].includes(ext)) return fileIcons.zip; // zip, rar
    if (["pdf"].includes(ext)) return fileIcons.pdf; // pdf
    if (["txt", "csv", "json", "xml", "md"].includes(ext))
      return fileIcons.text; // csv, json, xml
    if (["xls", "xlsx"].includes(ext)) return fileIcons.excel; // xls, xlsx
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return fileIcons.img; // 이미지 파일
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
    <div className={`${styles.fileDisplayContainer} mixed-layout-2`}>
      <div className={styles.fileIconContainer}>
        <Image
          src={icon}
          alt={fileExtension || "file icon"}
          className={styles.icon}
          width={24}
          height={24}
        />
      </div>
      <div className={styles.fileInfoContainer}>
        <span className={styles.fileName}>{fileName}</span>
        <span className={styles.size}>{size}</span>
      </div>
    </div>
  );
};

export default FileDisplay;
