import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  email: string | null;
  role: string | null;

  iat: number | null;
  exp: number | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  email: null,
  role: null,
  iat: null,
  exp: null,
  setAccessToken: (token) => {
    // 토큰을 디코딩하여 값 추출
    interface DecodedToken {
      email: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    set({
      accessToken: token,
      email: decodedToken.email,
      role: decodedToken.role,
      iat: decodedToken.iat, // 발급 시간
      exp: decodedToken.exp, // 만료 시간
    });
  },
  logout: () =>
    set({ accessToken: null, email: null, role: null, iat: null, exp: null }),
}));
