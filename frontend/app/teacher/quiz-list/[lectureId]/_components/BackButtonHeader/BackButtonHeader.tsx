"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButtonHeader.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function BackButtonHeader() {
  const router = useRouter();

  return (
    <header className={styles.quizHeader}>
      <IconButton
        icon={<ArrowLeft />}
        onClick={() => router.push(ROUTES.teacherQuizManagement)}
        ariaLabel={""}
      ></IconButton>
    </header>
  );
}
