import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ferhipkvqqytdtylujra.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "miseqhvfeyjaujbznrgq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
