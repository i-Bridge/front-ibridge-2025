import { Fetcher } from '@/lib/fetcher';
import PrivacyConsentForm from './_components/PrivacyConsentForm';
import { Text } from '@/ui/Text';
import ModalCard from '@/ui/Modal/ModalCard'; // ModalCard가 UI 컨테이너 역할을 하므로 유지


export const dynamic = 'force-dynamic';

// API 응답 데이터 (payload) 타입
interface ConsentContent {
  consentToCollection: string; // 개인정보 수집 및 이용 동의(필수) 약관
  consentToService: string; // 서비스 이용 약관 동의(필수) 약관
  consentToMarketing: string; // 마케팅 정보 수신 동의(선택) 약관
}

/**
 * 개인정보 동의 층 Page (Server Component)
 * 약관 내용을 서버에서 미리 가져와 클라이언트 컴포넌트에 전달합니다.
 */
export default async function PrivacyConsentPage() {
  let consentContent: ConsentContent | null = null;
  let hasError = false;

  try {
    // Fetcher가 API 응답 구조를 처리한다고 가정하고, data 필드만 추출
    const res = await Fetcher<ConsentContent>('/start/signup/consent', {
      method: 'GET',
    });

    // API 응답이 성공적이고, data 필드가 존재하며, isSuccess가 true인 경우
    if (res?.isSuccess && res.data) {
      consentContent = res.data;
    } else {
      hasError = true;
      console.error('개인정보 동의 약관 불러오기 실패:', res?.message);
    }
  } catch (error) {
    hasError = true;
    console.error('API call error during consent fetch:', error);
  }

  // 에러 발생 시 Fallback UI
  if (hasError || !consentContent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <ModalCard hasBorder={true} className="w-full max-w-md p-8 text-center">
          <Text variant="title01" className="text-red-600 mb-4">
            약관 정보를 불러올 수 없습니다.
          </Text>
          <Text variant="body03" className="text-gray-600">
            잠시 후 다시 시도해 주세요.
          </Text>
        </ModalCard>
      </div>
    );
  }

  // 성공 시 클라이언트 컴포넌트에 데이터 전달
  return <PrivacyConsentForm content={consentContent} />;
}
