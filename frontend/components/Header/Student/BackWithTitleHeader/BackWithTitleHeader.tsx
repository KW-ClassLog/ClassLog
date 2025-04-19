"use client";

import styles from "./BackWithTitleHeader.module.scss";
import { ChevronLeft } from "lucide-react";

type BackWithTitleHeaderProps = {
  title: string; // title을 props로 받기 위한 타입 정의
};

const BackWithTitleHeader: React.FC<BackWithTitleHeaderProps> = ({ title }) => {
  return (
    <section className={styles.studentHeader}>
      <ChevronLeft className={styles.chevronIcon} />
      <h1>{title}</h1>
    </section>
  );
};

export default BackWithTitleHeader;
