import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div>
      <h1>404에러..죄송해요..다시 접속해주시겠어요?</h1>;
    </div>
  );
}
