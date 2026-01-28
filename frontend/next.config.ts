import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  poweredByHeader: false,
  typedRoutes: true,
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  images: {
    qualities: [75, 100],
    domains: ['localhost'],
  },
  experimental: {
    inlineCss: true,
    dynamicOnHover: true,
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Developed-By",
            value: "IT 911",
          },
        ],
      },
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      }
    ];
  },
};

export default nextConfig; 