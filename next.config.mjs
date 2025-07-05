/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendfix-production.up.railway.app',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
