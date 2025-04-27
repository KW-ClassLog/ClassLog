"use client";

import { useSignupStore } from "@/store/useSignupStore";
import styles from "../page.module.scss";
import { Briefcase, GraduationCap } from "lucide-react";

export default function RoleSelect() {
  const { selectedRole, setField } = useSignupStore();

  return (
    <div className={styles.tabContainer}>
      <button
        type="button"
        className={`${styles.teacherButton} ${
          selectedRole === "teacher" ? styles.selected : ""
        }`}
        onClick={() => setField("selectedRole", "teacher")}
      >
        <Briefcase size={40} strokeWidth={1.2} />
        <div>교사용 계정</div>
      </button>
      <button
        type="button"
        className={`${styles.studentButton} ${
          selectedRole === "student" ? styles.selected : ""
        }`}
        onClick={() => setField("selectedRole", "student")}
      >
        <GraduationCap size={40} strokeWidth={1.2} />
        <div>학생용 계정</div>
      </button>
    </div>
  );
}
