"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

export default function PhoneInput() {
  const { phoneNumber, setField } = useSignupStore();

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length < 4) return numbersOnly;
    if (numbersOnly.length < 8)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
      3,
      7
    )}-${numbersOnly.slice(7, 11)}`;
  };

  return (
    <BasicInput
      value={phoneNumber}
      type="tel"
      placeholder="전화번호"
      onChange={(e) =>
        setField("phoneNumber", formatPhoneNumber(e.target.value))
      }
    />
  );
}
