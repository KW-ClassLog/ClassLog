"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./NoDataView.module.scss"; // 스타일이 포함된 SCSS 파일

type NoDataViewProps = {
  icon: LucideIcon; // 아이콘을 React 컴포넌트로 받아옴
  title: string;
  description: string;
};

const NoDataView: React.FC<NoDataViewProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className={styles.noDataView}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} strokeWidth={1} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default NoDataView;
