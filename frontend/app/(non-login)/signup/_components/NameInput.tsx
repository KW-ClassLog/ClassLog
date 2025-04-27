"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

export default function NameInput() {
  const { name, setField } = useSignupStore();

  return (
    <BasicInput
      value={name}
      placeholder="이름"
      onChange={(e) => setField("name", e.target.value)}
    />
  );
}
