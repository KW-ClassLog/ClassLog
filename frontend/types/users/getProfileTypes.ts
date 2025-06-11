export type GetProfileResult = {
  userId: string;
  name: string;
  organization: string;
  phoneNumber: string;
  profile: string;
  role: "STUDENT" | "TEACHER";
};
