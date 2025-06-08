const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  },
};

export default nextConfig;