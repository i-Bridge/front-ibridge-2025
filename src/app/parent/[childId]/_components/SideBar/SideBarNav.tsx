'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text } from '@/ui/Text';
import { FC } from 'react'; 
import {
  DashboardIcon,
  NoticeIcon,
  CalendarIcon,
  AnswerLogIcon,
  ScheduledIcon,
  FamilyeditIcon,
} from '@/ui/icon/icon';


type SidebarNavProps = {
  childId: string;
};

type NavItemConfig = {
  name: string;
  href: string;
  icon: FC; 
  isNew: boolean;
};

const navLinks: NavItemConfig[] = [
  {
    name: '대시보드',
    href: 'dashboard',
    icon: DashboardIcon,
    isNew: false,
  },
  {
    name: '알림',
    href: 'notice',
    icon: NoticeIcon,
    isNew: false, // 'New' 배지 표시
  },
];

const secondaryLinks: NavItemConfig[] = [
  {
    name: '캘린더',
    href: 'calendar',
    icon: CalendarIcon,
    isNew: false,
  },
  {
    name: '답변 기록',
    href: 'answerLog',
    icon: AnswerLogIcon,
    isNew: false,
  },
  {
    name: '예정 질문',
    href: 'scheduled',
    icon: ScheduledIcon,
    isNew: false,
  },
];

const settingsLink: NavItemConfig[] = [
  {
    name: '가족 설정',
    href: 'familyedit',
    icon: FamilyeditIcon,
    isNew: false,
  },
];

export default function SidebarNav({ childId }: SidebarNavProps) {
  const pathname = usePathname(); // 현재 URL 경로를 가져옵니다.

  const renderLink = (item: NavItemConfig) => {
    const href = `/parent/${childId}/${item.href}`;
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        key={item.name}
        className={`
          self-stretch h-11 px-5 py-3 rounded-xl inline-flex justify-start items-center gap-2
          ${
            isActive
              ? 'bg-grayscale-gray10' 
              : 'hover:bg-grayscale-gray10' 
          }
        `}
      >
        
        <div className={`w-5 h-5 ${
            isActive ? 'text-grayscale-gray90' : 'text-grayscale-gray60'
          }`}
        >
          <item.icon />
        </div>
        <div className="flex justify-start items-center gap-1">
          <Text
            variant={'caption03'}
            className={
              isActive ? 'text-grayscale-gray90' : 'text-grayscale-gray60'
            }
          >
            {item.name}
          </Text>

          {item.isNew && (
            <div className="w-1.5 h-1.5 bg-primary-primary rounded-full"></div>
          )}
        </div>
      </Link>
    );
  };

  return (
    // 루트 컨테이너는 그대로 둡니다.
    <div className="self-stretch px-5 flex flex-col justify-start items-start gap-3">
      {/* --- 첫 번째 메뉴 그룹 --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {navLinks.map(renderLink)}
      </div>

      {/* --- 구분선 --- */}
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-grayscale-gray20"></div>

      {/* --- 두 번째 메뉴 그룹 --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {secondaryLinks.map(renderLink)}
      </div>

      {/* --- 구분선 --- */}
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-grayscale-gray20"></div>

      {/* --- 세 번째 메뉴 그룹 --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {settingsLink.map(renderLink)}
      </div>
    </div>
  );
}

