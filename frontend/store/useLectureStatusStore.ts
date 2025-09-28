import { StudentLectureStatus } from "@/types/lectures/fetchStudentLectureDetailTypes";
import { create } from "zustand";

interface LectureStatusStore {
  lectureStatus: StudentLectureStatus | null;
  setLectureStatus: (status: StudentLectureStatus) => void;
  clearLectureStatus: () => void;
}

export const useLectureStatusStore = create<LectureStatusStore>((set) => ({
  lectureStatus: null,
  setLectureStatus: (status: StudentLectureStatus) =>
    set({ lectureStatus: status }),
  clearLectureStatus: () => set({ lectureStatus: null }),
}));
