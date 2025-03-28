// types.ts 파일에서 타입 정의
export interface Child {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  profileImage: string;
}

export interface UserData {
  children: Child[]; // 자식들의 배열
}

// axiosInstance 정의가 필요하다면 아래와 같이 설정 가능
import axiosInstance from '@/lib/axiosInstance';

// fetchUserData 함수
export const fetchUserData = async (): Promise<UserData | null> => {
  try {
    const response = await axiosInstance.get('/parent/mypage/edit'); // 실제 API 경로로 교체

    // 응답이 성공적이면 데이터 반환
    if (response?.data?.isSuccess) {
      const { data } = response.data;

      // 타입 검증: data가 UserData 타입에 부합하는지 체크
      if (isUserData(data)) {
        console.log('응답 데이터:', data);
        return data; // 타입 검증이 완료된 data 반환
      } else {
        console.error('응답 데이터가 예상 타입과 일치하지 않습니다:', data);
        return null; // 타입 불일치 시 null 반환
      }
    } else {
      console.log('응답 실패:', response.data.message);
      return null; // 실패한 경우 null 반환
    }
  } catch (error) {
    console.error('에러 발생:', error);
    return null; // 에러 발생 시 null 반환
  }
};

// 타입 검증 함수
const isUserData = (data: any): data is UserData => {
  // data가 UserData 타입인지 확인하는 로직
  return (
    Array.isArray(data.children) &&
    data.children.every(
      (child: any) =>
        typeof child.id === 'number' &&
        typeof child.name === 'string' &&
        typeof child.birthday === 'string' &&
        typeof child.gender === 'string' &&
        typeof child.profileImage === 'string',
    )
  );
};
