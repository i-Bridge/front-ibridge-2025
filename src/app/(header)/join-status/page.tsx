import { redirect } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import LoginStatusRenderer from '@/app/(header)/join-status/_components/LoginStatusRenderer';
import { Child , Parent} from '@/types/index';
import ModalCard from '@/ui/Modal/ModalCard';


interface LoginResponse {
  familyName: string;
  status: 1 | 2 | 3; // 1: 대기, 2: 수락, 3: 프로필
  children: Child[];
  parents: Parent[];
}

/**
 * 가족 합류 상태 층 (/join-status) - Async Server Component
 * 1. 서버에서 /start/login API를 호출합니다.
 * 2. status 3일 경우 next/navigation의 redirect()로 즉시 리디렉션합니다.
 * 3. status 1 또는 2일 경우 FamilyStatusRenderer (CC)에 데이터를 넘깁니다.
 */
export default async function JoinStatusPage() {
  let data: LoginResponse | null = null;


  try {
    const res = await Fetcher<LoginResponse>('/start/login');
    data = res?.data || null;
    console.log(data);

    if (!data) {
      throw new Error('/start/login에서 유효한 데이터를 받지 못했습니다.');
    }

    // [핵심] status 3은 서버에서 즉시 처리 (redirect는 throw를 발생시킵니다)
    if (data.status === 3) {
      console.log('🚀 [SC] status 3 확인: /profile로 즉시 리디렉션');
      // 서버에서 클라이언트 컴포넌트의 router.replace보다 빠르게 리디렉션합니다.
      redirect('/profile'); 
    }
    
  } catch (e) {
    console.error('❌ [SC] 가족 상태 확인 실패:', e);
    
  }

  // UI 컨테이너 (정적 HTML)
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <ModalCard hasBorder={true}>
        <LoginStatusRenderer data={data as LoginResponse} />
      </ModalCard>
    </div>
  );
}