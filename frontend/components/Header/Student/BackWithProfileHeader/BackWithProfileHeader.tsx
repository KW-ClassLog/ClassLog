"use client";

import styles from "./BackWithProfileHeader.module.scss";
import { ChevronLeft } from "lucide-react";

type BackWithProfileHeaderProps = {
  title: string; // title을 props로 받기 위한 타입 정의
};

const BackWithProfileHeader: React.FC<BackWithProfileHeaderProps> = ({
  title,
}) => {
  return (
    <section className={styles.section}>
      <ChevronLeft className={styles.chevronIcon} />
      <h1>{title}</h1>
    </section>
  );
};

export default BackWithProfileHeader;
