// [강사용] 헤더에서 선택한 클래스 저장하는 스토어

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClassStore {
  selectedClass: string | null;
  setSelectedClass: (className: string | null) => void;
}

const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      selectedClass: null,
      setSelectedClass: (className) => set({ selectedClass: className }),
    }),
    {
      name: "class-storage", // localStorage에 저장될 키 이름
    }
  )
);

export default useClassStore;
