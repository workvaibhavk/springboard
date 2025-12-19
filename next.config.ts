import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
  ,
  webpack: (config, { dev }) => {
    if (dev) {
      const currentIgnored = Array.isArray(config.watchOptions?.ignored)
        ? config.watchOptions.ignored
        : config.watchOptions?.ignored
          ? [config.watchOptions.ignored]
          : []
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/public/Thumbnails/**',
          '**/public/vcs/**',
          '**/trash/**'
        ]
      }
    }
    return config
  }
};

export default nextConfig;
