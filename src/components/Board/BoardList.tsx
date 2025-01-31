import Link from 'next/link';
import { Post } from '@/types/Board/post';

interface BoardListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

export default function BoardList({
  posts,
  currentPage,
  totalPages,
}: BoardListProps) {
  const getStatusColor = (status: Post['status']) => {
    switch (status) {
      case '완료':
        return 'bg-green-200 text-green-800';
      case '예정':
        return 'bg-yellow-200 text-yellow-800';
      case '반복':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">목차</th>
            <th className="border p-2 text-left">타이틀</th>
            <th className="border p-2 text-left">상태</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-100">
              <td className="border p-2">{post.order}</td>
              <td className="border p-2">
                <Link
                  href={`/parent/question/board/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
              </td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${getStatusColor(post.status)}`}
                >
                  {post.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav className="flex justify-center mt-8">
        <ul className="inline-flex -space-x-px">
          {currentPage > 1 && (
            <li>
              <Link
                href={`?page=${currentPage - 1}`}
                className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                이전
              </Link>
            </li>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <Link
                href={`?page=${page}`}
                className={`py-2 px-3 leading-tight ${
                  currentPage === page
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 bg-white'
                } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
              >
                {page}
              </Link>
            </li>
          ))}
          {currentPage < totalPages && (
            <li>
              <Link
                href={`?page=${currentPage + 1}`}
                className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                다음
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
