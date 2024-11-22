/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "**.pinsave.app",
      },
      {
        protocol: "https",
        hostname: "gold-accurate-leopard-8.mypinata.cloud",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
