import { create } from "zustand";

interface SignupState {
  role: "teacher" | "student" | null;
  name: string;
  phoneNumber: string;
  organization: string;
  email: string;
  password: string;
  setField: (
    field: keyof SignupState,
    value: string | "teacher" | "student" | null
  ) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  role: null,
  name: "",
  phoneNumber: "",
  organization: "",
  email: "",
  password: "",
  setField: (field, value) => {
    console.log(`[useSignupStore] ${field} updated to`, value);
    set({ [field]: value });
  },
}));
