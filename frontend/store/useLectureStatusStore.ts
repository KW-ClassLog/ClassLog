import { create } from "zustand";

export type LectureStatus =
  | "beforeLecture"
  | "onLecture"
  | "makeQuiz"
  | "checkDashboard";

interface LectureStatusStore {
  lectureStatus: LectureStatus | null;
  setLectureStatus: (status: LectureStatus) => void;
  clearLectureStatus: () => void;
}

export const useLectureStatusStore = create<LectureStatusStore>((set) => ({
  lectureStatus: null,
  setLectureStatus: (status: LectureStatus) => set({ lectureStatus: status }),
  clearLectureStatus: () => set({ lectureStatus: null }),
}));
