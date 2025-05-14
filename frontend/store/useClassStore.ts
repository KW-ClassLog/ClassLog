// [강사용] 헤더에서 선택한 클래스 저장하는 스토어

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
