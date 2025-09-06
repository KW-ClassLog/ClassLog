"use client";
import React, { useState } from "react";
import styles from "./LectureListAndNote.module.scss";
import LectureList from "../LectureList/LectureList";
import LectureNote from "../LectureNote/LectureNote";
import Tab from "../../../../../../components/Tab/Tab";

export default function LectureListAndNote() {
  const [selectedTab, setSelectedTab] = useState("강의 목록");

  const tabs = ["강의 목록", "강의자료"];

  const handleTabSelect = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className={styles.container}>
      <Tab tabs={tabs} onSelectTab={handleTabSelect} />
      <div className={styles.content}>
        {selectedTab === "강의 목록" ? <LectureList /> : <LectureNote />}
      </div>
    </div>
  );
}
