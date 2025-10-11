import { StudentLectureStatus } from "@/types/lectures/fetchStudentLectureDetailTypes";
import { create } from "zustand";

interface LectureStatusStore {
  lectureStatus: StudentLectureStatus | null;
  lectureDate: string | null;
  setLectureDate: (date: string) => void;
  setLectureStatus: (status: StudentLectureStatus) => void;
  clearLectureStatus: () => void;
}

export const useLectureStatusStore = create<LectureStatusStore>((set) => ({
  lectureStatus: null,
  lectureDate: null,
  setLectureDate: (date: string) => set({ lectureDate: date }),
  setLectureStatus: (status: StudentLectureStatus) =>
    set({ lectureStatus: status }),
  clearLectureStatus: () => set({ lectureStatus: null }),
}));
