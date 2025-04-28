export interface SignupRequest {
  role: "TEACHER" | "STUDENT";
  name: string;
  phoneNumber: string;
  organization: string;
  email: string;
  password: string;
}

// string이거나 객체거나 없거나
export type SignupResult = string | { [key: string]: string };
