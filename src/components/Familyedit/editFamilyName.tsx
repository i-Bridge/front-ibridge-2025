'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fetcher } from '@/lib/fetcher';

export default function FamilyName({ familyName }: { familyName: string }) {
  const [currentName, setCurrentName] = useState(familyName);
  const [editingFamilyName, setEditingFamilyName] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState(familyName);

  const handleFamilyNameSave = async () => {
    try {
      await Fetcher('/parent/mypage/edit/familyName', {
        method: 'PATCH',
        data: { familyName: newFamilyName },
      });
      setCurrentName(newFamilyName);
      setEditingFamilyName(false);
    } catch (error) {
      console.error('가족 이름 수정 실패:', error);
    }
  };

  return (
    <div className="flex flex-col items-center  w-full bg-red-100 mt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-semibold text-center py-10  flex items-center gap-2"
      >
        🏠
        {editingFamilyName ? (
          <>
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              autoFocus
              className="bg-transparent border-b-2 border-gray-400 focus:outline-none caret-black px-1"
              style={{
                fontSize: 'inherit',
                fontWeight: 'inherit',
                width: `${newFamilyName.length + 1}ch`,
              }}
            />
            <button onClick={handleFamilyNameSave} className="ml-2">
              {/* 저장 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </>
        ) : (
          <>
            <span>{currentName}</span>
            <button onClick={() => setEditingFamilyName(true)} className="ml-2">
              {/* 편집 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 
                  19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 
                  0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
