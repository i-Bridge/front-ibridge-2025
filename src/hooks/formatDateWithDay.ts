/**
 * YYYY-MM-DD 형식을 YYYY.MM.DD (요일) 형식으로 변환합니다.
 * @param dateString '2022-02-20' 형식의 날짜 문자열
 * @returns '2022.02.20 (월)' 형식의 문자열
 */
export const formatDateWithDay = (dateString: string): string => {
  try {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    // YYYY-MM-DD 형식이 Safari 등 일부 브라우저에서 UTC 자정으로
    // 해석되어 KST 기준 하루 전날로 표시되는 문제를 피하기 위해
    // 수동으로 년, 월, 일을 분리하여 로컬 시간 기준으로 Date 객체를 생성합니다.
    const parts = dateString.split('-').map(Number);
    if (parts.length !== 3) {
      console.warn('Invalid date format passed to formatDateWithDay:', dateString);
      return dateString; // 형식이 다르면 원본 반환
    }

    const [year, month, day] = parts;
    // Date 객체의 월은 0부터 시작하므로 month - 1
    const date = new Date(year, month - 1, day);

    // 년, 월, 일, 요일 추출
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 1월: 0 -> 1, '01'
    const dd = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = days[date.getDay()]; // 0: 일, 1: 월, ...

    return `${yyyy}.${mm}.${dd} (${dayOfWeek})`;
  } catch (error) {
    console.error("날짜 변환 중 오류:", error);
    return dateString; // 오류 발생 시 원본 날짜 반환
  }
};