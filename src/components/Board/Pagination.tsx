import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  return (
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
  );
};

export default Pagination;
