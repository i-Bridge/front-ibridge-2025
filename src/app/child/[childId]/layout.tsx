'use client';
import { useEffect } from 'react';
import { useHeaderContext } from '@/context/HeaderContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setHideHeader } = useHeaderContext();

  useEffect(() => {
    setHideHeader(true); // 하위 레이아웃에서는 헤더 숨기기

    return () => {
      setHideHeader(false); // 하위 레이아웃에서 벗어날 때 다시 헤더 보이기
    };
  }, [setHideHeader]);

  return <div>{children}</div>;
}
