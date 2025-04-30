export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResult {
  authCode: number;
}
