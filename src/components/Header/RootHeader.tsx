import Image from 'next/image';

export default function RootHeader() {
  return (
    <header className="p-2.5 px-8 flex items-center border-b-2 border-gray-300">
      <div className="flex items-center">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="mr-10"
        />
        <div className="flex items-center gap-5">
          <span className="text-lg text-gray-800 font-medium">부모용 소개</span>
          <span className="text-lg text-gray-800 font-medium">아이용 소개</span>
          <span className="text-lg text-gray-800 font-medium">
            자주 묻는 질문
          </span>
        </div>
      </div>
    </header>
  );
}
