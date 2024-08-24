/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React strict mode in development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
