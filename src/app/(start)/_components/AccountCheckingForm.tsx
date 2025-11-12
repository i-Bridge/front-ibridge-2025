import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import LogoutButton from '@/components/Headers/LogoutButton';
import ModalCard from '@/ui/Modal/ModalCard';
import TitleComponent from '@/ui/Modal/TitleComponent';

interface AccountCheckingProps {
  userName: string;
}

export default function AccountCheckingForm({
  userName,
}: AccountCheckingProps) {
  const displayUserName = userName || '사용자';

  return (
    <ModalCard hasBorder={true} className="items-center">
      <div className="flex flex-col items-center justify-center self-stretch gap-7">
        <RotatingSpinner />

        <div className="flex flex-col items-center justify-start gap-2">
          <TitleComponent
            title={`${displayUserName} 님, 반가워요!`}
            subtitle={`계정 확인 중입니다.`}
            align="center"
            subtitlePosition="bottom"
          />
        </div>
        <LogoutButton className="w-full h-auto">로그아웃</LogoutButton>
      </div>
    </ModalCard>
  );
}
