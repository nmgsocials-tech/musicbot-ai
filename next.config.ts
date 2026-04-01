import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Spotify's image CDN when we switch to next/image later.
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
};

export default nextConfig;
