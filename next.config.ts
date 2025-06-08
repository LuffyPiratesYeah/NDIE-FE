const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_KAKAO_BASE: process.env.NEXT_PUBLIC_KAKAO_BASE,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  experimental: {
    runtime: 'edge',
  },
};

export default nextConfig;
