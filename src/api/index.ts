import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
});

// JWT를 API 요청마다 Authorization 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

export default axiosInstance;
