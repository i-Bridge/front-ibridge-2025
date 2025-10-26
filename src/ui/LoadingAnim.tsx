"use client";

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" />
    </div>
  );
}
