"use client";

import { useSignupStore } from "@/store/useSignupStore";
import styles from "../page.module.scss";
import { Briefcase, GraduationCap } from "lucide-react";

export default function RoleSelect() {
  const { role, setField } = useSignupStore();

  return (
    <div className={styles.tabContainer}>
      <button
        type="button"
        className={`${styles.teacherButton} ${
          role === "teacher" ? styles.selected : ""
        }`}
        onClick={() => setField("role", "TEACHER")}
      >
        <Briefcase size={40} strokeWidth={1.2} />
        <div>교사용 계정</div>
      </button>
      <button
        type="button"
        className={`${styles.studentButton} ${
          role === "student" ? styles.selected : ""
        }`}
        onClick={() => setField("role", "STUDENT")}
      >
        <GraduationCap size={40} strokeWidth={1.2} />
        <div>학생용 계정</div>
      </button>
    </div>
  );
}
