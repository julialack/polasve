import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thtvetvlkdvndrbzazvf.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zxlbntpxxndfipmrdnxs.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tvn24.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.interia.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.onet.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wp.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.polsatnews.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
