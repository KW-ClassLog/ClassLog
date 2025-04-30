"use client";

import styles from "../page.module.scss";
import { useState } from "react";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import { login } from "@/api/users/login";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/Modal/AlertModal/AlertModal"; // Import AlertModal

type RightSectionProps = {
  isMobile: boolean;
};

export default function RightSection({ isMobile }: RightSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error 메시지 state
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal visibility state
  const router = useRouter(); // useRouter 사용

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      if (response.isSuccess) {
        // 로그인 성공 시 accessToken을 localStorage에 저장
        const accessToken = response.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // TODO: 비밀번호 찾기(변경) 직후 로그인일 경우, 홈으로 라우팅 이후에 팝업을 띄워야 함
        // if (response.result?.isTemporary){}

        // role에 따른 리다이렉트 경로 설정
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const role = payload.role;
        if (role == "STUDENT") {
          router.push(ROUTES.studentHome);
        } else {
          router.push(ROUTES.teacherHome);
        }
      } else {
        setErrorMessage(response.message || "로그인 실패");
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setShowErrorModal(true);
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="이메일을 입력해주세요"
        />
        <BasicInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호를 입력해주세요"
        />

        {/* TODO :비밀번호 찾기 기능은 추후에 추가 예정 */}
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

      {/* Show AlertModal on error */}
      {showErrorModal && (
        <AlertModal onClose={handleCloseModal}>{errorMessage}</AlertModal>
      )}
    </div>
  );
}
