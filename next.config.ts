import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },

  // Explicit Turbopack config (prevents the error)
  turbopack: {},
  // productionBrowserSourceMaps: true

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vspringboard.vercel.app" }],
        destination: "https://vspringboard.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
