import { refreshToken } from "@/api/users/refreshToken";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

export const setAuthData = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);

  const decoded = getDecodedToken();
  if (decoded) {
    localStorage.setItem("role", decoded.role);
    localStorage.setItem("exp", decoded.exp.toString());
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("exp");
};

export const setupTokenRefresh = () => {
  const decoded = getDecodedToken();
  if (!decoded) return;

  const expirationTime = decoded.exp * 1000; // 밀리초로 변환
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;

  // 만료 1분 전에 토큰 갱신
  const refreshTime = timeUntilExpiry - 60000;

  if (refreshTime <= 0) {
    // 이미 만료되었거나 곧 만료될 예정이면 즉시 갱신
    refreshToken();
  } else {
    // 만료 1분 전에 갱신 예약
    setTimeout(refreshToken, refreshTime);
  }
};
