import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types';
import { Child } from '@/types';

export interface ProfileData {
  isAccepted: boolean;
  isSend: boolean;
  familyName: string;
  children: Child[];
}

export const fetchLoginData = async (): Promise<ProfileData | null> => {
  try {
    const res: ApiResponse<ProfileData, { isSuccess: boolean }> =
      await axiosInstance.get('/start/login');

    if (res.code !== '200') {
      console.error('API 호출 실패:', res.message);
      return null;
    }
    if (!res.data.isSend) {
      console.log('isSend 거짓:',res.data.isSend);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error('API 예외 발생:', error);
    return null;
  }
};
