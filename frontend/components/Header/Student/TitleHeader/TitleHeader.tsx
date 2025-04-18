"use client";

import styles from "./TitleHeader.module.scss";

type TitleHeaderProps = {
  title: string; // title을 props로 받기 위한 타입 정의
};

const TitleHeader: React.FC<TitleHeaderProps> = ({ title }) => {
  return (
    <section className={styles.studentHeader}>
      <h1>{title}</h1>
    </section>
  );
};

export default TitleHeader;
