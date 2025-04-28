"use client";

import styles from "../page.module.scss";
import Image from "next/image";

export default function LeftSection() {
  return (
    <div className={styles.leftSection}>
      <div className={styles.textWrapper}>
        <h1>CLASSLOG,</h1>
        <h2>당신의 강의를 더 스마트하게</h2>
        <p>기반 수업 녹음, 실시간 소통, 자동 퀴즈 생성을 통해</p>
        <p>강의 준비부터 피드백까지 한 번에 해결하세요.</p>
      </div>
      <div className={styles.introImageWrapper}>
        <Image
          src="/images/intro_image.png"
          alt="소개 이미지"
          width={650}
          height={300}
        />
      </div>
    </div>
  );
}
