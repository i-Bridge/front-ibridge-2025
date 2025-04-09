export type ApiResponse<
  T = undefined,
  U extends Partial<{ isSuccess: boolean; isDuplicate: boolean }> = {}
> = {
  code: string;
  message: string;
} & U & (T extends undefined ? {} : { data?: T }); 