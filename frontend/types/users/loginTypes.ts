export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResult = { isTemporary: boolean; message: string };
