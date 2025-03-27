import axiosInstance from '@/lib/axiosInstance';

// 요청을 보내는 함수 예시
const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('/parent/mypage/edit'); // 실제 API 경로로 교체

    if (response?.data?.isSuccess) {
      // 응답이 성공적이면 data를 반환
      const { data } = response.data;
      console.log('응답 데이터:', data);

      // data에 있는 정보 활용
      const { name, familyName, children } = data;
      console.log('이름:', name);
      console.log('성:', familyName);
      console.log('자녀들:', children);
    } else {
      // 실패한 경우 메시지 출력
      console.log('응답 실패:', response.data.message);
    }
  } catch (error) {
    // 네트워크 오류 등 에러 처리
    console.error('에러 발생:', error);
  }
};

// 호출 예시
fetchUserData();
