import axiosInstance from '@/lib/axiosInstance';

export const fetchLoginData = async () => {
  try {
    const res = await axiosInstance.get('/start/login');
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};