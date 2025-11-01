import { Child } from "./child.types";
import { Parent } from "./parent.types";

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
export interface SigninData {
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
export interface LoginData {
  familyName: string;
  /**
   * (JSDoc 태그로도 타입 정보를 명시)
   * @type {'PENDING' | 'FIRST_LOGIN' | 'ACTIVE'}
   */
  status: LoginStatus; 
  parents: Parent[];
  children: Child[];
}