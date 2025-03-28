'use client';

import { useState, useEffect } from 'react';
import { fetchUserData } from '@/app/services/familyedit/fetchUserData'; // API 호출 함수
import { Child, UserData } from '@/app/services/familyedit/fetchUserData'; // 타입 임포트

export default function ChildrenForm() {
  const [children, setChildren] = useState<Child[]>([]);
  const [editMode, setEditMode] = useState<number[]>([]);

  // 컴포넌트가 마운트될 때 fetchUserData 호출하여 데이터를 받아옵니다.
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data: UserData | null = await fetchUserData(); // UserData 타입으로 지정
        if (data && data.children) {
          setChildren(data.children); // 받아온 자식 데이터 상태에 설정
        }
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };
    getUserData();
  }, []);

  const handleAddChild = () => {
    const newChild: Child = {
      id: children.length + 1,
      name: '',
      birthday: '',
      gender: 'Male',
      profileImage:
        'https://via.placeholder.com/150/00FF00/808080?text=New+Profile',
    };
    setChildren([...children, newChild]);
  };

  const handleChange = (id: number, field: keyof Child, value: string) => {
    setChildren((prevChildren) =>
      prevChildren.map((child) =>
        child.id === id ? { ...child, [field]: value } : child,
      ),
    );
  };

  const handleSave = (id: number) => {
    setEditMode(editMode.filter((item) => item !== id));
    alert(`Child ${id} information applied!`);
  };

  const handleEdit = (id: number) => {
    setEditMode([...editMode, id]);
  };

  const handleDelete = (id: number) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  return (
    <div className="relative pt-8">
      <p className="text-2xl font-semibold py-10">자식 정보 수정하기</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
        {children.map((child) => (
          <div
            key={child.id}
            className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
              <img
                src={child.profileImage}
                alt={`Profile of ${child.name}`}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <label
                  htmlFor={`name-${child.id}`}
                  className="block text-xs font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id={`name-${child.id}`}
                  type="text"
                  value={child.name}
                  onChange={(e) =>
                    handleChange(child.id, 'name', e.target.value)
                  }
                  disabled={!editMode.includes(child.id)}
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor={`birthday-${child.id}`}
                  className="block text-xs font-medium text-gray-700"
                >
                  Birthday
                </label>
                <input
                  id={`birthday-${child.id}`}
                  type="date"
                  value={child.birthday}
                  onChange={(e) =>
                    handleChange(child.id, 'birthday', e.target.value)
                  }
                  disabled={!editMode.includes(child.id)}
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor={`gender-${child.id}`}
                  className="block text-xs font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id={`gender-${child.id}`}
                  value={child.gender}
                  onChange={(e) =>
                    handleChange(child.id, 'gender', e.target.value)
                  }
                  disabled={!editMode.includes(child.id)}
                  className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-between mt-3">
                {!editMode.includes(child.id) ? (
                  <button
                    onClick={() => handleEdit(child.id)}
                    className="py-1 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(child.id)}
                    className="py-1 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 text-sm"
                  >
                    Apply
                  </button>
                )}

                <button
                  onClick={() => handleDelete(child.id)}
                  className="py-1 px-4 text-black font-semibold rounded-md text-sm"
                >
                  Delete
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
          + Add Child
        </button>
      </div>
    </div>
  );
}
