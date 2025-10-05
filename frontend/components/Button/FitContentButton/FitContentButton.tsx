"use client";

import React from "react";
import styles from "./FitContentButton.module.scss";

interface FitContentButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const FitContentButton: React.FC<FitContentButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  className,
}) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default FitContentButton;
