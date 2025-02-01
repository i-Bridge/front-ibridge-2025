import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시작페이지',
};

import Link from "next/link";

export default function HomePage() {
  return (
    <div>
    <h3 className="mb-4">(시작 페이지)</h3>
    <div className="absolute right-0 w-1/2 inset-y-0 flex flex-col items-center justify-center ">
    
    <div className="flex flex-col items-center gap-4">
      <Link
        href="/parent/home"
        className="w-40 h-12 flex justify-center items-center bg-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-600 transition"
      >
        (임시) 부모용 홈 페이지
      </Link>
      <Link
        href="/setup"
        className="w-40 h-12 flex justify-center items-center bg-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-600 transition"
      >
        회원가입 시 ) Set up 페이지
      </Link>
    </div>
  </div>
    </div>
  );
}