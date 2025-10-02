// NotFound.tsx
interface NotFoundProps {
  message: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100 p-6">
      <div className="bg-gray-100 p-6 rounded-3xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-black mb-2">🔍 데이터 없음</h1>
        <p className="text-sm text-black mb-2">{message}</p>
        <p className="text-xs text-black">
          URL이 올바른지 확인하거나 관리자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}