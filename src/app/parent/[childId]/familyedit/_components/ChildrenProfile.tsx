// src/components/ChildrenProfile.tsx

'use client';
import { useState, useEffect } from 'react'; // ✅ useEffect 추가
import { Text } from '@/ui/Text';
import AddChildrenModal from '@/components/AddChildrenModal';
import { ChildCard } from '@/components/ChildCard';
import { Child } from '@/types';
import CustomCard from '@/ui/CustomCard';

interface ChildrenProfileProps {
  childrenInfo: Child[];
}

export default function ChildrenProfile({ childrenInfo }: ChildrenProfileProps) {
  // ✅ 1. Zustand 스토어에서 '상태'와 '액션'을 모두 가져옵니다.
  // (useSetupStore에 setChildren, addChild, removeChildById, updateChildById가 있다고 가정)


  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  // ✅ 2. 'editingIndex' -> 'editingId'로 변경 (id는 number 타입이라 가정)
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ 3. 부모에게 받은 prop을 스토어에 1회 초기화
  useEffect(() => {
    //setChildren(childrenInfo);
  }, [childrenInfo]);


  // --- 모달 및 핸들러 로직 (ID 기반으로 수정) ---

  const handleCloseModal = () => {
    setIsAddFormOpen(false);
    setEditingId(null); // ✅ editingId로 변경
  };

  // ✅ id: number 타입을 받도록 수정 (onEdit에서 number를 보장)
  const handleOpenEditModal = (id: number) => {
    setEditingId(id); // ✅ editingId로 변경
    setIsAddFormOpen(true);
  };

  // ✅ id: number 타입을 받도록 수정
  const handleRemoveChild = (id: number) => {
    // (Zustand 액션이 ID를 받는다고 가정)
    console.log(id);
    //removeChildById(id); 
  };

  const handleOpenAddModal = () => {
    setEditingId(null); // ✅ editingId로 변경
    setIsAddFormOpen(true);
  };

  const handleSubmitModal = (childData: Child) => {
    if (editingId !== null) {
      // ✅ ID로 업데이트 (Zustand 액션이 ID와 데이터를 받는다고 가정)
      //updateChildById(editingId, childData); 
      console.log(childData);
    } else {
      // ✅ 새로 추가 (id는 스토어 또는 백엔드 응답으로 생성되어야 함)
      //addChild(childData); 
    }
    handleCloseModal();
  };

  // --- 추가하기 카드 (변경 없음) ---
  const AddCardComponent = (
    <CustomCard
      onClick={handleOpenAddModal}
      className="h-44 self-stretch flex justify-center items-center border-2 border-dashed border-gray-300"
    >
      <Text variant="caption02" className="text-gray-500">
        + 자녀 추가하기
      </Text>
    </CustomCard>
  );

  return (
    <>
      <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* ✅ 4. 'childrenInfo' (prop) 대신 'children' (store state)을 렌더링 */}
        {/* ✅ 'index'를 map에서 받아옵니다. */}
        {childrenInfo.map((child, index) => (
          <ChildCard
            // ✅ 5. React 'key' 문제 해결: id가 없으면 index로 fallback
            key={child.id || `child-${index}`} 
            child={child}
            
            // ✅ onEdit/onDelete는 child.id가 '있을 때만' 호출
            onEdit={() => child.id  && handleOpenEditModal(child.id )}
            onDelete={() => child.id  && handleRemoveChild(child.id )}
            showActions={true}
          />
        ))}

        {AddCardComponent}
      </div>

      {isAddFormOpen && (
        <AddChildrenModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          initialData={
            // ✅ 6. 'editingId'를 사용해 .find()로 데이터를 찾습니다.
            editingId !== null 
              ? childrenInfo.find(c => c.id === editingId) 
              : undefined
          }
        />
      )}
    </>
  );
}