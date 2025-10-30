import { signIn } from 'next-auth/react';
import { OwlIcon } from '@/ui/icon/OwlIcon';
import { Logo } from '@/ui/icon/Logo';
import { Text } from '@/ui/Text';
import { NaverIcon, GoogleIcon } from '@/constants/icon';

export default function PreLoginForm() {
  return (
    <>
      <div className=" inline-flex flex-col justify-start items-start gap-5">
        <OwlIcon />
        <div className="inline-flex flex-col justify-start items-start gap-2">
          <Logo />
          <Text variant="body04" className="text-grayscale-gray60">
            감정은 행동이 아닌,
            <br />
            말로 표현될 수 있어야 합니다.
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full ">
        {/* Naver Login Button Logic... */}
        <button
          onClick={() => signIn('naver')}
          className="self-stretch h-14 px-4 bg-[#03C75A] text-white rounded-lg inline-flex justify-center items-center gap-2 shadow-md hover:bg-green-700 transition-colors"
        >
          <NaverIcon />
          <Text as="span" variant="body03" className="text-white">
            네이버 로그인
          </Text>
        </button>

        {/* Google Login Button Logic... */}
        <button
          onClick={() => signIn('google')}
          className="self-stretch h-14 px-4 bg-white border border-grayscale-gray20 rounded-lg inline-flex justify-center items-center gap-2 shadow-sm hover:bg-grayscale-gray40 transition-colors"
        >
          <GoogleIcon />
          <Text as="span" variant="body03">
            구글 로그인
          </Text>
        </button>
      </div>
    </>
  );
}
