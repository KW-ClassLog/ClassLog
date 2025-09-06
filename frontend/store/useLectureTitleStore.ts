import { create } from "zustand";

interface LectureTitleStore {
  lectureTitle: string;
  setLectureTitle: (title: string) => void;
  clearLectureTitle: () => void;
}

export const useLectureTitleStore = create<LectureTitleStore>((set) => ({
  lectureTitle: "",
  setLectureTitle: (title: string) => set({ lectureTitle: title }),
  clearLectureTitle: () => set({ lectureTitle: "" }),
}));
