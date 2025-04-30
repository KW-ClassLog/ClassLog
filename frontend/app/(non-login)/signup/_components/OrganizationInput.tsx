"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

export default function OrganizationInput() {
  const { organization, setField } = useSignupStore();

  return (
    <BasicInput
      value={organization}
      placeholder="소속 (선택)"
      onChange={(e) => setField("organization", e.target.value)}
    />
  );
}
