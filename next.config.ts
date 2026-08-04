import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.104", "localhost:3000", "192.135.83.221", "192.135.125.12"],

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

  // experimental: {
  //   // If you're trying to fix Server Action origin issues:
  //   serverActions: {
  //   },
  // },

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
