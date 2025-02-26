'use client';

import { useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="mt-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
        <p>이름: {session.user?.name}</p>
        <p>이메일: {session.user?.email}</p>
      </div>
    );
  }
  return <p className="mt-4">로그인하지 않았습니다.</p>;
}
