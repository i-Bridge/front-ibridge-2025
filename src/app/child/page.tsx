import WalkingMan from '@/components/Child/WalkingMan/WalkingMan';
import Link from 'next/link';

export default function Child() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mt-8">
        걸어가는 사람 애니메이션
      </h1>
      
        <div className=" w-40 bg-red-300 text-black   mt-10 cursor-pointer">
        <Link href="/child/home">
          child 홈 화면으로 이동
          </Link>
        </div>
      
      <WalkingMan />
      
    </div>
    
  );
}
