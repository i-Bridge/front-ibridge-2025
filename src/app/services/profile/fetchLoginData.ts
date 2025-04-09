'use server';

import { serverFetch } from '@/lib/serverFetcher';
import { Child } from '@/types';

export interface ProfileData {
  accepted: boolean;
  send: boolean;
  familyName: string;
  children: Child[];
}export const fetchLoginData = async (): Promise<ProfileData | null> => {
  try {
    const res = await serverFetch<ProfileData>('/start/login');

    console.log('fetchLoginData 반환값:', res); // 응답 전체를 확인

    // res.data가 없거나 isSend가 false이면 null 반환
    if (!res.data || !res.data.send) {
      console.log('isSend 거짓:', res.data?.send);
      return null;
    }

    return res.data; // ProfileData 반환
  } catch (error) {
    console.error('API 예외 발생:', error);
    return null;
  }
};


