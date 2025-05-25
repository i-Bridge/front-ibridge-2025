'use client';
import { useState } from 'react';

export default function CopyLinkPopover({ link }: { link: string }) {
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="relative">
      {/* + 버튼 */}
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="text-xl w-8 h-8 rounded-xl bg-orange-400 hover:bg-orange-200 flex items-center justify-center text-white"
      >
        +
      </button>

      {/* Popover */}
      {showPopover && (
        <div className="absolute mt-2 left-0 bg-white border rounded-lg shadow-md p-4 w-90 flex flex-col">
          {/* 초대 메시지 */}
          <p className="text-sm text-gray-700 font-semibold mb-2">
            초대하고 싶은 분에게 링크를 보내주세요
          </p>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm whitespace-nowrap overflow-x-auto bg-gray-100 p-2 rounded-xl font-light">
              {link}
            </p>
            <button
              onClick={handleCopy}
              className="ml-2 p-2 hover:bg-gray-200 rounded-full flex items-center"
              aria-label="복사"
            >
              {copied ? (
                // ✅ 복사 후 체크 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ) : (
                // ✅ 기본 복사 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
