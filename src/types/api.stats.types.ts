// 답변 기록
// /parent/{childId}/home subjects
// 예정 질문
// /parent/{childId}/scheduled
// /parent/{childId}/questions/edit
// /parent/{childId}/questions/reroll
// 달력
// /parent/{childId}/stat/emotion
// /parent/{childId}/subjects 
// 상세질문 리스트
// /parent/{childId}/{subjectId} 




/**
 * [/parent/{childId}/stat/emotion] API의 응답(Response) 데이터 타입입니다.
 * (특정 자녀의 감정 캘린더 정보를 반환합니다.)
 *
 * @example
 * // [성공 시 예시]
 * {
 * 	"signupDate" : "2025-10-12",
	"emotion" : 1, //이번 달 기준 가장 많이 선택한 감정
	"emotions" :[
			1,
			2,
			...
		]
 * }
 *
 * @see [관련 API 문서 링크 (선택 사항)]
 */
export interface StatEmotionResponse {
  signupDate: string; // 회원 가입 날짜 (YYYY-MM-DD 형식)
  emotion: number; // 이번 달 기준 가장 많이 선택한 감정
  emotions: number[]; // 이번 달 기준 선택한 감정 목록
}
