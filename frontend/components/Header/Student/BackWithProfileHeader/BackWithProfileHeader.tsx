"use client";

import styles from "./BackWithProfileHeader.module.scss";
import { ChevronLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

const BackWithProfileHeader: React.FC = () => {
  const router = useRouter();

  return (
    <section className={styles.studentHeader}>
      <ChevronLeft className={styles.icon} onClick={() => router.back()} />

      <User className={styles.icon} />
    </section>
  );
};

export default BackWithProfileHeader;
