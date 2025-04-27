import { create } from "zustand";

interface SignupState {
  name: string;
  phoneNumber: string;
  organization: string;
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  selectedRole: "teacher" | "student" | null;
  setField: (
    field: keyof SignupState,
    value: string | "teacher" | "student" | null
  ) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  name: "",
  phoneNumber: "",
  organization: "",
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  selectedRole: null,
  setField: (field, value) => set({ [field]: value }),
}));
