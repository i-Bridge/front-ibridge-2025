'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text } from '@/ui/Text';
import AddChildrenModal from '@/components/AddChildrenModal';
import { Child } from '@/types';
import { ChildCard } from '@/components/ChildCard';
import CustomCard from '@/ui/CustomCard';
import { Fetcher } from '@/lib/api/fetcher';
import { showSuccess, showError } from '@/lib/toast';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
import { Button } from '@/ui/Button';

interface ChildrenProfileProps {
  childrenInfo: Child[];
  refreshChildrenList?: () => void;
}

export default function ChildrenProfile({ childrenInfo }: ChildrenProfileProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetChildId, setTargetChildId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCloseModal = () => {
    setIsAddFormOpen(false);
    setEditingId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setEditingId(id);
    setIsAddFormOpen(true);
  };

  const confirmDeleteChild = (id: number) => {
    setTargetChildId(id);
    setDeleteModalOpen(true);
  };

  const handleRemoveChild = async () => {
    if (targetChildId === null) return;
    setLoading(true);

    try {
      const res = await Fetcher(`/parent/mypage/edit/delete`, {
        method: 'DELETE',
        data: { childId: targetChildId },
      });

      if (res.isSuccess) {
        showSuccess('자녀가 삭제되었습니다.');
        router.refresh();
      } else {
        throw new Error(res.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      showError('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setTargetChildId(null);
    }
  };

  const handleSubmitModal = async (childData: Child) => {
    setLoading(true);
    try {
      if (editingId !== null) {
        // 수정
        const res = await Fetcher(`/parent/mypage/edit/${editingId}`, {
          method: 'PATCH',
          data: {
            childId: editingId,
            name: childData.name,
            birthday: childData.birth,
            gender: childData.gender === 'FEMALE' ? 1 : 0,
          },
        });

        if (res.isSuccess) {
          showSuccess('자녀 정보가 수정되었습니다.');
          router.refresh();
        } else {
          throw new Error(res.message || '수정 실패');
        }
      } else {
        // 추가
        const res = await Fetcher(`/parent/mypage/edit/add`, {
          method: 'POST',
          data: {
            name: childData.name,
            birthday: childData.birth,
            gender: childData.gender === 'FEMALE' ? 1 : 0,
          },
        });

        if (res.isSuccess) {
          showSuccess('자녀가 추가되었습니다.');
          router.refresh();
        } else {
          throw new Error(res.message || '추가 실패');
        }
      }

      handleCloseModal();
    } catch (err) {
      console.error(err);
      showError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setIsAddFormOpen(true);
  };

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
        {childrenInfo.map((child, index) => (
          <ChildCard
            key={child.id || `child-${index}`}
            child={child}
            onEdit={() => child.id && handleOpenEditModal(child.id)}
            onDelete={() => child.id && confirmDeleteChild(child.id)}
            showActions={true}
          />
        ))}
        {AddCardComponent}
      </div>

      {isAddFormOpen && (
        <AddChildrenModal
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          initialData={editingId !== null ? childrenInfo.find((c) => c.id === editingId) : undefined}
          
        />
      )}

      {deleteModalOpen && (
        <CommonModalPopup
          title="정말로 이 자녀를 삭제하시겠습니까?"
          onClose={() => setDeleteModalOpen(false)}
          footerContent={
            <div className="flex gap-3">
              <Button
                variant="grayscale"
                onClick={() => setDeleteModalOpen(false)}
                disabled={loading}
                className="w-full h-16"
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleRemoveChild}
                disabled={loading}
                className="w-full h-16"
              >
                {loading ? '삭제 중...' : '확인'}
              </Button>
            </div>
          }
        >
          <></>
        </CommonModalPopup>
      )}
    </>
  );
}
