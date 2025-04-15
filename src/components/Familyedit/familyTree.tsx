'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tree, TreeNode } from 'react-organizational-chart';
import Image from 'next/image';
import { Fetcher } from '@/lib/fetcher';

interface ParentInfo {
  parentId: number;
  parentName: string;
}

interface ChildInfo {
  childId: number;
  childName: string;
  childGender: 0 | 1;
}

interface FamilyData {
  familyName: string;
  parents: ParentInfo[];
  children: ChildInfo[];
}

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
  const [inviteModal, setInviteModal] = useState(false);
  const [familyInfo, setFamilyInfo] = useState<FamilyData | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        const res = await Fetcher<FamilyData>('/parent/mypage/edit');
        if (res?.data) setFamilyInfo(res.data);
      } catch (err) {
        console.error('가족 정보 가져오기 실패:', err);
      }
    };
    fetchFamilyInfo();
  }, []);

  useEffect(() => {
    document.body.style.overflow = inviteModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [inviteModal]);

  const handleInvite = () => {
    setInviteModal(true);
  };

  const handleInviteSubmit = () => {
    alert(`"${email}"로 초대장이 발송되었습니다!`);
    setInviteModal(false);
  };

  const renderTree = () => {
    if (!familyInfo) return null;
    const [parent1, parent2] = familyInfo.parents;
    return (
      <Tree
        lineWidth={'2px'}
        lineColor={'#034892'}
        lineBorderRadius={'10px'}
        label={
          <ParentCard
            parent1Name={parent1?.parentName ?? '부모1'}
            parent1Image={'/images/boy.svg'}
            parent2Name={parent2?.parentName ?? null}
            parent2Image={parent2 ? '/images/girl.svg' : null}
            onInvite={handleInvite}
          />
        }
      >
        {familyInfo.children.map((child) => (
          <TreeNode
            key={child.childId}
            label={
              <ChildCard
                name={child.childName}
                image={
                  child.childGender === 0
                    ? '/images/boy.svg'
                    : '/images/girl.svg'
                }
              />
            }
          />
        ))}
      </Tree>
    );
  };

  return (
    <div className="flex flex-col items-center py-10 w-full bg-i-lightpurple">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-semibold text-center py-10 mb-12"
      >
        🏠행복한 {familyInfo?.familyName}
      </motion.p>
      {renderTree()}

      {inviteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setInviteModal(false)}
        >
          <div
            className="bg-white p-8 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">배우자 초대</h3>
            <p className="mb-4">배우자를 초대하려면 이메일을 입력해주세요:</p>
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
