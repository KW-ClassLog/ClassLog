"use client";

import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    console.log("로그인 시도:", { emailId, password });
    // 여기에 로그인 API 호출 로직 추가할 수 있음
  };

  return (
    <div className={styles.loginPage}>
      {!isMobile && (
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
      )}

      <div className={styles.rightSection}>
        {isMobile && <BackWithTitleHeader title="로그인" />}

        <div className={styles.loginForm}>
          <Image
            src="/images/logo3.png"
            alt="ClassLog Logo"
            width={150}
            height={50}
          />
          <BasicInput
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            type="email"
            placeholder="이메일을 입력해주세요"
          />
          <BasicInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호를 입력해주세요"
          />
          <p className={styles.forgetPassword}>비밀번호를 잊으셨나요?</p>

          <FullWidthButton onClick={handleLogin}>로그인</FullWidthButton>
          <div className={styles.signupLink}>
            계정이 없으신가요? <Link href={ROUTES.signup}>회원가입하기</Link>
          </div>
          <div className={styles.or}>OR</div>
          <button className={styles.kakaoButton}>
            <Image
              src="/images/kakao_logo.png"
              alt="Kakao Logo"
              width={20}
              height={20}
            />
            <p>카카오 로그인</p>
          </button>
        </div>
      </div>
    </div>
  );
}
