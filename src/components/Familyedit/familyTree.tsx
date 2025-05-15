'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tree, TreeNode } from 'react-organizational-chart';
import Image from 'next/image';
import { Fetcher } from '@/lib/fetcher';

interface ParentInfo {
  parentId: number;
  parentName: string;
  parentGender: 0 | 1; // 0: 남성, 1: 여성
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

const ParentsCard = ({
  parents,
  onInvite,
}: {
  parents: ParentInfo[];
  onInvite: () => void;
}) => {
  return (

    <div className="flex justify-center gap-6 flex-wrap items-center w-auto bg-white p-4 rounded-lg shadow-md border">
      {parents.map((parent) => (
        <div key={parent.parentId} className="flex flex-col items-center">
          <Image
            src={
              parent.parentGender === 0 ? '/images/boy.svg' : '/images/girl.svg'
            }
            alt={parent.parentName}
            width={50}
            height={50}
            className="rounded-full"
          />
          <p className="text-sm font-semibold">{parent.parentName}</p>
        </div>
      ))}
      {parents.length < 2 && (
        <button
          onClick={onInvite}
          className="py-2 px-4 bg-purple-300 text-white font-semibold rounded-md hover:bg-purple-400 text-sm"
        >
          + 배우자 초대
        </button>
      )}

    </div>
  );
};

export default function FamilyTree() {
  const [inviteModal, setInviteModal] = useState(false);
  const [familyInfo, setFamilyInfo] = useState<FamilyData | null>(null);
  const [email, setEmail] = useState('');
  const [editingFamilyName, setEditingFamilyName] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        const res = await Fetcher<FamilyData>('/parent/mypage/edit');
        if (res?.data) {
          setFamilyInfo(res.data);
          setNewFamilyName(res.data.familyName);
        }
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

  const handleFamilyNameSave = async () => {
    try {
      await Fetcher('/parent/mypage/edit/familyName', {
        method: 'PATCH',
        data: { familyName: newFamilyName },
      });
      setFamilyInfo((prev) =>
        prev ? { ...prev, familyName: newFamilyName } : prev,
      );
      setEditingFamilyName(false);
    } catch (error) {
      console.error('가족 이름 수정 실패:', error);
    }
  };

  const renderTree = () => {
    if (!familyInfo) return null;
    return (
      <Tree
        lineWidth={'2px'}
        lineColor={'#034892'}
        lineBorderRadius={'10px'}
        label={
          <ParentsCard parents={familyInfo.parents} onInvite={handleInvite} />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-semibold text-center py-10 mb-12 flex items-center gap-2"
      >
        {editingFamilyName ? (
          <>
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              className="border border-gray-400 rounded-md p-1 text-lg"
            />
            <button
              onClick={handleFamilyNameSave}
              className="text-sm text-blue-600 hover:underline"
            >
              저장
            </button>
          </>
        ) : (
          <>
            🏠행복한 {familyInfo?.familyName}
            <button onClick={() => setEditingFamilyName(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </>
        )}
      </motion.div>

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
