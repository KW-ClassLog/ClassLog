import { create } from "zustand";
import { FetchLecturesByClassResult } from "@/types/classes/fetchLecturesByClassTypes";
import { fetchLecturesByClass } from "@/api/classes/fetchLecturesByClass";

interface LectureListStore {
  lectureList: FetchLecturesByClassResult[];
  isLoading: boolean;
  error: string | null;
  fetchLectureList: (classId: string) => Promise<void>;
  refreshLectureList: (classId: string) => Promise<void>;
}

const useLectureListStore = create<LectureListStore>((set) => ({
  lectureList: [],
  isLoading: false,
  error: null,
  fetchLectureList: async (classId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchLecturesByClass(classId);
      if (response.isSuccess && response.result) {
        set({ lectureList: response.result, isLoading: false });
      } else {
        set({
          error: response.message || "강의 목록을 불러오는데 실패했습니다.",
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: "강의 목록을 불러오는데 실패했습니다.", isLoading: false });
      console.error("Failed to fetch lecture list:", err);
    }
  },
  refreshLectureList: async (classId: string) => {
    const response = await fetchLecturesByClass(classId);
    if (response.isSuccess && response.result) {
      set({ lectureList: response.result });
    }
  },
}));

export default useLectureListStore;
