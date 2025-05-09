"use client";

import { ROUTES } from "@/constants/routes";
import styles from "../page.module.scss"; // 스타일 시트 임포트
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfileSection() {
  return (
    <Link href={ROUTES.studentProfileEdit} className={styles.profileSection}>
      <Image
        src="/images/default_profile.jpg"
        alt="Profile Image"
        className={styles.profileImage}
        width={60}
        height={60}
      />
      <div className={styles.profileInfo}>
        <h2>손아현</h2>
        <p>학생</p>
      </div>
      <div className={styles.editButton}>
        <ChevronRight />
      </div>
    </Link>
  );
}
