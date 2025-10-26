'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/fetcher';
import LoginButton from '@/components/Auth/LoginButton';
import ModalCard from '@/components/ModalCard';


export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccepted = async () => {
      if (session?.accessToken) {
        try {
          const result = await Fetcher<{ accepted: boolean }>('/start/login');
          if (result?.data?.accepted) {
            router.replace('/profile');
          }
        } catch {}
      }
    };

    checkAccepted();
  }, [session, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/images/LoginPageBG.png')] bg-cover bg-no-repeat bg-center">
      
      <ModalCard>
        <LoginButton />
        
      </ModalCard>
      
    </div>
  );
}