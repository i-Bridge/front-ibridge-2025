import { Child, Parent } from './people.types';

//start api types
// /start/signin - POST
// /start/login - POST
// /start/signup/exist - POST
// /start/signup/consent - GET
// /start/signup/isConsent - POST
// /start/signup/dup - POST
// /start/signup/undo - POST
// /start/signup/new - POST
// /start/signup/status - GET

/**
 * /start/signin API의 응답 데이터 타입입니다.
 * (최초 로그인 여부, 약관 동의 필요 여부, 가족 초대 여부 등을 반환)
 *
 * @example
 * {
 * first: true,
 * requiredPIIConsent: true,
 * send: false,
 * hasFamily: false
 * }
 *
 */
export interface SigninResponse {
  first: boolean;
  requiredPIIConsent: boolean;
  send: boolean;
  hasFamily: boolean;
}

/**
 * [신규] 로그인 및 가족 합류 상태를 나타내는 문자열 리터럴 타입
 * - `PENDING`: 가족의 초대 수락을 대기 중인 상태
 * - `FIRST_LOGIN`: 가족 합류는 완료했으나, 프로필/아이 정보 등 초기 설정이 필요한 상태
 * - `ACTIVE`: 모든 설정이 완료되어 정상적으로 서비스를 이용 중인 상태
 */
export type LoginStatus = 'PENDING' | 'FIRST_LOGIN' | 'ACTIVE';

/**
 * /start/login API의 응답 데이터 타입입니다.
 * (가족 합류 상태, 가족/아이 정보 등을 반환)
 *
 * @example
 * // type LoginStatus = 'PENDING' | 'FIRST_LOGIN' | 'ACTIVE';
 * {
 * familyName: "행복한 우리집",
 * status: "PENDING",
 * parents: [
 * { parentId: "p1", name: "김철수" }
 * ],
 * children: []
 * }
 */
export interface LoginResponse {
  familyName: string;
  /**
   * (JSDoc 태그로도 타입 정보를 명시)
   * @type {'PENDING' | 'FIRST_LOGIN' | 'ACTIVE'}
   */
  status: LoginStatus;
  parents: Parent[];
  children: Child[];
}

/**
 * [/start/signup/exist,/start/signup/dup] API의 응답(Response) 데이터 타입입니다.
 * ( 회원가입 시 가족 승인 요청 보냄 )
 *
 * @example
 * // [성공 시 예시]
 * {
 *   exist: false
 * }
 *
 * @see [관련 API 문서 링크 (선택 사항)]
 */
export interface SignupExistDupResponse {
  exist: boolean; // 가족 요청 성공 여부
}

