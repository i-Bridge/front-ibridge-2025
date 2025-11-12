
import CustomCard from '@/ui/CustomCard';
import { GirlIcon, BoyIcon, EditIcon, DeleteIcon } from '@/ui/icon/icon';
import { Child } from '@/types';
import { twMerge } from 'tailwind-merge';
import TitleComponent from '@/ui/Modal/TitleComponent';

interface ChildListItemProps {
  child: Child;
  onEdit?: (childId: number | undefined) => void;
  onDelete?: (childId: number | undefined) => void;
  showActions: boolean;
  cardClassName?: string;
}

// ----------------------------------------------------
// ChildCard Component (수정: showActions에 따른 레이아웃 변경)
// ----------------------------------------------------
export function ChildCard({
  child,
  onEdit,
  onDelete,
  showActions = true,
  cardClassName,
}: ChildListItemProps) {
  const isFemale = child.gender === 'FEMALE';
  const bgColor = isFemale
    ? 'bg-secondary-secondaryMedium'
    : 'bg-other-mint-light';

  const handleEdit = () => {
    if (showActions && onEdit) {
      onEdit(child.id);
    } else {
      console.warn(
        'Edit action requested but showActions is false or onEdit is undefined.',
      );
    }
  };

  const handleDelete = () => {
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
        'flex lg:flex-row lg:items-start ',
        showActions ? 'self-stretch justify-between' : 'justify-center',
        bgColor,
        cardClassName,
      )}
    >
      {/* 왼쪽: 아이콘 + 정보 */}
      {/* [수정] showActions 값에 따라 레이아웃 변경
        - true: 'items-center' (가로 정렬, 수직 중앙)
        - false: 'flex-col items-start' (세로 정렬, 좌측 상단)
      */}
      <div
        className={twMerge(
          'flex  gap-5',
          showActions ? 'justify-start items-center' : 'flex-col items-center',
        )}
      >
        <div className=" flex-shrink-0">
          {isFemale ? <GirlIcon /> : <BoyIcon />}
        </div>
        <div className={twMerge(
          'inline-flex flex-col  gap-2',
          showActions ? 'justify-start items-start' : 'justify-center items-center',
        )}>
          <TitleComponent title={child.name} subtitle={formattedBirthday} align={showActions ? "start" : "center"} />
          
        </div>
      </div>

      {/* 오른쪽: 버튼 */}
      {showActions && (
        <div className=''>
        <div className="flex self-stretch justify-start items-start lg:gap-2 gap-1">
          <button
            onClick={handleEdit}
            className=" p-1 lg:bg-white rounded-full flex justify-center items-center"
            aria-label={`${child.name} 정보 수정`}
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDelete}
            className=" p-1 lg:bg-white rounded-full flex justify-center items-center"
            aria-label={`${child.name} 정보 삭제`}
          >
            <DeleteIcon />
          </button>
        </div>
        </div>
      )}
    </CustomCard>
  );
}