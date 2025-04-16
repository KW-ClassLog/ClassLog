"use client";

import styles from "./StudentClassDetailHeader.module.scss";
import { ChevronLeft } from "lucide-react";

type StudentClassDetailHeaderProps = {
  title: string; // title을 props로 받기 위한 타입 정의
};

const StudentClassDetailHeader: React.FC<StudentClassDetailHeaderProps> = ({
  title,
}) => {
  return (
    <section className={styles.studentClassDetailHeader}>
      <ChevronLeft className={styles.chevronIcon} />
      <h1>{title}</h1>
    </section>
  );
};

export default StudentClassDetailHeader;
