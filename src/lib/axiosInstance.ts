import axios from 'axios';
import { getSession } from 'next-auth/react';

const encodeHeaderValue = (value: string) => {
  return Buffer.from(value, 'utf-8').toString('base64');
};

const axiosInstance = axios.create({
  baseURL: 'http://54.180.112.182:8080',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    console.log('세션 정보:', session);

    if (session?.user) {
      if (session.user.email) {
        config.headers['X-User-Email'] = session.user.email; // 사용자 이메일 추가
      }
      if (session.user.name) {
        config.headers['X-User-Name'] = encodeHeaderValue(session.user.name); // 사용자 이름 추가
      }
      if (session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
