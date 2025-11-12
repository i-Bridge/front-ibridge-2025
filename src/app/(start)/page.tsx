'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/api/fetcher';
import LoginSessionCheck from './_components/LoginSessionCheck';
import { LoginResponse } from '@/types';

export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccepted = async () => {
      if (session?.accessToken) {
        try {
          const result = await Fetcher<LoginResponse>('/start/login');
          if (result?.data?.status === 'ACTIVE') {
            router.replace('/profile');
            console.log('login', result);
          }
        } catch {}
      }
    };

    checkAccepted();
  }, [session, router]);

  return <LoginSessionCheck />;
}
