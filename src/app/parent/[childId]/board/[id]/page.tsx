import { allPosts } from '@/app/parent/[childId]/board/page';
import Link from 'next/link';

export default function PostDetail({ params }: { params: { id: string } }) {
  const post = allPosts.find((p) => p.id === parseInt(params.id));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="mb-4">
        상태:{' '}
        <span
          className={`px-2 py-1 rounded text-sm ${getStatusColor(post.status)}`}
        >
          {post.status}
        </span>
      </p>
      <p className="mb-4">목차: {post.order}</p>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">내용:</h2>
        <p>{post.content}</p>
      </div>
      <Link href="/parent/board" className="text-blue-600 hover:underline">
        목록으로 돌아가기
      </Link>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case '완료':
      return 'bg-green-200 text-green-800';
    case '예정':
      return 'bg-yellow-200 text-yellow-800';
    case '반복':
      return 'bg-blue-200 text-blue-800';
    case '진행 중':
      return 'bg-blue-200 text-blue-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}
