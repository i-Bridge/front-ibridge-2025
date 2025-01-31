import Image from 'next/image';
import Link from "next/link";

export default function ParentHeader() {
  return (
    <header className="p-2.5 px-5 flex items-center justify-between border-b-2 border-gray-300">
      <div className="flex items-center">
        <Link href="/parent/home">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full mr-10"
        />
        </Link>
        <div className="flex items-center gap-5">
          <span className="text-lg text-gray-800 font-medium">서비스 소개</span>
          <span className="text-lg text-gray-800 font-medium">질문하기</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-lg text-gray-800 font-medium">
          자주 묻는 질문
        </span>
        <Link
      href="/parent/calendar"
      className="bg-none border-none p-0 cursor-pointer flex items-center hover:opacity-70"
    >
          <Image
            src="/images/calendar.png"
            alt="Calendar"
            width={40}
            height={40}
            className="rounded-lg"
          />
        </Link>
        <button className="bg-none border-none p-0 cursor-pointer flex items-center hover:opacity-70">
          <Image
            src="/images/profile.png"
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
