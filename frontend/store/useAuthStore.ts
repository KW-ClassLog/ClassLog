import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/api/users/refreshToken";
import { useQuizStore } from "./useQuizStore";
import useLectureListStore from "./useLectureListStore";
import useSelectedClassStore from "./useSelectedClassStore";
import useClassListStore from "./useClassListStore";
import { useSignupStore } from "./useSignupStore";
import {registerFcmToken} from "@/api/notifications/fcm";
import { useLectureStatusStore } from "./useLectureStatusStore";
import { useClassTitleStore } from "./useClassTitleStore";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  role: string | null;

  iat: number | null;
  exp: number | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

function getInitialAuthState() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        interface DecodedToken {
          userId: string;
          role: string;
          iat: number;
          exp: number;
        }
        const decodedToken = jwtDecode<DecodedToken>(token);

        // 토큰 만료 체크
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          // 토큰이 만료되었으면 localStorage에서 제거하고 초기 상태 반환
          localStorage.removeItem("accessToken");

          return {
            accessToken: null,
            userId: null,
            role: null,
            iat: null,
            exp: null,
          };
        }

        return {
          accessToken: token,
          userId: decodedToken.userId,
          role: decodedToken.role,
          iat: decodedToken.iat,
          exp: decodedToken.exp,
        };
      } catch {
        // 토큰 파싱 실패 시 localStorage에서 제거하고 초기 상태 반환
        localStorage.removeItem("accessToken");

        return {
          accessToken: null,
          userId: null,
          role: null,
          iat: null,
          exp: null,
        };
      }
    }
  }
  return {
    accessToken: null,
    userId: null,
    role: null,
    iat: null,
    exp: null,
  };
}

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
let expirationCheckInterval: ReturnType<typeof setInterval> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  ...getInitialAuthState(),
  setAccessToken: (token) => {
    // 토큰을 디코딩하여 값 추출
    interface DecodedToken {
      userId: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    set({
      accessToken: token,
      userId: decodedToken.userId,
      role: decodedToken.role,
      iat: decodedToken.iat, // 발급 시간
      exp: decodedToken.exp, // 만료 시간
    });
    // localStorage에도 저장
    localStorage.setItem("accessToken", token);
    registerFcmToken();

    // 기존 타이머가 있으면 제거
    if (refreshTimeout) clearTimeout(refreshTimeout);
    if (expirationCheckInterval) clearInterval(expirationCheckInterval);

    // 만료 1분 전에 refreshToken 예약
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    const refreshTime = timeUntilExpiry - 60000; // 1분 전

    if (refreshTime > 0) {
      refreshTimeout = setTimeout(() => {
        refreshToken();
      }, refreshTime);
    } else {
      // 이미 만료 임박이면 즉시 갱신
      refreshToken();
    }

    // 토큰 만료 체크 인터벌 설정 (30초마다 체크)
    expirationCheckInterval = setInterval(() => {
      const { checkTokenExpiration } = get();
      if (checkTokenExpiration()) {
        // 토큰이 만료되었으면 모든 스토어 초기화
        get().logout();
      }
    }, 30000);
  },
  logout: () => {
    set({ accessToken: null, userId: null, role: null, iat: null, exp: null });
    localStorage.removeItem("accessToken");

    if (refreshTimeout) clearTimeout(refreshTimeout);
    if (expirationCheckInterval) clearInterval(expirationCheckInterval);

    // 모든 스토어 초기화
    useQuizStore.getState().reset();
    useLectureListStore.getState().reset();
    useSelectedClassStore.getState().reset();
    useClassListStore.getState().reset();
    useSignupStore.getState().reset();
    useLectureStatusStore.getState().clearLectureStatus();
    useClassTitleStore.getState().clearClassTitle();
    useSelectedClassStore.getState().reset();

    console.log("로그아웃: 모든 스토어가 초기화되었습니다.");
  },
  checkTokenExpiration: () => {
    const { exp } = get();
    if (!exp) return true; // 토큰이 없으면 만료된 것으로 간주

    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  },
}));
