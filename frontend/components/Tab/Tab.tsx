"use client";
import React, { useState } from "react";
import styles from "./Tab.module.scss";

type TabProps = {
  tabs: string[]; // 탭 이름 배열
  onSelectTab: (selectedTab: string) => void; // 선택된 탭을 부모로 전달하는 함수
};

const Tab: React.FC<TabProps> = ({ tabs, onSelectTab }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onSelectTab(tabs[index]); // 선택된 탭을 부모에게 전달
  };

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${styles.tabItem} ${
            activeTab === index ? styles.active : ""
          }`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tab;
