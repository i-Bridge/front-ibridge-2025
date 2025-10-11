import type { NextConfig } from 'next';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    domains: ['ibridge-s3.s3.ap-northeast-2.amazonaws.com','ibridge-10150107.s3.ap-northeast-2.amazonaws.com' ], // 외부 이미지 도메인 추가
    // 나중에 삭제
  },
};

export default withBundleAnalyzer(nextConfig);
