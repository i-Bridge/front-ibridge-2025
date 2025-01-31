import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시작페이지',
};

import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h3>(시작 페이지)</h3>
      <Link
        href="/parent/home"
        className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
      >
        부모용 홈 페이지
      </Link>
    </div>
  );
}