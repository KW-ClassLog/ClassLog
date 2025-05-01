"use client";

import styles from "./BackWithTitleHeader.module.scss";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type BackWithTitleHeaderProps = {
  title: string;
  backTo?: string;
};

const BackWithTitleHeader: React.FC<BackWithTitleHeaderProps> = ({
  title,
  backTo,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <section className={styles.studentHeader}>
      <ChevronLeft className={styles.chevronIcon} onClick={handleBack} />
      <h1>{title}</h1>
    </section>
  );
};

export default BackWithTitleHeader;
