"use client";

import React, { useEffect, useState } from "react";
import styles from "./ClassInfoSection.module.scss";
import { useParams } from "next/navigation";
import { fetchClassInfoByClassId } from "@/api/classes/fetchClassInfoByClassId";
import { FetchClassInfoByClassIdResult } from "@/types/classes/fetchClassInfoByClassIdTypes";
import { Calendar, Clock } from "lucide-react";

export default function ClassInfoSection() {
  const { classId } = useParams();

  const [classInfo, setClassInfo] =
    useState<FetchClassInfoByClassIdResult | null>(null);

  useEffect(() => {
    fetchClassInfoByClassId(classId as string).then((res) => {
      if (res.isSuccess) {
        setClassInfo(res.result || null);
      }
    });
  }, [classId]);

  return (
    <div className={styles.container}>
      <div className={styles.classInfo}>
        <div className={styles.classInfoTitleContainer}>
          <div className={styles.classInfoTitle}>{classInfo?.className}</div>
          <div className={styles.classInfoProfessor}>
            {classInfo?.professorName}
          </div>
        </div>
        <div className={styles.classInfoDate}>
          <Clock strokeWidth={1.5} />
          {classInfo?.classDate}
        </div>
        <div className={styles.classInfoDate}>
          <Calendar strokeWidth={1.5} />
          {classInfo?.startDate} ~ {classInfo?.endDate}
        </div>
      </div>
    </div>
  );
}
