export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message?: string;
  result?: T; // string, number, boolean, Object, ... 다양한 타입이 올 수 있으므로
}
