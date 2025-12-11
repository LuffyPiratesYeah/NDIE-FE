import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cloudflare Workers에서는 이미지 최적화 비활성화
    unoptimized: true,
  },
  // Cloudflare Workers 호환성
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Node.js 25의 실험적 localStorage 문제 해결
  serverExternalPackages: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
};

export default nextConfig;
