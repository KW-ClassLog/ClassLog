import { create } from "zustand";

interface SignupState {
  role: "TEACHER" | "STUDENT" | null;
  name: string;
  phoneNumber: string;
  organization: string;
  email: string;
  password: string;
  setField: (
    field: keyof SignupState,
    value: string | "TEACHER" | "STUDENT" | null
  ) => void;
  reset: () => void;
}

const initialState = {
  role: null,
  name: "",
  phoneNumber: "",
  organization: "",
  email: "",
  password: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,
  setField: (field, value) => {
    set({ [field]: value });
  },
  reset: () => set(initialState),
}));
