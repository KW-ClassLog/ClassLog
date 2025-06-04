import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/api/users/refreshToken";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  role: string | null;

  iat: number | null;
  exp: number | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
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
        return {
          accessToken: token,
          userId: decodedToken.userId,
          role: decodedToken.role,
          iat: decodedToken.iat,
          exp: decodedToken.exp,
        };
      } catch {
        // 토큰 파싱 실패 시 모두 null
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

export const useAuthStore = create<AuthState>((set) => ({
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

    // 기존 타이머가 있으면 제거
    if (refreshTimeout) clearTimeout(refreshTimeout);

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
  },
  logout: () => {
    set({ accessToken: null, userId: null, role: null, iat: null, exp: null });
    localStorage.removeItem("accessToken");
    if (refreshTimeout) clearTimeout(refreshTimeout);
  },
}));
