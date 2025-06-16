// [강사용] 헤더에서 선택한 클래스 저장하는 스토어

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedClassStore {
  selectedClassId: string | null;
  selectedClassName: string | null;
  setSelectedClass: (classId: string, className: string) => void;
  resetSelectedClass: () => void;
  reset: () => void;
}

const initialState = {
  selectedClassId: null,
  selectedClassName: null,
};

const useSelectedClassStore = create<SelectedClassStore>()(
  persist(
    (set) => ({
      ...initialState,
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
      reset: () => set(initialState),
    }),
    {
      name: "class-storage",
    }
  )
);

export default useSelectedClassStore;
