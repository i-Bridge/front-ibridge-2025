'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';

interface ParentInfo {
  parentId: number;
  parentName: string;
}

interface ChildInfo {
  childId?: number;
  childName: string;
  childBirth: string;
  childGender: number; // 0: 남자, 1: 여자
  isNew?: boolean;
}

interface FamilyData {
  familyName: string;
  parents: ParentInfo[];
  children: ChildInfo[];
}

export default function ChildrenForm() {
  const [familyInfo, setFamilyInfo] = useState<FamilyData | null>(null);
  const [editMode, setEditMode] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      try {
        const res = await Fetcher<FamilyData>('/parent/mypage/edit');
        if (res?.data) {
          setFamilyInfo(res.data);
        } else {
          setError('가족 정보를 불러오지 못했습니다.');
        }
      } catch (err) {
        console.error('가족 정보 요청 실패:', err);
        setError('가족 정보 요청 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyInfo();
  }, []);

  const handleChange = (
    id: number | undefined,
    field: keyof ChildInfo,
    value: string | number,
  ) => {
    if (!familyInfo) return;
    const updatedChildren = familyInfo.children.map((child) =>
      child.childId === id ? { ...child, [field]: value } : child,
    );
    setFamilyInfo({ ...familyInfo, children: updatedChildren });
  };

  const handleAddChild = () => {
    if (!familyInfo) return;
    const newChild: ChildInfo = {
      childName: '',
      childBirth: '',
      childGender: 0,
      isNew: true,
    };
    setFamilyInfo({
      ...familyInfo,
      children: [...familyInfo.children, newChild],
    });
  };

  const handleEdit = (id: number | undefined) => {
    if (id !== undefined) {
      setEditMode((prev) => [...prev, id]);
    }
  };

  const handleSave = async (child: ChildInfo) => {
    try {
      if (child.isNew) {
        const res = await Fetcher<{ childId: number }>(
          '/parent/mypage/edit/add',
          {
            method: 'POST',
            data: {
              name: child.childName,
              birthday: child.childBirth,
              gender: child.childGender,
            },
          },
        );
        if (res?.data?.childId) {
          child.childId = res.data.childId;
          child.isNew = false;
        }
      } else {
        await Fetcher(`/parent/mypage/edit/${child.childId}`, {
          method: 'PATCH',
          data: {
            childId: child.childId,
            name: child.childName,
            birthday: child.childBirth,
            gender: child.childGender,
          },
        });
        setEditMode((prev) => prev.filter((id) => id !== child.childId));
      }
    } catch (error) {
      console.error('자녀 정보 저장 실패:', error);
    }
  };

  const handleDelete = async (child: ChildInfo) => {
    try {
      if (child.childId) {
        await Fetcher('/parent/mypage/edit/delete', {
          method: 'DELETE',
          data: { childId: child.childId },
        });
      }
      setFamilyInfo({
        ...familyInfo!,
        children: familyInfo!.children.filter((c) => c !== child),
      });
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!familyInfo) return <p>가족 정보가 없습니다.</p>;

  return (
    <div className="relative pt-8">
      <p className="text-2xl font-semibold py-10">자녀 정보 수정하기</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
        {familyInfo.children.map((child, index) => (
          <div
            key={child.childId ?? `new-${index}`}
            className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img
                src="/images/default_profile.png"
                alt={`Profile of ${child.childName}`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  이름
                </label>
                <input
                  type="text"
                  value={child.childName}
                  onChange={(e) =>
                    handleChange(child.childId, 'childName', e.target.value)
                  }
                  disabled={
                    !child.isNew && !editMode.includes(child.childId ?? -1)
                  }
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  생일
                </label>
                <input
                  type="date"
                  value={child.childBirth}
                  onChange={(e) =>
                    handleChange(child.childId, 'childBirth', e.target.value)
                  }
                  disabled={
                    !child.isNew && !editMode.includes(child.childId ?? -1)
                  }
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  성별
                </label>
                <select
                  value={child.childGender}
                  onChange={(e) =>
                    handleChange(
                      child.childId,
                      'childGender',
                      Number(e.target.value),
                    )
                  }
                  disabled={
                    !child.isNew && !editMode.includes(child.childId ?? -1)
                  }
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value={0}>남자</option>
                  <option value={1}>여자</option>
                </select>
              </div>
              <div className="flex justify-between mt-3">
                {!child.isNew && !editMode.includes(child.childId ?? -1) ? (
                  <button
                    onClick={() => handleEdit(child.childId)}
                    className="py-1 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 text-sm"
                  >
                    수정
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(child)}
                    className="py-1 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 text-sm"
                  >
                    저장
                  </button>
                )}
                <button
                  onClick={() => handleDelete(child)}
                  className="py-1 px-4 text-black font-semibold rounded-md text-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleAddChild}
          className="py-2 px-6 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 text-sm"
        >
          + 자녀 추가
        </button>
      </div>
    </div>
  );
}
