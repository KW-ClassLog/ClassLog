import { create } from "zustand";
import { FetchMyClassListResult } from "@/types/classes/fetchMyClassListTypes";
import { fetchMyClassList } from "@/api/classes/fetchMyClassList";

interface ClassListStore {
  classList: FetchMyClassListResult[];
  isLoading: boolean;
  error: string | null;
  fetchClassList: () => Promise<void>;
  refreshClassList: () => Promise<void>;
}

const useClassListStore = create<ClassListStore>((set) => ({
  classList: [],
  isLoading: false,
  error: null,
  fetchClassList: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchMyClassList();
      if (response.isSuccess && response.result) {
        set({ classList: response.result, isLoading: false });
      } else {
        set({
          error: response.message || "클래스 목록을 불러오는데 실패했습니다.",
          isLoading: false,
        });
      }
    } catch (err) {
      set({
        error: "클래스 목록을 불러오는데 실패했습니다.",
        isLoading: false,
      });
      console.error("Failed to fetch class list:", err);
    }
  },
  refreshClassList: async () => {
    const response = await fetchMyClassList();
    if (response.isSuccess && response.result) {
      set({ classList: response.result });
    }
  },
}));

export default useClassListStore;
