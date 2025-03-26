'use client';
import React, { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import Image from 'next/image';

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

export default function FamilyTree() {
  const [inviteModal, setInviteModal] = useState(false); // 초대 모달 상태

  // 부모-자식 트리 구조
  const renderTree = () => (
    <Tree
      lineWidth={'2px'}
      lineColor={'#034892'}
      lineBorderRadius={'10px'}
      label={
        <ChildCard name="우리 가족" image="https://via.placeholder.com/100" />
      } // 루트 가족 이름
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

  return (
    <div className="flex flex-col items-center py-10 w-full">
      {/* 부모와 자식 트리 */}
      {renderTree()}

      {/* 초대 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => setInviteModal(true)}
          className="py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-sm"
        >
          + 배우자 초대
        </button>
      </div>

      {/* 초대 모달 */}
      {inviteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
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
                onClick={() => {
                  alert('초대장이 발송되었습니다!');
                  setInviteModal(false); // 초대 후 모달 닫기
                }}
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
