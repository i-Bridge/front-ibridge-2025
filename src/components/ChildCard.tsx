import { Text } from '@/ui/Text';
import CustomCard from '@/ui/CustomCard';
import { GirlIcon, BoyIcon, EditIcon, DeleteIcon } from '@/ui/icon/icon';
import { Child } from '@/types';
import { twMerge } from 'tailwind-merge';

interface ChildListItemProps {
  child: Child;
  onEdit?: (childId: number | undefined) => void;
  onDelete?: (childId: number | undefined) => void;
  showActions: boolean;
  cardClassName?: string;
}

// ----------------------------------------------------
// ChildCard Component (수정: 편집/삭제 기능 포함 및 조건부 렌더링)
// ----------------------------------------------------
// showActions의 기본값을 true로 설정합니다.
export function ChildCard({
  child,
  onEdit,
  onDelete,
  showActions = true,
  cardClassName,
}: ChildListItemProps) {
  console.log(child);

  const isFemale = child.gender === 'Female';
  const bgColor = isFemale
    ? 'bg-secondary-secondaryMedium'
    : 'bg-other-mint-light';
  // showActions가 true일 때만 onEdit과 onDelete가 존재함이 보장되므로,
  // 함수 호출 시 해당 핸들러의 존재 여부를 확인합니다.
  const handleEdit = () => {
    // showActions가 true이고 onEdit 함수가 실제로 존재할 때만 호출
    if (showActions && onEdit) {
      onEdit(child.id);
    } else {
      console.warn(
        'Edit action requested but showActions is false or onEdit is undefined.',
      );
    }
  };

  const handleDelete = () => {
    // showActions가 true이고 onDelete 함수가 실제로 존재할 때만 호출
    if (showActions && onDelete) {
      onDelete(child.id);
    } else {
      console.warn(
        'Delete action requested but showActions is false or onDelete is undefined.',
      );
    }
  };

  const formattedBirthday = child.birth ? child.birth.replace(/-/g, '.') : '';

  return (
    <CustomCard
      className={twMerge(
        'self-stretch flex flex-row justify-between items-start',
        bgColor,
        cardClassName, // 💡 외부에서 받은 호버/커스텀 클래스
      )}
    >
      {/* 왼쪽: 아이콘 + 정보 */}
      <div className="flex justify-start items-center gap-5">
        <div className="w-24 h-24 flex-shrink-0">
          {isFemale ? <GirlIcon /> : <BoyIcon />}
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-2">
          <Text variant="title02">{child.name}</Text>
          <Text variant="body03" className="text-grayscale-gray60 ">
            {formattedBirthday}
          </Text>
        </div>
      </div>

      {/* 오른쪽: 버튼 */}
      {showActions && (
        <div className="flex self-stretch justify-start items-start gap-2">
          <button
            onClick={handleEdit}
            className="w-10 h-10 p-1 bg-white rounded-full flex justify-center items-center"
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDelete}
            className="w-10 h-10 p-1 bg-white rounded-full flex justify-center items-center"
          >
            <DeleteIcon />
          </button>
        </div>
      )}
    </CustomCard>
  );
}
