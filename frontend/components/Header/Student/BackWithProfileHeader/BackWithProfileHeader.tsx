"use client";

import styles from "./BackWithProfileHeader.module.scss";
import { ChevronLeft, User } from "lucide-react";

const BackWithProfileHeader: React.FC = () => {
  return (
    <section className={styles.studentHeader}>
      <ChevronLeft className={styles.icon} />

      <User className={styles.icon} />
    </section>
  );
};

export default BackWithProfileHeader;
