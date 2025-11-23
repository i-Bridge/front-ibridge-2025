// components/parent-profile-row.tsx
"use client";

import { useState } from "react";
import { EditIcon } from "@/ui/icon/icon"; // @/ui/icon/icon 가정
import { Text } from "@/ui/Text";
import NameChangeModal from "./ParentNameEdit"; // 2. (새로 만들) 모달 컴포넌트

// 컴포넌트가 받을 props 타입 정의
interface ParentProfileRowProps {
  initialName: string;
  email?: string;
  isMe: boolean;
}

export default function ParentProfileRow({
  initialName,
  email,
  isMe,
}: ParentProfileRowProps) {
  // 1. 모달의 노출 여부만 관리하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // isMe가 false이면 아무것도 렌더링하지 않거나,
  // 혹은 수정 버튼만 없는 상태로 렌더링할 수 있습니다.
  // 여기서는 '수정 버튼'만 isMe에 따라 제어합니다.

  return (
    <>
     
        {/* 1. 이름, 수정 버튼, 이메일이 있는 첫 번째 줄 */}
        <div className="w-full self-stretch flex flex-col justify-start items-start md:flex-row md:justify-between md:items-center gap-2">
          {/* 1.1 이름 표시 영역 */}
          <div className="flex-1 flex justify-start items-center gap-2">
            <Text variant={'title04'}>
              {initialName}
              {/* isMe가 true일 때만 '(나)' 표시 */}
              {isMe && <Text  variant={'title04'}> (나)</Text>}
            </Text>

            {/* isMe가 true일 때만 수정 버튼 표시 */}
            {isMe && (
              <button
                onClick={() => setIsModalOpen(true)} // 2. 클릭 시 모달 열기
                aria-label="이름 수정"
                className="w-10 h-10 p-1 bg-gray-50 rounded-full flex justify-center items-center overflow-hidden hover:bg-gray-100"
              >
                <EditIcon  />
              </button>
            )}
          </div>

          {/* 1.2 이메일 (항상 표시) */}
          <Text as='div' variant={'body03'} className="text-grayscale-gray60">
            {email}
          </Text>
        </div>

      {/* * 3. 모달 렌더링
       * isModalOpen이 true일 때만 NameChangeModal을 렌더링합니다.
       */}
      {/* 모달 렌더링 시 email prop 전달 */}
      {isModalOpen && (
        <NameChangeModal
          currentName={initialName}
          email={email} // 👈 이메일 prop을 전달합니다.
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}