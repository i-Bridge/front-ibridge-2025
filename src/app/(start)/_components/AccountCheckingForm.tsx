import { Text } from '@/ui/Text';
import RotatingSpinner from '@/ui/loading/RotatingSpinner';
import LogoutButton from '@/components/Headers/LogoutButton';
import ModalCard from '@/ui/Modal/ModalCard';

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
          <Text variant="title02" className=" text-grayscale-gray90 ">
            {displayUserName} 님, 반가워요!
          </Text>

          <Text variant="body05" className="text-grayscale-gray60 ">
            계정 확인 중입니다.
          </Text>
        </div>
        <LogoutButton className='h-auto'>로그아웃</LogoutButton>
      </div>
    </ModalCard>
  );
}
