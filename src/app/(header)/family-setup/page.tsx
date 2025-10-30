//회원 정보 설정 페이지 기본 UI
import Setup from './_components/Setup';
import ModalCard from '@/ui/Modal/ModalCard';

export default function SetUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ModalCard hasBorder={false}>
        <Setup />
      </ModalCard>
    </div>
  );
}
