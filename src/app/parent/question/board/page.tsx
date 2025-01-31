import { NextPage } from 'next';
import Head from 'next/head';

interface Post {
  id: number;
  title: string;
  status: '완료' | '예정' | '반복';
  order: number;
}

const posts: Post[] = [
  { id: 1, title: 'Next.js 시작하기', status: '완료', order: 1 },
  { id: 2, title: 'Tailwind CSS 적용하기', status: '완료', order: 2 },
  { id: 3, title: '게시판 기능 구현', status: '예정', order: 3 },
  { id: 4, title: '데이터베이스 연동', status: '예정', order: 4 },
  { id: 5, title: '주간 회고', status: '반복', order: 5 },
];

const Home: NextPage = () => {
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
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>게시판</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">게시판</h1>

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
              <td className="border p-2">{post.title}</td>
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
    </div>
  );
};

export default Home;
