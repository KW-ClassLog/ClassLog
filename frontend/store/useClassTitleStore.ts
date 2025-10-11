import { create } from "zustand";

interface ClassTitleStore {
  classTitle: string;
  setClassTitle: (title: string) => void;
  clearClassTitle: () => void;
}

export const useClassTitleStore = create<ClassTitleStore>((set) => ({
  classTitle: "",
  setClassTitle: (title: string) => set({ classTitle: title }),
  clearClassTitle: () => set({ classTitle: "" }),
}));
