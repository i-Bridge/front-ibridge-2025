import WalkingMan from '@/components/Child/WalkingMan/WalkingMan';

export default function Child() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8">
        걸어가는 사람 애니메이션
      </h1>
      <WalkingMan />
    </div>
  );
}
