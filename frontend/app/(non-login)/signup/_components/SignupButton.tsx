"use client";

import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

export default function SignupButton() {
  return (
    <FullWidthButton
      onClick={() => {
        console.log("회원가입 요청");
      }}
    >
      회원가입
    </FullWidthButton>
  );
}
