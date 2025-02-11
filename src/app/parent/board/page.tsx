import { Post } from '@/types/Board/post';
import BoardList from '@/components/Board/BoardList';

const ITEMS_PER_PAGE = 10;

export const allPosts: Post[] = [
  {
    id: 1,
    title: 'Next.js 시작하기',
    status: '완료',
    order: 1,
    content: 'Next.js의 기본 개념과 설정 방법에 대해 알아봅니다.',
  },
  {
    id: 2,
    title: 'Tailwind CSS 적용하기',
    status: '완료',
    order: 2,
    content: 'Tailwind CSS를 Next.js 프로젝트에 적용하는 방법을 학습합니다.',
  },
  {
    id: 3,
    title: '게시판 기능 구현',
    status: '예정',
    order: 3,
    content: '간단한 게시판 기능을 구현해봅니다.',
  },
  {
    id: 4,
    title: '데이터베이스 연동',
    status: '예정',
    order: 4,
    content:
      '데이터베이스를 연동하여 데이터를 저장하고 불러오는 방법을 익힙니다.',
  },
  {
    id: 5,
    title: '주간 회고',
    status: '반복',
    order: 5,
    content: '일주일간의 개발 활동을 돌아보고 정리합니다.',
  },
  {
    id: 6,
    title: '사용자 인증 구현',
    status: '예정',
    order: 6,
    content: '로그인, 회원가입 등의 사용자 인증 기능을 구현합니다.',
  },
  {
    id: 7,
    title: 'API 엔드포인트 생성',
    status: '완료',
    order: 7,
    content: 'Next.js의 API 라우트를 사용하여 백엔드 API를 만듭니다.',
  },
  {
    id: 8,
    title: '테스트 코드 작성',
    status: '예정',
    order: 8,
    content:
      'Jest와 React Testing Library를 사용하여 테스트 코드를 작성합니다.',
  },
  {
    id: 9,
    title: '성능 최적화',
    status: '예정',
    order: 9,
    content:
      'Next.js의 이미지 최적화, 코드 분할 등을 활용하여 성능을 개선합니다.',
  },
  {
    id: 10,
    title: '배포 파이프라인 구축',
    status: '완료',
    order: 10,
    content: 'CI/CD 파이프라인을 구축하여 자동 배포 환경을 만듭니다.',
  },
  {
    id: 11,
    title: '사용자 피드백 수집',
    status: '예정',
    order: 11,
    content: '사용자 피드백을 수집하고 분석하는 시스템을 구현합니다.',
  },
  {
    id: 12,
    title: '디자인 시스템 구축',
    status: '진행 중',
    order: 12,
    content: '재사용 가능한 컴포넌트로 구성된 디자인 시스템을 만듭니다.',
  },
  {
    id: 13,
    title: '접근성 개선',
    status: '예정',
    order: 13,
    content: '웹 접근성 가이드라인을 준수하여 애플리케이션을 개선합니다.',
  },
  {
    id: 14,
    title: '국제화 및 지역화',
    status: '예정',
    order: 14,
    content: '다국어 지원을 위한 국제화 및 지역화 작업을 수행합니다.',
  },
  {
    id: 15,
    title: '보안 감사',
    status: '완료',
    order: 15,
    content: '애플리케이션의 보안 취약점을 점검하고 개선합니다.',
  },
];

export default function BoardPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) || 1;
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">게시판</h1>
      <BoardList
        posts={paginatedPosts}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}
