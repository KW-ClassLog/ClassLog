import { create } from "zustand";

interface ClassStore {
  selectedClass: string | null;
  setSelectedClass: (className: string | null) => void;
}

const useClassStore = create<ClassStore>((set) => ({
  selectedClass: null,
  setSelectedClass: (className) => set({ selectedClass: className }),
}));

export default useClassStore;
