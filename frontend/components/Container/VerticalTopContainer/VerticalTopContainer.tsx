"use client";

import React from "react";
import styles from "./VerticalTopContainer.module.scss";

interface VerticalCenterContainerProps {
  children: React.ReactNode; // 자식 요소를 받는 프로퍼티
}

const VerticalCenterContainer: React.FC<VerticalCenterContainerProps> = ({
  children,
}) => {
  return <div className={styles.container}>{children}</div>;
};

export default VerticalCenterContainer;
