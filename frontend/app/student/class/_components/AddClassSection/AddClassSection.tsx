"use client";

import React, { useState } from "react";
import { CirclePlus } from "lucide-react";
import styles from "./AddClassSection.module.scss";
import EnterClassModal from "./EnterClassModal/EnterClassModal";

export default function AddClassSection() {
  const [isOpen, setIsOpen] = useState(false);
  const onClickAddClass = () => {
    setIsOpen(true);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.iconContainer} onClick={onClickAddClass}>
          <p>클래스 추가하기</p>
          <CirclePlus size={16} />
        </div>
      </div>
      {isOpen && <EnterClassModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
