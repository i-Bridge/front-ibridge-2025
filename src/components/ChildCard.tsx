import { Text } from '@/ui/Text';
import CustomCard from '@/ui/CustomCard';
import { GirlIcon,BoyIcon,EditIcon,DeleteIcon } from '@/constants/icon';


interface ChildInfo {
  name: string;
  gender: number;
  birth: string;
}

interface ChildListItemProps {
  child: ChildInfo;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChildCard({ child, onEdit, onDelete }: ChildListItemProps) {
  const isFemale = child.gender === 1;
  const bgColor = isFemale ? 'bg-secondary-secondaryMedium' : 'bg-other-mint-light';

  return (
    <CustomCard
      className={` self-stretch flex justify-between items-start ${bgColor}`}
    >
        {/* 왼쪽: 아이콘 + 정보 */}
        <div className="flex justify-start items-center gap-5">
          <div className="w-24 h-24 flex-shrink-0">
            {isFemale ? <GirlIcon /> : <BoyIcon />}
          </div>
          <div className="inline-flex flex-col justify-start items-start gap-2">
            <Text variant="title02" >
              {child.name}
            </Text>
            <Text variant="body03" className="text-grayscale-gray60 ">
              {child.birth}
            </Text>
          </div>
        </div>

        {/* 오른쪽: 버튼 */}
        <div className="flex self-stretch justify-start items-start gap-2">
          <button
            onClick={onEdit}
            className="w-10 h-10 p-1 bg-white rounded-full flex justify-center items-center"
          >
            <EditIcon />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 p-1 bg-white rounded-full flex justify-center items-center"
          >
            <DeleteIcon />
          </button>
        </div>
      
    </CustomCard>
  );
}