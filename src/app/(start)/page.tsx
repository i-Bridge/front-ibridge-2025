import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import StartPageClient from '@/components/Start/StartPageClient';

export default async function StartPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/profile');
  }

  return <StartPageClient />;
}
