'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/fetcher';
import ModalCard from '@/ui/Modal/ModalCard';
import LoginSessionCheck from './_components/LoginSessionCheck';
import AccountCheckingForm from './_components/AccountCheckingForm';

export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccepted = async () => {
      if (session?.accessToken) {
        try {
          const result = await Fetcher<{ accepted: boolean }>('/start/login');
          if (result?.data?.accepted) {
            //router.replace('/profile');
          }
        } catch {}
      }
    };

    checkAccepted();
  }, [session, router]);

  return (
    <div className="flex items-center justify-center  ">
      <ModalCard hasBorder={true}>
        <LoginSessionCheck />
      </ModalCard>
    </div>
  );
}
//<LoginSessionCheck />
//<AccountCheckingForm userName=''/>