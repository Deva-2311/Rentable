import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/product/:path*',
        destination: '/products/:path*',
        permanent: true,
      },
      {
        source: '/owner',
        destination: '/owner/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
