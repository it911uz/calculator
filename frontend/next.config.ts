// next.config.ts
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
    qualities: [75, 100]
  },
  // reactCompiler: true,
  experimental: {
    inlineCss: true,
    dynamicOnHover: true,
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@hookform/resolvers",
      "@next/third-parties",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@t3-oss/env-core",
      "@t3-oss/env-nextjs",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "apexcharts",
      "class-variance-authority",
      "clsx",
      "date-fns",
      "dayjs",
      "embla-carousel-react",
      "framer-motion",
      "input-otp",
      "ky",
      "lucide-react",
      "next",
      "next-auth",
      "next-themes",
      "nuqs",
      "react",
      "react-apexcharts",
      "react-day-picker",
      "react-dom",
      "react-headless-pagination",
      "react-hook-form",
      "react-responsive",
      "react-scroll-parallax",
      "react-select",
      "simple-parallax-js",
      "sonner",
      "suneditor",
      "suneditor-react",
      "tailwind-merge",
      "tw-animate-css",
      "zod",
    ]
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