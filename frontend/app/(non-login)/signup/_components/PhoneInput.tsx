"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

export default function PhoneInput() {
  const { phoneNumber, setField } = useSignupStore();

  return (
    <BasicInput
      value={phoneNumber}
      type="tel"
      placeholder="전화번호"
      onChange={(e) => setField("phoneNumber", e.target.value)}
    />
  );
}
