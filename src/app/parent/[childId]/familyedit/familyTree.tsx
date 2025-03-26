'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tree, TreeNode } from 'react-organizational-chart';
import Image from 'next/image';

// ChildCard 컴포넌트 (자식 카드)
const ChildCard = ({ name, image }: { name: string; image: string }) => (
  <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-md border">
    <Image
      src={image}
      alt={name}
      width={50}
      height={50}
      className="rounded-full"
    />
    <p className="text-sm font-semibold mt-2">{name}</p>
  </div>
);

// ParentCard 컴포넌트 (부모 카드)
const ParentCard = ({
  parent1Name,
  parent1Image,
  parent2Name,
  parent2Image,
  onInvite,
}: {
  parent1Name: string;
  parent1Image: string;
  parent2Name: string | null;
  parent2Image: string | null;
  onInvite: () => void;
}) => {
  return (
    <div className="flex justify-between items-center w-80 bg-white p-4 rounded-lg shadow-md border">
      <div className="flex flex-col items-center">
        <Image
          src={parent1Image}
          alt={parent1Name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <p className="text-sm font-semibold">{parent1Name}</p>
      </div>

      <div className="flex flex-col items-center">
        {parent2Name ? (
          <>
            <Image
              src={parent2Image}
              alt={parent2Name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <p className="text-sm font-semibold">{parent2Name}</p>
          </>
        ) : (
          // 부모2가 없으면 배우자 초대 버튼을 표시
          <button
            onClick={onInvite}
            className="py-2 px-4 bg-purple-300 text-white font-semibold rounded-md hover:bg-purple-400 text-sm"
          >
            + 배우자 초대
          </button>
        )}
      </div>
    </div>
  );
};

export default function FamilyTree() {
  const [inviteModal, setInviteModal] = useState(false); // 초대 모달 상태
  const [parent2, setParent2] = useState<string | null>(null); // 부모 2 상태

  // 모달 열릴 때 페이지 스크롤 비활성화
  useEffect(() => {
    if (inviteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Clean up when component unmounts or inviteModal state changes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [inviteModal]);

  // 부모-자식 트리 구조
  const renderTree = () => (
    <Tree
      lineWidth={'2px'}
      lineColor={'#034892'}
      lineBorderRadius={'10px'}
      label={
        <ParentCard
          parent1Name="부모 1"
          parent1Image="https://via.placeholder.com/100"
          parent2Name={parent2} // 부모2 이름을 prop으로 전달
          parent2Image={parent2 ? 'https://via.placeholder.com/100' : null} // 부모2 이미지가 있을 경우에만 전달
          onInvite={handleInvite} // 초대 버튼 클릭 시 초대 모달을 열도록 설정
        />
      }
    >
      <TreeNode
        label={
          <ChildCard name="첫째" image="https://via.placeholder.com/100" />
        }
      />
      <TreeNode
        label={
          <ChildCard name="둘째" image="https://via.placeholder.com/100" />
        }
      />
    </Tree>
  );

  // 초대 모달을 여는 함수
  const handleInvite = () => {
    setInviteModal(true);
  };

  // 부모2를 초대한 후 상태를 업데이트
  const handleInviteSubmit = () => {
    setParent2('배우자');
    alert('초대장이 발송되었습니다!');
    setInviteModal(false);
  };

  return (
    <div className="flex flex-col items-center py-10 w-full bg-i-lightpurple">
      {/* 부모와 자식 트리 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-semibold text-center py-10 mb-12"
      >
        행복한 우리 가족(가족 이름 받아오기)
      </motion.p>
      {renderTree()}

      {/* 초대 모달 */}
      {inviteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setInviteModal(false)} // 외부 클릭 시 모달 닫기
        >
          <div
            className="bg-white p-8 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
          >
            <h3 className="text-lg font-semibold mb-4">배우자 초대</h3>
            <p className="mb-4">배우자를 초대하려면 이메일을 입력해주세요:</p>
            <input
              type="email"
              placeholder="이메일 주소"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setInviteModal(false)}
                className="py-1 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleInviteSubmit}
                className="py-1 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                초대 보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
