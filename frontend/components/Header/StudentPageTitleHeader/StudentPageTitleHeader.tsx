"use client";

import styles from "./StudentPageTitleHeader.module.scss";

type StudentPageTitleHeaderProps = {
  title: string; // title을 props로 받기 위한 타입 정의
};

const StudentPageTitleHeader: React.FC<StudentPageTitleHeaderProps> = ({
  title,
}) => {
  return (
    <section className={styles.studentPageTitleHeader}>
      <h1>{title}</h1>
    </section>
  );
};

export default StudentPageTitleHeader;
