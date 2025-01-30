import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div>
      <h1>Custom Not found</h1>;
    </div>
  );
}
