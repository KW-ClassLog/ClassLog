import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.scss";
import { IMAGES } from "@/constants/images";

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
          <div className={styles.textWrapper}>
            <h1>CLASSLOG,</h1>
            <h2>당신의 강의를 더 스마트하게</h2>
            <p>수업 녹음, 실시간 소통, AI 기반 퀴즈 생성을 통해</p>
            <p>강의 준비부터 피드백까지 한 번에 해결하세요.</p>
          </div>
          <div className={styles.heroCtas}>
            <Link href={"/signup"} className={styles.primaryCta}>
              시작하기
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.introImageWrapper}>
            <Image
              src={IMAGES.introImage}
              alt="소개 이미지"
              width={650}
              height={300}
              className={styles.heroImage}
              priority
            />
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollDot} />
      </div>
    </section>
  );
}
