'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher';
import Image from 'next/image';

interface ParentInfo {
  parentId: number;
  parentName: string;
}

interface ChildInfo {
  childId?: number;
  childName: string;
  childBirth: string;
  childGender: 0 | 1;
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
  const [editedChildren, setEditedChildren] = useState<
    Record<number, Partial<ChildInfo>>
  >({});
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

  const handleFieldChange = (
    id: number,
    field: keyof ChildInfo,
    value: string | number,
  ) => {
    setEditedChildren((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
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
    setEditMode((prev) => [...prev, -1]);
  };

  const handleEdit = (id: number | undefined) => {
    if (id !== undefined) {
      setEditMode((prev) => [...prev, id]);
    }
  };

  const handleSave = async (child: ChildInfo) => {
    try {
      const updated = {
        ...child,
        ...editedChildren[child.childId ?? -1],
      };

      if (child.isNew) {
        const res = await Fetcher<{ childId: number }>(
          '/parent/mypage/edit/add',
          {
            method: 'POST',
            data: {
              name: updated.childName,
              birthday: updated.childBirth,
              gender: updated.childGender,
            },
          },
        );
        if (res?.data?.childId) {
          const newId = res.data.childId;
          if (!familyInfo) return;

          const updatedChildren = familyInfo.children.map((c) =>
            c === child ? { ...updated, childId: newId, isNew: false } : c,
          );

          setFamilyInfo((prev) =>
            prev ? { ...prev, children: updatedChildren } : prev,
          );

          setEditMode((prev) => prev.filter((id) => id !== -1));
          window.location.reload();
        }
      } else {
        await Fetcher(`/parent/mypage/edit/${child.childId}`, {
          method: 'PATCH',
          data: {
            childId: child.childId,
            name: updated.childName,
            birthday: updated.childBirth,
            gender: updated.childGender,
          },
        });
        setFamilyInfo((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            children: prev.children.map((c) =>
              c.childId === child.childId ? updated : c,
            ),
          };
        });
        setEditMode((prev) => prev.filter((id) => id !== child.childId));
      }

      setEditedChildren((prev) => {
        const rest = { ...prev };
        delete rest[child.childId ?? -1];
        return rest;
      });
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
      setFamilyInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          children: prev.children.filter((c) => c !== child),
        };
      });
      window.location.reload();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!familyInfo) return <p>가족 정보가 없습니다.</p>;

  return (
    <div className="relative  flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        {familyInfo.children.map((child, index) => {
          const id = child.childId ?? -1;
          const isEditing = child.isNew || editMode.includes(id);
          const childData = isEditing
            ? { ...child, ...editedChildren[id] }
            : child;

          return (
            <div
              key={child.childId ?? `new-${index}`}
              className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 relative">
                <Image
                  src={
                    childData.childGender === 0
                      ? '/images/boy.svg'
                      : '/images/girl.svg'
                  }
                  alt={`Profile of ${childData.childName}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    이름
                  </label>
                  <input
                    type="text"
                    value={childData.childName}
                    onChange={(e) =>
                      handleFieldChange(id, 'childName', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    생일
                  </label>
                  <input
                    type="date"
                    value={formatDate(childData.childBirth)}
                    onChange={(e) =>
                      handleFieldChange(id, 'childBirth', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    성별
                  </label>
                  <select
                    value={childData.childGender}
                    onChange={(e) =>
                      handleFieldChange(
                        id,
                        'childGender',
                        Number(e.target.value),
                      )
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                  >
                    <option value={0}>남자</option>
                    <option value={1}>여자</option>
                  </select>
                </div>
                <div className="flex justify-between mt-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(child)}
                        className="py-1 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-400 text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => handleDelete(child)}
                        className="p-2 text-gray-600 hover:text-orange-500 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(child.childId)}
                      className="ml-auto p-2 text-gray-600 hover:text-orange-500 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className=" py-10">
        <button
          onClick={handleAddChild}
          className="py-2 px-3 bg-orange-400 text-white font-semibold rounded-md hover:bg-orange-300 text-sm"
        >
          + 자녀 추가
        </button>
      </div>
    </div>
  );
}
