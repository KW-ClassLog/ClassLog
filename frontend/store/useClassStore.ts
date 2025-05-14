// [강사용] 헤더에서 선택한 클래스 저장하는 스토어

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClassStore {
  selectedClassId: string | null;
  selectedClassName: string | null;
  setSelectedClass: (classId: string, className: string) => void;
  resetSelectedClass: () => void;
}

const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      selectedClassId: null,
      selectedClassName: null,
      setSelectedClass: (classId, className) =>
        set({
          selectedClassId: classId,
          selectedClassName: className,
        }),
      resetSelectedClass: () =>
        set({
          selectedClassId: null,
          selectedClassName: null,
        }),
    }),
    {
      name: "class-storage",
    }
  )
);

export default useClassStore;
