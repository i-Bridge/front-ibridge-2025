import { Post } from '@/types/Board/post';
import BoardList from '@/components/Board/BoardList';

const ITEMS_PER_PAGE = 10;

const allPosts: Post[] = [
  { id: 1, title: 'Next.js 시작하기', status: '진행 중', order: 1 },
  { id: 2, title: 'Tailwind CSS 적용하기', status: '완료', order: 2 },
  { id: 3, title: '게시판 기능 구현', status: '예정', order: 3 },
  { id: 4, title: '데이터베이스 연동', status: '예정', order: 4 },
  { id: 5, title: '주간 회고', status: '반복', order: 5 },
  { id: 6, title: '사용자 인증 구현', status: '예정', order: 6 },
  { id: 7, title: 'API 엔드포인트 생성', status: '완료', order: 7 },
  { id: 8, title: '테스트 코드 작성', status: '예정', order: 8 },
  { id: 9, title: '성능 최적화', status: '예정', order: 9 },
  { id: 10, title: '배포 파이프라인 구축', status: '완료', order: 10 },
  { id: 11, title: '사용자 피드백 수집', status: '예정', order: 11 },
  { id: 12, title: '디자인 시스템 구축', status: '진행 중', order: 12 },
  { id: 13, title: '접근성 개선', status: '예정', order: 13 },
  { id: 14, title: '국제화 및 지역화', status: '예정', order: 14 },
  { id: 15, title: '보안 감사', status: '완료', order: 15 },
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">게시판</h1>
      <BoardList
        posts={paginatedPosts}
        currentPage={page}
        totalPages={totalPages}
      />
    </main>
  );
}
