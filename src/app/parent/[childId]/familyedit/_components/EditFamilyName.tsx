'use client';

import React, { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { Text } from '@/ui/Text';
import { EditIcon } from '@/ui/icon/icon';

export default function EditFamilyName({ familyName }: { familyName: string }) {
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
    <div className="flex flex-col items-start ">
      
        {editingFamilyName ? (
          <>
           
            <button onClick={handleFamilyNameSave} className="ml-2">
              
            </button>
          </>
        ) : (
          
          <div className='flex gap-3'>
            <button onClick={() => setEditingFamilyName(true)} className="ml-2">
              
              <EditIcon/>
            </button>
          </div>
        )}
      
    </div>
  );
}
