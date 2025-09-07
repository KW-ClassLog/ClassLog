import { useAuthStore } from "./useAuthStore";
import { useQuizStore } from "./useQuizStore";
import useLectureListStore from "./useLectureListStore";
import useSelectedClassStore from "./useSelectedClassStore";
import useClassListStore from "./useClassListStore";
import { useSignupStore } from "./useSignupStore";
import { useLectureStatusStore } from "./useLectureStatusStore";

/**
 * 모든 스토어를 초기 상태로 리셋하는 함수
 * 로그아웃이나 토큰 만료 시 사용
 */
export const resetAllStores = () => {
  // 각 스토어의 reset 함수 호출
  // auth store는 직접 초기화 (무한 루프 방지)
  useAuthStore.setState({
    accessToken: null,
    userId: null,
    role: null,
    iat: null,
    exp: null,
  });
  localStorage.removeItem("accessToken");

  useQuizStore.getState().reset();
  useLectureListStore.getState().reset();
  useSelectedClassStore.getState().reset();
  useClassListStore.getState().reset();
  useSignupStore.getState().reset();
  useLectureStatusStore.getState().clearLectureStatus();

  console.log("모든 스토어가 초기화되었습니다.");
};
